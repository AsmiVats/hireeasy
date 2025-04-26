// @ts-nocheck
'use client'
import { useState } from "react";
import { TriangleAlert, Upload } from 'lucide-react';
import { toast } from "react-hot-toast";

interface UploadResumeProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    payScale?: string;
    payType?: string;
    noticePeriod?: string;
    profileHeadline?: string;
    linkedinLink?: string;
    videoLink?: string;
    resumeFile?: File | null;
  };
  updateData?: (section: string, data: any) => void;
}

const UploadResume = ({ onNext, onBack, data, updateData }: UploadResumeProps) => {
  const [formData, setFormData] = useState({
    payScale: data?.payScale || "$10K",
    payType: data?.payType || "Monthly",
    noticePeriod: data?.noticePeriod || "30 days",
    profileHeadline: data?.profileHeadline || "",
    linkedinLink: data?.linkedinLink || "",
    videoLink: data?.videoLink || "",
    resumeFile: data?.resumeFile || null,
    resumeFileName: ""
  });

  const [errors, setErrors] = useState({
    payScale: "",
    payType: "",
    noticePeriod: "",
    profileHeadline: "",
    resumeFile: ""
  });

  const validateForm = () => {
    const newErrors = {
      payScale: "",
      payType: "",
      noticePeriod: "",
      profileHeadline: "",
      resumeFile: ""
    };

    // Profile headline validation
    if (!formData.profileHeadline.trim()) {
      newErrors.profileHeadline = "Profile headline is required";
    }

    // Resume file validation
    if (!formData.resumeFile) {
      newErrors.resumeFile = "Resume is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        if (updateData) {
          updateData('payScale', formData.payScale);
          updateData('payType', formData.payType);
          updateData('noticePeriod', formData.noticePeriod);
          updateData('profileHeadline', formData.profileHeadline);
          updateData('linkedinLink', formData.linkedinLink);
          updateData('videoLink', formData.videoLink);
          updateData('resumeFile', formData.resumeFile);
        }
        
        // Upload resume file to get URL
        let resumeLink = "";
        if (formData.resumeFile) {
          // Create form data for file upload
          const fileFormData = new FormData();
          fileFormData.append('file', formData.resumeFile);
          
          // Upload the file
          const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploadFile`, {
            method: 'POST',
            body: fileFormData,
          });
          
          if (!uploadResponse.ok) {
            throw new Error('Failed to upload resume');
          }
          
          const uploadResult = await uploadResponse.json();
          resumeLink = uploadResult.fileUrl;
        
        // Make API call to create job seeker profile
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobSeeker/createJobSeekerProfile`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phone || "",
            yearsOfExperience: parseInt(data?.experience?.split(' ')[0] || "0"),
            dob: data?.dateOfBirth || "",
            address: data?.address || "",
            city: data?.city || "",
            state: data?.state || "",
            zipcode: data?.zipcode || "",
            country: data?.country || "",
            payScale: parseInt(formData.payScale.replace(/\D/g, '')),
            payType: formData.payType.toLowerCase(),
            resumeLink: resumeLink,
            linkedinProfile: formData.linkedinLink,
            profileHeadline: formData.profileHeadline,
            // Add password - in a real app, this should be handled securely
            password: "123456" // This is just for demo purposes
          })
        });
      }
        if (!response.ok) {
          throw new Error('Failed to create profile');
        }
        
        const result = await response.json();
        toast.success('Profile created successfully!');
        onNext();
      } catch (error) {
        console.error('Error creating profile:', error);
        toast.error('Failed to create profile');
      }
    } else {
      toast.error("Please fill all required fields correctly");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        resumeFile: file,
        resumeFileName: file.name
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center pt-[60px] pb-[90px]">
      <div className="w-full max-w-[550px]">
        <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[25px]">
          Build your job seeker profile
        </h1>
        
        <h2 className="mb-[45px] text-[26px] text-center text-[#13B5CF]">
          You haven't created your profile yet. To find the best jobs create your profile.
        </h2>

        <div className="mb-[30px]">
          <h3 className="text-[18px] font-medium text-[#293E40]">Upload your Resume</h3>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Pay scale <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.payScale}
                  onChange={(e) => setFormData({ ...formData, payScale: e.target.value })}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent appearance-none border-gray-300"
                >
                  <option value="$10K">$10K</option>
                  <option value="$20K">$20K</option>
                  <option value="$30K">$30K</option>
                  <option value="$40K">$40K</option>
                  <option value="$50K">$50K</option>
                  <option value="$60K">$60K</option>
                  <option value="$70K">$70K</option>
                  <option value="$80K">$80K</option>
                  <option value="$90K">$90K</option>
                  <option value="$100K">$100K</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-[#293E40] mb-1">
                Pay type <span className="text-[#900B09]">*</span>
              </label>
              <div className="relative">
                <select
                  value={formData.payType}
                  onChange={(e) => setFormData({ ...formData, payType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent appearance-none border-gray-300"
                >
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                  <option value="Hourly">Hourly</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Notice period <span className="text-[#900B09]">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.noticePeriod}
                onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent appearance-none border-gray-300"
              >
                <option value="30 days">30 days</option>
                <option value="60 days">60 days</option>
                <option value="90 days">90 days</option>
                <option value="Immediate">Immediate</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Profile Headline <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.profileHeadline}
              onChange={(e) => setFormData({ ...formData, profileHeadline: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.profileHeadline ? 'border-[#900B09]' : 'border-gray-300'
              }`}
              placeholder="e.g. Senior Software Engineer with 5+ years of experience"
            />
            {errors.profileHeadline && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.profileHeadline}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              LinkedIn profile link
            </label>
            <input
              type="text"
              value={formData.linkedinLink}
              onChange={(e) => setFormData({ ...formData, linkedinLink: e.target.value })}
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent border-gray-300"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Video introduction link
            </label>
            <input
              type="text"
              value={formData.videoLink}
              onChange={(e) => setFormData({ ...formData, videoLink: e.target.value })}
              className="w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent border-gray-300"
              placeholder="https://youtube.com/watch?v=yourvideoID"
            />
          </div>

          <div>
            <label className="block text-sm text-[#293E40] mb-1">
              Upload your resume <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={formData.resumeFileName}
              readOnly
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                errors.resumeFile ? 'border-[#900B09]' : 'border-gray-300'
              }`}
              placeholder="No file selected"
            />
            <p className="mt-1 text-xs text-gray-500">
              .doc, .pdf, .rtf files supported.
            </p>
            {errors.resumeFile && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {errors.resumeFile}
              </p>
            )}
            <div className="mt-2">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center px-4 py-2 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-gray-50 w-fit">
                  <Upload className="h-4 w-4 mr-2" />
                  Browse...
                </div>
                <input
                  id="file-upload"
                  type="file"
                  accept=".doc,.docx,.pdf,.rtf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-between mt-20">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 mt-10 rounded-sm transition-colors bg-[#6B7280] text-white hover:bg-[#4B5563]"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 mt-10 rounded-sm transition-colors bg-[#13B5CF] text-white hover:bg-[#009951]"
            >
              Finish up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadResume;