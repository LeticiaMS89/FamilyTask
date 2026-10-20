import type {
  Approval,
  FamilyTaskData,
  Goal,
  HistoryEvent,
  Reward,
  Task,
  Transaction,
  User,
  Wallet,
} from './models';

const asArray = <T>(value: unknown): T[] => Array.isArray(value) ? value as T[] : [];
const asRecord = <T>(value: unknown): Record<string, T> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, T> : {};
const asNumber = (value: unknown, fallback = 0): number => Number.isFinite(Number(value)) ? Number(value) : fallback;

export const defaultFamilyTaskData = (): FamilyTaskData => ({
  members: [],
  tasks: [],
  types: [],
  water: {},
  history: [],
  wallets: {},
  transactions: [],
  goals: [],
  rewards: [],
  approvals: [],
});

export function normalizeTask(value: Partial<Task>): Task {
  return {
    id: String(value.id ?? ''),
    memberId: String(value.memberId ?? ''),
    title: String(value.title ?? ''),
    type: String(value.type ?? 'unpaid'),
    penalty: value.penalty,
    days: Array.isArray(value.days) ? value.days.map(Number) : [],
    date: value.date,
    time: value.time ? String(value.time) : undefined,
    mode: value.mode === 'single' ? 'single' : 'recurring',
    isWardrobe: Boolean(value.isWardrobe),
    difficulty: value.difficulty ?? 'bronze',
    points: asNumber(value.points),
    requiresProof: Boolean(value.requiresProof),
    rotation: value.rotation,
    status: value.status && typeof value.status === 'object' ? value.status : {},
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  };
}

export function normalizeFamilyTaskData(input: Partial<FamilyTaskData> | null | undefined): FamilyTaskData {
  const source = input ?? {};
  const members = asArray<User>(source.members).map(member => ({
    ...member,
    id: String(member.id ?? ''),
    name: String(member.name ?? ''),
  }));

  return {
    ...defaultFamilyTaskData(),
    members,
    tasks: asArray<Partial<Task>>(source.tasks).map(normalizeTask),
    types: asArray(source.types),
    water: asRecord(source.water),
    history: asArray<HistoryEvent>(source.history),
    wallets: asRecord<Wallet>(source.wallets),
    transactions: asArray<Transaction>(source.transactions),
    goals: asArray<Goal>(source.goals),
    rewards: asArray<Reward>(source.rewards),
    approvals: asArray<Approval>(source.approvals),
  };
}
