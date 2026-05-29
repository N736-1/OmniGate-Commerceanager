import { Store } from '../types';

export const WED2C_STORES: Store[] = [
  {
    id: 'store1',
    name: 'The American E',
    url: 'https://httpstheamericane.wed2c.com',
    niche: 'American Fashion & Apparel Accessories'
  },
  {
    id: 'store2',
    name: 'The American Emporium',
    url: 'https://theamericanemporiu.wed2c.com',
    niche: 'Global Gadgets & Trendy Kitchenware'
  },
  {
    id: 'store3',
    name: 'Sell Online Store 1',
    url: 'https://sellonlinestore1.wed2c.com',
    niche: 'Fitness Gear & Smart Tech Gear'
  },
  {
    id: 'store4',
    name: 'Sell Bazaar Shop',
    url: 'https://sellbazzarshop.wed2c.com',
    niche: 'Gourmet Treats & Home Decor Essentials'
  },
  {
    id: 'store5',
    name: 'Dropshipping Shop',
    url: 'https://dropshippingshop.wed2c.com',
    niche: 'Instant Essentials & Quick Lifehacks'
  },
  {
    id: 'store6',
    name: 'Bazaar Store',
    url: 'https://bazzarstore.wed2c.com',
    niche: 'Eco-Friendly Utensils & Lifestyle Products'
  },
  {
    id: 'store7',
    name: 'Bazaar Shop',
    url: 'https://bazaarshop.wed2c.com',
    niche: 'Active Outdoor Wear & Travel Packs'
  },
  {
    id: 'store8',
    name: 'Online Drop Store',
    url: 'https://onlinedropstore.wed2c.com',
    niche: 'Smart Office Supplies & Desktop Lighting'
  },
  {
    id: 'store9',
    name: 'Sell Online Store',
    url: 'https://sellonlinestore.wed2c.com',
    niche: 'Wellness Items & Premium Organic Care'
  }
];

export interface ChannelBenchmark {
  platform: 'Facebook' | 'Google Ads' | 'YouTube Ads' | 'TikTok' | 'WhatsApp' | 'Instagram';
  avgCPC: number;
  avgCTR: number;
  avgCVR: number; // Conversion rate
  recommendedNiches: string[];
  roiFactor: number; // Relative efficiency
}

export const CHANNEL_BENCHMARKS: ChannelBenchmark[] = [
  {
    platform: 'Facebook',
    avgCPC: 0.85,
    avgCTR: 1.2,
    avgCVR: 2.1,
    recommendedNiches: ['American Fashion & Apparel Accessories', 'Gourmet Treats & Home Decor Essentials'],
    roiFactor: 1.8
  },
  {
    platform: 'Google Ads',
    avgCPC: 1.20,
    avgCTR: 2.5,
    avgCVR: 3.4,
    recommendedNiches: ['Smart Office Supplies & Desktop Lighting', 'Fitness Gear & Smart Tech Gear'],
    roiFactor: 2.2
  },
  {
    platform: 'YouTube Ads',
    avgCPC: 1.50,
    avgCTR: 0.8,
    avgCVR: 1.8,
    recommendedNiches: ['Global Gadgets & Trendy Kitchenware', 'Active Outdoor Wear & Travel Packs'],
    roiFactor: 1.5
  },
  {
    platform: 'TikTok',
    avgCPC: 0.45,
    avgCTR: 1.8,
    avgCVR: 1.9,
    recommendedNiches: ['Instant Essentials & Quick Lifehacks', 'Global Gadgets & Trendy Kitchenware'],
    roiFactor: 2.0
  },
  {
    platform: 'WhatsApp',
    avgCPC: 0.15, // Conversation start / Broadcast cost
    avgCTR: 9.5, // Extremely high click/response rate
    avgCVR: 5.5, // High peer-to-peer / direct marketing trust
    recommendedNiches: ['Wellness Items & Premium Organic Care', 'Eco-Friendly Utensils & Lifestyle Products'],
    roiFactor: 2.6
  },
  {
    platform: 'Instagram',
    avgCPC: 0.70,
    avgCTR: 1.4,
    avgCVR: 2.3,
    recommendedNiches: ['American Fashion & Apparel Accessories', 'Wellness Items & Premium Organic Care'],
    roiFactor: 1.9
  }
];
