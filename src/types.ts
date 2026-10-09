export type BadgeType = 'feat' | 'free' | 'new' | 'paid';

export interface Badge {
  type: BadgeType;
  label: string;
}

export interface Tool {
  id: number;
  name: string;
  cat: string;
  catLabel: string;
  icon: string;
  match: string;
  desc: string;
  tags: string[];
  badges: Badge[];
  price: string;
  priceClass: string;
  rating: number;
  ratingCount: string;
  stars: string;
  featured: boolean;
  url: string;
}

export interface Review {
  id?: number;
  toolId?: number;
  name: string;
  role?: string;
  text: string;
  rating: number;
  date: string;
}

export interface GitHubRepo {
  id: string;
  name: string;
  owner: string;
  fullName: string;
  icon?: string;
  description: string;
  url: string;
  stars: number;
  starsFormatted: string;
  forks: number;
  forksFormatted: string;
  language: string;
  languageColor: string;
  license: string;
  topics: string[];
  category: string;
  categoryLabel: string;
  featured?: boolean;
}
