export interface WebResponse<T> {
  code: number;
  status: string;
  data: T;
  errors?: T;
  actions?: ActionAccessRights;
  paging?: Paging;
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
