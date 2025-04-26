"use client";

import React, { useState } from "react";
import QuestionCard from "../index";
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import { Button } from "@/components/ui/button";

interface Question {
  "Question No.": number;
  Question: string;
  "Multiple Choice": string[];
  "Correct Answer": string;
}
 const mcq:Question[] = [
   {
     "Question No.": 1,
     Question:
       "Which of the following modules is NOT part of ServiceNow SecOps?",
     "Multiple Choice": [
       "A) Vulnerability Response",
       "B) Security Incident Response",
       "C) Threat Intelligence",
       "D) Change Management",
     ],
     "Correct Answer": "D) Change Management",
   },
   {
     "Question No.": 2,
     Question:
       "What is the primary purpose of the Security Incident Response (SIR) module in SecOps?",
     "Multiple Choice": [
       "A) Managing IT service requests",
       "B) Detecting and responding to security threats",
       "C) Handling HR cases",
       "D) Automating procurement processes",
     ],
     "Correct Answer": "B) Detecting and responding to security threats",
   },
   {
     "Question No.": 3,
     Question:
       "Which role is required to access and manage security incidents in SecOps?",
     "Multiple Choice": [
       "A) sn_si.admin",
       "B) itil",
       "C) security_user",
       "D) sn_secops.manager",
     ],
     "Correct Answer": "A) sn_si.admin",
   },
   {
     "Question No.": 4,
     Question: "What is the main function of Vulnerability Response in SecOps?",
     "Multiple Choice": [
       "A) Monitoring system performance",
       "B) Identifying and prioritizing vulnerabilities in an organization's environment",
       "C) Managing software licenses",
       "D) Configuring firewall rules",
     ],
     "Correct Answer":
       "B) Identifying and prioritizing vulnerabilities in an organization's environment",
   },
   {
     "Question No.": 5,
     Question:
       "Which framework does ServiceNow SecOps integrate with to enhance security incident management?",
     "Multiple Choice": [
       "A) MITRE ATT&CK",
       "B) ITIL",
       "C) COBIT",
       "D) Agile Scrum",
     ],
     "Correct Answer": "A) MITRE ATT&CK",
   },
   {
     "Question No.": 6,
     Question:
       "What is the purpose of the Threat Intelligence module in SecOps?",
     "Multiple Choice": [
       "A) Automating user provisioning",
       "B) Identifying, analyzing, and responding to cyber threats",
       "C) Managing IT assets",
       "D) Tracking software development tasks",
     ],
     "Correct Answer":
       "B) Identifying, analyzing, and responding to cyber threats",
   },
   {
     "Question No.": 7,
     Question:
       "Which record type is used to track vulnerabilities in ServiceNow SecOps?",
     "Multiple Choice": [
       "A) Security Incident",
       "B) Configuration Item (CI)",
       "C) Vulnerability Item",
       "D) Change Request",
     ],
     "Correct Answer": "C) Vulnerability Item",
   },
   {
     "Question No.": 8,
     Question:
       "How does ServiceNow integrate with external security tools for automated threat detection?",
     "Multiple Choice": [
       "A) Through SOAP web services",
       "B) Using Security Orchestration, Automation, and Response (SOAR)",
       "C) Manually exporting reports",
       "D) By email notifications",
     ],
     "Correct Answer":
       "B) Using Security Orchestration, Automation, and Response (SOAR)",
   },
   {
     "Question No.": 9,
     Question:
       "Which dashboard in SecOps provides a real-time overview of security incidents and vulnerabilities?",
     "Multiple Choice": [
       "A) ITSM Overview",
       "B) Security Operations Dashboard",
       "C) Change Management Dashboard",
       "D) CMDB Dashboard",
     ],
     "Correct Answer": "B) Security Operations Dashboard",
   },
   {
     "Question No.": 10,
     Question: 'What does "Risk Calculator" do in Vulnerability Response?',
     "Multiple Choice": [
       "A) Predicts stock market trends",
       "B) Determines the severity of vulnerabilities based on business impact",
       "C) Measures the financial cost of security incidents",
       "D) Analyzes software performance issues",
     ],
     "Correct Answer":
       "B) Determines the severity of vulnerabilities based on business impact",
   },
 ];
const SecOps = () => {
 

  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(mcq.length).fill(null),
  );
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 2;

  // Calculate total pages
  const totalPages = Math.ceil(mcq.length / questionsPerPage);

  // Get current questions
  const getCurrentQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return mcq.slice(start, end);
  };

  const handleAnswerSelect = (
    questionIndex: number,
    selectedOptionIndex: number,
  ) => {
    const actualIndex = currentPage * questionsPerPage + questionIndex;
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[actualIndex] = selectedOptionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className=" mx-auto mb-5">
        <ProgressBar currentStep={currentPage} totalSteps={totalPages} />
        <div className="space-y-6">
          {getCurrentQuestions().map((question, index) => (
            <QuestionCard
              key={index}
              question={question.Question}
              options={question["Multiple Choice"]}
              questionNumber={question["Question No."]}
              selectedAnswer={
                selectedAnswers[currentPage * questionsPerPage + index]
              }
              onAnswerSelect={(selectedIndex) =>
                handleAnswerSelect(index, selectedIndex)
              }
            />
          ))}

          <div className=" mt-[30px] flex items-center  justify-between px-1">
            <button
              onClick={handleBack}
              disabled={currentPage === 0}
              className={` rounded-sm px-6 py-2 text-white transition-colors ${
                currentPage === 0 ? "bg-gray-400" : "bg-[#293E40]"
              }`}
            >
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              className={` rounded-sm px-6 py-2 text-white transition-colors ${
                currentPage === totalPages - 1 ? "bg-gray-400" : "bg-[#13B5CF]"
              }`}
            >
              {currentPage === totalPages - 1 ? "Finish" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecOps;
