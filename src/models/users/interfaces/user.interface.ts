export interface UserInterface {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
