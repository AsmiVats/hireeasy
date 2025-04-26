'use client'
import { useState } from "react";
import { TriangleAlert, Plus, Trash2, Pencil } from 'lucide-react';
import { toast } from "react-hot-toast";

interface Language {
  name: string;
  proficiency: number;
  abilities: {
    read: boolean;
    write: boolean;
    speak: boolean;
  };
}

interface AddLanguageProps {
  onNext: () => void;
  onBack: () => void;
  data?: {
    languages?: Language[];
  };
  updateData?: (section: string, data: any) => void;
}

const AddLanguage = ({ onNext, onBack, data, updateData }: AddLanguageProps) => {
  const [languages, setLanguages] = useState<Language[]>(data?.languages || []);
  const [currentLanguage, setCurrentLanguage] = useState<Language>({ 
    name: '', 
    proficiency: 5,
    abilities: {
      read: false,
      write: false,
      speak: false
    }
  });
  const [error, setError] = useState('');
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const validateLanguage = () => {
    if (!currentLanguage.name.trim()) {
      setError('Language name is required');
      return false;
    }
    
    if (!currentLanguage.abilities.read && !currentLanguage.abilities.write && !currentLanguage.abilities.speak) {
      setError('Please select at least one language ability');
      return false;
    }
    
    setError('');
    return true;
  };

  const handleAddLanguage = () => {
    if (validateLanguage()) {
      if (editIndex !== null) {
        // Update existing language
        const updatedLanguages = [...languages];
        updatedLanguages[editIndex] = currentLanguage;
        setLanguages(updatedLanguages);
        setEditIndex(null);
      } else {
        // Add new language
        setLanguages([...languages, currentLanguage]);
      }
      
      // Reset current language
      setCurrentLanguage({ 
        name: '', 
        proficiency: 5,
        abilities: {
          read: false,
          write: false,
          speak: false
        }
      });
      
      if (updateData) {
        updateData('languages', [...languages, currentLanguage]);
      }
      
      toast.success(editIndex !== null ? 'Language updated successfully' : 'Language added successfully');
    }
  };

  const handleEditLanguage = (index: number) => {
    setCurrentLanguage(languages[index]);
    setEditIndex(index);
  };

  const handleDeleteLanguage = (index: number) => {
    const updatedLanguages = [...languages];
    updatedLanguages.splice(index, 1);
    setLanguages(updatedLanguages);
    
    if (updateData) {
      updateData('languages', updatedLanguages);
    }
    
    toast.success('Language deleted successfully');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (languages.length === 0 && !validateLanguage()) {
      toast.error('Please add at least one language');
      return;
    }
    
    if (currentLanguage.name.trim() && validateLanguage()) {
      handleAddLanguage();
    }
    
    if (updateData) {
      updateData('languages', languages);
    }
    
    onNext();
  };

  const toggleAbility = (ability: 'read' | 'write' | 'speak') => {
    setCurrentLanguage({
      ...currentLanguage,
      abilities: {
        ...currentLanguage.abilities,
        [ability]: !currentLanguage.abilities[ability]
      }
    });
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
          <h3 className="text-[18px] font-medium text-[#293E40]">Add Languages</h3>
        </div>

        {/* Display existing languages */}
        {languages.length > 0 && (
          <div className="mb-6 space-y-4">
            {languages.map((language, index) => (
              <div key={index} className="border border-gray-300 rounded-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{language.name}</h4>
                  <div className="flex space-x-2">
                    <button 
                      type="button" 
                      onClick={() => handleEditLanguage(index)}
                      className="text-gray-600 hover:text-[#13B5CF]"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteLanguage(index)}
                      className="text-gray-600 hover:text-[#900B09]"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 mb-2">
                  {language.abilities.read && (
                    <span className="text-sm text-gray-600">Read</span>
                  )}
                  {language.abilities.write && (
                    <span className="text-sm text-gray-600">Write</span>
                  )}
                  {language.abilities.speak && (
                    <span className="text-sm text-gray-600">Speak</span>
                  )}
                </div>
                <div className="relative pt-1">
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">1/10</div>
                    <div className="text-xs text-gray-500">10/10</div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ width: `${(language.proficiency / 10) * 100}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#13B5CF]"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add language form */}
        <div className="border border-gray-300 rounded-sm p-4 mb-6">
          <div className="mb-4">
            <label className="block text-sm text-[#293E40] mb-1">
              Language name <span className="text-[#900B09]">*</span>
            </label>
            <input
              type="text"
              value={currentLanguage.name}
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, name: e.target.value })}
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

          <div className="mb-4 flex gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentLanguage.abilities.read}
                onChange={() => toggleAbility('read')}
                className="h-4 w-4 text-[#13B5CF] focus:ring-[#13B5CF] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Read</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentLanguage.abilities.write}
                onChange={() => toggleAbility('write')}
                className="h-4 w-4 text-[#13B5CF] focus:ring-[#13B5CF] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Write</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentLanguage.abilities.speak}
                onChange={() => toggleAbility('speak')}
                className="h-4 w-4 text-[#13B5CF] focus:ring-[#13B5CF] border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Speak</span>
            </label>
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
              value={currentLanguage.proficiency}
              onChange={(e) => setCurrentLanguage({ ...currentLanguage, proficiency: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddLanguage}
              className="px-4 py-2 bg-[#13B5CF] text-white rounded-sm hover:bg-[#2a9d1a]"
            >
              Done
            </button>
          </div>
        </div>

        {/* Add another language button */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setCurrentLanguage({ 
              name: '', 
              proficiency: 5,
              abilities: {
                read: false,
                write: false,
                speak: false
              }
            })}
            className="flex items-center px-4 py-2 border border-[#13B5CF] text-[#13B5CF] rounded-sm hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another Language
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

export default AddLanguage;