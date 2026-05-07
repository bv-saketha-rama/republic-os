import { cronJobs } from 'convex/server';
import { api } from './_generated/api';

const crons = cronJobs();

// Fetch latest Lok Sabha bills daily at 2 AM UTC (7:30 AM IST)
crons.daily('fetch-loksabha-bills', { hourUTC: 2, minuteUTC: 0 }, api.ingestion.loksabha.fetchAndStoreBills);

// Fetch PIB press releases daily at 6 AM UTC (11:30 AM IST)
crons.daily('fetch-pib-changelog', { hourUTC: 6, minuteUTC: 0 }, api.ingestion.pib.fetchAndStoreReleases);

// Refresh Lok Sabha member profiles weekly on Mondays
crons.weekly('fetch-loksabha-members', { dayOfWeek: 'monday', hourUTC: 4, minuteUTC: 0 }, api.ingestion.loksabha.fetchAndStoreMembers);

export default crons;
