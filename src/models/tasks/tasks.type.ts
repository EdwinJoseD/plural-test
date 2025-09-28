export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export interface TasksType {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  assignedTo?: string;
  createdBy?: string;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TasksCreationAttributes = Omit<
  TasksType,
  'id' | 'createdAt' | 'updatedAt'
>;

export type TasksUpdateAttributes = Partial<
  Omit<TasksType, 'id' | 'createdAt' | 'updatedAt'>
>;
