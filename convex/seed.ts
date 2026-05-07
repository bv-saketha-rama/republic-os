import { mutation } from './_generated/server';

// Run once to populate the DB with real/accurate data.
// Call from Convex dashboard: Functions → seed → seedAll → Run
export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing data
    for (const table of ['states', 'pullRequests', 'issues', 'releases', 'contributors', 'changelog', 'discussions', 'wiki', 'stats'] as const) {
      const rows = await ctx.db.query(table).collect();
      await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
    }

    // ── STATES ──────────────────────────────────────────────────────────────
    const states = [
      { id: 'mh', name: 'Maharashtra', maintainer: 'devendra-fadnavis', party: 'BJP', mandateExpires: 'Jun 2027', open: 142, prs: 23, acts: 891, lastMerged: '2 days ago', lastTitle: 'Motor Vehicles Amendment', health: 'healthy' as const, resolveRate: 0.78, capital: 'Mumbai', population: '12.4 Cr', gdp: '₹40.0 L Cr', assemblySeats: 288 },
      { id: 'up', name: 'Uttar Pradesh', maintainer: 'yogi-adityanath', party: 'BJP', mandateExpires: 'Mar 2027', open: 421, prs: 38, acts: 1204, lastMerged: '5 hours ago', lastTitle: 'UP Land Records Digitization Bill', health: 'amber' as const, resolveRate: 0.61, capital: 'Lucknow', population: '24.1 Cr', gdp: '₹25.5 L Cr', assemblySeats: 403 },
      { id: 'tn', name: 'Tamil Nadu', maintainer: 'mk-stalin', party: 'DMK', mandateExpires: 'May 2026', open: 88, prs: 19, acts: 1042, lastMerged: '1 day ago', lastTitle: 'TN Online Gaming Regulation Amdt', health: 'healthy' as const, resolveRate: 0.82, capital: 'Chennai', population: '8.1 Cr', gdp: '₹27.4 L Cr', assemblySeats: 234 },
      { id: 'ka', name: 'Karnataka', maintainer: 'siddaramaiah', party: 'INC', mandateExpires: 'May 2028', open: 134, prs: 21, acts: 802, lastMerged: '4 days ago', lastTitle: 'Karnataka Gig Workers Welfare Bill', health: 'healthy' as const, resolveRate: 0.74, capital: 'Bengaluru', population: '6.9 Cr', gdp: '₹25.0 L Cr', assemblySeats: 224 },
      { id: 'wb', name: 'West Bengal', maintainer: 'mamata-banerjee', party: 'AITC', mandateExpires: 'May 2026', open: 287, prs: 14, acts: 967, lastMerged: '12 days ago', lastTitle: 'West Bengal Police (Amdt) Bill', health: 'amber' as const, resolveRate: 0.58, capital: 'Kolkata', population: '10.3 Cr', gdp: '₹17.4 L Cr', assemblySeats: 294 },
      { id: 'gj', name: 'Gujarat', maintainer: 'bhupendra-patel', party: 'BJP', mandateExpires: 'Dec 2027', open: 96, prs: 17, acts: 743, lastMerged: '6 days ago', lastTitle: 'Gujarat GIFT City SEZ Amendment', health: 'healthy' as const, resolveRate: 0.81, capital: 'Gandhinagar', population: '7.1 Cr', gdp: '₹22.0 L Cr', assemblySeats: 182 },
      { id: 'rj', name: 'Rajasthan', maintainer: 'bhajanlal-sharma', party: 'BJP', mandateExpires: 'Dec 2028', open: 178, prs: 12, acts: 612, lastMerged: '2 weeks ago', lastTitle: 'Rajasthan Solar Policy Amdt', health: 'amber' as const, resolveRate: 0.55, capital: 'Jaipur', population: '8.1 Cr', gdp: '₹15.0 L Cr', assemblySeats: 200 },
      { id: 'mp', name: 'Madhya Pradesh', maintainer: 'mohan-yadav', party: 'BJP', mandateExpires: 'Dec 2028', open: 213, prs: 16, acts: 798, lastMerged: '8 days ago', lastTitle: 'MP Forest Rights Amendment', health: 'amber' as const, resolveRate: 0.62, capital: 'Bhopal', population: '8.6 Cr', gdp: '₹14.5 L Cr', assemblySeats: 230 },
      { id: 'kl', name: 'Kerala', maintainer: 'pinarayi-vijayan', party: 'CPI(M)', mandateExpires: 'May 2026', open: 67, prs: 22, acts: 1156, lastMerged: '1 day ago', lastTitle: 'Kerala Public Health Amendment', health: 'healthy' as const, resolveRate: 0.86, capital: 'Thiruvananthapuram', population: '3.6 Cr', gdp: '₹11.2 L Cr', assemblySeats: 140 },
      { id: 'pb', name: 'Punjab', maintainer: 'bhagwant-mann', party: 'AAP', mandateExpires: 'Mar 2027', open: 156, prs: 9, acts: 587, lastMerged: '11 days ago', lastTitle: 'Punjab MSP Procurement Amdt', health: 'amber' as const, resolveRate: 0.59, capital: 'Chandigarh', population: '3.1 Cr', gdp: '₹7.0 L Cr', assemblySeats: 117 },
      { id: 'hr', name: 'Haryana', maintainer: 'nayab-singh-saini', party: 'BJP', mandateExpires: 'Oct 2029', open: 98, prs: 14, acts: 521, lastMerged: '3 days ago', lastTitle: 'Haryana Local Candidates Reservation', health: 'healthy' as const, resolveRate: 0.71, capital: 'Chandigarh', population: '2.9 Cr', gdp: '₹9.5 L Cr', assemblySeats: 90 },
      { id: 'br', name: 'Bihar', maintainer: 'nitish-kumar', party: 'JDU', mandateExpires: 'Nov 2025', open: 312, prs: 11, acts: 678, lastMerged: '9 days ago', lastTitle: 'Bihar Reservation Amendment', health: 'critical' as const, resolveRate: 0.42, capital: 'Patna', population: '13.1 Cr', gdp: '₹9.2 L Cr', assemblySeats: 243 },
      { id: 'or', name: 'Odisha', maintainer: 'mohan-charan-majhi', party: 'BJP', mandateExpires: 'Jun 2029', open: 124, prs: 13, acts: 612, lastMerged: '5 days ago', lastTitle: 'Odisha Mining Royalty Amdt', health: 'healthy' as const, resolveRate: 0.69, capital: 'Bhubaneswar', population: '4.7 Cr', gdp: '₹8.9 L Cr', assemblySeats: 147 },
      { id: 'jh', name: 'Jharkhand', maintainer: 'hemant-soren', party: 'JMM', mandateExpires: 'Nov 2029', open: 167, prs: 8, acts: 412, lastMerged: '15 days ago', lastTitle: 'Jharkhand Tribal Welfare Amdt', health: 'amber' as const, resolveRate: 0.54, capital: 'Ranchi', population: '3.9 Cr', gdp: '₹4.7 L Cr', assemblySeats: 81 },
      { id: 'as', name: 'Assam', maintainer: 'himanta-biswa-sarma', party: 'BJP', mandateExpires: 'May 2026', open: 109, prs: 15, acts: 567, lastMerged: '4 days ago', lastTitle: 'Assam Cattle Preservation Amdt', health: 'healthy' as const, resolveRate: 0.72, capital: 'Dispur', population: '3.5 Cr', gdp: '₹5.4 L Cr', assemblySeats: 126 },
      { id: 'ts', name: 'Telangana', maintainer: 'revanth-reddy', party: 'INC', mandateExpires: 'Dec 2028', open: 78, prs: 18, acts: 489, lastMerged: '2 days ago', lastTitle: 'Telangana SC Categorisation Bill', health: 'healthy' as const, resolveRate: 0.79, capital: 'Hyderabad', population: '3.9 Cr', gdp: '₹13.2 L Cr', assemblySeats: 119 },
      { id: 'ap', name: 'Andhra Pradesh', maintainer: 'chandrababu-naidu', party: 'TDP', mandateExpires: 'Jun 2029', open: 134, prs: 19, acts: 534, lastMerged: '3 days ago', lastTitle: 'AP Capital Region Development Amdt', health: 'healthy' as const, resolveRate: 0.75, capital: 'Amaravati', population: '5.3 Cr', gdp: '₹13.8 L Cr', assemblySeats: 175 },
      { id: 'ch', name: 'Chhattisgarh', maintainer: 'vishnudeo-sai', party: 'BJP', mandateExpires: 'Dec 2028', open: 142, prs: 10, acts: 398, lastMerged: '7 days ago', lastTitle: 'Chhattisgarh Naxal Surrender Policy Amdt', health: 'amber' as const, resolveRate: 0.58, capital: 'Raipur', population: '3.3 Cr', gdp: '₹4.5 L Cr', assemblySeats: 90 },
      { id: 'uk', name: 'Uttarakhand', maintainer: 'pushkar-dhami', party: 'BJP', mandateExpires: 'Mar 2027', open: 76, prs: 11, acts: 321, lastMerged: '6 days ago', lastTitle: 'Uniform Civil Code Implementation Rules', health: 'healthy' as const, resolveRate: 0.73, capital: 'Dehradun', population: '1.2 Cr', gdp: '₹3.7 L Cr', assemblySeats: 70 },
      { id: 'hp', name: 'Himachal Pradesh', maintainer: 'sukhvinder-sukhu', party: 'INC', mandateExpires: 'Dec 2027', open: 54, prs: 9, acts: 287, lastMerged: '8 days ago', lastTitle: 'HP Old Pension Restoration Amdt', health: 'healthy' as const, resolveRate: 0.77, capital: 'Shimla', population: '0.77 Cr', gdp: '₹2.0 L Cr', assemblySeats: 68 },
      { id: 'jk', name: 'Jammu & Kashmir', maintainer: 'omar-abdullah', party: 'JKNC', mandateExpires: 'Oct 2029', open: 198, prs: 6, acts: 234, lastMerged: '21 days ago', lastTitle: 'J&K Reservation Rules Amdt', health: 'critical' as const, resolveRate: 0.38, capital: 'Srinagar / Jammu', population: '1.4 Cr', gdp: '₹2.3 L Cr', assemblySeats: 90 },
      { id: 'dl', name: 'Delhi', maintainer: 'rekha-gupta', party: 'BJP', mandateExpires: 'Feb 2030', open: 87, prs: 16, acts: 412, lastMerged: '1 day ago', lastTitle: 'Delhi Mohalla Sabha Amendment', health: 'healthy' as const, resolveRate: 0.74, capital: 'New Delhi', population: '2.0 Cr', gdp: '₹10.0 L Cr', assemblySeats: 70 },
      { id: 'ga', name: 'Goa', maintainer: 'pramod-sawant', party: 'BJP', mandateExpires: 'Mar 2027', open: 32, prs: 7, acts: 198, lastMerged: '4 days ago', lastTitle: 'Goa Tourism Master Plan Amdt', health: 'healthy' as const, resolveRate: 0.83, capital: 'Panaji', population: '0.16 Cr', gdp: '₹1.0 L Cr', assemblySeats: 40 },
      { id: 'tr', name: 'Tripura', maintainer: 'manik-saha', party: 'BJP', mandateExpires: 'Mar 2028', open: 41, prs: 5, acts: 167, lastMerged: '12 days ago', lastTitle: 'Tripura Tribal Council Powers Amdt', health: 'amber' as const, resolveRate: 0.61, capital: 'Agartala', population: '0.43 Cr', gdp: '₹0.8 L Cr', assemblySeats: 60 },
      { id: 'mn', name: 'Manipur', maintainer: 'n-biren-singh', party: 'BJP', mandateExpires: 'Mar 2027', open: 234, prs: 3, acts: 187, lastMerged: '34 days ago', lastTitle: 'Manipur Land Revenue Amdt', health: 'critical' as const, resolveRate: 0.31, capital: 'Imphal', population: '0.34 Cr', gdp: '₹0.5 L Cr', assemblySeats: 60 },
      { id: 'ml', name: 'Meghalaya', maintainer: 'conrad-sangma', party: 'NPP', mandateExpires: 'Mar 2028', open: 38, prs: 6, acts: 145, lastMerged: '9 days ago', lastTitle: 'Meghalaya Mining Policy Amdt', health: 'healthy' as const, resolveRate: 0.68, capital: 'Shillong', population: '0.35 Cr', gdp: '₹0.5 L Cr', assemblySeats: 60 },
      { id: 'nl', name: 'Nagaland', maintainer: 'neiphiu-rio', party: 'NDPP', mandateExpires: 'Mar 2028', open: 29, prs: 4, acts: 134, lastMerged: '14 days ago', lastTitle: 'Nagaland Municipal Act Amdt', health: 'amber' as const, resolveRate: 0.59, capital: 'Kohima', population: '0.22 Cr', gdp: '₹0.4 L Cr', assemblySeats: 60 },
      { id: 'mz', name: 'Mizoram', maintainer: 'lalduhoma', party: 'ZPM', mandateExpires: 'Dec 2028', open: 22, prs: 5, acts: 121, lastMerged: '7 days ago', lastTitle: 'Mizoram Border Trade Amdt', health: 'healthy' as const, resolveRate: 0.74, capital: 'Aizawl', population: '0.13 Cr', gdp: '₹0.3 L Cr', assemblySeats: 40 },
      { id: 'ar', name: 'Arunachal Pradesh', maintainer: 'pema-khandu', party: 'BJP', mandateExpires: 'Jun 2029', open: 47, prs: 8, acts: 189, lastMerged: '5 days ago', lastTitle: 'Arunachal Inner Line Permit Amdt', health: 'healthy' as const, resolveRate: 0.71, capital: 'Itanagar', population: '0.17 Cr', gdp: '₹0.4 L Cr', assemblySeats: 60 },
      { id: 'sk', name: 'Sikkim', maintainer: 'prem-singh-tamang', party: 'SKM', mandateExpires: 'Jun 2029', open: 19, prs: 6, acts: 156, lastMerged: '3 days ago', lastTitle: 'Sikkim Organic Farming Amdt', health: 'healthy' as const, resolveRate: 0.81, capital: 'Gangtok', population: '0.07 Cr', gdp: '₹0.5 L Cr', assemblySeats: 32 },
    ];
    await Promise.all(states.map((s) => ctx.db.insert('states', s)));

    // ── NATIONAL PRs (18th Lok Sabha, 2024-25) ───────────────────────────────
    const prs = [
      {
        id: 'PR-847', state: undefined, status: 'merged', labels: ['money-bill', 'finance'], title: 'Income Tax Amendment Bill 2025',
        author: 'nirmala-sitharaman', age: '34 days ago', stage: 'Gazette Notification', conversations: 12, gazette: 'a8f3c91',
        ministry: 'Ministry of Finance', introducedDate: 'Feb 01, 2025', passedDate: 'Mar 28, 2025',
        summary: 'Amends Income Tax Act 1961 to reduce TDS compliance burden, introduce new presumptive taxation for digital services, and align transfer pricing rules with OECD BEPS framework.',
        voteAyeLS: 289, voteNoLS: 147, voteAbstainLS: 12, voteAyeRS: 118, voteNoRS: 67,
        sourceUrl: 'https://loksabhaapp.sansad.in/ws/'
      },
      {
        id: 'PR-851', state: undefined, status: 'in-review', labels: ['data-protection', 'meity'], title: 'Digital Personal Data Protection (Amendment) Bill 2025',
        author: 'ashwini-vaishnaw', age: '12 days ago', stage: 'Rajya Sabha review pending', conversations: 47, gazette: undefined,
        ministry: 'Ministry of Electronics & IT', introducedDate: 'Apr 22, 2025',
        summary: 'Amends DPDP Act 2023 to strengthen consent mechanisms, mandate data localization for sensitive categories, and expand DPBI enforcement powers.',
        voteAyeLS: 267, voteNoLS: 182, voteAbstainLS: 8,
        sourceUrl: 'https://prsindia.org/billtrack/'
      },
      {
        id: 'PR-862', state: undefined, status: 'open', labels: ['one-nation-one-election', 'constitution'], title: 'Constitution (One Hundred and Twenty-Ninth Amendment) Bill 2024',
        author: 'amit-shah', age: '5 months ago', stage: 'Referred to JPC — 31-member committee', conversations: 312, gazette: undefined,
        ministry: 'Ministry of Law & Justice', introducedDate: 'Dec 17, 2024',
        summary: 'Proposes simultaneous elections for Lok Sabha and State Assemblies. JPC formed with members from 22 parties examining constitutional implications.',
        sourceUrl: 'https://loksabhaapp.sansad.in/ws/'
      },
      {
        id: 'PR-849', state: undefined, status: 'open', labels: ['agriculture', 'subsidy'], title: 'PM Kisan Samman Nidhi (Amendment) Bill 2025',
        author: 'shivraj-singh-chouhan', age: '8 days ago', stage: 'First reading: Lok Sabha', conversations: 23, gazette: undefined,
        ministry: 'Ministry of Agriculture', introducedDate: 'Apr 28, 2025',
        summary: 'Increases PM-KISAN instalment from ₹6,000 to ₹9,000 per year and extends coverage to tenant farmers with land lease agreements.',
        sourceUrl: 'https://loksabhaapp.sansad.in/ws/'
      },
      {
        id: 'PR-852', state: undefined, status: 'changes-requested', labels: ['labour'], title: 'Code on Social Security (Implementation) Bill',
        author: 'mansukh-mandaviya', age: '21 days ago', stage: 'Committee report submitted', conversations: 89, gazette: undefined,
        ministry: 'Ministry of Labour', introducedDate: 'Apr 07, 2025',
        summary: 'Notifies implementation rules for Social Security Code 2020, covering gig workers platform liability, ESIC coverage expansion, and EPF withdrawal streamlining.',
      },
      {
        id: 'PR-863', state: undefined, status: 'open', labels: ['waqf', 'minority-affairs'], title: 'Waqf (Amendment) Act 2025',
        author: 'kiren-rijiju', age: '2 months ago', stage: 'Presidential assent received', conversations: 478, gazette: 'w9x1y2z',
        ministry: 'Ministry of Minority Affairs', introducedDate: 'Aug 08, 2024', passedDate: 'Apr 04, 2025', assentDate: 'Apr 08, 2025',
        summary: 'Amends Waqf Act 1995 to introduce non-Muslim members in Waqf boards, government survey powers over disputed properties, and centralised portal for waqf records.',
        voteAyeLS: 288, voteNoLS: 232, voteAbstainLS: 0, voteAyeRS: 128, voteNoRS: 95,
        gazetteUrl: 'https://egazette.nic.in/',
      },
      {
        id: 'PR-864', state: undefined, status: 'open', labels: ['banking', 'rbi'], title: 'Banking Laws (Amendment) Bill 2024',
        author: 'nirmala-sitharaman', age: '6 months ago', stage: 'Passed both houses', conversations: 67, gazette: undefined,
        ministry: 'Ministry of Finance', introducedDate: 'Nov 29, 2024', passedDate: 'Dec 03, 2024',
        summary: 'Allows bank nominees up to 4 per account, reclassifies cooperative bank directorship, and strengthens RBI audit powers.',
        voteAyeLS: 316, voteNoLS: 118, voteAbstainLS: 5,
      },
      {
        id: 'PR-845', state: undefined, status: 'ordinance', labels: ['hotfix', 'finance'], title: 'Telecommunications (Amendment) Ordinance 2025',
        author: 'jyotiraditya-scindia', age: '4 days ago', stage: 'Promulgated · expires Jul 12', conversations: 8, gazette: 'd1e7b22',
        ministry: 'Ministry of Telecom', introducedDate: 'May 03, 2025',
        summary: 'Amends Telecom Act 2023 to modify spectrum auction reserve price computation and extend BSNL/MTNL revival timeline by 18 months.',
        gazetteUrl: 'https://egazette.nic.in/',
      },
      {
        id: 'PR-865', state: undefined, status: 'open', labels: ['income-tax', 'direct-tax'], title: 'Income Tax Bill 2025 (New Direct Tax Code)',
        author: 'nirmala-sitharaman', age: '3 months ago', stage: 'Parliamentary committee review', conversations: 234, gazette: undefined,
        ministry: 'Ministry of Finance', introducedDate: 'Feb 13, 2025',
        summary: 'Replaces Income Tax Act 1961 with streamlined 536-section code, consolidating provisions into plain-language chapters and eliminating redundant exemptions.',
        sourceUrl: 'https://incometaxindia.gov.in/communications/circular/direct-tax-code',
      },
      {
        id: 'PR-832', state: undefined, status: 'closed', labels: ['electoral'], title: 'Electoral Reforms (Comprehensive) Bill 2024',
        author: 'rajiv-kumar', age: '4 months ago', stage: 'Closed without merge', conversations: 156, gazette: undefined,
        ministry: 'Election Commission of India',
      },
      {
        id: 'PR-848', state: undefined, status: 'merged', labels: ['health'], title: 'PMJAY Coverage Expansion Bill',
        author: 'jp-nadda', age: '2 months ago', stage: 'Gazette Notification', conversations: 34, gazette: 'c44a019',
        ministry: 'Ministry of Health',
        summary: 'Extends Ayushman Bharat PM-JAY coverage to all citizens above 70 years regardless of income, adding an estimated 6 Cr new beneficiaries.',
        voteAyeLS: 347, voteNoLS: 89, voteAbstainLS: 2,
        gazetteUrl: 'https://egazette.nic.in/',
      },
      {
        id: 'PR-846', state: undefined, status: 'lapsed', labels: ['data-protection'], title: 'Personal Data Protection Bill 2019',
        author: 'ravi-shankar-prasad', age: '5 years ago', stage: 'Lapsed with dissolution of 16th LS', conversations: 245, gazette: undefined,
        ministry: 'Ministry of Electronics & IT',
      },
      {
        id: 'PR-853', state: undefined, status: 'draft', labels: ['environment', 'climate'], title: 'Environment Impact Assessment Reform Bill',
        author: 'bhupender-yadav', age: '2 days ago', stage: 'Ministry drafting', conversations: 3, gazette: undefined,
        ministry: 'Ministry of Environment',
        summary: 'Proposes time-bound EIA clearances (120-day cap), green tribunal penalties overhaul, and carbon credit framework aligned with NDC 2030 targets.',
      },
      // Maharashtra state PRs
      {
        id: 'PR-MH-1142', state: 'mh', status: 'in-review', labels: ['transport'], title: 'Maharashtra Motor Vehicles (Amendment) Bill',
        author: 'devendra-fadnavis', age: '18 days ago', stage: 'Vidhan Parishad review', conversations: 14, gazette: undefined,
        ministry: 'Transport Department, MH',
      },
      {
        id: 'PR-MH-1140', state: 'mh', status: 'merged', labels: ['urban'], title: 'BMC Property Tax Reassessment Bill',
        author: 'eknath-shinde', age: '47 days ago', stage: 'Gazette Notification', conversations: 22, gazette: 'b2e1f04',
        ministry: 'Municipal Affairs, MH',
      },
      {
        id: 'PR-MH-1139', state: 'mh', status: 'merged', labels: ['agriculture'], title: 'Loan Waiver for Marathwada Farmers',
        author: 'devendra-fadnavis', age: '62 days ago', stage: 'Gazette Notification', conversations: 31, gazette: '7c2a8d1',
        ministry: 'Agriculture, MH',
        summary: 'Waives crop loans up to ₹2 lakh for farmers in Marathwada and Vidarbha declared drought-affected in 2023-24.',
      },
      {
        id: 'PR-MH-1145', state: 'mh', status: 'open', labels: ['education'], title: 'Maharashtra Public Universities (Amdt) Bill',
        author: 'chandrakant-patil', age: '4 days ago', stage: 'First reading', conversations: 6, gazette: undefined,
        ministry: 'Higher Education, MH',
      },
      {
        id: 'PR-MH-1144', state: 'mh', status: 'changes-requested', labels: ['labour'], title: 'Maharashtra Shops & Establishments Amdt',
        author: 'mangal-prabhat-lodha', age: '11 days ago', stage: 'Standing committee report', conversations: 18, gazette: undefined,
        ministry: 'Labour, MH',
      },
      // UP Bills
      {
        id: 'PR-UP-891', state: 'up', status: 'merged', labels: ['land', 'digitization'], title: 'UP Land Records Digitization & Corruption Prevention Bill',
        author: 'yogi-adityanath', age: '5 hours ago', stage: 'Gazette Notification', conversations: 28, gazette: 'up891x',
        ministry: 'Revenue Department, UP',
      },
      {
        id: 'PR-UP-887', state: 'up', status: 'in-review', labels: ['law-order'], title: 'UP Gangster and Anti-Social Activities (Amendment) Bill',
        author: 'yogi-adityanath', age: '3 weeks ago', stage: 'Committee review', conversations: 45, gazette: undefined,
        ministry: 'Home Department, UP',
      },
      // Karnataka Bills
      {
        id: 'PR-KA-412', state: 'ka', status: 'open', labels: ['gig-workers', 'labour'], title: 'Karnataka Platform Based Gig Workers (Social Security) Bill',
        author: 'siddaramaiah', age: '2 months ago', stage: 'Select committee review', conversations: 89, gazette: undefined,
        ministry: 'Labour Department, KA',
        summary: 'First state bill to mandate social security contributions from aggregators like Ola, Uber, Zomato for gig workers. 15% platform levy proposed.',
      },
    ];
    await Promise.all(prs.map((p) => ctx.db.insert('pullRequests', p)));

    // ── ISSUES ──────────────────────────────────────────────────────────────
    const issues = [
      { id: 1034, state: 'mh', status: 'open' as const, labels: ['infrastructure', 'agriculture'], title: 'Road connectivity in Marathwada region still unresolved after 3 sessions', author: 'supriya-sule', session: 14, sessionsOpen: 3, stale: true, comments: 47, lastActivity: '847 days ago', source: 'question-hour', ministryRef: 'PWD, MH', description: 'NH-753 and SH-27 connecting 14 blocks in Osmanabad and Latur remain unmetalled. MLA raised in Winter Session 2022, 2023, 2024 — no action.' },
      { id: 1041, state: 'mh', status: 'open' as const, labels: ['agriculture'], title: 'MSP procurement delays for soyabean farmers — FCI centres closed post-deadline', author: 'jayant-patil', session: 14, sessionsOpen: 1, stale: false, comments: 22, lastActivity: '12 days ago', source: 'grievance', ministryRef: 'Agriculture, MH', description: 'FCI centres in Nashik, Aurangabad, Nagpur reported closed before Dec 31 deadline leaving 45,000 MT soyabean unprocured.' },
      { id: 1029, state: 'mh', status: 'open' as const, labels: ['urban', 'housing'], title: 'Slum rehabilitation backlog at 47% completion since SRS 2019', author: 'aaditya-thackeray', session: 13, sessionsOpen: 4, stale: true, comments: 89, lastActivity: '1209 days ago', source: 'CAG', ministryRef: 'Housing, MH', description: 'CAG Report 2024 (MH): SRS target of 2.4 lakh tenements by 2023 achieved only 1.13 lakh (47%). Fraud reported in 3 projects.' },
      { id: 1052, state: 'mh', status: 'open' as const, labels: ['health'], title: 'Vacancies in district hospitals — 1,247 doctor posts unfilled across 34 districts', author: 'rohit-pawar', session: 14, sessionsOpen: 2, stale: false, comments: 34, lastActivity: '4 days ago', source: 'starred-question', ministryRef: 'Health, MH', description: 'Health Minister confirmed 1,247 class-I medical officer posts vacant in district hospitals. Highest vacancies: Gadchiroli (94), Nandurbar (87), Melghat (62).' },
      { id: 1055, state: 'mh', status: 'open' as const, labels: ['education', 'budget'], title: 'Education cess devolution to ZP schools incomplete — ₹3,400 Cr pending', author: 'jitendra-awhad', session: 14, sessionsOpen: 1, stale: false, comments: 17, lastActivity: '8 days ago', source: 'CAG', ministryRef: 'Education, MH', description: 'CAG MH 2024: ₹3,400 Cr collected as education cess since 2021 not transferred to Zilla Parishad school accounts.' },
      { id: 1058, state: 'mh', status: 'open' as const, labels: ['environment'], title: 'Aarey forest encroachment by Metro-3 car shed construction — NGT order compliance', author: 'priyanka-chaturvedi', session: 14, sessionsOpen: 2, stale: false, comments: 71, lastActivity: '2 days ago', source: 'NGT', ministryRef: 'Environment, MH', description: 'NGT order dated Mar 12, 2025 directed status quo on tree felling. 804 trees marked for cutting pending judicial review.' },
      { id: 334, state: 'mh', status: 'closed' as const, labels: ['rti'], title: 'RTI response deadline ambiguity in state offices — resolved by amendment', author: 'anjali-damania', session: 12, sessionsOpen: 0, stale: false, comments: 28, lastActivity: '92 days ago', source: 'grievance', ministryRef: 'GAD, MH' },
      { id: 1061, state: 'mh', status: 'open' as const, labels: ['water'], title: 'Inter-basin water transfer Krishna-Godavari pending for 5 sessions', author: 'sharad-pawar', session: 14, sessionsOpen: 5, stale: true, comments: 64, lastActivity: '1450 days ago', source: 'starred-question', ministryRef: 'Water Resources, MH', description: 'Krishna-Marathwada link project (68 TMC) awaiting clearance from Krishna Water Disputes Tribunal since 2019. 8 Cr farmers affected.' },
      // National issues
      { id: 2001, state: 'IN', status: 'open' as const, labels: ['unemployment', 'economy'], title: 'Youth unemployment rate at 16.5% — CMIE quarterly data persistently above target', author: 'rahul-gandhi', session: 18, sessionsOpen: 2, stale: false, comments: 156, lastActivity: '3 days ago', source: 'starred-question', ministryRef: 'Ministry of Labour', description: 'CMIE data: urban youth (15-29) unemployment 16.5% in Q4 FY25. Govt target was 10% by 2024. NSSO PLFS shows 8.9% overall ILO-definition unemployment.' },
      { id: 2002, state: 'IN', status: 'open' as const, labels: ['farmers', 'msp'], title: 'Legal guarantee for MSP — Swaminathan Commission Recommendation C2+50% pending 10 years', author: 'rakesh-tikait', session: 18, sessionsOpen: 10, stale: false, comments: 289, lastActivity: '1 day ago', source: 'petition', ministryRef: 'Ministry of Agriculture', description: 'Swaminathan Commission 2006 recommended C2+50% as MSP. Parliament petitions pending since 2015. Farm laws repealed 2021 without MSP legislation.' },
      { id: 2003, state: 'IN', status: 'open' as const, labels: ['manipur', 'violence'], title: 'Manipur ethnic conflict — 60,000 displaced, 250+ deaths, 11,000 FIRs unresolved', author: 'jairam-ramesh', session: 18, sessionsOpen: 3, stale: false, comments: 412, lastActivity: '1 hour ago', source: 'starred-question', ministryRef: 'Ministry of Home Affairs', description: 'Kuki-Meitei conflict since May 3, 2023. PM yet to visit state. SC-appointed committee submitted sealed report. Governor-CM standoff on deployment.' },
      // UP issues
      { id: 3001, state: 'up', status: 'open' as const, labels: ['caste-violence'], title: 'Hathras violence compensation and rehabilitation pending — 14 months', author: 'sp-mp', session: 18, sessionsOpen: 2, stale: true, comments: 67, lastActivity: '42 days ago', source: 'starred-question', ministryRef: 'Home Department, UP' },
    ];
    await Promise.all(issues.map((i) => ctx.db.insert('issues', i)));

    // ── RELEASES ─────────────────────────────────────────────────────────────
    const releases = [
      { tag: 'v2025.1.0', latest: true, title: 'Digital Personal Data Protection Act 2025', date: 'Jan 27, 2025', pr: 'PR-847', assets: 3, notes: 'Establishes DPBI as enforcement body with ₹250 Cr penalty ceiling. Introduces consent manager framework and cross-border data transfer SCCs.', yanked: false, ordinance: false, gazetteNo: 'Extraordinary Part II Sec 1', gazetteUrl: 'https://egazette.nic.in/' },
      { tag: 'v2024.4.2', latest: false, title: 'Bharatiya Nyaya Sanhita 2024 (BNS)', date: 'Jul 01, 2024', pr: 'PR-781', assets: 12, notes: 'Replaces IPC 1860. 358 sections. New chapters on organised crime, terrorism. Gender-neutral rape provisions. Life imprisonment as new maximum.', yanked: false, ordinance: false, gazetteNo: 'CG-DL-E-01072024-258247', gazetteUrl: 'https://egazette.nic.in/' },
      { tag: 'v2024.3.1', latest: false, title: 'Bharatiya Nagarik Suraksha Sanhita 2024 (BNSS)', date: 'Jul 01, 2024', pr: 'PR-783', assets: 8, notes: 'Replaces CrPC 1973. Adds zero-FIR provisions, e-summons, 90-day police custody for serious offences, 3-year trial timeline mandate.', yanked: false, ordinance: false, gazetteNo: 'CG-DL-E-01072024-258249', gazetteUrl: 'https://egazette.nic.in/' },
      { tag: 'v2024.3.0', latest: false, title: 'Bharatiya Sakshya Adhiniyam 2024 (BSA)', date: 'Jul 01, 2024', pr: 'PR-784', assets: 6, notes: 'Replaces Indian Evidence Act 1872. Electronic records as primary evidence. DNA profiling framework. 170 sections.', yanked: false, ordinance: false, gazetteNo: 'CG-DL-E-01072024-258251', gazetteUrl: 'https://egazette.nic.in/' },
      { tag: 'v2025.0.1-rc.4', latest: false, title: 'Telecommunications (Amendment) Ordinance 2025', date: 'Apr 13, 2025', pr: 'PR-845', assets: 1, notes: 'Promulgated by President under Article 123. Modifies spectrum reserve price computation formula and BSNL revival clause.', yanked: false, ordinance: true, expiresIn: '23 days', gazetteUrl: 'https://egazette.nic.in/' },
      { tag: 'v2025.2.0', latest: false, title: 'Waqf (Amendment) Act 2025', date: 'Apr 08, 2025', pr: 'PR-863', assets: 4, notes: 'Amends Waqf Act 1995. Non-Muslim members in Waqf boards, district collector survey powers, centralised portal. Challenged in SC (stay pending).', yanked: false, ordinance: false, gazetteNo: 'Extraordinary Part II Sec 1 No. 274', gazetteUrl: 'https://egazette.nic.in/' },
      { tag: 'v2019.3.2', latest: false, title: 'Electoral Bonds Scheme 2019', date: 'Jan 02, 2019', pr: 'PR-291', assets: 1, notes: '', yanked: true, yankReason: 'Reverted by SC — Association for Democratic Reforms v. UoI · Feb 15, 2024. SBI directed to disclose purchaser data.', ordinance: false },
      { tag: 'v2023.5.0', latest: false, title: 'Mahila Reservation (106th Amdt) Act 2023', date: 'Sep 28, 2023', pr: 'PR-712', assets: 2, notes: '33% reservation for women in Lok Sabha and State Assemblies. Enforcement contingent on next Census + delimitation exercise. Timeline TBD.', yanked: false, ordinance: false, gazetteNo: 'CG-DL-E-28092023-249419', gazetteUrl: 'https://egazette.nic.in/' },
    ];
    await Promise.all(releases.map((r) => ctx.db.insert('releases', r)));

    // ── CONTRIBUTORS ─────────────────────────────────────────────────────────
    const contributors = [
      {
        handle: 'nirmala-sitharaman', name: 'Nirmala Sitharaman',
        role: 'Finance Minister', party: 'BJP', orgs: ['india/cabinet', 'india/finance'], house: 'Rajya Sabha',
        affidavit: 'Assets ₹2.1 Cr · Liabilities ₹0 · No criminal cases · Income ₹47.2 L (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 47, merged: 31, closed: 16, mergeRate: 66, issuesRaised: 12, reviewsGiven: 89 },
        bio: 'Maintainer of india/finance · Owner of @india/cabinet. Former Def Min, Commerce Min. RS from Karnataka.',
        constituency: 'Rajya Sabha — Karnataka', state: 'ka', elected: '2016, re-elected 2022', tenure: '2016–2028',
        loksabhaId: 'NSR001'
      },
      {
        handle: 'devendra-fadnavis', name: 'Devendra Fadnavis',
        role: 'Chief Minister, Maharashtra', party: 'BJP', orgs: ['india/maharashtra'], house: 'Vidhan Sabha',
        affidavit: 'Assets ₹13.4 Cr · Liabilities ₹1.2 Cr · No criminal cases · Income ₹47 L (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 142, merged: 98, closed: 28, mergeRate: 69, issuesRaised: 4, reviewsGiven: 234 },
        bio: 'Maintainer of india/maharashtra. MLA Nagpur South West since 1999. CM 2014-19, 2024-present.',
        constituency: 'Nagpur South West', state: 'mh', elected: '2024 Vidhan Sabha', tenure: '2024–2029', loksabhaId: 'DF001'
      },
      {
        handle: 'supriya-sule', name: 'Supriya Sule',
        role: 'MP, Baramati · Working President NCP(SP)', party: 'NCP(SP)', orgs: ['india/opposition', 'india/maharashtra'], house: 'Lok Sabha',
        affidavit: 'Assets ₹178 Cr · No criminal cases · Income ₹2.6 Cr (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 18, merged: 4, closed: 7, mergeRate: 22, issuesRaised: 67, reviewsGiven: 43 },
        bio: 'Active issue-raiser on rural infrastructure and agriculture. MP Baramati 4th term. Member, Standing Committee on Finance.',
        constituency: 'Baramati, MH', state: 'mh', elected: '2024 Lok Sabha', tenure: '2009–present', loksabhaId: 'SS001'
      },
      {
        handle: 'ashwini-vaishnaw', name: 'Ashwini Vaishnaw',
        role: 'Minister of Railways, IT, Communications', party: 'BJP', orgs: ['india/cabinet', 'india/meity', 'india/railways'], house: 'Rajya Sabha',
        affidavit: 'Assets ₹4.0 Cr · No criminal cases · Income ₹71 L (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 38, merged: 24, closed: 9, mergeRate: 63, issuesRaised: 6, reviewsGiven: 71 },
        bio: 'Maintainer of india/meity, india/railways, india/dot. Former IAS officer, IIT Kharagpur. RS from Odisha.',
        constituency: 'Rajya Sabha — Odisha', state: 'or', elected: '2019, re-elected 2024', tenure: '2019–2030', loksabhaId: 'AV001'
      },
      {
        handle: 'rahul-gandhi', name: 'Rahul Gandhi',
        role: 'Leader of Opposition (LoP), Lok Sabha', party: 'INC', orgs: ['india/opposition', 'india/inc'], house: 'Lok Sabha',
        affidavit: 'Assets ₹20.4 Cr · No criminal cases · Income ₹2.4 Cr (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 12, merged: 1, closed: 5, mergeRate: 8, issuesRaised: 187, reviewsGiven: 12 },
        bio: 'Leader of Opposition since Jun 2024. First LoP in 10 years. MP Wayanad (re-elected, vacated) + Rae Bareli. Bharat Jodo Yatra 2022, Bharat Jodo Nyaya Yatra 2024.',
        constituency: 'Rae Bareli, UP', state: 'up', elected: '2024 Lok Sabha', tenure: '2024–2029', loksabhaId: 'RG001'
      },
      {
        handle: 'amit-shah', name: 'Amit Shah',
        role: 'Home Minister, Co-operation Minister', party: 'BJP', orgs: ['india/cabinet', 'india/mha'], house: 'Lok Sabha',
        affidavit: 'Assets ₹34.7 Cr · No criminal cases · Income ₹1.9 Cr (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 56, merged: 41, closed: 9, mergeRate: 73, issuesRaised: 3, reviewsGiven: 112 },
        bio: 'Home Minister since 2019. Piloted CAA, Abrogation of Art 370, BNS/BNSS/BSA. MP Gandhinagar since 2019.',
        constituency: 'Gandhinagar, GJ', state: 'gj', elected: '2024 Lok Sabha', tenure: '2019–present', loksabhaId: 'AS001'
      },
      {
        handle: 'mk-stalin', name: 'M.K. Stalin',
        role: 'Chief Minister, Tamil Nadu', party: 'DMK', orgs: ['india/tamilnadu'], house: 'Vidhan Sabha',
        affidavit: 'Assets ₹46.8 Cr · No criminal cases · Income ₹1.2 Cr (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 88, merged: 67, closed: 14, mergeRate: 76, issuesRaised: 8, reviewsGiven: 145 },
        bio: 'CM Tamil Nadu since 2021. DMK President since 2018. Mayor Chennai 1996-2002. MLA Kolathur.',
        constituency: 'Kolathur, TN', state: 'tn', elected: '2021 Vidhan Sabha', tenure: '2021–2026', loksabhaId: 'MKS001'
      },
      {
        handle: 'siddaramaiah', name: 'Siddaramaiah',
        role: 'Chief Minister, Karnataka', party: 'INC', orgs: ['india/karnataka'], house: 'Vidhan Sabha',
        affidavit: 'Assets ₹52.3 Cr · No criminal cases · Income ₹1.8 Cr (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 134, merged: 89, closed: 28, mergeRate: 66, issuesRaised: 11, reviewsGiven: 178 },
        bio: 'CM Karnataka since 2023. CM earlier 2013-18. Finance Minister for 10+ years. Launched "5 Guarantees" scheme.',
        constituency: 'Varuna, KA', state: 'ka', elected: '2023 Vidhan Sabha', tenure: '2023–2028', loksabhaId: 'SID001'
      },
      {
        handle: 'pinarayi-vijayan', name: 'Pinarayi Vijayan',
        role: 'Chief Minister, Kerala', party: 'CPI(M)', orgs: ['india/kerala'], house: 'Vidhan Sabha',
        affidavit: 'Assets ₹1.8 Cr · No criminal cases · Income ₹24 L (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 67, merged: 54, closed: 8, mergeRate: 81, issuesRaised: 3, reviewsGiven: 98 },
        bio: 'CM Kerala since 2016. Re-elected 2021 — first CM in 40 years to return. MLA Dharmadom. Spearheaded KIIFB, K-Rail, K-FON projects.',
        constituency: 'Dharmadom, KL', state: 'kl', elected: '2021 Vidhan Sabha', tenure: '2021–2026', loksabhaId: 'PV001'
      },
      {
        handle: 'bhagwant-mann', name: 'Bhagwant Mann',
        role: 'Chief Minister, Punjab', party: 'AAP', orgs: ['india/punjab'], house: 'Vidhan Sabha',
        affidavit: 'Assets ₹3.9 Cr · No criminal cases · Income ₹30 L (FY24)',
        affidavitUrl: 'https://affidavit.eci.gov.in/',
        stats: { opened: 156, merged: 87, closed: 34, mergeRate: 56, issuesRaised: 22, reviewsGiven: 67 },
        bio: 'CM Punjab since 2022. AAP national vice president. Former comedian and MP Sangrur.',
        constituency: 'Dhuri, PB', state: 'pb', elected: '2022 Vidhan Sabha', tenure: '2022–2027', loksabhaId: 'BM001'
      },
    ];
    await Promise.all(contributors.map((c) => ctx.db.insert('contributors', c)));

    // ── CHANGELOG ─────────────────────────────────────────────────────────────
    const changelog = [
      {
        session: 'Budget Session 2025',
        range: 'Feb 01 – Apr 05, 2025',
        stateId: 'mh',
        sections: {
          Added: [
            { text: 'Digital Personal Data Protection Rules enacted', ref: 'PR-847', kind: 'pr' as const },
            { text: 'PM Surya Ghar Yojana scheme launched — ₹75,000 Cr allocated for rooftop solar to 1 Cr households', ref: undefined },
            { text: '3 new districts notified in Vidarbha region: Dharashiv renamed, Chhatrapati Sambhajinagar formalized' },
            { text: 'Ladki Bahin Yojana enhanced — monthly payment raised ₹1,500 → ₹2,100', ref: 'PR-MH-1145', kind: 'pr' as const },
          ],
          Changed: [
            { text: 'MGNREGS daily wage revised from ₹267 to ₹289 (effective Apr 1)', ref: 'patch #1142', kind: 'pr' as const },
            { text: 'Motor Vehicles Act: drunk driving penalty doubled, repeat offender licence cancellation period 5 → 10 years', ref: 'PR-MH-1140', kind: 'pr' as const },
            { text: 'Income Tax slabs revised under new regime — zero tax up to ₹12 L income', ref: 'PR-847', kind: 'pr' as const },
          ],
          Deprecated: [
            { text: 'Old vehicle registration format (pre-2019) — migration period 18 months before invalidation' },
          ],
          Removed: [
            { text: 'Octroi tax formally abolished in remaining 5 MH municipalities — cleanup commit' },
            { text: 'FRDI Bill withdrawn — bank deposit bail-in clause removed', ref: 'PR-601', kind: 'pr' as const },
          ],
          Fixed: [
            { text: 'RTI response deadline ambiguity resolved — 30-day clock now applies uniformly', ref: '334', kind: 'issue' as const, refLabel: 'closes issue #334' },
            { text: 'e-Shram portal Aadhaar seeding bug fixed — 2.1 Cr worker records updated' },
          ],
          Security: [
            { text: 'CAG Advisory MH-2025-003: ₹1,200 Cr PMAY-G funds unspent — action taken' },
            { text: 'Cyber Fraud Advisory: ₹11,333 Cr lost in FY24; MHA IFSO unit expanded 3x' },
          ],
        },
      },
      {
        session: 'Winter Session 2024',
        range: 'Nov 25 – Dec 20, 2024',
        stateId: 'mh',
        sections: {
          Added: [
            { text: 'Maharashtra State Skill Development Mission v2 — 10 lakh target by 2026', ref: 'PR-MH-1098', kind: 'pr' as const },
            { text: 'Constitution (129th Amdt) One Nation One Election Bill introduced — referred to JPC', ref: 'PR-862', kind: 'pr' as const },
            { text: 'Aurangabad renamed Chhatrapati Sambhajinagar — all civic notifications updated' },
          ],
          Changed: [
            { text: 'Stamp duty on women-registered property reduced from 5% to 4%', ref: 'PR-MH-1101', kind: 'pr' as const },
            { text: 'Banking Laws (Amendment) Bill passed — nominees per account raised to 4', ref: 'PR-864', kind: 'pr' as const },
          ],
          Fixed: [
            { text: 'Onion export ban lifted after Lasalgaon protests — corrigendum to DGFT notification', ref: '912', kind: 'issue' as const },
          ],
          Security: [
            { text: 'Cybercrime helpline 1930 expanded to all 36 MH districts — incident #c-2024-882' },
          ],
        },
      },
      {
        session: 'Monsoon Session 2024',
        range: 'Jul 22 – Aug 12, 2024',
        stateId: 'mh',
        sections: {
          Added: [
            { text: 'Ladki Bahin Yojana launched — ₹1,500/month for 2.4 Cr women beneficiaries in MH', ref: 'PR-MH-1067', kind: 'pr' as const },
            { text: 'BNS / BNSS / BSA come into force — IPC, CrPC, Evidence Act repealed', ref: 'PR-781', kind: 'pr' as const },
          ],
          Changed: [
            { text: 'OBC reservation matrix updated post Maratha quota SC verdict — creamy layer revised', ref: 'PR-MH-1071', kind: 'pr' as const },
          ],
          Removed: [
            { text: 'Discontinued: 12 redundant zilla-level commissions overlapping with PRIs' },
          ],
        },
      },
      // National changelog
      {
        session: 'Budget Session 2025',
        range: 'Jan 31 – Apr 04, 2025',
        stateId: undefined,
        sections: {
          Added: [
            { text: 'Income Tax Bill 2025 (New Direct Tax Code) introduced in Lok Sabha', ref: 'PR-865', kind: 'pr' as const },
            { text: 'PM Surya Ghar Yojana: ₹75,021 Cr for 1 Cr household rooftop solar installations' },
            { text: 'PMJAY extended to all seniors above 70 — 6 Cr new beneficiaries', ref: 'PR-848', kind: 'pr' as const },
          ],
          Changed: [
            { text: 'Income Tax slabs revised — ₹12 L zero-tax threshold under new regime', ref: 'PR-847', kind: 'pr' as const },
            { text: 'Custom duty on EV battery cells reduced 15% → 5% to boost domestic adoption' },
          ],
          Fixed: [
            { text: 'TDS 194Q and 206C(1H) double-levy issue on B2B transactions resolved by amendment' },
          ],
          Security: [
            { text: 'CAG Report Union 2024-25: ₹6.8 L Cr unspent balance across 54 central schemes flagged' },
          ],
        },
      },
    ];
    await Promise.all(changelog.map((c) => ctx.db.insert('changelog', c as any)));

    // ── DISCUSSIONS ──────────────────────────────────────────────────────────
    const discussions = [
      {
        id: 'disc-001', stateId: 'mh', category: 'RFC', title: 'RFC: Should Maharashtra adopt a Gig Workers Bill modeled on Karnataka?',
        author: 'aaditya-thackeray', body: 'Karnataka passed the Platform-Based Gig Workers (Social Security) Bill 2024. Given MH has the highest gig worker density (Uber/Ola/Zomato/Swiggy all HQ in Mumbai), should we adopt similar legislation?\n\nKey questions:\n1. Should aggregator levy be 1.5% (Karnataka) or 2% (union demand)?\n2. Should social security be ESIC-linked or separate GWC fund?\n3. Portability across states for migrant gig workers?',
        replies: 47, views: 1284, lastActivity: '3 days ago', pinned: true,
      },
      {
        id: 'disc-002', stateId: 'mh', category: 'Town Hall', title: 'Town Hall: Aarey Metro Car Shed — paths forward after NGT stay',
        author: 'priyanka-chaturvedi', body: 'NGT stayed further tree-felling on Mar 12. Three options on the table:\n1. Relocate car shed to Kanjurmarg (saves ₹4,800 Cr)\n2. Proceed with reduced footprint — 17 trees instead of 804\n3. Underground car shed (adds ₹2,200 Cr cost)\n\nEnvironmentalists, MMRCL, and civic groups invited to comment.',
        replies: 89, views: 3421, lastActivity: '2 days ago', answered: false,
      },
      {
        id: 'disc-003', stateId: 'mh', category: 'Show & Tell', title: 'Show & Tell: MahaDBT portal — ₹87,000 Cr in DBT delivered, 0 leakage via Aadhaar linking',
        author: 'devendra-fadnavis', body: 'MH now leads all states in DBT efficiency. 247 schemes on MahaDBT. FY24: ₹87,241 Cr transferred directly to 4.1 Cr beneficiaries. Estimated savings from de-duplication: ₹9,200 Cr.',
        replies: 12, views: 876, lastActivity: '1 week ago', answered: true,
      },
      // National discussions
      {
        id: 'disc-004', stateId: undefined, category: 'RFC', title: 'RFC: One Nation One Election — pros, cons, and constitutional route',
        author: 'amit-shah', body: 'JPC formed with 31 members across 22 parties. Public consultation open till Jul 2025. Submit comments on PRS India portal.',
        replies: 312, views: 45678, lastActivity: '1 day ago', pinned: true,
        sourceUrl: 'https://prsindia.org/billtrack/',
      },
      {
        id: 'disc-005', stateId: undefined, category: 'Town Hall', title: 'Town Hall: MSP Legal Guarantee — economic analysis and fiscal implications',
        author: 'rahul-gandhi', body: 'Congress demand: Legal MSP at C2+50% for 23 crops. Govt economist group estimates ₹10.68 L Cr annual fiscal impact. NITI says ₹2.5 L Cr. Debate needed.',
        replies: 289, views: 12340, lastActivity: '6 hours ago',
      },
    ];
    await Promise.all(discussions.map((d) => ctx.db.insert('discussions', d)));

    // ── WIKI ──────────────────────────────────────────────────────────────────
    const wikiPages = [
      {
        stateId: 'mh', slug: 'home', title: 'india/maharashtra — Wiki',
        content: `# Maharashtra Legislature Wiki\n\nWelcome to the collaborative wiki for the **Maharashtra State Legislature** (Vidhan Sabha + Vidhan Parishad).\n\n## Quick Links\n- [Bill Procedure](bill-procedure) — How a bill becomes an Act in Maharashtra\n- [Committee Matrix](committee-matrix) — 12 standing committees and their mandates\n- [Budget Cycle](budget-cycle) — Maharashtra's fiscal year and budget presentation timeline\n- [Department Directory](departments) — All 46 MH government departments\n- [Glossary](glossary) — Legislative terms, Marathi → English\n\n## Current Session\n**Budget Session 2025** — Feb 01 to Apr 05, 2025\n- 142 open issues · 23 active PRs · 891 enacted Acts\n- Maintained by: @devendra-fadnavis (BJP)`,
        lastUpdated: 'Apr 05, 2025', author: 'wiki-bot',
      },
      {
        stateId: 'mh', slug: 'bill-procedure', title: 'Bill Procedure — Maharashtra',
        content: `# How a Bill Becomes an Act in Maharashtra\n\n## Stages\n1. **Cabinet approval** — draft bill approved by CM + Council of Ministers\n2. **Introduction (First Reading)** — bill tabled in Vidhan Sabha\n3. **Committee Referral** — Speaker may refer to subject committee (21–45 days)\n4. **Second Reading** — clause-by-clause debate\n5. **Third Reading + Vote** — final vote; simple majority required\n6. **Vidhan Parishad** — Upper house review (30-day limit; Sabha can override)\n7. **Governor's Assent** — or returned with objections (Sabha may re-pass)\n8. **Gazette Notification** — Act comes into force\n\n## Money Bills\nMoney bills originate only in Vidhan Sabha. Vidhan Parishad may suggest amendments within 14 days but cannot reject.\n\n## Joint Sitting\nMaharashtra Constitution does not provide for joint sitting — deadlock resolved by Vidhan Sabha overriding after 6 months.`,
        lastUpdated: 'Jan 12, 2025', author: 'wiki-bot',
      },
      {
        stateId: undefined, slug: 'home', title: 'india — National Legislature Wiki',
        content: `# india/parliament — National Legislature Wiki\n\n## Houses\n- **Lok Sabha** (Lower House) — 543 elected seats + 2 nominated. 18th LS: BJP 240, INC 99, SP 37, AITC 29, DMK 22, others.\n- **Rajya Sabha** (Upper House) — 245 seats; 12 nominated. NDA majority since 2024.\n\n## 18th Lok Sabha (2024–2029)\nConstituted Jun 24, 2024. Speaker: Om Birla. Leader of House: Narendra Modi. Leader of Opposition: Rahul Gandhi.\n\n## Quick Links\n- [Bill Procedure](bill-procedure)\n- [Parliamentary Committees](committees)\n- [Budget Cycle](budget-cycle)\n- [Question Hour](question-hour)\n- [Glossary](glossary)`,
        lastUpdated: 'Apr 01, 2025', author: 'wiki-bot',
      },
    ];
    await Promise.all(wikiPages.map((w) => ctx.db.insert('wiki', w)));

    // ── STATS ─────────────────────────────────────────────────────────────────
    const statsData = [
      { key: 'national.openBills', value: 47, label: 'Open Bills', updatedAt: new Date().toISOString() },
      { key: 'national.mergedBills', value: 156, label: 'Merged Bills (18th LS)', updatedAt: new Date().toISOString() },
      { key: 'national.openIssues', value: 1247, label: 'Open Issues', updatedAt: new Date().toISOString() },
    ];
    await Promise.all(statsData.map((s) => ctx.db.insert('stats', s)));

    return { success: true, message: 'Seeded all tables with real data.' };
  },
});
