'use client';
import React, { useState } from "react";
import { Bold, Italic, List, TriangleAlert } from "lucide-react";
import { useEmployerProfileStore } from '@/store/employerProfile';
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import mammoth from 'mammoth';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";

interface StepThreeProps {
  onNext?: () => void;
  onBack?: () => void;
  currentStep?: number;
  totalSteps?: number;
}

const StepThree = ({ onNext, onBack, currentStep, totalSteps }: StepThreeProps) => {
  const { formData: storeData, updateFormData } = useEmployerProfileStore();
  const [description, setDescription] = useState(storeData.description || "");
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({
    description: ''
  });

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  
    if (selectedFile) {
      try {
        const reader = new FileReader();
        const fileType = selectedFile.name.split('.').pop().toLowerCase();
  
        if (fileType === 'docx') {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const result = await mammoth.extractRawText({ arrayBuffer });
          setDescription(result.value.trim());
        } else if (fileType === 'txt') {
          reader.onload = (event) => {
            const text = event.target?.result || '';
            setDescription(text.toString().trim());
          };
          reader.readAsText(selectedFile);
        } else {
          alert('Currently supporting .docx and .txt files only');
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        alert('Error reading file. Please try again with a different file.');
      }
    }
  };

  const validateForm = () => {
    const newErrors = {
      description: ''
    };

    if (!description.trim()) {
      newErrors.description = 'Job description is required';
    } else if (description.trim().length < 50) {
      newErrors.description = 'Job description should be at least 50 characters long';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    updateFormData({
      description: description
    });
    if (onNext) onNext();
  };

  const handleFormatClick = (format:string)=> {
    // Implement logic for formatting the description
    console.log(format)
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc pl-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal pl-4',
          },
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Enter job description...',
        showOnlyWhenEditable: true,
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none min-h-[200px] p-4",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setDescription(html);
    },
  });
  return (
    <div className="min-h-screen flex justify-center pt-10 sm:pt-[100px] px-2 sm:px-0">
      <div className="w-full max-w-[95vw] sm:max-w-[550px]">
        <h1 className="text-2xl sm:text-[36px] font-bold text-center text-[#293E40] mb-6 sm:mb-[25px]">
          Create a new job
        </h1>

        <h2 className="mb-6 sm:mb-[25px] text-lg sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
          Add job Description
        </h2>
        <ProgressBar currentStep={currentStep || 0} totalSteps={totalSteps || 0} />
        <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-1 block text-sm label_color">
            Job description <span className="text-[#900B09]">*</span>
          </label>

          <div className={`overflow-hidden rounded-sm border ${
            errors.description ? 'border-b-[#900B09]' : 'border-gray-300'
          }`}>
            <div className="flex items-center gap-2 border-b border-gray-300 bg-white px-3 py-2">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`rounded p-1 ${
                  editor?.isActive("bold") ? "bg-gray-200" : ""
                }`}
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`rounded p-1 ${
                  editor?.isActive("italic") ? "bg-gray-200" : ""
                }`}
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`rounded p-1 ${
                  editor?.isActive("underline") ? "bg-gray-200" : ""
                }`}
              >
                <u>U</u>
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`rounded p-1 ${
                  editor?.isActive("bulletList") ? "bg-gray-200" : ""
                }`}
              >
                •
              </button>
            </div>
            <EditorContent editor={editor} className="bg-white" />
          </div>
            {errors.description && (
            <p className="mt-4 text-sm text-[#900B09] flex items-center">
              <TriangleAlert className="mr-4 h-4 w-4" /> {errors.description}
            </p>
          )}
          </div>

          {/* File Upload */}
          <div>
            <label className="inline-flex cursor-pointer items-center rounded-sm border border-[#13B5CF] px-4 py-2 text-[#13B5CF] hover:bg-blue-50">
              <span className="mr-2">Upload from a file...</span>
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".docx,.txt"
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-8 flex flex-row  sm:flex-row justify-between gap-4">
            <button 
              className="w-full sm:w-auto px-4 py-2 text-sm mt-4 sm:mt-0 rounded-sm transition-colors bg-[#293E40] text-white #009951"
              onClick={onBack}
            >
              Back
            </button>
            <button
                type="submit"
                onClick={handleSubmit}
                className="w-full sm:w-auto px-4 py-2 text-sm mt-4 sm:mt-0 rounded-sm transition-colors bg-[#13B5CF] text-white #009951"
              >
                Continue
              </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export  { StepThree };
