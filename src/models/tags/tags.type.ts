export enum TagColor {
  RED = '#EF4444',
  BLUE = '#3B82F6',
  GREEN = '#10B981',
  YELLOW = '#F59E0B',
  PURPLE = '#8B5CF6',
  ORANGE = '#F97316',
  PINK = '#EC4899',
  TEAL = '#14B8A6',
  GRAY = '#6B7280',
}

export type TagType = {
  id: string;
  name: string;
  color: TagColor;
  createdAt?: Date;
};
