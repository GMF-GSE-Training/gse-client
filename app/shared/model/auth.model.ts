import { User } from "./user.model";

export interface LoginUserRequest {
  identifier: string;
  password: string;
}

export interface RegisterUserRequest {
  idNumber?: string;
  nik: string;
  email: string;
  name: string;
  password: string;
  dinas?: string;
}

export interface UpdatePassword {
  token?: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  id: string;
  idNumber?: string;
  email?: string;
  name?: string;
  dinas?: string;
  roleId?: string;
  token?: string;
  role?: {
      id?: string;
      name?: string;
  }
  participant?: Object;
}
