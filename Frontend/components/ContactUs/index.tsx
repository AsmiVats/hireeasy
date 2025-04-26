"use client";
import React, { useState } from "react";
import { Bold, Italic, List } from "lucide-react";
import { TriangleAlert } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      message: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/job/contactUs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const center = {
    lat: 40.417262811308476, lng: -74.52901806891437
  };

  const mapContainerStyle = {
    width: "100%",
    height: "300px",
  };

  const SuccessScreen = () => (
    <div className="space-y-6">
      <h2 className="text-[26px] font-semibold text-[#293E40]">Contact us</h2>
      
      <p className="text-[15px] text-[#13B5CF]">
        Thank you for your Contacting us. One of our representative will contact you on your number.
      </p>
      
      <p className="text-[15px] text-[#293E40]">
        We will reply on your email with all the necessary details. on the below address.
      </p>
  
      <div className="space-y-4 rounded border border-[#EAECF0] p-[15px]">
        <p className="text-[15px] text-[#293E40]">
          Email Address: {formData.email}
        </p>
        <p className="text-[15px] text-[#AEB4C1]">
          Name: {formData.name}
        </p>
        <p className="text-[15px] text-[#AEB4C1]">
          Contact no: {formData.phone}
        </p>
      </div>
  
      <div className="flex justify-end">
        <button
          onClick={() => {
            setSubmitSuccess(false);
            setFormData({ name: "", email: "", phone: "", message: "" });
          }}
          className="rounded-sm bg-[#13B5CF] px-6 py-2 text-white hover:bg-opacity-90"
        >
          Done
        </button>
      </div>
    </div>
  );


  return (
    <div className="container mx-auto px-4 py-[20px]">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Location Section */}
        <div className="space-y-6 bg-white pb-[30px] pl-[40px] pr-[40px] pt-[30px]">
          <h2 className="text-[24px] font-semibold text-[#1E1E1E]">Location</h2>

          {/* World Map */}
          <div className="h-[300px] w-full overflow-hidden rounded-lg border border-[#E6E6E6] bg-white">
            <LoadScript
              googleMapsApiKey={
                "AIzaSyDNEDoqk0pGqsM0b2NVVBgWOX3SnkSENfE"
              }
            >
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>

          {/* Address Details */}
          <div className="space-y-4">
            <h3 className="text-[20px] font-semibold text-[#1E1E1E]">
              Address
            </h3>
            <div className="space-y-2 text-[#293E40]">
              <p className="flex items-center gap-2">
                <LocationIcon /> 1100 Cornwall rd suite 
              </p>
              <p className="flex items-center gap-2">
                <LocationIcon /> 205 Monmouth junction 
              </p>
              <p className="flex items-center gap-2">
                <LocationIcon /> New Jersey 08852
              </p>
              <p className="flex items-center gap-2">
                <PhoneIcon /> +1 (212) 555-0123
              </p>
              <p className="flex items-center gap-2">
                <EmailIcon /> support@Hireeasy.com
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="space-y-6 bg-white pb-[30px] pl-[40px] pr-[40px] pt-[30px]">
        {submitSuccess ? (
    <SuccessScreen />
  ) : (<>
  <h2 className="text-[24px] font-semibold text-[#1E1E1E]">
            Contact us
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[15px] text-[#1E1E1E]">
                Full name <span className="text-[#900B09]">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full rounded-sm border px-4 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                  errors.name ? "border-b-[#900B09]" : "border-[#D0D5DD]"
                }`}
              />
              {errors.name && (
                <p className="mt-4 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-4 h-4 w-4" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[15px] text-[#1E1E1E]">
                Email <span className="text-[#900B09]">*</span>
              </label>
              <input
                type="email"
                className={`w-full rounded-sm border px-4 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                  errors.email ? "border-b-[#900B09]" : "border-[#D0D5DD]"
                }`}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              {errors.email && (
                <p className="mt-4 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-4 h-4 w-4" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[15px] text-[#1E1E1E]">
                Phone <span className="text-[#900B09]">*</span>
              </label>
              <input
                type="tel"
                className="w-full rounded-sm border border-[#D0D5DD] px-4 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              {errors.phone && (
                <p className="mt-4 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-4 h-4 w-4" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-[15px] text-[#1E1E1E]">
                Message
              </label>
              <div className="overflow-hidden rounded-sm border border-[#D0D5DD]">
                <div className="flex items-center gap-2 border-b border-[#D0D5DD] bg-white px-3 py-2">
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-gray-100"
                  >
                    <Bold size={18} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-gray-100"
                  >
                    <Italic size={18} />
                  </button>
                  <button
                    type="button"
                    className="rounded p-1 hover:bg-gray-100"
                  >
                    <List size={18} />
                  </button>
                </div>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="min-h-[150px] w-full px-3 py-2 focus:outline-none"
                  placeholder="Type your message..."
                />
              </div>
              {errors.message && (
                <p className="mt-4 flex items-center text-sm text-[#900B09]">
                  <TriangleAlert className="mr-4 h-4 w-4" /> {errors.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
            <a href="#" className="text-sm text-[#13B5CF] hover:text-[#009951]">
            Need Help?
          </a>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-sm bg-[#13B5CF] px-6 py-2 text-[15px] text-white hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
            {submitSuccess && (
              <SuccessScreen />
            )}
          </form>
  </>)}
          
        </div>
      </div>
    </div>
  );
};

// Icon Components
const LocationIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path
      fillRule="evenodd"
      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
      clipRule="evenodd"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

export default ContactUs;
