export interface CreateCertificate {
  theoryScore: number;
  practiceScore: number;
  certificateNumber: string;
}

export interface Certificate {
  id: string;
  capabilityName: string;
  expDate: string;
  detailLink: string;
}