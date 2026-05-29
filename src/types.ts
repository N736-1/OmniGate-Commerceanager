export interface Store {
  id: string;
  name: string;
  url: string;
  niche: string;
}

export type AgentRole = 'Master Agent' | 'Agent' | 'Sub-Agent';

export interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  parentId?: string; // Links sub-agent to parent agent
  assignedStoreUrls: string[]; // Store URLs assigned for promotion
  commissionRate: number; // Percentage, e.g., 10 for 10%
  email: string;
  phone: string;
  totalSalesCount: number;
  totalRevenueGenerated: number;
  createdAt: string;
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  isActive: boolean;
  apiKey: string;
  webhookUrl: string;
  supportedMethods: string[];
  testMode: boolean;
}

export interface AdCampaign {
  id: string;
  storeUrl: string;
  platform: 'Facebook' | 'Google Ads' | 'YouTube Ads' | 'TikTok' | 'WhatsApp' | 'Instagram';
  budget: number; // Monthly budget in USD
  targetCPC: number;
  targetCTR: number; // e.g., 2% -> 2
  targetConversionRate: number; // e.g., 1.5% -> 1.5
  avgOrderValue: number; // in USD
}

export interface ScaleProjectionParams {
  monthsToProject: number;
  initialInvestment: number;
  monthlyMarketingSpend: number;
  expectedROASMultiplier: number;
  agentGrowthRate: number; // e.g. 15% growth monthly
  organicTrafficGrowth: number; // % monthly
}
