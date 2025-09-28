export type AttachmentType = {
  id: string;
  taskId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  createdAt?: Date;
};
