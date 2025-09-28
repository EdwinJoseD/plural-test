export type TaskCommentType = {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt?: Date;
};

export type CreateTaskCommentDTO = {
  taskId: string;
  userId: string;
  content: string;
};

export type UpdateTaskCommentDTO = {
  content?: string;
};
