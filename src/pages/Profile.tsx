import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getAllTools } from '../lib/toolStore';
import { GITHUB_REPOS } from '../data/githubRepos';
import { ToolCard } from '../components/ToolCard';
import { GitHubRepoCard } from '../components/GitHubRepoCard';
import { Tool, GitHubRepo } from '../types';
import { Heart, Info, Bookmark, Star, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Profile() {
  const [activeTab, setActiveTab] = useState<'tools' | 'repos'>('tools');
  const [likedTools, setLikedTools] = useState<Tool[]>([]);
  const [keptRepos, setKeptRepos] = useState<GitHubRepo[]>([]);
  const revealRefs = useRef<HTMLElement[]>([]);

  const loadData = () => {
    const all = getAllTools();
    const bookmarks = JSON.parse(localStorage.getItem('starkive_bookmarks') || '[]');
    setLikedTools(all.filter(t => bookmarks.includes(t.id)));

    const savedRepos = JSON.parse(localStorage.getItem('starkive_saved_repos') || '[]');
    setKeptRepos(GITHUB_REPOS.filter(r => savedRepos.includes(r.id)));
  };

  useEffect(() => {
    loadData();

    const handleToast = () => loadData();
    window.addEventListener('show-toast', handleToast);
    window.addEventListener('starkive_tools_updated', loadData);
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('show-toast', handleToast);
      window.removeEventListener('starkive_tools_updated', loadData);
      window.removeEventListener('storage', loadData);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    revealRefs.current.forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, [likedTools, keptRepos]);

  const addToReveal = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el);
  };

  const clearBookmarks = () => {
    if (confirm('Clear all saved tools?')) {
      localStorage.removeItem('starkive_bookmarks');
      setLikedTools([]);
    }
  };

  const clearKeptRepos = () => {
    if (confirm('Clear all kept GitHub repositories?')) {
      localStorage.removeItem('starkive_saved_repos');
      setKeptRepos([]);
    }
  };

  return (
    <div className="page active">
      <div className="ticker-wrap mt-[70px]">
        <div className="ticker-inner">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="ticker-item"><span className="ticker-sep"></span>Your Profile</span>
              <span className="ticker-item"><span className="ticker-sep"></span>Saved Tools</span>
              <span className="ticker-item"><span className="ticker-sep"></span>Kept GitHub Repos</span>
              <span className="ticker-item"><span className="ticker-sep"></span>Personal Toolkit</span>
              <span className="ticker-item"><span className="ticker-sep"></span>AI Discovery</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      <section className="section min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <div className="section-row mb-10 reveal" ref={addToReveal}>
            <div className="section-title-block">
              <div className="sec-label">User Account</div>
              <h1 className="sec-title">Your<br /><em>Profile</em></h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
            {/* Sidebar */}
            <div className="flex flex-col gap-6 reveal" ref={addToReveal}>
              <div className="bg-black2 border border-border p-6 rounded-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-2xl">
                    🤖
                  </div>
                  <div>
                    <h2 className="font-syne text-lg font-bold uppercase tracking-tight text-white">AI Scout</h2>
                    <p className="text-white3 text-xs font-mono">Personal Toolkit</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/repos"
                    className="flex items-center justify-between w-full p-3.5 bg-black3 hover:bg-black4 border border-border rounded-xl transition-all group no-underline text-white text-xs font-syne uppercase font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Star size={15} className="text-[#f0c040]" fill="currentColor" />
                      <span>Explore GitHub Repos</span>
                    </div>
                    <span className="text-white3 group-hover:text-white">↗</span>
                  </Link>

                  <Link
                    to="/browse"
                    className="flex items-center justify-between w-full p-3.5 bg-black3 hover:bg-black4 border border-border rounded-xl transition-all group no-underline text-white text-xs font-syne uppercase font-bold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Heart size={15} className="text-accent" />
                      <span>Browse All Tools</span>
                    </div>
                    <span className="text-white3 group-hover:text-white">↗</span>
                  </Link>
                </div>
              </div>

              {/* Stats Card */}
              <div className="bg-black2 border border-border p-6 rounded-2xl space-y-3">
                <h3 className="font-syne text-xs font-bold uppercase tracking-[0.2em] text-accent">Resource Stats</h3>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-white2 text-xs">Saved AI Tools</span>
                  <span className="font-mono text-base font-bold text-accent">{likedTools.length}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-white2 text-xs">Kept GitHub Repos</span>
                  <span className="font-mono text-base font-bold text-[#f0c040]">{keptRepos.length}</span>
                </div>
              </div>
            </div>

            {/* Main Area with Tabs */}
            <div className="reveal" ref={addToReveal}>
              {/* Tab Selector */}
              <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                <button
                  onClick={() => setActiveTab('tools')}
                  className={cn(
                    "px-4 py-2 rounded-xl font-syne text-xs uppercase font-bold transition-all flex items-center gap-2 cursor-pointer border",
                    activeTab === 'tools'
                      ? "bg-accent text-black border-accent shadow-md shadow-accent/20"
                      : "bg-black2 border-border text-white3 hover:text-white"
                  )}
                >
                  <Heart size={14} fill={activeTab === 'tools' ? "currentColor" : "none"} />
                  <span>Saved Tools ({likedTools.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('repos')}
                  className={cn(
                    "px-4 py-2 rounded-xl font-syne text-xs uppercase font-bold transition-all flex items-center gap-2 cursor-pointer border",
                    activeTab === 'repos'
                      ? "bg-accent text-black border-accent shadow-md shadow-accent/20"
                      : "bg-black2 border-border text-white3 hover:text-white"
                  )}
                >
                  <Bookmark size={14} fill={activeTab === 'repos' ? "currentColor" : "none"} />
                  <span>Kept GitHub Repos ({keptRepos.length})</span>
                </button>
              </div>

              {/* Tab 1: Saved Tools */}
              {activeTab === 'tools' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-syne text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white">
                      <Heart size={20} className="text-accent" fill="currentColor" />
                      Saved AI Tools
                    </h2>
                    {likedTools.length > 0 && (
                      <button
                        onClick={clearBookmarks}
                        className="text-white3 hover:text-accent2 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Clear Saved Tools
                      </button>
                    )}
                  </div>

                  {likedTools.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {likedTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black2 border border-dashed border-border p-12 rounded-2xl text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white3">
                        <Heart size={32} />
                      </div>
                      <h3 className="font-syne text-base font-bold uppercase mb-2 text-white">No saved tools yet</h3>
                      <p className="text-white3 text-xs italic mb-6">Click the heart on any AI tool card to save it to your toolkit.</p>
                      <Link to="/browse" className="btn-primary">Browse All Tools</Link>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Kept GitHub Repos */}
              {activeTab === 'repos' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-syne text-xl font-bold uppercase tracking-tight flex items-center gap-2 text-white">
                      <Bookmark size={20} className="text-accent" fill="currentColor" />
                      Kept GitHub Repositories
                    </h2>
                    {keptRepos.length > 0 && (
                      <button
                        onClick={clearKeptRepos}
                        className="text-white3 hover:text-accent2 text-xs font-mono flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 size={13} /> Clear Kept Repos
                      </button>
                    )}
                  </div>

                  {keptRepos.length > 0 ? (
                    <div className="tools-grid">
                      {keptRepos.map((repo, idx) => (
                        <GitHubRepoCard key={repo.id} repo={repo} index={idx} onBookmarkToggle={() => loadData()} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-black2 border border-dashed border-border p-12 rounded-2xl text-center">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-[#f0c040]">
                        <Star size={32} />
                      </div>
                      <h3 className="font-syne text-base font-bold uppercase mb-2 text-white">No kept repositories yet</h3>
                      <p className="text-white3 text-xs italic mb-6">Click "Keep" on any GitHub repository to bookmark it here for quick access.</p>
                      <Link to="/repos" className="btn-primary">Explore GitHub Repos</Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
