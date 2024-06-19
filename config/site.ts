import { SiteConfig, PricingPlan } from '@/types/config'

export const siteConfig: SiteConfig = {
  name: 'Acme Inc',
  title: 'Create Next App',
  description: 'Generated by create next app',
  symbol: 'Mountain', // LucideIcon
  fixedHeader: true,
}

export const pricingPlans: PricingPlan[] = [
  { name: 'free', post: 3 },
  { name: 'basic', post: -1 },
  { name: 'standard', post: -1 },
  { name: 'premium', post: -1 },
]
