"use client";
import React, { useState } from 'react';
import { RadioGroup } from '@/components/ui/radio-group';

interface AddJobBasicsProps {
  onNext?: () => void;
  onBack?: () => void;
}

const AddJobBasics = ({ onNext, onBack }: AddJobBasicsProps) => {
  const [postType, setPostType] = useState('new');

  return (
    <div className="min-h-screen flex justify-center pt-[100px]">
      <div className="w-full max-w-[550px]">
        <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[25px]">Create a new job</h1>
        <h2 className="mb-[25px] text-[26px] text-center opacity-60 text-[#13B5CF]">Add job basics</h2>

        <div className="mb-8">
          <label className="mb-2 block text-sm font-medium label_color">
            How would you like to post your job? <span className="text-[#900B09]">**</span>
          </label>
          <RadioGroup
            defaultValue="new"
            onValueChange={(value) => setPostType(value)}
            className="space-y-4"
          >
            <div className="flex items-center">
              <input
                type="radio"
                value="template"
                checked={postType === 'template'}
                onChange={(e) => setPostType(e.target.value)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-[#13B5CF]"
              />
              <label className="text-sm label_color">
                Use a previous job as a template
              </label>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                value="new"
                checked={postType === 'new'}
                onChange={(e) => setPostType(e.target.value)}
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-[#13B5CF]"
              />
              <label className="text-sm label_color">
                Create a brand new post
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="mt-8 flex justify-between">
          <button
            onClick={onBack}
            className="rounded-sm bg-gray-600 px-6 py-2 text-white transition-colors hover:bg-gray-700"
          >
            Back
          </button>
          <button
            onClick={onNext}
            className="rounded-sm bg-[#13B5CF] px-6 py-2 text-white transition-colors hover:bg-[#009951]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export {AddJobBasics};