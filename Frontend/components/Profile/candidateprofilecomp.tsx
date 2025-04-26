// @ts-nocheck
"use client";
import { useState, useEffect, Suspense } from "react";
import { TriangleAlert } from "lucide-react";
import { toast } from "react-hot-toast";
import PersonalInfo from "./PersonalInfo";
import AddressSection from "./AddressSection";
import AddEmployment from "./AddEmployment";
import RolesAndResponsibilities from "./RolesAndResponsibilities";
import AddEducation from "./AddEducation";
import EducationList from "./EducationList";
import AddSkill from "./AddSkill";
import AddLanguage from "./AddLanguage";
import UploadResume from "./UploadResume";
import ProfileSuccess from "./ProfileSuccess";

interface CandidateProfileProps {
  candidate?: {
    name: string;
    title: string;
    experience: string;
    location: string;
    skills: string[];
    lastActive: string;
    email?: string;
    phone?: string;
  };
}


function CandidateProfileContent({
  candidate,
  currentStep,
  formData,
  handleNext,
  handleBack,
  updateData,
  goToAddEmployment,
  goToAddEducation,
}) {
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <PersonalInfo
            onNext={handleNext}
            data={{ ...formData, dob: formData.dateOfBirth }}
            updateData={updateData}
          />
        );
      case 1:
        return (
          <AddressSection
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
            updateData={updateData}
          />
        );
      case 2:
        return (
          <AddEmployment
            onNext={handleNext}
            onBack={handleBack}
            data={formData}
            updateData={updateData}
          />
        );
      case 3:
        return (
          <RolesAndResponsibilities
            onNext={handleNext}
            onBack={handleBack}
            data={{
              responsibilities: "",
              employmentHistory: [
                {
                  jobTitle: formData.jobTitle,
                  companyName: formData.companyName,
                  fromDate: formData.fromDate,
                  toDate: formData.toDate,
                  responsibilities: "",
                },
              ],
            }}
            updateData={updateData}
            goToAddEmployment={goToAddEmployment}
          />
        );
      case 4:
        return (
          <AddEducation
            onBack={handleBack}
            onNext={handleNext}
            data={formData}
            updateData={updateData}
          />
        );
      case 5:
        return (
          <EducationList
            onBack={handleBack}
            onNext={handleNext}
            data={formData}
            updateData={updateData}
            goToAddEducation={goToAddEducation}
          />
        );
      case 6:
        return (
          <AddSkill
            onBack={handleBack}
            onNext={handleNext}
            data={{ skills: [] }}
            updateData={updateData}
          />
        );
      case 7:
        return (
          <AddLanguage
            onBack={handleBack}
            onNext={handleNext}
            data={{ languages: [] }}
            updateData={updateData}
          />
        );
      case 8:
        return (
          <UploadResume
            onBack={handleBack}
            onNext={handleNext}
            data={{
              ...formData,
              // Add email from candidate prop if available
              resumeFile: null as File | null,
            }}
            updateData={updateData}
          />
        );

      case 9:
        return (
          <ProfileSuccess
            data={{
              name: formData.name || candidate?.name,
            }}
          />
        );
    }
  };

  return renderStep();
}


export const CandidateProfilecomp = ({
  candidate = {
    name: "John Doe",
    title: "Senior Software Engineer",
    experience: "5 years",
    location: "San Francisco, CA",
    skills: ["JavaScript", "React", "Node.js"],
    lastActive: "2 days ago",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
  },
}: CandidateProfileProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    experience: "10 years",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    jobTitle: "",
    companyName: "",
    fromDate: "",
    toDate: "",
    experienceInCompany: "1 year",
  });

  useEffect(() => {
    // Set initial form data from candidate prop
    debugger;
    const emailID = localStorage.getItem("email");
    let randomNumber = Math.floor(Math.random() * (10 - 1 + 1)) + 1;
    setFormData({
      name: "",
      email: emailID ? emailID + randomNumber : "",
      phone: "",
      dateOfBirth: "",
      experience: "10 years",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      jobTitle: "",
      companyName: "",
      fromDate: "",
      toDate: "",
      experienceInCompany: "1 year",
    });
  }, []);
  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const goToAddEmployment = () => {
    setCurrentStep(2);
  };

  const goToAddEducation = () => {
    setCurrentStep(4);
  };

  const updateData = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 

  return (
    <Suspense 
    fallback={
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    }
  >
    <CandidateProfileContent
      candidate={candidate}
      currentStep={currentStep}
      formData={formData}
      handleNext={handleNext}
      handleBack={handleBack}
      updateData={updateData}
      goToAddEmployment={goToAddEmployment}
      goToAddEducation={goToAddEducation}
    />
  </Suspense>
  );
};
