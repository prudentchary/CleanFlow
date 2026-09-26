export type ProcessingStatus = 
  | 'received' 
  | 'washing' 
  | 'drying' 
  | 'quality_check' 
  | 'ready';

export interface StageAssignment {
  staffId: string;
  staffName: string;
  assignedAt: string;
  completedAt?: string;
}

export interface OrderAssignments {
  washAndStarch: StageAssignment;
  pressAndPackage: StageAssignment;
}

export interface QueueItem {
  id: string;
  orderId: string;
  customerName: string;
  itemsSummary: string;
  specialInstructions?: string;
  isExpress: boolean;
  promisedTime: string;
  status: ProcessingStatus; // Keep this! Controls Kanban columns
  rackLocation?: string;
  hasIssue?: boolean;
  issueNote?: string;
  assignments: OrderAssignments; // Controls staff accountability
}
export interface StageAssignment {
  staffId: string;
  staffName: string;
  assignedAt: string;
  completedAt?: string;
}

export interface OrderAssignments {
  washAndStarch: StageAssignment;
  pressAndPackage: StageAssignment;
}

export interface QueueItem {
  id: string;
  orderId: string;
  customerName: string;
  itemsSummary: string;
  specialInstructions?: string;
  isExpress: boolean;
  promisedTime: string;
  status: 'received' | 'washing' | 'drying' | 'quality_check' | 'ready';
  rackLocation?: string;
  hasIssue?: boolean;
  issueNote?: string;

  // Add this property
  assignments: OrderAssignments; 
}