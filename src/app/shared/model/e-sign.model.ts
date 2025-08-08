export interface CreateESign {
  idNumber: string;
  role: string;
  name: string;
  eSign: ArrayBuffer | File | Blob;
  eSignFileName?: string;
  signatureType?: SignatureType;
  status?: boolean;
}

export interface UpdateESign {
  idNumber?: string;
  role?: string;
  name?: string;
  eSign?: File;
  eSignFileName?: string;
  signatureType?: SignatureType;
  status?: boolean;
}

export interface ESign {
  id: string;
  idNumber: string;
  role: string;
  name: string;
  eSign: File;
  eSignFileName: string;
  signatureType: SignatureType;
  status: boolean;
}

export interface ESignResponse {
  id: string;
  idNumber: string;
  role: string;
  name: string;
  eSign: File;
  eSignFileName: string;
  signatureType: SignatureType;
  status: boolean;
}

export enum SignatureType {
  SIGNATURE1 = 'SIGNATURE1',
  SIGNATURE2 = 'SIGNATURE2',
}
