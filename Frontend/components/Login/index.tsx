"use client";
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { useRouter } from 'next/navigation';
import { authService } from '@/utils/authService';


const SignInForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [error, setError] = useState('');
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const router = useRouter();

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await authService.login({ email, password });
      localStorage.setItem('token', response.token || 'loggedIn');
      localStorage.setItem('user', response.userId);
      if (staySignedIn) {
        localStorage.setItem('staySignedIn', 'true');
      }
      router.push('/dashboardhome');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm">
        <h1 className="text-[26px] font-medium mb-6">Sign in</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-[#900B09] rounded-sm text-sm">
            {error}
          </div>
        )}
        
        <div className="mb-6">
  <span className="text-sm text-gray-600">New User? </span>
  <button 
    onClick={() =>(true)} 
    className="text-sm text-[#13B5CF] hover:text-blue-600 hover:underline"
  >
    Create an account
  </button>
  
</div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm label_color mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm label_color mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#13B5CF] focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Stay signed in</span>
                <Switch
                  checked={staySignedIn}
                  onCheckedChange={setStaySignedIn}
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-sm #009951 transition-colors"
              >
                Sign in
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 space-y-2">
          <a href="https://www.google.com" className="block text-sm text-[#13B5CF]">
            Reset your password
          </a>
          <a href="#" className="block text-sm text-[#13B5CF]">
            Sign in to a different account
          </a>
        </div>

      </div>
    </div>
  );
};

export default SignInForm;