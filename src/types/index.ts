export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
  user?: User;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}