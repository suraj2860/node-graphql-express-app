export interface User {
  id: number;
  firstName: string;
  lastName?: string;
  userName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
