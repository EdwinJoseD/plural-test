export type NotificationType = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  relatedId?: string;
  isRead?: boolean;
  createdAt?: Date;
};
