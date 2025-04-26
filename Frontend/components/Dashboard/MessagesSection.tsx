// Add at the top of the file
/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';

interface Messageinterface {
  id: number;
  title: string;
  jobTitle: string;
  skill: string;
  description: string;
  isRead: boolean;
  type: 'job' | 'candidate';
}

export const MessagesSection = () => {
  const [activeTab, setActiveTab] = useState('unread');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

  useEffect(() => {
    const empID = localStorage.getItem('user')
    
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/message/getAllMessages?employerId=${empID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  useEffect(() => {
    const empID = localStorage.getItem('user')
    let url = "";

    if (activeTab === 'unread') {
      url = `${BASE_URL}/message/getUnreadMessages?employerId=${empID}`;
    } else if (activeTab === 'inbox') {
      url = `${BASE_URL}/message/getAllMessages?employerId=${empID}`;
    } else if (activeTab === 'jobs') {
      url = `${BASE_URL}/message/getAllMessages?employerId=${empID}`;
    } else if (activeTab === 'candidates') {
      url = `${BASE_URL}/message/getAllMessages?employerId=${empID}`;
    } else if (activeTab === 'all') {
      url = `${BASE_URL}/message/getAllMessages?employerId=${empID}`;
    }
    const fetchUnreadMessage = async () => {
      try {
        const response = await fetch(
          url,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchUnreadMessage();
  }, [activeTab]);
  
 

  const getFilteredMessages = () => {
    switch (activeTab) {
      case 'unread':
        return messages.filter(msg => msg);
      case 'inbox':
        return messages;
      case 'jobs':
        return messages.filter(msg => msg);
      case 'candidates':
        return messages.filter(msg => msg);
      case 'all':
        return messages;
      default:
        return messages;
    }
  };

  return (
    <div className="flex h-full bg-gray-50">
      {/* Message Navigation */}
      <div style={{borderLeft:"1px solid #D9D9D9"}} className="w-64 bg-white p-6 border-r border-l-1 border-[#D9D9D9]">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Messages</h2>
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('unread')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeTab === 'unread' 
                ? 'text-[#13B5CF] bg-green-50' 
                : 'text-[#009951] hover:bg-green-30'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeTab === 'inbox' 
                ? 'text-[#13B5CF] bg-green-50' 
                : 'text-[#009951] hover:bg-green-30'
            }`}
          >
            Inbox
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeTab === 'jobs' 
                ? 'text-[#13B5CF] bg-green-50' 
                : 'text-[#009951] hover:bg-green-30'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('candidates')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeTab === 'candidates' 
                ? 'text-[#13B5CF] bg-green-50' 
                : 'text-[#009951] hover:bg-green-30'
            }`}
          >
            Candidates
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`w-full text-left px-3 py-2 rounded-sm ${
              activeTab === 'all' 
                ? 'text-[#13B5CF] bg-green-50' 
                : 'text-[#009951] hover:bg-green-30'
            }`}
          >
            All
          </button>
        </nav>
      </div>

      {/* Message Content */}
      <div className="flex-1 p-6">
        <div className="space-y-4">
          {getFilteredMessages().map((message) => (
            <div 
              key={message._id} 
              className={`p-4 rounded-sm bg-white shadow-sm ${!message.isRead ? 'border-2 border-[#D9D9D9]' : 'border-2 border-[#e6e6e6]'}`}
            >
              <h3 className="font-medium text-gray-900">
                {message.message}
              </h3>
              <p className={`mt-1 text-gray-400`}>
                {message.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};