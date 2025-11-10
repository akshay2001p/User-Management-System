export interface User {
  id?: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
  status: 'Awaiting Approval' | 'Active';
  isFirstLogin?: boolean;
}