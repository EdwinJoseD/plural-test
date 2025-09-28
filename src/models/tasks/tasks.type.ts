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

export type TasksType = {
  id: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedTo?: string;
  createdBy?: string;
  dueDate?: Date;
  completedAt?: Date;
  estimatedHours?: number;
  actualHours?: number;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TaskFilter = {
  page: number;
  limit: number;
  fieldName?: keyof TasksType;
  fieldValue?: string;
  fieldSort?: keyof TasksType;
  valueSort?: 'ASC' | 'DESC';
};

export type CreateTaskDTO = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedTo?: string;
  createdBy?: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
};

export type UpdateTaskDTO = Partial<CreateTaskDTO>;
