export interface WebResponse<T> {
  code: number;
  status: string;
  data: T;
  errors?: T;
  actions?: ActionAccessRights;
  paging?: Paging;
  info?: string; // Pesan info tambahan dari backend (misal: threshold hybrid sort)
}

export interface ActionAccessRights {
  canEdit?: boolean;
  canDelete?: boolean;
  canView?: boolean;
  canPrint?: boolean;
}

export interface Paging  {
  totalPage: number;
  currentPage: number;
  size: number;
}
