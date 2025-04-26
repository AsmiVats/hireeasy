'use client';
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { ExternalLink, Pencil } from 'lucide-react';

interface SecurityInfo {
  email: string;
  phone: string;
  recoveryEmail: string;
  twoStepVerification: boolean;
  isVerified: boolean;
}

export const SecuritySection = () => {
  const [securityInfo, setSecurityInfo] = useState<SecurityInfo>({
    email: "",
    phone: "",
    recoveryEmail: "",
    twoStepVerification: false,
    isVerified: true
  });
  const [isEditing, setIsEditing] = useState({
    email: false,
    phone: false,
    recoveryEmail: false
  });
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchProfileInfo = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );  
        if (!response.ok) {
          throw new Error("Failed to fetch profile information");
        }
        const responseData = await response.json();
        setSecurityInfo(responseData.data);
      } catch (error) {
        console.error("Error fetching profile information:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchProfileInfo();
  }, []);

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#5A5A5A]"></div>
      </div>
    );
  }

  const handleUpdate = async (field: string, value: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/updateUser/${localStorage.getItem('user')}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );

      if (!response.ok) throw new Error('Update failed');

      setSecurityInfo(prev => ({ ...prev, [field]: value }));
      setIsEditing(prev => ({ ...prev, [field]: false }));
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const EditableField = ({ field, value }: { field: string; value: string }) => (
    <div className="flex items-center gap-3">
      {isEditing[field] ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={value}
            onChange={(e) => setSecurityInfo(prev => ({ ...prev, [field]: e.target.value }))}
            className="border rounded px-2 py-1 text-[15px] text-[#1E1E1E]"
          />
          <button 
            onClick={() => handleUpdate(field, securityInfo[field])}
            disabled={loading}
            className="text-green-600 hover:text-green-700"
          >
            {loading ? '...' : '✓'}
          </button>
          <button 
            onClick={() => setIsEditing(prev => ({ ...prev, [field]: false }))}
            className="text-red-600 hover:text-red-700"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <span className="text-[15px] text-[#1E1E1E]">{value}</span>
          <button 
            className="text-[#5A5A5A]"
            onClick={() => setIsEditing(prev => ({ ...prev, [field]: true }))}
          >
            <Pencil className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className="space-y-8 font-medium">
      <div>
        <h2 className=" text-[#0F1137] mb-8 font-semibold">Access information</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Email Id</span>
            <div className="flex items-center gap-3">
              {isEditing.email ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={securityInfo.email}
                    onChange={(e) => setSecurityInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="border rounded px-2 py-1 text-[15px] text-[#1E1E1E]"
                  />
                  <button 
                    onClick={() => handleUpdate('email', securityInfo.email)}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700"
                  >
                    {loading ? '...' : '✓'}
                  </button>
                  <button 
                    onClick={() => setIsEditing(prev => ({ ...prev, email: false }))}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-[15px] text-[#1E1E1E]">{securityInfo.email}</span>
                  <button 
                    className="text-[#5A5A5A]"
                    onClick={() => setIsEditing(prev => ({ ...prev, email: true }))}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Phone number</span>
            <div className="flex items-center gap-3">
              {isEditing.phone ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={securityInfo.phone}
                    onChange={(e) => setSecurityInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="border rounded px-2 py-1 text-[15px] text-[#1E1E1E]"
                  />
                  <button 
                    onClick={() => handleUpdate('phone', securityInfo.phone)}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700"
                  >
                    {loading ? '...' : '✓'}
                  </button>
                  <button 
                    onClick={() => setIsEditing(prev => ({ ...prev, phone: false }))}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-[15px] text-[#1E1E1E]">{securityInfo.phone}</span>
                  <button 
                    className="text-[#5A5A5A]"
                    onClick={() => setIsEditing(prev => ({ ...prev, phone: true }))}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Recovery email Id</span>
            <div className="flex items-center gap-3">
              {isEditing.recoveryEmail ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={securityInfo.recoveryEmail}
                    onChange={(e) => setSecurityInfo(prev => ({ ...prev, recoveryEmail: e.target.value }))}
                    className="border rounded px-2 py-1 text-[15px] text-[#1E1E1E]"
                  />
                  <button 
                    onClick={() => handleUpdate('recoveryEmail', securityInfo.recoveryEmail)}
                    disabled={loading}
                    className="text-green-600 hover:text-green-700"
                  >
                    {loading ? '...' : '✓'}
                  </button>
                  <button 
                    onClick={() => setIsEditing(prev => ({ ...prev, recoveryEmail: false }))}
                    className="text-red-600 hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-[15px] text-[#1E1E1E]">{securityInfo.recoveryEmail}</span>
                  <button 
                    className="text-[#5A5A5A]"
                    onClick={() => setIsEditing(prev => ({ ...prev, recoveryEmail: true }))}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="  text-[#0F1137] mb-8 font-semibold">Security management</h2>
        
        <div className="space-y-6 w-48">
          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Two step verification</span>
            <Switch
              checked={securityInfo.twoStepVerification}
              onCheckedChange={(checked) => 
                setSecurityInfo(prev => ({ ...prev, twoStepVerification: checked }))
              }
            />
          </div>

          <div className="flex items-center justify-between w-[385px]">
            <span className="text-[15px] text-[#5A5A5A]">Verified</span>
            {securityInfo.isVerified ? (
              <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="text-[15px] text-[#900B09]">Not verified</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};