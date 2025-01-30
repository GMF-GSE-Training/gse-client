import { Capability } from "./capability.model";

export interface CreateCot {
  capabilityId: string;
  startDate: string;
  endDate: string;
  trainingLocation: string;
  theoryInstructorRegGse: string;
  theoryInstructorCompetency: string;
  practicalInstructor1: string;
  practicalInstructor2: string;
  status?: boolean;
}

export interface UpdateCot {
  id: string;
  capabilityId?: string;
  startDate?: string;
  endDate?: string;
  trainingLocation?: string;
  theoryInstructorRegGse?: string;
  theoryInstructorCompetency?: string;
  practicalInstructor1?: string;
  practicalInstructor2?: string;
  status?: boolean;
}

export interface Cot {
  id: string;
  startDate: string;
  endDate: string;
  trainingLocation: string;
  theoryInstructorRegGse: string;
  theoryInstructorCompetency: string;
  practicalInstructor1: string;
  practicalInstructor2: string;
  status: boolean;
  capability: Capability;
}

export interface CotResponse {
  id: string;
  startDate: string;
  endDate: string;
  trainingLocation: string;
  theoryInstructorRegGse: string;
  theoryInstructorCompetency: string;
  practicalInstructor1: string;
  practicalInstructor2: string;
  numberOfParticipants?: number;
  status: boolean;
  capability: Capability;
}
