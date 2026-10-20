export type EntityId = string;
export type ISODateString = string;

export type UserRole = 'parent' | 'child';
export type TaskDifficulty = 'bronze' | 'silver' | 'gold' | 'diamond';
export type TaskStatus = 'pending' | 'awaiting_approval' | 'approved' | 'rejected' | 'failed' | 'done';
export type TaskScheduleMode = 'recurring' | 'single';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type TransactionType = 'task_reward' | 'conversion' | 'goal_contribution' | 'reward_purchase' | 'adjustment';
export type WalletBucket = 'spend' | 'save' | 'help';

export interface User {
  id: EntityId;
  name: string;
  role?: UserRole;
  age?: number;
  avatar?: string;
  photo?: string;
  base?: number;
  waterGoal?: number;
  wardrobeBonusEnabled?: boolean;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface TaskRotation {
  enabled: boolean;
  memberIds: EntityId[];
  currentIndex?: number;
  startDate?: ISODateString;
}

export interface Task {
  id: EntityId;
  memberId: EntityId;
  title: string;
  type: EntityId;
  penalty?: string;
  days?: number[];
  date?: ISODateString;
  time?: string;
  mode: TaskScheduleMode;
  isWardrobe?: boolean;
  difficulty: TaskDifficulty;
  points: number;
  requiresProof: boolean;
  rotation?: TaskRotation;
  status: Record<string, TaskStatus>;
  createdAt?: ISODateString;
  updatedAt?: ISODateString;
}

export interface Proof {
  id: EntityId;
  url: string;
  storagePath?: string;
  mimeType?: string;
  createdAt: ISODateString;
}

export interface Approval {
  id: EntityId;
  taskId: EntityId;
  childId: EntityId;
  date: ISODateString;
  status: ApprovalStatus;
  proof?: Proof;
  feedback?: string;
  reviewedBy?: EntityId;
  reviewedAt?: ISODateString;
  createdAt: ISODateString;
}

export interface WalletSplit {
  spend: number;
  save: number;
  help: number;
}

export interface Wallet {
  id: EntityId;
  childId: EntityId;
  points: number;
  money: number;
  split: WalletSplit;
  conversion: {
    points: number;
    money: number;
  };
  buckets: WalletSplit;
  updatedAt?: ISODateString;
}

export interface Transaction {
  id: EntityId;
  childId: EntityId;
  type: TransactionType;
  pointsDelta: number;
  moneyDelta: number;
  bucket?: WalletBucket;
  sourceId?: EntityId;
  description: string;
  createdAt: ISODateString;
}

export interface Goal {
  id: EntityId;
  childId: EntityId;
  title: string;
  description?: string;
  imageUrl?: string;
  targetAmount: number;
  accumulatedAmount: number;
  targetDate?: ISODateString;
  completedAt?: ISODateString;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

export interface Reward {
  id: EntityId;
  title: string;
  description?: string;
  imageUrl?: string;
  pointsCost: number;
  active: boolean;
  stock?: number;
  createdAt: ISODateString;
  updatedAt?: ISODateString;
}

export interface WaterLog {
  [date: ISODateString]: Record<EntityId, number> & { total?: number };
}

export interface HistoryEvent {
  id: EntityId;
  date: ISODateString;
  kind: 'water' | 'task' | 'finance' | 'member' | 'wallet' | 'goal' | 'reward' | 'approval';
  label: string;
  memberId?: EntityId;
  value?: number;
}

export interface FamilyTaskData {
  members: User[];
  tasks: Task[];
  types: Array<{ id: EntityId; label: string; rule: string; color: string }>;
  water: WaterLog;
  history: HistoryEvent[];
  wallets: Record<EntityId, Wallet>;
  transactions: Transaction[];
  goals: Goal[];
  rewards: Reward[];
  approvals: Approval[];
}
