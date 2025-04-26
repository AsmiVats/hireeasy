/* eslint-disable */
// @ts-nocheck
"use client";

import { useState, useEffect, use } from "react";
import { TriangleAlert } from "lucide-react";
import DatePicker from 'react-date-picker';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { TimePicker } from 'rsuite';
import "rsuite/dist/rsuite-no-reset.min.css";

// Update the form data interface
interface BookDemoFormData {
  contactName: string;
  email: string;
  phone: string;
  companyName: string;
  companySize: string;
  preferredDate: Date | undefined;
  preferredTime: string;
}
interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookDemoModal = ({ isOpen, onClose }: BookDemoModalProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<BookDemoFormData>({
    contactName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    preferredDate: undefined,
    preferredTime: "",
  });

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [errors, setErrors] = useState({
    contactName: "",
    email: "",
    phone: "",
    companyName: "",
    companySize: "",
    preferredDate: "",
    preferredTime: "",
  });

 

  const validateStep1 = () => {
    const newErrors = {
      contactName: "",
      email: "",
      phone: "",
      companyName: "",
      companySize: "",
      preferredDate: "",
      preferredTime: "",
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!formData.contactName.trim()) {
      newErrors.contactName = "Contact name is required";
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

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const validateStep2 = () => {
    const newErrors = { ...errors };

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.companySize.trim()) {
      newErrors.companySize = "Company size is required";
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = "Please select a date";
    }

    if (!formData.preferredTime) {
      newErrors.preferredTime = "Please select a time";
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, preferredDate: date }));
  };

  const handleTimeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Format time input as HH:MM
    value = value.replace(/\D/g, "").slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + ":" + value.slice(2);
    }
    setFormData((prev) => ({ ...prev, preferredTime: value }));
  };
  const BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  const handleBookDemo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      const response = await fetch(`${BASE_URL}/demo/bookDemo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setStep(3);
    } catch (error) {
      console.error("Booking failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendEmail = async () => {
    setIsLoading(true);
    const emailData = {
      to: formData.email,
      subject: "You have booked a demo with us.",
    };
    try {
      const response = await fetch(`${BASE_URL}/sendMailToClient`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });
      const data = response.json();
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Email failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // Replace the date and time inputs in step 2 form with dateTimeSection
  const renderSuccessModal = () => (
    <Dialog open={showSuccessModal} onOpenChange={() => {
      setShowSuccessModal(false);
      onClose();
    }}>
      <DialogContent className="w-[550px] rounded-sm p-8">
        <div className="space-y-6">
          <h2 className="text-[26px] font-bold text-[#293E40]">
            Demo Booked Successfully
          </h2>
          
          <p className="text-[15px] text-[#13B5CF]">
            Thank you for your interest in Hireeasy. One of our representative will contact you on your number.
          </p>
          
          <p className="text-[15px] text-[#293E40]">
            We have sent you an email with all the necessary details
          </p>
  
          <div className="space-y-4 rounded border border-[#EAECF0] p-[15px]">
            <p className="text-[15px] font-medium text-[#293E40]">
              Meeting time: {formData.preferredTime}, {formData.preferredDate
            ? format(formData.preferredDate, "dd / MM / yy")
            : "DD / MM / YY"}
            </p>
            <p className="text-[15px] text-[#293E40]">
              Email Address: {formData.email}
            </p>
            <p className="text-[15px] text-[#AEB4C1]">
              Name: {formData.contactName}
            </p>
            <p className="text-[15px] text-[#AEB4C1]">
              Contact no: {formData.phone}
            </p>
          </div>
  
          <div className="flex justify-end pt-4">
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onClose();
              }}
              className="globalbutton"
            >
              Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const datePickerSection = (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex w-full items-center justify-between rounded-sm border border-[#D0D5DD] px-4 py-1 text-left text-[15px]",
            !formData.preferredDate && "text-gray-400",
          )}
        >
          {formData.preferredDate
            ? format(formData.preferredDate, "dd / MM / yy")
            : "DD / MM / YY"}
          <CalendarIcon />
        </button>
        
      </PopoverTrigger>
      <PopoverContent className="w-[550px]" align="start">
        
        
      </PopoverContent>
    </Popover>
  );

  // Replace the date and time input section in step 2
  const dateTimeSection = (
    <div className="grid grid-cols-2 gap-4">
      <div>
      <label className="mb-2 block text-[15px] label_color">
        Preferred Date <span className="text-[#D92D20]">*</span>
      </label>
      <DatePicker
        value={formData.preferredDate}
        onChange={(value) => handleDateSelect(value as Date | undefined)}
        minDate={new Date()}
        format="dd/mm/yy"
        className="w-full"
        className="w-full rounded-sm border border-[#D0D5DD] input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
        clearIcon={null}
        dayPlaceholder="DD"
        monthPlaceholder="MM"
        yearPlaceholder="YY"
        style={{border:"1px solid transparent"}}
        calendarIcon={<CalendarIcon className="h-5 w-5 text-[#5a5a5a]" />}
        
      />
      {errors.preferredDate && (
        <p className="mt-1 flex items-center text-sm text-[#900B09]">
          <TriangleAlert className="mr-2 h-4 w-4" /> {errors.preferredDate}
        </p>
      )}
    </div>

    <div>
  <label className="mb-2 block text-[15px] label_color">
    Time <span className="text-[#D92D20]">*</span>
  </label>
  <div className="relative">
    <TimePicker
      format="HH:mm"
      value={formData.preferredTime ? new Date(`2000/01/01 ${formData.preferredTime}`) : null}
      style={{border:"1px solid transparent", padding:"6px 10px", borderRadius:"4px"}}
      onChange={(value) => {
        const timeString = value ? value.toTimeString().slice(0, 5) : "";
        setFormData((prev) => ({
          ...prev,
          preferredTime: timeString,
        }));
      }}
      
      ranges={[]}
      hideHours={hour => hour < 9 || hour > 18}
      className="custom-time-picker z-99999 w-full rounded-sm border border-[#D0D5DD] input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
    />
    {errors.preferredTime && (
      <p className="mt-1 flex items-center text-sm text-[#900B09]">
        <TriangleAlert className="mr-2 h-4 w-4" /> {errors.preferredTime}
      </p>
    )}
  </div>
</div>
    </div>
  );

  // Update the success screen date format
  const renderSuccessScreen = () => (
    <div className="space-y-6">
      <h2 className="mb-4 text-[26px] font-bold text-[#293E40]">
        Booking Details
      </h2>
      <p className="mb-[30px] text-[15px] text-[#13B5CF]">
        We will send you an email with all the necessary details.
      </p>

      <div className="space-y-4 rounded border border-[#EAECF0] p-[15px]">
        <p className="text-[15px] font-medium label_color">
          Meeting time: {formData.preferredTime},{" "}
          {format(formData.preferredDate!, "do MMMM yyyy")}
        </p>
        <p className="text-[15px] label_color">
          Email Address: {formData.email}
        </p>
        <p className="text-[15px] text-[#AEB4C1]">
          Name: {formData.contactName}
        </p>
        <p className="text-[15px] text-[#AEB4C1]">
          Contact no: {formData.phone}
        </p>
      </div>

      <div className="flex items-center justify-between pt-[60px]">
        <button
          type="button"
          onClick={handleBack}
          className="globalbackbutton text-[15px] "
        >
          Back
        </button>
        <button
          onClick={sendEmail}
          className="globalbutton"
        >
          Finish up
        </button>
      </div>
    </div>
  );

  // Replace the date input in step 2 form with datePickerSection
  // and update the time input with proper formatting

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[550px] rounded-sm p-8">
        <>
          {step === 3 ? (
            renderSuccessScreen()
          ) : (
            <div>
              <DialogTitle className="mb-8 text-[26px] font-medium text-[#293E40]">
                {step === 3 ? "Booking Details" : "Book a Demo"}
              </DialogTitle>

              {step === 1 ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[15px] label_color">
                      Contact Name <span className="text-[#900B09]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactName: e.target.value,
                        }))
                      }
                      className={`w-full rounded-sm border input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                        errors.contactName
                          ? "border-b-[#900B09]"
                          : "border-[#D0D5DD]"
                      }`}
                    />
                    {errors.contactName && (
                      <p className="mt-4 flex items-center text-sm text-[#900B09]">
                        <TriangleAlert className="mr-4 h-4 w-4" />{" "}
                        {errors.contactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[15px] label_color">
                      Email <span className="text-[#900B09]">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={`w-full rounded-sm border input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                        errors.email ? "border-b-[#900B09]" : "border-[#D0D5DD]"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-4 flex items-center text-sm text-[#900B09]">
                        <TriangleAlert className="mr-4 h-4 w-4" />{" "}
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[15px] label_color">
                      Phone <span className="text-[#900B09]">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={`w-full rounded-sm border input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] ${
                        errors.phone ? "border-b-[#900B09]" : "border-[#D0D5DD]"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-4 flex items-center text-sm text-[#900B09]">
                        <TriangleAlert className="mr-4 h-4 w-4" />{" "}
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-end pt-4">
                    <button
                      type="submit"
                      className="globalbutton"
                    >
                      Continue
                    </button>
                  </div>
                  <div className="flex items-start">
                    <button
                      type="button"
                      className="text-[14px] text-[#13B5CF]  hover:underline"
                    >
                      Need Help ?
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleBookDemo} className="space-y-6">
                  <div>
                    <label className="mb-2 block text-[15px] label_color">
                      Company name <span className="text-[#900B09]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          companyName: e.target.value,
                        }))
                      }
                      className="w-full rounded-sm border border-[#D0D5DD] input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                    />
                    {errors.companyName && (
                      <p className="mt-4 flex items-center text-sm text-[#900B09]">
                        <TriangleAlert className="mr-4 h-4 w-4" />{" "}
                        {errors.contactName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-[15px] label_color">
                      Company size <span className="text-[#900B09]">*</span>
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          companySize: e.target.value,
                        }))
                      }
                      className="w-full rounded-sm border border-[#D0D5DD] input_field focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF] px-3 py-2 appearance-none bg-white"
                    >
                      <option value="" disabled>Select company size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                    {errors.companySize && (
                      <p className="mt-4 flex items-center text-sm text-[#900B09]">
                        <TriangleAlert className="mr-4 h-4 w-4" />{" "}
                        {errors.companySize}
                      </p>
                    )}
                  </div>
                  {dateTimeSection}
                  

                  <div className="flex  justify-between align-top pt-[6px]">
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleBack}
                        className="globalbackbutton"
                      >
                        Back
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="globalbutton flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          Processing...
                        </>
                      ) : (
                        'Book Demo'
                      )}
                    </button>
                  </div>
                  <div className="flex items-start">
                    <button
                      type="button"
                      className="text-[14px] text-[#13B5CF]  hover:underline"
                    >
                      Need Help ?
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </>
      </DialogContent>
      {renderSuccessModal()}
    </Dialog>
  );
};
