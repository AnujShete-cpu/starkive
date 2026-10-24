import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { GitHubRepo } from '../types';
import { cn } from '../lib/utils';

interface GitHubRepoCardProps {
  repo: GitHubRepo;
  index?: number;
  onBookmarkToggle?: (repoId: string, isSaved: boolean) => void;
}

export const GitHubRepoCard: React.FC<GitHubRepoCardProps> = ({ repo, index, onBookmarkToggle }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('starkive_saved_repos') || localStorage.getItem('toolscout_saved_repos') || '[]');
    setIsBookmarked(saved.includes(repo.id));
  }, [repo.id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem('starkive_saved_repos') || localStorage.getItem('toolscout_saved_repos') || '[]');
    let updated: string[];
    if (isBookmarked) {
      updated = saved.filter((id: string) => id !== repo.id);
    } else {
      updated = [...saved, repo.id];
    }
    localStorage.setItem('starkive_saved_repos', JSON.stringify(updated));
    setIsBookmarked(!isBookmarked);

    if (onBookmarkToggle) {
      onBookmarkToggle(repo.id, !isBookmarked);
    }

    const event = new CustomEvent('show-toast', {
      detail: !isBookmarked ? 'Bookmarked!' : 'Removed from bookmarks'
    });
    window.dispatchEvent(event);
  };

  const num = typeof index === 'number' ? (index + 1 < 10 ? `0${index + 1}` : `${index + 1}`) : '01';

  return (
    <div
      className={cn("tool-card cursor-pointer", repo.featured && "featured")}
      onClick={() => window.open(repo.url, '_blank')}
    >
      <div className="tool-card-num">{num}</div>
      <div className="tool-top">
        <div className="tool-icon-wrap">
          <span className="text-2xl">{repo.icon || '🤖'}</span>
        </div>
        <div className="tool-badges">
          <span className="badge badge-free">FREE</span>
          {repo.featured && <span className="badge badge-feat">FEATURED</span>}
        </div>
      </div>
      <div>
        <div className="tool-name">{repo.name}</div>
        <div className="tool-cat">{repo.categoryLabel}</div>
      </div>
      <p className="tool-desc">{repo.description}</p>
      <div className="tool-tags">
        {repo.topics.map((tag, i) => (
          <span
            key={i}
            className="tool-tag"
            onClick={(e) => {
              e.stopPropagation();
              window.open(repo.url, '_blank');
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="tool-footer">
        <div>
          <div className="tool-price free">Free</div>
          <div className="tool-rating">
            <span className="stars">★★★★★</span> 4.8 ({repo.starsFormatted})
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className={cn("bookmark-btn", isBookmarked && "saved")}
            onClick={toggleBookmark}
            title={isBookmarked ? "Bookmarked" : "Bookmark"}
          >
            <Heart size={14} fill={isBookmarked ? "currentColor" : "none"} />
          </button>
          <a
            href={repo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="tool-link"
            onClick={(e) => e.stopPropagation()}
          >
            Try →
          </a>
        </div>
      </div>
    </div>
  );
};
