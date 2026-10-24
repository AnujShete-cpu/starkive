import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GITHUB_REPOS, REPO_CATEGORIES, REPO_LANGUAGES } from '../data/githubRepos';
import { GitHubRepoCard } from '../components/GitHubRepoCard';
import { GitHubRepo } from '../types';
import { Search, Star, GitFork, Bookmark, Filter, ArrowUpDown, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Repos() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [repos, setRepos] = useState<GitHubRepo[]>(GITHUB_REPOS);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('cat') || 'all');
  const [selectedLanguage, setSelectedLanguage] = useState(searchParams.get('lang') || 'All');
  const [sortBy, setSortBy] = useState<'stars' | 'forks' | 'name'>(
    (searchParams.get('sort') as 'stars' | 'forks' | 'name') || 'stars'
  );
  const [showKeptOnly, setShowKeptOnly] = useState(searchParams.get('kept') === 'true');
  const [savedRepoIds, setSavedRepoIds] = useState<string[]>([]);

  const revealRefs = useRef<HTMLElement[]>([]);

  const loadSavedIds = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('starkive_saved_repos') || localStorage.getItem('toolscout_saved_repos') || '[]');
      setSavedRepoIds(saved);
    } catch {
      setSavedRepoIds([]);
    }
  };

  useEffect(() => {
    loadSavedIds();
    const handleBookmarkUpdate = () => loadSavedIds();
    window.addEventListener('storage', handleBookmarkUpdate);
    window.addEventListener('show-toast', handleBookmarkUpdate);
    return () => {
      window.removeEventListener('storage', handleBookmarkUpdate);
      window.removeEventListener('show-toast', handleBookmarkUpdate);
    };
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    const cat = searchParams.get('cat');
    const lang = searchParams.get('lang');
    const sort = searchParams.get('sort');
    const kept = searchParams.get('kept');

    if (q !== null) setSearchQuery(q);
    if (cat !== null) setSelectedCategory(cat);
    if (lang !== null) setSelectedLanguage(lang);
    if (sort !== null) setSortBy(sort as any);
    if (kept !== null) setShowKeptOnly(kept === 'true');
  }, [searchParams]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    return () => observer.disconnect();
  }, [repos]);

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  // Filter and Sort Repos
  const filteredRepos = repos.filter((repo) => {
    // Kept only filter
    if (showKeptOnly && !savedRepoIds.includes(repo.id)) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && repo.category !== selectedCategory) {
      return false;
    }

    // Language filter
    if (selectedLanguage !== 'All' && repo.language.toLowerCase() !== selectedLanguage.toLowerCase()) {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = repo.name.toLowerCase().includes(q);
      const matchOwner = repo.owner.toLowerCase().includes(q);
      const matchDesc = repo.description.toLowerCase().includes(q);
      const matchTopics = repo.topics.some((t) => t.toLowerCase().includes(q));
      const matchCat = repo.categoryLabel.toLowerCase().includes(q);
      if (!matchName && !matchOwner && !matchDesc && !matchTopics && !matchCat) {
        return false;
      }
    }

    return true;
  });

  // Sort
  const sortedRepos = [...filteredRepos].sort((a, b) => {
    if (sortBy === 'stars') return b.stars - a.stars;
    if (sortBy === 'forks') return b.forks - a.forks;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleFilterChange = (params: { cat?: string; lang?: string; sort?: string; kept?: boolean }) => {
    const newParams: Record<string, string> = {};
    const cat = params.cat !== undefined ? params.cat : selectedCategory;
    const lang = params.lang !== undefined ? params.lang : selectedLanguage;
    const sort = params.sort !== undefined ? params.sort : sortBy;
    const kept = params.kept !== undefined ? params.kept : showKeptOnly;

    if (searchQuery) newParams.q = searchQuery;
    if (cat !== 'all') newParams.cat = cat;
    if (lang !== 'All') newParams.lang = lang;
    if (sort !== 'stars') newParams.sort = sort;
    if (kept) newParams.kept = 'true';

    setSearchParams(newParams);
  };

  return (
    <div className="page active min-h-screen">
      {/* Header */}
      <div className="browse-header">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="section-title-block reveal" ref={addToReveal}>
            <div className="sec-label flex items-center gap-2">
              <Sparkles size={14} className="text-accent" />
              Open-Source AI Ecosystem ({GITHUB_REPOS.length} Repositories)
            </div>
            <h1 className="sec-title">
              GitHub<br />
              <em>Repositories</em>
            </h1>
            <p className="sec-desc !text-left !self-start mt-4 max-w-xl">
              Discover, sort, and keep the most influential open-source AI projects. Starred repositories, autonomous agent frameworks, and self-hosted model engines.
            </p>
          </div>

          {/* Kept Repos Quick Toggle */}
          <button
            onClick={() => {
              const nextKept = !showKeptOnly;
              setShowKeptOnly(nextKept);
              handleFilterChange({ kept: nextKept });
            }}
            className={cn(
              "px-5 py-3 rounded-xl font-syne text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-2 border self-start md:self-auto cursor-pointer",
              showKeptOnly
                ? "bg-accent text-black border-accent shadow-lg shadow-accent/20"
                : "bg-black3 border-border text-white hover:border-white2"
            )}
          >
            <Bookmark size={15} fill={showKeptOnly ? "currentColor" : "none"} />
            <span>Kept Repos ({savedRepoIds.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="browse-search-wrap reveal mt-8" ref={addToReveal}>
          <input
            type="text"
            placeholder="Search GitHub repositories by name, topics (e.g. agents, ollama, whisper)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={() => {}}>Search</button>
        </div>

        {/* Filter Controls: Categories, Languages & Sort */}
        <div className="flex flex-col gap-4 mt-6">
          {/* Category Chips */}
          <div className="tools-filters reveal !mb-0 flex-wrap" ref={addToReveal}>
            {REPO_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={cn('tfilter', selectedCategory === cat.value && 'active')}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  handleFilterChange({ cat: cat.value });
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Secondary Filter Row: Languages & Sorting */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            {/* Language filter buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono text-white3 flex items-center gap-1 uppercase">
                <Filter size={12} /> Language:
              </span>
              {REPO_LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => {
                    setSelectedLanguage(lang);
                    handleFilterChange({ lang });
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer',
                    selectedLanguage.toLowerCase() === lang.toLowerCase()
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black2 text-white3 border-border hover:text-white hover:border-white2'
                  )}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-white3 flex items-center gap-1 uppercase">
                <ArrowUpDown size={12} /> Sort by:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  const val = e.target.value as any;
                  setSortBy(val);
                  handleFilterChange({ sort: val });
                }}
                className="bg-black2 border border-border2 text-white font-mono text-xs px-3 py-1.5 rounded-lg outline-none focus:border-accent cursor-pointer"
              >
                <option value="stars">Most Stars ⭐</option>
                <option value="forks">Most Forks 🍴</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Repos */}
      <section className="section !pt-[40px] max-w-7xl mx-auto px-4 md:px-12">
        {sortedRepos.length > 0 ? (
          <div className="tools-grid">
            {sortedRepos.map((repo, idx) => (
              <GitHubRepoCard
                key={repo.id}
                repo={repo}
                index={idx}
                onBookmarkToggle={() => loadSavedIds()}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-black2 border border-border rounded-2xl p-8 max-w-xl mx-auto">
            <div className="text-4xl mb-3">📁</div>
            <h3 className="font-syne text-lg font-bold uppercase text-white mb-1">
              No Repositories Found
            </h3>
            <p className="text-white3 text-xs mb-6">
              {showKeptOnly
                ? "You haven't kept any repositories yet. Click 'Keep' on any repo card to save it here!"
                : `No repositories match your current filters and search query.`}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedLanguage('All');
                setShowKeptOnly(false);
                setSearchParams({});
              }}
              className="bg-accent text-black font-syne text-xs uppercase font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
