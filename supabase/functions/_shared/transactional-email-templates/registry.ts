import { template as affiliateApplicationReceived } from './affiliate-application-received.tsx'
import { template as affiliateApplicationApproved } from './affiliate-application-approved.tsx'
import { template as affiliateApprovedBronze } from './affiliate-approved-bronze.tsx'
import { template as affiliateApprovedSilver } from './affiliate-approved-silver.tsx'
import { template as affiliateApprovedGold } from './affiliate-approved-gold.tsx'
import { template as benchClubApproved } from './bench-club-approved.tsx'
import { template as benchClubReceived } from './bench-club-received.tsx'

export interface TemplateEntry {
  // deno-lint-ignore no-explicit-any
  component: any
  subject: string | ((data: Record<string, unknown>) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'affiliate-application-received': affiliateApplicationReceived,
  'affiliate-application-approved': affiliateApplicationApproved,
  'affiliate-approved-bronze': affiliateApprovedBronze,
  'affiliate-approved-silver': affiliateApprovedSilver,
  'affiliate-approved-gold': affiliateApprovedGold,
  'bench-club-approved': benchClubApproved,
  'bench-club-received': benchClubReceived,
}
