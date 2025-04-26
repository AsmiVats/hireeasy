import { useState, useEffect } from "react";
import { ExternalLink, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";

interface ProfileInfo {
  name: string;
  companyName: string;
  location: string;
  companyDescription: string;
  isAccountDisabled: boolean;
}

export const ProfileSection = () => {
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    name: "",
    companyName: "",
    location: "",
    companyDescription: ``,
    isAccountDisabled: false,
  });
  const [isFetching, setIsFetching] = useState(true);
  const [editMode, setEditMode] = useState({
    name: false,
    companyName: false,
    location: false,
    companyDescription: false
  });
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  
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
        setProfileInfo(responseData.data);
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#13B5CF]"></div>
      </div>
    );
  }

  const handleDeleteAccount = async () => {

    const user = localStorage.getItem("user");
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone.",
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/deleteUser?userId=${user}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      localStorage.clear();
      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateProfile = async (field: string, value: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/updateUser/${localStorage.getItem('user')}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ [field]: value }),
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };


  return (
    <div className="grid grid-cols-2  gap-4 bg-white rounded px-6">
      {/* Left Column */}
      <div className="border-r border-[#D9D9D9] pr-8">
        <h2 className="mb-6 text-base font-semibold text-[#0F1137]">Profile information</h2>
        <div className="space-y-5 font-medium">
          {/* Name */}
          <div className="flex items-center">
            <span className="w-[110px] text-[15px] text-[#5A5A5A]">Name:</span>
            {editMode.name ? (
              <input
                type="text"
                value={profileInfo.name}
                onChange={(e) =>
                  setProfileInfo((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                onBlur={() => {
                  setEditMode((prev) => ({ ...prev, name: false }));
                  handleUpdateProfile("name", profileInfo.name);
                }}
                className="ml-2 rounded-sm border border-[#D0D5DD] px-2 py-1 text-[15px] font-semibold focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2 text-[15px] font-semibold text-[#1E1E1E]">{profileInfo.name}</span>
                <button
                  className="ml-2 text-[#5A5A5A] hover:text-[#13B5CF]"
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, name: true }))
                  }
                  aria-label="Edit Name"
                >
                  <Pencil className="h-4 ml-2  w-4" />
                </button>
              </>
            )}
          </div>
          {/* Company */}
          <div className="flex items-center">
            <span className="w-[110px] text-[15px] text-[#5A5A5A]">Company</span>
            {editMode.companyName ? (
              <input
                type="text"
                value={profileInfo.companyName}
                onChange={(e) =>
                  setProfileInfo((prev) => ({
                    ...prev,
                    companyName: e.target.value,
                  }))
                }
                onBlur={() => {
                  setEditMode((prev) => ({ ...prev, companyName: false }));
                  handleUpdateProfile("companyName", profileInfo.companyName);
                }}
                className="ml-2 rounded-sm border border-[#D0D5DD] px-2 py-1 text-[15px] font-semibold focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2 text-[15px] font-semibold text-[#1E1E1E]">{profileInfo.companyName}</span>
                <button
                  className="ml-2 text-[#5A5A5A] hover:text-[#13B5CF]"
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, companyName: true }))
                  }
                  aria-label="Edit Company"
                >
                  <Pencil className="h-4 ml-2  w-4" />
                </button>
              </>
            )}
          </div>
          {/* Location */}
          <div className="flex items-center">
            <span className="w-[110px] text-[15px] text-[#5A5A5A]">Location</span>
            {editMode.location ? (
              <input
                type="text"
                value={profileInfo.location}
                onChange={(e) =>
                  setProfileInfo((prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                onBlur={() => {
                  setEditMode((prev) => ({ ...prev, location: false }));
                  handleUpdateProfile("location", profileInfo.location);
                }}
                className="ml-2 rounded-sm border border-[#D0D5DD] px-2 py-1 text-[15px] font-semibold focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                autoFocus
              />
            ) : (
              <>
                <span className="ml-2 text-[15px] font-semibold text-[#1E1E1E]">{profileInfo.location}</span>
                <button
                  className="ml-2 text-[#5A5A5A] hover:text-[#13B5CF]"
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, location: true }))
                  }
                  aria-label="Edit Location"
                >
                  <Pencil className="h-4 ml-2  w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      
        {/* Account Management */}
        <div className="mt-[30px]">
          <h2 className="mb-4 text-base font-semibold text-[#0F1137]">Account management</h2>
          <div className="flex items-center mb-6">
            <span className="w-[110px] mr-[90px] text-[15px] text-[#5A5A5A]">Disable account</span>
            <Switch
              checked={profileInfo.isAccountDisabled}
              onCheckedChange={(checked) =>
                setProfileInfo((prev) => ({
                  ...prev,
                  isAccountDisabled: checked,
                }))
              }
            />
          </div>
          <div className="flex items-center">
            <span className="w-[110px] mr-[85px] text-[15px] text-[#5A5A5A]">Delete Account</span>
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="ml-2 rounded bg-[#D92D20] px-8 py-2 text-[15px] font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {isDeleting ? (
                <div className=" flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  <span>Deleting...</span>
                </div>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
        
      {/* Right Column */}
      <div>
  <div className="flex items-center mb-2">
    <h2 className="text-base font-semibold text-[#0F1137] mr-2">Company Description</h2>
    <button
      className="text-[#5A5A5A] hover:text-[#13B5CF]"
      onClick={() => setEditMode(prev => ({ ...prev, companyDescription: true }))}
      aria-label="Edit Company Description"
    >
      <Pencil className="h-4 ml-2 w-4" />
    </button> 
  </div>
  {editMode.companyDescription ? (
    <textarea
      value={profileInfo.companyDescription}
      onChange={(e) => setProfileInfo(prev => ({ ...prev, companyDescription: e.target.value }))}
      onBlur={() => {
        setEditMode((prev) => ({ ...prev, companyDescription: false }));
        handleUpdateProfile("companyDescription", profileInfo.companyDescription);
      }}
      className="w-full min-h-[200px] rounded-sm border border-[#D0D5DD] p-3 text-[15px] leading-relaxed text-[#5A5A5A] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
      autoFocus
    />
  ) : (
    <div className="w-full overflow-auto  rounded-sm p-3">
      <p className="text-[15px] text-[#5A5A5A] break-words whitespace-pre-wrap">
        {profileInfo.companyDescription}
      </p>
    </div>
  )}
</div>
    </div>
  );
};
