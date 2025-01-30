export interface CreateUserRequest {
  participantId: string;
  idNumber?: string;
  nik?: string;
  email: string;
  name: string;
  password: string;
  dinas?: string;
  roleId: string;
}

export interface UpdateUserRequest {
  idNumber?: string;
  nik?: string;
  email?: string;
  name?: string;
  password?: string;
  dinas?: string;
  roleId?: string;
}

export interface User {
  id: string;
  participantId?: string;
  idNumber?: string;
  nik?: string;
  email: string;
  name: string;
  dinas?: string;
  roleId: string;
  role: {
    id: string,
    name: string,
  },
}

export interface UserResponse {
  id: string;
  participantId?: string;
  idNumber?: string;
  nik: string;
  email: string;
  name: string;
  dinas?: string;
  roleId: string;
  role: {
    id: string,
    name: string,
  },
}
