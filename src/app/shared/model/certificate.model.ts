export interface CreateCertificate {
  theoryScore: number;
  practiceScore: number;
  attendance: number;
}

export interface CertificateResponse {
  id: string;
  cotId: string;
  participantId: string;
  theoryScore: number;
  practiceScore: number;
  attendance: number;
  createdAt: string;
  updatedAt: string;
  participant?: {
    id: string;
    name: string;
    idNumber: string;
  };
}
