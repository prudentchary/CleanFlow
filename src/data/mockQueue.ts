import { type QueueItem } from '@/types/queue';

export const initialQueueItems: QueueItem[] = [
  {
    id: 'Q-101',
    orderId: 'ORD-8821',
    customerName: 'Sarah Jenkins',
    itemsSummary: '2x Suits, 3x Shirts',
    specialInstructions: 'Light starch on shirts',
    isExpress: true,
    promisedTime: 'Today, 5:00 PM',
    status: 'washing',
    assignments: {
      washAndStarch: { staffId: 'stf-01', staffName: 'Sarah J.', assignedAt: '09:00 AM' },
      pressAndPackage: { staffId: 'stf-03', staffName: 'David C.', assignedAt: '09:00 AM' },
    },
  },
  {
    id: 'Q-102',
    orderId: 'ORD-8824',
    customerName: 'Michael Brown',
    itemsSummary: '1x Winter Coat, 1x Duvet',
    specialInstructions: 'Delicate wool treatment',
    isExpress: false,
    promisedTime: 'Tomorrow, 12:00 PM',
    status: 'received',
    assignments: {
      washAndStarch: { staffId: 'stf-02', staffName: 'Alex R.', assignedAt: '09:30 AM' },
      pressAndPackage: { staffId: 'stf-04', staffName: 'Emma W.', assignedAt: '09:30 AM' },
    },
  },
  {
    id: 'Q-103',
    orderId: 'ORD-8819',
    customerName: 'David Chen',
    itemsSummary: '4x T-Shirts, 2x Jeans',
    isExpress: false,
    promisedTime: 'Today, 6:00 PM',
    status: 'drying',
    assignments: {
      washAndStarch: { staffId: 'stf-01', staffName: 'Sarah J.', assignedAt: '10:00 AM' },
      pressAndPackage: { staffId: 'stf-03', staffName: 'David C.', assignedAt: '10:00 AM' },
    },
  },
  {
    id: 'Q-104',
    orderId: 'ORD-8815',
    customerName: 'Emma Wilson',
    itemsSummary: '1x Evening Gown',
    specialInstructions: 'Pre-existing stain on hem line',
    isExpress: true,
    promisedTime: 'Today, 4:00 PM',
    status: 'quality_check',
    hasIssue: true,
    issueNote: 'Stain requires second spot-cleaning cycle',
    assignments: {
      washAndStarch: { staffId: 'stf-02', staffName: 'Alex R.', assignedAt: '08:00 AM' },
      pressAndPackage: { staffId: 'stf-04', staffName: 'Emma W.', assignedAt: '08:00 AM' },
    },
  },
];