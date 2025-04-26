"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetPasswordModal = ({ isOpen, onClose }: ResetPasswordModalProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset email');
      }

      setSuccess(true);
    } catch (error) {
      setError("Failed to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[550px] p-8">
        <DialogTitle className="mb-6 text-[26px] font-bold text-[#293E40]">
          Reset Password
        </DialogTitle>
        
        <p className="mb-6 text-[15px] text-[#293E40]">
          Enter the email address associated with the account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-[15px] text-[#1E1E1E]">
              Email address <span className="text-[#D92D20]">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-[#D0D5DD] px-4 py-1 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-[#D92D20]">{error}</p>
          )}

          {success ? (
            <div className="text-center">
              <p className="text-[15px] text-[#13B5CF]">
                Reset instructions have been sent to your email.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 rounded-sm bg-[#13B5CF] px-6 py-2 text-[15px] text-white hover:opacity-90"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={onClose}
                className="text-[15px] text-[#13B5CF] hover:underline"
              >
                Back to login
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-sm bg-[#13B5CF] px-6 py-2 text-[15px] text-white hover:opacity-90 disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send email"}
              </button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};