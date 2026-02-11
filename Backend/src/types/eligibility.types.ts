export interface EligibilityRequest {
  dateOfBirth: string;      // dd-mm-yyyy from frontend
  gender: string;
  maritalStatus: string;
  caste: string;            // casteCategory → backend me caste use kar rahe
  annualIncome: number;
  disability: string;
  education: string;        // educationLevel → backend me education
  employment: string;       // employmentStatus → backend me employment
  state: string;
}
