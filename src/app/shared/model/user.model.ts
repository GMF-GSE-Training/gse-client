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
  // Action properties untuk tabel
  editLink?: string;
  deleteMethod?: () => void;
  detailLink?: string;
  printLink?: string;
  roleName?: string; // untuk display di tabel
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
