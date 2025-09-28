export type TaskCommentType = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt?: Date;
};
