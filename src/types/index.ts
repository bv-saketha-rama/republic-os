export interface State {
  id: string;
  name: string;
  maintainer: string;
  party: string;
  mandateExpires: string;
  open: number;
  prs: number;
  acts: number;
  lastMerged: string;
  lastTitle: string;
  health: 'healthy' | 'amber' | 'critical';
  resolveRate: number;
}

export interface PR {
  id: string;
  state: string | null;
  status: string;
  labels: string[];
  title: string;
  author: string;
  age: string;
  stage: string;
  conversations: number;
  gazette: string | null;
}

export interface Issue {
  id: number;
  state: string;
  status: 'open' | 'closed';
  labels: string[];
  title: string;
  author: string;
  session: number;
  sessionsOpen: number;
  stale: boolean;
  comments: number;
  lastActivity: string;
}

export interface Release {
  tag: string;
  latest: boolean;
  title: string;
  date: string;
  pr: string;
  assets: number;
  notes: string;
  yanked: boolean;
  yankReason?: string;
  ordinance: boolean;
  expiresIn?: string;
}

export interface Contributor {
  handle: string;
  name: string;
  role: string;
  party: string;
  orgs: string[];
  house: string;
  affidavit: string;
  stats: {
    opened: number;
    merged: number;
    closed: number;
    mergeRate: number;
    issuesRaised: number;
    reviewsGiven: number;
  };
  bio: string;
}

export interface ChangelogEntry {
  session: string;
  range: string;
  sections: Record<string, Array<{
    text: string;
    ref?: string;
    kind?: 'pr' | 'issue';
    refLabel?: string;
  }> | undefined>;
}

export interface HoveredState {
  id: string;
  x: number;
  y: number;
}

export type PanelTab = 'code' | 'issues' | 'prs' | 'releases' | 'changelog' | 'wiki' | 'discussions' | 'insights';

export type ViewKind = 'repo' | 'pr' | 'issue' | 'profile';

export interface AppView {
  kind: ViewKind;
  id?: string;
  handle?: string;
}
