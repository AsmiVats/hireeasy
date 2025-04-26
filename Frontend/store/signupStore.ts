import { create } from "zustand";

interface StepOneData {
  name: string;
  companyName: string;
  companySize: string;
  email: string;
  password: string;
  userType: string;
  isActive: boolean;
  logoUrl: string;
  contact: number;
  planId: number;
}

interface StepTwoData {
  phone: string;
  email: string;
  password: string;
}

interface SignupStore {
  stepOneData: StepOneData;
  stepTwoData: StepTwoData;
  setStepOneData: (data: Partial<StepOneData>) => void;
  setStepTwoData: (data: Partial<StepTwoData>) => void;
  resetForm: () => void;
}

const initialStepOneState: StepOneData = {
  name: "",
  companyName: "",
  companySize: "",
  email: "",
  password: "",
  userType: "",
  isActive: false,
  logoUrl: "",
  contact: 0,
  planId: 0,
};

const initialStepTwoState: StepTwoData = {
  phone: "",
  email: "",
  password: "",
};

export const useSignupStore = create<SignupStore>((set) => ({
  stepOneData: initialStepOneState,
  stepTwoData: initialStepTwoState,
  setStepOneData: (data) =>
    set((state) => ({
      stepOneData: {
        ...state.stepOneData,
        ...data,
      },
    })),
  setStepTwoData: (data) =>
    set((state) => ({
      stepTwoData: {
        ...state.stepTwoData,
        ...data,
      },
    })),
  resetForm: () =>
    set({
      stepOneData: initialStepOneState,
      stepTwoData: initialStepTwoState,
    }),
}));
