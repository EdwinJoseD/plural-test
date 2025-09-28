export type TimeEntryType = {
  id: string;
  taskId: string;
  userId: string;
  startTime: Date;
  endTime: Date | null;
  hoursLogged: number | null;
  description: string | null;
  createdAt?: Date;
};

export type CreateTimeEntryInput = {
  taskId: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  hoursLogged?: number;
  description?: string;
};

export type UpdateTimeEntryInput = {
  startTime?: Date;
  endTime?: Date;
  hoursLogged?: number;
  description?: string;
};

export type TimeEntryFilter = {
  userId?: string;
  taskId?: string;
  startDate?: Date;
  endDate?: Date;
};

export type TimeEntrySort =
  | 'startTime'
  | 'endTime'
  | 'hoursLogged'
  | 'createdAt';

export type TimeEntryOrder = 'asc' | 'desc';

export type TimeEntryQueryOptions = {
  filter?: TimeEntryFilter;
  sortBy?: TimeEntrySort;
  order?: TimeEntryOrder;
  limit?: number;
  offset?: number;
};
