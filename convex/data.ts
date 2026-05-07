// RepublicOS — synthetic data layer
// All data is fictional/representative; styled to feel like a real govt repo
// This file serves as the static backend until real Convex tables are populated.

export const STATES = [
  { id: 'mh', name: 'Maharashtra', maintainer: 'devendra-fadnavis', party: 'BJP', mandateExpires: 'Jun 2027', open: 142, prs: 23, acts: 891, lastMerged: '2 days ago', lastTitle: 'Motor Vehicles Amendment', health: 'healthy' as const, resolveRate: 0.78 },
  { id: 'up', name: 'Uttar Pradesh', maintainer: 'yogi-adityanath', party: 'BJP', mandateExpires: 'Mar 2027', open: 421, prs: 38, acts: 1204, lastMerged: '5 hours ago', lastTitle: 'UP Land Records Digitization Bill', health: 'amber' as const, resolveRate: 0.61 },
  { id: 'tn', name: 'Tamil Nadu', maintainer: 'mk-stalin', party: 'DMK', mandateExpires: 'May 2026', open: 88, prs: 19, acts: 1042, lastMerged: '1 day ago', lastTitle: 'Tamil Nadu Online Gaming Regulation Amdt', health: 'healthy' as const, resolveRate: 0.82 },
  { id: 'ka', name: 'Karnataka', maintainer: 'siddaramaiah', party: 'INC', mandateExpires: 'May 2028', open: 134, prs: 21, acts: 802, lastMerged: '4 days ago', lastTitle: 'Karnataka Gig Workers Welfare Bill', health: 'healthy' as const, resolveRate: 0.74 },
  { id: 'wb', name: 'West Bengal', maintainer: 'mamata-banerjee', party: 'AITC', mandateExpires: 'May 2026', open: 287, prs: 14, acts: 967, lastMerged: '12 days ago', lastTitle: 'West Bengal Police (Amdt) Bill', health: 'amber' as const, resolveRate: 0.58 },
  { id: 'gj', name: 'Gujarat', maintainer: 'bhupendra-patel', party: 'BJP', mandateExpires: 'Dec 2027', open: 96, prs: 17, acts: 743, lastMerged: '6 days ago', lastTitle: 'Gujarat GIFT City SEZ Amendment', health: 'healthy' as const, resolveRate: 0.81 },
  { id: 'rj', name: 'Rajasthan', maintainer: 'bhajanlal-sharma', party: 'BJP', mandateExpires: 'Dec 2028', open: 178, prs: 12, acts: 612, lastMerged: '2 weeks ago', lastTitle: 'Rajasthan Solar Policy Amdt', health: 'amber' as const, resolveRate: 0.55 },
  { id: 'mp', name: 'Madhya Pradesh', maintainer: 'mohan-yadav', party: 'BJP', mandateExpires: 'Dec 2028', open: 213, prs: 16, acts: 798, lastMerged: '8 days ago', lastTitle: 'MP Forest Rights Amendment', health: 'amber' as const, resolveRate: 0.62 },
  { id: 'kl', name: 'Kerala', maintainer: 'pinarayi-vijayan', party: 'CPI(M)', mandateExpires: 'May 2026', open: 67, prs: 22, acts: 1156, lastMerged: '1 day ago', lastTitle: 'Kerala Public Health Amendment', health: 'healthy' as const, resolveRate: 0.86 },
  { id: 'pb', name: 'Punjab', maintainer: 'bhagwant-mann', party: 'AAP', mandateExpires: 'Mar 2027', open: 156, prs: 9, acts: 587, lastMerged: '11 days ago', lastTitle: 'Punjab MSP Procurement Amdt', health: 'amber' as const, resolveRate: 0.59 },
  { id: 'hr', name: 'Haryana', maintainer: 'nayab-singh-saini', party: 'BJP', mandateExpires: 'Oct 2029', open: 98, prs: 14, acts: 521, lastMerged: '3 days ago', lastTitle: 'Haryana Local Candidates Reservation', health: 'healthy' as const, resolveRate: 0.71 },
  { id: 'br', name: 'Bihar', maintainer: 'nitish-kumar', party: 'JDU', mandateExpires: 'Nov 2025', open: 312, prs: 11, acts: 678, lastMerged: '9 days ago', lastTitle: 'Bihar Reservation Amendment', health: 'critical' as const, resolveRate: 0.42 },
  { id: 'or', name: 'Odisha', maintainer: 'mohan-charan-majhi', party: 'BJP', mandateExpires: 'Jun 2029', open: 124, prs: 13, acts: 612, lastMerged: '5 days ago', lastTitle: 'Odisha Mining Royalty Amdt', health: 'healthy' as const, resolveRate: 0.69 },
  { id: 'jh', name: 'Jharkhand', maintainer: 'hemant-soren', party: 'JMM', mandateExpires: 'Nov 2029', open: 167, prs: 8, acts: 412, lastMerged: '15 days ago', lastTitle: 'Jharkhand Tribal Welfare Amdt', health: 'amber' as const, resolveRate: 0.54 },
  { id: 'as', name: 'Assam', maintainer: 'himanta-biswa-sarma', party: 'BJP', mandateExpires: 'May 2026', open: 109, prs: 15, acts: 567, lastMerged: '4 days ago', lastTitle: 'Assam Cattle Preservation Amdt', health: 'healthy' as const, resolveRate: 0.72 },
  { id: 'ts', name: 'Telangana', maintainer: 'revanth-reddy', party: 'INC', mandateExpires: 'Dec 2028', open: 78, prs: 18, acts: 489, lastMerged: '2 days ago', lastTitle: 'Telangana SC Categorisation Bill', health: 'healthy' as const, resolveRate: 0.79 },
  { id: 'ap', name: 'Andhra Pradesh', maintainer: 'chandrababu-naidu', party: 'TDP', mandateExpires: 'Jun 2029', open: 134, prs: 19, acts: 534, lastMerged: '3 days ago', lastTitle: 'AP Capital Region Development Amdt', health: 'healthy' as const, resolveRate: 0.75 },
  { id: 'ch', name: 'Chhattisgarh', maintainer: 'vishnudeo-sai', party: 'BJP', mandateExpires: 'Dec 2028', open: 142, prs: 10, acts: 398, lastMerged: '7 days ago', lastTitle: 'Chhattisgarh Naxal Surrender Policy Amdt', health: 'amber' as const, resolveRate: 0.58 },
  { id: 'uk', name: 'Uttarakhand', maintainer: 'pushkar-dhami', party: 'BJP', mandateExpires: 'Mar 2027', open: 76, prs: 11, acts: 321, lastMerged: '6 days ago', lastTitle: 'Uniform Civil Code Implementation Rules', health: 'healthy' as const, resolveRate: 0.73 },
  { id: 'hp', name: 'Himachal Pradesh', maintainer: 'sukhvinder-sukhu', party: 'INC', mandateExpires: 'Dec 2027', open: 54, prs: 9, acts: 287, lastMerged: '8 days ago', lastTitle: 'HP Old Pension Restoration Amdt', health: 'healthy' as const, resolveRate: 0.77 },
  { id: 'jk', name: 'Jammu & Kashmir', maintainer: 'omar-abdullah', party: 'JKNC', mandateExpires: 'Oct 2029', open: 198, prs: 6, acts: 234, lastMerged: '21 days ago', lastTitle: 'J&K Reservation Rules Amdt', health: 'critical' as const, resolveRate: 0.38 },
  { id: 'dl', name: 'Delhi', maintainer: 'rekha-gupta', party: 'BJP', mandateExpires: 'Feb 2030', open: 87, prs: 16, acts: 412, lastMerged: '1 day ago', lastTitle: 'Delhi Mohalla Sabha Amendment', health: 'healthy' as const, resolveRate: 0.74 },
  { id: 'ga', name: 'Goa', maintainer: 'pramod-sawant', party: 'BJP', mandateExpires: 'Mar 2027', open: 32, prs: 7, acts: 198, lastMerged: '4 days ago', lastTitle: 'Goa Tourism Master Plan Amdt', health: 'healthy' as const, resolveRate: 0.83 },
  { id: 'tr', name: 'Tripura', maintainer: 'manik-saha', party: 'BJP', mandateExpires: 'Mar 2028', open: 41, prs: 5, acts: 167, lastMerged: '12 days ago', lastTitle: 'Tripura Tribal Council Powers Amdt', health: 'amber' as const, resolveRate: 0.61 },
  { id: 'mn', name: 'Manipur', maintainer: 'n-biren-singh', party: 'BJP', mandateExpires: 'Mar 2027', open: 234, prs: 3, acts: 187, lastMerged: '34 days ago', lastTitle: 'Manipur Land Revenue Amdt', health: 'critical' as const, resolveRate: 0.31 },
  { id: 'ml', name: 'Meghalaya', maintainer: 'conrad-sangma', party: 'NPP', mandateExpires: 'Mar 2028', open: 38, prs: 6, acts: 145, lastMerged: '9 days ago', lastTitle: 'Meghalaya Mining Policy Amdt', health: 'healthy' as const, resolveRate: 0.68 },
  { id: 'nl', name: 'Nagaland', maintainer: 'neiphiu-rio', party: 'NDPP', mandateExpires: 'Mar 2028', open: 29, prs: 4, acts: 134, lastMerged: '14 days ago', lastTitle: 'Nagaland Municipal Act Amdt', health: 'amber' as const, resolveRate: 0.59 },
  { id: 'mz', name: 'Mizoram', maintainer: 'lalduhoma', party: 'ZPM', mandateExpires: 'Dec 2028', open: 22, prs: 5, acts: 121, lastMerged: '7 days ago', lastTitle: 'Mizoram Border Trade Amdt', health: 'healthy' as const, resolveRate: 0.74 },
  { id: 'ar', name: 'Arunachal Pradesh', maintainer: 'pema-khandu', party: 'BJP', mandateExpires: 'Jun 2029', open: 47, prs: 8, acts: 189, lastMerged: '5 days ago', lastTitle: 'Arunachal Inner Line Permit Amdt', health: 'healthy' as const, resolveRate: 0.71 },
  { id: 'sk', name: 'Sikkim', maintainer: 'prem-singh-tamang', party: 'SKM', mandateExpires: 'Jun 2029', open: 19, prs: 6, acts: 156, lastMerged: '3 days ago', lastTitle: 'Sikkim Organic Farming Amdt', health: 'healthy' as const, resolveRate: 0.81 },
];

export const PARTY_COLORS: Record<string, string> = {
  'BJP': '#f97316', 'INC': '#3b82f6', 'AITC': '#22c55e', 'DMK': '#ef4444',
  'AAP': '#06b6d4', 'CPI(M)': '#dc2626', 'JDU': '#84cc16', 'JMM': '#10b981',
  'TDP': '#eab308', 'JKNC': '#8b5cf6', 'NPP': '#14b8a6', 'NDPP': '#6366f1',
  'ZPM': '#f59e0b', 'SKM': '#ec4899'
};

export const PRS = [
  { id: 'PR-847', state: null, status: 'merged', labels: ['money-bill', 'finance'], title: 'Income Tax Amendment Bill 2025', author: 'nirmala-sitharaman', age: '34 days ago', stage: 'Gazette Notification', conversations: 12, gazette: 'a8f3c91' },
  { id: 'PR-851', state: null, status: 'in-review', labels: ['data-protection', 'meity'], title: 'Digital Personal Data Protection (Amendment) Bill 2025', author: 'ashwini-vaishnaw', age: '12 days ago', stage: 'Rajya Sabha review pending', conversations: 47, gazette: null },
  { id: 'PR-849', state: null, status: 'open', labels: ['agriculture', 'subsidy'], title: 'PM Kisan Samman Nidhi (Amendment) Bill 2025', author: 'shivraj-singh-chouhan', age: '8 days ago', stage: 'First reading: Lok Sabha', conversations: 23, gazette: null },
  { id: 'PR-852', state: null, status: 'changes-requested', labels: ['labour'], title: 'Code on Social Security (Implementation) Bill', author: 'mansukh-mandaviya', age: '21 days ago', stage: 'Committee report submitted', conversations: 89, gazette: null },
  { id: 'PR-845', state: null, status: 'ordinance', labels: ['hotfix', 'finance'], title: 'Telecommunications (Amendment) Ordinance 2025', author: 'jyotiraditya-scindia', age: '4 days ago', stage: 'Promulgated · expires Jul 12', conversations: 8, gazette: 'd1e7b22' },
  { id: 'PR-832', state: null, status: 'closed', labels: ['electoral'], title: 'Electoral Reforms (Comprehensive) Bill 2024', author: 'rajiv-kumar', age: '4 months ago', stage: 'Closed without merge', conversations: 156, gazette: null },
  { id: 'PR-848', state: null, status: 'merged', labels: ['health'], title: 'PMJAY Coverage Expansion Bill', author: 'jp-nadda', age: '2 months ago', stage: 'Gazette Notification', conversations: 34, gazette: 'c44a019' },
  { id: 'PR-846', state: null, status: 'lapsed', labels: ['data-protection'], title: 'Personal Data Protection Bill 2019', author: 'ravi-shankar-prasad', age: '5 years ago', stage: 'Lapsed with dissolution of 16th LS', conversations: 245, gazette: null },
  { id: 'PR-853', state: null, status: 'draft', labels: ['environment'], title: 'Environment Impact Assessment Reform Bill', author: 'bhupender-yadav', age: '2 days ago', stage: 'Ministry drafting', conversations: 3, gazette: null },
];

export const MH_PRS = [
  { id: 'PR-MH-1142', state: 'mh', status: 'in-review', labels: ['transport'], title: 'Maharashtra Motor Vehicles (Amendment) Bill', author: 'devendra-fadnavis', age: '18 days ago', stage: 'Vidhan Parishad review', conversations: 14, gazette: null },
  { id: 'PR-MH-1140', state: 'mh', status: 'merged', labels: ['urban'], title: 'BMC Property Tax Reassessment Bill', author: 'eknath-shinde', age: '47 days ago', stage: 'Gazette Notification', conversations: 22, gazette: 'b2e1f04' },
  { id: 'PR-MH-1139', state: 'mh', status: 'merged', labels: ['agriculture'], title: 'Loan Waiver for Marathwada Farmers', author: 'devendra-fadnavis', age: '62 days ago', stage: 'Gazette Notification', conversations: 31, gazette: '7c2a8d1' },
  { id: 'PR-MH-1145', state: 'mh', status: 'open', labels: ['education'], title: 'Maharashtra Public Universities (Amdt) Bill', author: 'chandrakant-patil', age: '4 days ago', stage: 'First reading', conversations: 6, gazette: null },
  { id: 'PR-MH-1144', state: 'mh', status: 'changes-requested', labels: ['labour'], title: 'Maharashtra Shops & Establishments Amdt', author: 'mangal-prabhat-lodha', age: '11 days ago', stage: 'Standing committee report', conversations: 18, gazette: null },
];

export const ISSUES = [
  { id: 1034, state: 'mh', status: 'open' as const, labels: ['infrastructure', 'agriculture'], title: 'Road connectivity in Marathwada region still unresolved', author: 'supriya-sule', session: 14, sessionsOpen: 3, stale: true, comments: 47, lastActivity: '847 days ago' },
  { id: 1041, state: 'mh', status: 'open' as const, labels: ['agriculture'], title: 'MSP procurement delays for soyabean farmers', author: 'jayant-patil', session: 14, sessionsOpen: 1, stale: false, comments: 22, lastActivity: '12 days ago' },
  { id: 1029, state: 'mh', status: 'open' as const, labels: ['urban', 'housing'], title: 'Slum rehabilitation backlog at 47% completion since 2019', author: 'aaditya-thackeray', session: 13, sessionsOpen: 4, stale: true, comments: 89, lastActivity: '1209 days ago' },
  { id: 1052, state: 'mh', status: 'open' as const, labels: ['health'], title: 'Vacancies in district hospitals — 1,247 doctor posts unfilled', author: 'rohit-pawar', session: 14, sessionsOpen: 2, stale: false, comments: 34, lastActivity: '4 days ago' },
  { id: 1055, state: 'mh', status: 'open' as const, labels: ['education', 'budget'], title: 'Devolution of education cess to ZP schools incomplete', author: 'jitendra-awhad', session: 14, sessionsOpen: 1, stale: false, comments: 17, lastActivity: '8 days ago' },
  { id: 1058, state: 'mh', status: 'open' as const, labels: ['environment'], title: 'Aarey forest encroachment by infrastructure projects', author: 'priyanka-chaturvedi', session: 14, sessionsOpen: 2, stale: false, comments: 71, lastActivity: '2 days ago' },
  { id: 334, state: 'mh', status: 'closed' as const, labels: ['rti'], title: 'RTI response deadline ambiguity in state offices', author: 'anjali-damania', session: 12, sessionsOpen: 0, stale: false, comments: 28, lastActivity: '92 days ago' },
  { id: 1061, state: 'mh', status: 'open' as const, labels: ['water'], title: 'Inter-basin water transfer Krishna-Godavari pending clearance', author: 'sharad-pawar', session: 14, sessionsOpen: 5, stale: true, comments: 64, lastActivity: '1450 days ago' },
];

export const CHANGELOG_MH = [
  {
    session: 'Budget Session 2025',
    range: 'Feb 01 – Apr 05, 2025',
    sections: {
      Added: [
        { text: 'Digital Personal Data Protection Rules enacted', ref: 'PR-847', kind: 'pr' as const },
        { text: 'PM Surya Ghar Yojana scheme launched — ₹75,000 Cr allocated', ref: undefined },
        { text: '3 new districts notified in Vidarbha region', ref: undefined }
      ],
      Changed: [
        { text: 'MGNREGS daily wage revised from ₹267 to ₹289', ref: 'patch #1142', kind: 'pr' as const },
        { text: 'Motor Vehicles Act: penalty for drunk driving increased', ref: 'PR-MH-1140', kind: 'pr' as const }
      ],
      Deprecated: [
        { text: 'Old vehicle registration format — migration period 18 months', ref: undefined }
      ],
      Removed: [
        { text: 'Octroi tax formally abolished — cleanup commit', ref: undefined }
      ],
      Fixed: [
        { text: 'RTI response deadline ambiguity resolved', ref: '334', kind: 'issue' as const, refLabel: 'closes issue #334' }
      ],
      Security: [
        { text: 'CAG Advisory MH-2025-003: ₹1,200 Cr PMAY-G funds unspent', ref: undefined, refLabel: 'see advisory' }
      ]
    }
  },
  {
    session: 'Winter Session 2024',
    range: 'Dec 02 – Dec 19, 2024',
    sections: {
      Added: [
        { text: 'Maharashtra State Skill Development Mission v2', ref: 'PR-MH-1098', kind: 'pr' as const },
        { text: 'Aurangabad renamed Chhatrapati Sambhajinagar — civic notifications updated', ref: undefined },
      ],
      Changed: [
        { text: 'Stamp duty on women-registered property reduced 1%', ref: 'PR-MH-1101', kind: 'pr' as const },
      ],
      Fixed: [
        { text: 'Onion export ban revised after Lasalgaon protests — corrigendum', ref: '912', kind: 'issue' as const }
      ],
      Security: [
        { text: 'Cybercrime helpline 1930 expanded to all districts — incident #c-2024-882', ref: undefined }
      ]
    }
  },
  {
    session: 'Monsoon Session 2024',
    range: 'Jul 22 – Aug 12, 2024',
    sections: {
      Added: [
        { text: 'Ladki Bahin Yojana — ₹1,500/month for 2.4 Cr women beneficiaries', ref: 'PR-MH-1067', kind: 'pr' as const },
      ],
      Changed: [
        { text: 'OBC reservation matrix updated post Maratha quota verdict', ref: 'PR-MH-1071', kind: 'pr' as const }
      ],
      Removed: [
        { text: 'Discontinued: redundant 12 zilla-level commissions overlapping with PRIs', ref: undefined }
      ]
    }
  }
];

export const RELEASES = [
  {
    tag: 'v2025.1.0', latest: true, title: 'Digital Personal Data Protection Act 2025',
    date: 'Jan 27, 2025', pr: 'PR-847', assets: 3,
    notes: 'Added comprehensive data protection framework. Establishes DPBI as enforcement body.',
    yanked: false, ordinance: false
  },
  {
    tag: 'v2024.4.2', latest: false, title: 'Bharatiya Nyaya Sanhita 2024 (BNS)',
    date: 'Jul 01, 2024', pr: 'PR-781', assets: 12,
    notes: 'Replaces IPC 1860. 358 sections, restructured chapters on offences against the state, body, women, and property.',
    yanked: false, ordinance: false
  },
  {
    tag: 'v2024.3.1', latest: false, title: 'Bharatiya Nagarik Suraksha Sanhita 2024',
    date: 'Jul 01, 2024', pr: 'PR-783', assets: 8,
    notes: 'Replaces CrPC. Adds zero-FIR provisions, e-filing, time-bound trials.',
    yanked: false, ordinance: false
  },
  {
    tag: 'v2025.0.1-rc.4', latest: false, title: 'Telecommunications (Amendment) Ordinance 2025',
    date: 'Apr 13, 2025', pr: 'PR-845', assets: 1,
    notes: 'Promulgated by President under Article 123. Spectrum auction rules amended.',
    yanked: false, ordinance: true, expiresIn: '23 days'
  },
  {
    tag: 'v2019.3.2', latest: false, title: 'Electoral Bonds Scheme 2019',
    date: 'Jan 02, 2019', pr: 'PR-291', assets: 1,
    notes: '',
    yanked: true, yankReason: 'Reverted by SC — Association for Democratic Reforms v. UoI · Feb 15, 2024',
    ordinance: false
  },
  {
    tag: 'v2023.5.0', latest: false, title: 'Mahila Reservation (106th Amdt) Act',
    date: 'Sep 28, 2023', pr: 'PR-712', assets: 2,
    notes: '33% reservation for women in Lok Sabha and State Assemblies. Enforcement contingent on next Census + delimitation.',
    yanked: false, ordinance: false
  }
];

export const CONTRIBUTORS: Record<string, Contributor> = {
  'nirmala-sitharaman': {
    handle: 'nirmala-sitharaman', name: 'Nirmala Sitharaman',
    role: 'Finance Minister', party: 'BJP',
    orgs: ['india/cabinet'], house: 'Rajya Sabha',
    affidavit: 'Assets ₹2.1 Cr · No criminal cases · Income ₹XX L (FY24)',
    stats: { opened: 47, merged: 31, closed: 16, mergeRate: 66, issuesRaised: 12, reviewsGiven: 89 },
    bio: 'Maintainer of india/finance · Owner of @india/cabinet'
  },
  'devendra-fadnavis': {
    handle: 'devendra-fadnavis', name: 'Devendra Fadnavis',
    role: 'Chief Minister, Maharashtra', party: 'BJP',
    orgs: ['india/maharashtra'], house: 'Vidhan Parishad',
    affidavit: 'Assets ₹13.4 Cr · No criminal cases · Income ₹47 L (FY24)',
    stats: { opened: 142, merged: 98, closed: 28, mergeRate: 69, issuesRaised: 4, reviewsGiven: 234 },
    bio: 'Maintainer of india/maharashtra'
  },
  'supriya-sule': {
    handle: 'supriya-sule', name: 'Supriya Sule',
    role: 'MP, Baramati · Working President NCP(SP)', party: 'NCP(SP)',
    orgs: ['india/opposition'], house: 'Lok Sabha',
    affidavit: 'Assets ₹178 Cr · No criminal cases · Income ₹2.6 Cr (FY24)',
    stats: { opened: 18, merged: 4, closed: 7, mergeRate: 22, issuesRaised: 67, reviewsGiven: 43 },
    bio: 'Active issue-raiser on rural infrastructure and agriculture'
  },
  'ashwini-vaishnaw': {
    handle: 'ashwini-vaishnaw', name: 'Ashwini Vaishnaw',
    role: 'Minister of Railways, IT, Communications', party: 'BJP',
    orgs: ['india/cabinet'], house: 'Rajya Sabha',
    affidavit: 'Assets ₹4.0 Cr · No criminal cases · Income ₹71 L (FY24)',
    stats: { opened: 38, merged: 24, closed: 9, mergeRate: 63, issuesRaised: 6, reviewsGiven: 71 },
    bio: 'Maintainer of india/meity, india/railways, india/dot'
  }
};

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
