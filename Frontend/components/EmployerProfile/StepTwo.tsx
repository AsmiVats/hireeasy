"use client";
import React, { useState } from 'react';

interface Benefit {
  id: string;
  name: string;
  selected: boolean;
}

function StepTwo() {
  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: '1', name: 'Health Insurance', selected: true },
    { id: '2', name: 'Paid time off', selected: false },
    { id: '3', name: 'Dental insurance', selected: false },
    { id: '4', name: '401(k)', selected: false },
    { id: '5', name: 'Vision insurance', selected: false },
    { id: '6', name: 'Flexible schedule', selected: false },
    { id: '7', name: 'Tuition reimbursement', selected: false },
    { id: '8', name: 'Life insurance', selected: false },
  ]);

  const toggleBenefit = (id: string) => {
    setBenefits(benefits.map(benefit => 
      benefit.id === id 
        ? { ...benefit, selected: !benefit.selected }
        : benefit
    ));
  };

  return (
    <div className="min-h-screen flex justify-center pt-10 sm:pt-[100px] px-2 sm:px-0">
      <div className="w-full max-w-[95vw] sm:max-w-[550px]">
        <h1 className="text-2xl sm:text-[36px] font-bold text-center text-[#293E40] mb-6 sm:mb-[25px]">
          Create a new job
        </h1>
        <h2 className="mb-6 sm:mb-[25px] text-lg sm:text-[26px] text-center opacity-60 text-[#13B5CF]">
          Add job details - page 2
        </h2>
        
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="block mb-2">
              Job type <span className="text-[#900B09]">*</span>
            </label>
            <input type="text" className="w-full p-2 border rounded-sm" />
          </div>

          <div>
            <label className="block mb-2">
              Experience (in years) <span className="text-[#900B09]">*</span>
            </label>
            <select className="w-full p-2 border rounded-sm">
              <option>10 years</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2">
                Min. Range <span className="text-[#900B09]">*</span>
              </label>
              <select className="w-full p-2 border rounded-sm">
                <option>$10K</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">
                Max Range <span className="text-[#900B09]">*</span>
              </label>
              <select className="w-full p-2 border rounded-sm">
                <option>$50K</option>
              </select>
            </div>
            <div>
              <label className="block mb-2">
                Pay type <span className="text-[#900B09]">*</span>
              </label>
              <select className="w-full p-2 border rounded-sm">
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-2">
              Benefits <span className="text-[#900B09]">*</span>
            </label>
            <select className="w-full p-2 border rounded-sm mb-4">
              <option>Select from the list</option>
            </select>
            
            <div className="flex flex-wrap gap-2">
              {benefits.map(benefit => (
                <button
                  key={benefit.id}
                  type="button"
                  onClick={() => toggleBenefit(benefit.id)}
                  className="px-4 py-2 border rounded-full flex items-center gap-2 text-sm sm:text-base"
                >
                  {benefit.name}
                  <span className="text-gray-400">
                    {benefit.selected ? '−' : '+'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
            <button type="button" className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-sm">
              Back
            </button>
            <button type="button" className="w-full sm:w-auto px-6 py-2 bg-[#13B5CF] text-white rounded-sm">
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export { StepTwo };