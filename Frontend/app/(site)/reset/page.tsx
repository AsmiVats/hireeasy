"use client";
import Reset from "@/components/ResetPass/Reset";
import React, { useState } from "react";

const SettingsPage: React.FC = () => {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <div>
      

      <section>
       
        <button onClick={() => setIsResetModalOpen(true)}>
          Reset Password
        </button>
      </section>

      <Reset
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};

export default SettingsPage;
