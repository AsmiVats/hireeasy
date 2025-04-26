"use client";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import filterImage from "../../asset/filter.png";
import * as Slider from "@radix-ui/react-slider";
interface SearchFilterProps {
  criteria: {
    skills: string[];
    postedWithin: string;
    maxPay: number;
    minPay: number;
    title: string;
    postalCode: string;
    jobType: string;
    jobLocationType: string;
    experience: number;
    maxExperience: number;
    minExperience: number;
    city: string;
    state: string;
    country: string;
  };
  onFilterChange: (newCriteria: Partial<SearchFilterProps["criteria"]>) => void;
}

const SearchFilter = ({ criteria, onFilterChange }: SearchFilterProps) => {
  const [expRange, setExpRange] = useState([
    criteria.minExperience || 1,
    criteria.maxExperience || 10,
  ]);

  const [payRange, setPayRange] = useState([
    criteria.minPay || 100,
    criteria.maxPay || 500,
  ]);

  const handleActivityChange = (period: string) => {
    const newValue = period === criteria.postedWithin ? "" : period;
    onFilterChange({ postedWithin: newValue });
  };

  const handleExperienceChange = (values: number[]) => {
    setExpRange(values);
    onFilterChange({
      minExperience: values[0],
      maxExperience: values[1],
      experience: values[0], // keeping for backward compatibility
    });
  };

  const handlePayScaleChange = (values: number[]) => {
    setPayRange(values);
    onFilterChange({
      minPay: values[0],
      maxPay: values[1],
    });
  };

  const handleSkillChange = (skill: string, checked: boolean) => {
    const updatedSkills = checked
      ? [...(criteria.skills || []), skill]
      : (criteria.skills || []).filter((s) => s !== skill);
    onFilterChange({ skills: updatedSkills });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ postalCode: e.target.value });
  };

  return (
    <div className="w-full max-w-[280px] rounded-sm border border-gray-100 bg-white py-[15px] pl-[30px] pr-[15px]">
      <div className="mb-6 flex items-center gap-2">
        <img src={filterImage.src} alt="Filter" className="h-6 w-6" />
        <h2 className="text-[15px] font-medium text-[#293E40] ">
          Filter your search
        </h2>
      </div>

      <div className="space-y-6">
        {/* Activity Section */}
        <div>
          <h3 className="pb-[20px] text-[14px] font-medium text-[#293E40]">
            Job Posted
          </h3>
          <div className="space-y-2 pl-[10px]">
            {[
              { label: "In last 24 hours", value: "1day" },
              { label: "In last week", value: "7days" },
              { label: "In last 15 days", value: "15days" },
              { label: "In last 30 days", value: "30days" },
            ].map(({ label, value }) => (
              <label
                key={value}
                className="flex items-center gap-2 pb-[20px] text-sm text-[#293E40]"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#009951] checked:border-[#009951] checked:bg-[#009951] hover:border-[#009951] focus:ring-[#009951] focus:ring-offset-0"
                  checked={criteria.postedWithin === value}
                  onChange={(e) =>
                    handleActivityChange(e.target.checked ? value : "")
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        {/* Years of Experience Section */}
        <div>
          <h3 className="pb-[20px] text-[14px] font-medium text-[#293E40]">
            Years of Experience
          </h3>
          <div className="space-y-4 pl-[10px]">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Min {expRange[0]} Yr</span>
              <span>Max {expRange[1]} Yrs</span>
            </div>
            <Slider.Root
              className="relative flex h-5 w-full touch-none select-none items-center"
              value={expRange}
              max={10}
              min={1}
              step={1}
              onValueChange={handleExperienceChange}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-gray-200">
                <Slider.Range className="absolute h-full rounded-full bg-[#5A5A5A]" />
              </Slider.Track>
              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#5A5A5A] focus:outline-none focus:ring-2 focus:ring-[#009951] focus:ring-offset-2"
                aria-label="Min experience"
              />
              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#5A5A5A] focus:outline-none focus:ring-2 focus:ring-[#009951] focus:ring-offset-2"
                aria-label="Max experience"
              />
            </Slider.Root>
          </div>
        </div>

        {/* Pay Scale Section */}
        <div>
          <h3 className="pb-[20px] text-[14px] font-medium text-[#293E40]">
            Pay scale
          </h3>
          <div className="space-y-4 pl-[10px]">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Min ${payRange[0]}k</span>
              <span>Max ${payRange[1]}k</span>
            </div>
            <Slider.Root
              className="relative flex h-5 w-full touch-none select-none items-center"
              value={payRange}
              max={500}
              min={100}
              step={10}
              onValueChange={handlePayScaleChange}
            >
              <Slider.Track className="relative h-1 w-full grow rounded-full bg-gray-200">
                <Slider.Range className="absolute h-full rounded-full bg-[#5A5A5A]" />
              </Slider.Track>
              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#5A5A5A] focus:outline-none focus:ring-2 focus:ring-[#009951] focus:ring-offset-2"
                aria-label="Min salary"
              />
              <Slider.Thumb
                className="block h-4 w-4 rounded-full bg-[#5A5A5A] focus:outline-none focus:ring-2 focus:ring-[#009951] focus:ring-offset-2"
                aria-label="Max salary"
              />
            </Slider.Root>
          </div>
        </div>

        {/* Skills Section */}
        <div>
          <h3 className="pb-[20px] text-[14px] font-medium text-[#293E40]">
            Skills
          </h3>
          <div className="space-y-2 pl-[10px]">
            {["ITSM", "ITBM", "CSM", "Software Asset"].map((skill) => (
              <label
                key={skill}
                className="flex items-center gap-2 pb-[20px] text-sm text-[#293E40]"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-[#009951] checked:border-[#009951] checked:bg-[#009951] hover:border-[#009951] focus:ring-[#009951] focus:ring-offset-0"
                  checked={criteria.skills.includes(skill)}
                  onChange={(e) => handleSkillChange(skill, e.target.checked)}
                />
                {skill}
              </label>
            ))}
          </div>
        </div>

        {/* Location Section */}
        <div>
          <h3 className="pb-[20px] text-[14px] font-medium text-[#293E40]">
            Location - Zip code
          </h3>
          <div className="relative">
            <input
              type="text"
              value={criteria.postalCode || ""}
              onChange={handleLocationChange}
              onBlur={handleLocationChange} // Add this to trigger on focus loss
              className="w-full rounded-sm border border-gray-200 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
            />
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
