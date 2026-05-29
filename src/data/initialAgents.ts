import { Agent } from '../types';

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'agent_1',
    name: 'Sarah Jenkins',
    role: 'Master Agent',
    email: 'sarah.j@emporiumhub.net',
    phone: '+1 (555) 901-2134',
    assignedStoreUrls: [
      'https://theamericanemporiu.wed2c.com',
      'https://httpstheamericane.wed2c.com'
    ],
    commissionRate: 12,
    totalSalesCount: 142,
    totalRevenueGenerated: 11360,
    createdAt: '2026-01-10T08:30:00Z'
  },
  {
    id: 'agent_2',
    name: 'Carlos Ruiz',
    role: 'Agent',
    parentId: 'agent_1',
    email: 'carlos.r@emporiumhub.net',
    phone: '+1 (555) 304-4821',
    assignedStoreUrls: [
      'https://theamericanemporiu.wed2c.com'
    ],
    commissionRate: 8,
    totalSalesCount: 64,
    totalRevenueGenerated: 4800,
    createdAt: '2026-02-15T11:20:00Z'
  },
  {
    id: 'agent_3',
    name: 'Fiona Gallagher',
    role: 'Master Agent',
    email: 'fiona.g@bazaarshop.io',
    phone: '+44 7911 123456',
    assignedStoreUrls: [
      'https://bazaarshop.wed2c.com',
      'https://bazzarstore.wed2c.com'
    ],
    commissionRate: 15,
    totalSalesCount: 198,
    totalRevenueGenerated: 14850,
    createdAt: '2026-01-05T09:15:00Z'
  },
  {
    id: 'agent_4',
    name: 'Ami Nakamura',
    role: 'Sub-Agent',
    parentId: 'agent_3',
    email: 'ami.n@bazaarshop.io',
    phone: '+81 90-1234-5678',
    assignedStoreUrls: [
      'https://bazzarstore.wed2c.com'
    ],
    commissionRate: 6,
    totalSalesCount: 37,
    totalRevenueGenerated: 2405,
    createdAt: '2026-03-01T14:45:00Z'
  },
  {
    id: 'agent_5',
    name: 'David Kojo',
    role: 'Agent',
    email: 'david.k@dropcommerce.co',
    phone: '+233 24 123 4567',
    assignedStoreUrls: [
      'https://dropshippingshop.wed2c.com',
      'https://onlinedropstore.wed2c.com'
    ],
    commissionRate: 10,
    totalSalesCount: 89,
    totalRevenueGenerated: 6230,
    createdAt: '2026-02-10T10:05:00Z'
  }
];
