'use client'
import { useState } from "react";
import { TriangleAlert, Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from "react-hot-toast";

interface Skill {
  name: string;
  proficiency: number;
}

interface AddSkillProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    skills?: Skill[];
  };
  updateData?: (section: string, data: any) => void;
}

const AddSkill = ({ onNext, onBack, data, updateData }: AddSkillProps) => {
  const [skills, setSkills] = useState<Skill[]>(data?.skills || []);
  const [currentSkill, setCurrentSkill] = useState<Skill>({ name: '', proficiency: 5 });
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  // Add state to store skill IDs from API response
  const [skillIds, setSkillIds] = useState<{[key: string]: string}>({});

  const validateSkill = () => {
    if (!currentSkill.name.trim()) {
      setError('Skill name is required');
      return false;
    }
    setError('');
    return true;
  };

  const handleAddSkill = async () => {
    if (validateSkill()) {
      let updatedSkills;
      
      if (editIndex !== null) {
        // Update existing skill
        updatedSkills = [...skills];
        updatedSkills[editIndex] = currentSkill;
        setSkills(updatedSkills);
        setEditIndex(null);
      } else {
        // Add new skill
        updatedSkills = [...skills, currentSkill];
        setSkills(updatedSkills);
      }
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login to add skills');
          return;
        }
        
        // Prepare the API payload
        const apiPayload = {
          data: [
            {
              candidateProfile: localStorage.getItem('candidateid') || '',
              name: currentSkill.name,
              rating: currentSkill.proficiency
            }
          ]
        };
        
        // Call the API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobSeeker/addSkills`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(apiPayload)
        });
        
        if (!response.ok) {
          throw new Error('Failed to add skill');
        }
        
        const result = await response.json();
        console.log('Skill added successfully:', result);
        
        // Store the skill ID from the response
        if (result && result.length > 0) {
          const newSkillIds = { ...skillIds };
          result.forEach((skill: any) => {
            newSkillIds[skill.name] = skill._id;
          });
          setSkillIds(newSkillIds);
        }
        
        // Reset current skill
        setCurrentSkill({ name: '', proficiency: 5 });
        
        if (updateData) {
          updateData('skills', updatedSkills);
        }
        
        toast.success(editIndex !== null ? 'Skill updated successfully' : 'Skill added successfully');
      } catch (error) {
        console.error('Error adding skill:', error);
        toast.error('Failed to add skill. Please try again.');
      }
    }
  };

  const handleEditSkill = (index: number) => {
    setCurrentSkill(skills[index]);
    setEditIndex(index);
  };

  const handleDeleteSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    setSkills(updatedSkills);
    
    if (updateData) {
      updateData('skills', updatedSkills);
    }
    
    toast.success('Skill deleted successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skills.length === 0 && !validateSkill()) {
      toast.error('Please add at least one skill');
      return;
    }
    
    if (currentSkill.name.trim() && validateSkill()) {
      handleAddSkill();
    }
    
    if (updateData) {
      updateData('skills', skills);
    }
    
    onNext();
  };

  const handleTakeAssessment = (skillName: string) => {
    if (skillIds[skillName]) {
      window.location.href = `/questionnaire?skillName=${skillName}`;
    } else {
      toast.error('Assessment not available for this skill');
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
          <h3 className="text-[18px] font-medium text-[#293E40]">Add Skills</h3>
        </div>

        {/* Display existing skills */}
        {skills.length > 0 && (
          <div className="mb-6 space-y-4">
            {skills.map((skill, index) => (
              <div key={index} className="border border-gray-300 rounded-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{skill.name}</h4>
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      onClick={() => handleEditSkill(index)}
                      className="text-gray-600 hover:text-[#13B5CF]"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteSkill(index)}
                      className="text-gray-600 hover:text-[#900B09]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">1/10</div>
                    <div className="text-xs text-gray-500">10/10</div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${(skill.proficiency / 10) * 100}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#13B5CF]"
                    ></div>
                  </div>
                </div>
                {skillIds[skill.name] && (
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleTakeAssessment(skill.name)}
                      className="px-3 py-1 bg-[#293E40] text-white rounded-sm text-sm hover:bg-[#1a2b2d]"
                    >
                      Take Assessment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add skill form */}
        <div className="border border-gray-300 rounded-sm p-4 mb-6">
          <div className="mb-4">
            <label className="block text-sm text-[#293E40] mb-1">
              Skill name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={currentSkill.name}
              onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent ${
                error ? 'border-[#900B09]' : 'border-gray-300'
              }`}
            />
            {error && (
              <p className="mt-1 text-sm text-[#900B09] flex items-center">
                <TriangleAlert className="h-4 w-4 mr-2" />
                {error}
              </p>
            )}
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">1/10</div>
              <div className="text-xs text-gray-500">10/10</div>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentSkill.proficiency}
              onChange={(e) => setCurrentSkill({ ...currentSkill, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-[#13B5CF] text-white rounded-sm hover:bg-[#2a9d1a]"
            >
              {editIndex !== null ? 'Update' : 'Done'}
            </button>
          </div>
        </div>

        {/* Add another skill button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setCurrentSkill({ name: '', proficiency: 5 })}
            className="flex items-center px-4 py-2 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another Skill
          </button>
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
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddSkill;