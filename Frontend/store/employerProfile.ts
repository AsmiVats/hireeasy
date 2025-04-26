import { create } from 'zustand';

interface EmployerProfileData {
  companyName: string;
  phone:string;
  name: string;
  employerId: string;
  title: string;
  jobType: string;
  email: string;
  jobLocationType: string;
  alternativeEmail1: string;
  alternativeEmail2: string;
  experience: number;
  companyLogo: string;
  payRange: {
    min: number;
    max: number;
  };
  noOfPeople: number;
  location: {
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  benefits: string[];
  description: string;
  status: string;
}

interface EmployerProfileStore {
  formData: EmployerProfileData;
  updateFormData: (data: Partial<EmployerProfileData>) => void;
  resetForm: () => void;
}

const initialState: EmployerProfileData = {
  companyName: "",
  phone:"",
  name: "",
  employerId: '',
  title: "",
  jobType: "",
  email: "",
  jobLocationType: "",
  alternativeEmail1: "",
  alternativeEmail2: "",
  experience: 0,
  companyLogo: "",
  payRange: {
    min: 0,
    max: 0
  },
  noOfPeople: 0,
  location: {
    city: "",
    state: "NY",
    postalCode: "000000",
    country: "india"
  },
  benefits: [],
  description: "",
  status: ""
};

export const useEmployerProfileStore = create<EmployerProfileStore>((set) => ({
  formData: initialState,
  updateFormData: (data) => set((state) => ({
    formData: { ...state.formData, ...data }
  })),
  resetForm: () => set({ formData: initialState })
}));