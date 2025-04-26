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
       "What is the central repository for storing information about all IT assets and their configurations within ITOM?",
     "Multiple Choice": [
       "A. CMDB",
       "B. Event Management Console",
       "C. Service Mapping",
       "D. Orchestration Engine",
     ],
     "Correct Answer": "A. CMDB",
   },
   {
     "Question No.": 2,
     Question:
       "Which ITOM feature automatically discovers and maps IT infrastructure components across the network?",
     "Multiple Choice": [
       "A. Service Mapping",
       "B. Event Management",
       "C. Discovery",
       "D. Operational Intelligence",
     ],
     "Correct Answer": "C. Discovery",
   },
   {
     "Question No.": 3,
     Question:
       "How does ITOM leverage 'Orchestration' to streamline IT operations?",
     "Multiple Choice": [
       "A. By automatically triggering workflows based on predefined conditions",
       "B. By providing real-time monitoring of system performance",
       "C. By managing user access to IT services",
       "D. By generating detailed reports on asset utilization",
     ],
     "Correct Answer":
       "A. By automatically triggering workflows based on predefined conditions",
   },
   {
     "Question No.": 4,
     Question:
       "What is the primary benefit of using 'ITOM Visibility' in ServiceNow?",
     "Multiple Choice": [
       "A. To monitor user activity on IT systems",
       "B. To provide real-time insights into IT infrastructure health",
       "C. To manage software license compliance",
       "D. To automate incident remediation",
     ],
     "Correct Answer":
       "B. To provide real-time insights into IT infrastructure health",
   },
   {
     "Question No.": 5,
     Question:
       "Which ITOM feature is most relevant for managing cloud-based infrastructure?",
     "Multiple Choice": [
       "A. Service Mapping",
       "B. Discovery",
       "C. Cloud Management",
       "D. Event Management",
     ],
     "Correct Answer": "C. Cloud Management",
   },
   {
     "Question No.": 6,
     Question: "How does ITOM integrate with ITSM to improve service delivery?",
     "Multiple Choice": [
       "A. By automatically creating incidents in ITSM based on detected infrastructure issues",
       "B. By managing user access to IT services",
       "C. By providing detailed reports on customer satisfaction",
       "D. By automating change management processes",
     ],
     "Correct Answer":
       "A. By automatically creating incidents in ITSM based on detected infrastructure issues",
   },
   {
     "Question No.": 7,
     Question: "In ServiceNow ITOM, what is the function of 'Orchestration'?",
     "Multiple Choice": [
       "A. To automate IT and business processes",
       "B. To discover network devices",
       "C. To manage incidents and problems",
       "D. To create service catalogs",
     ],
     "Correct Answer": "A. To automate IT and business processes",
   },
   {
     "Question No.": 8,
     Question:
       "What is the purpose of Operational Intelligence in ServiceNow ITOM?",
     "Multiple Choice": [
       "A. To discover new devices and applications",
       "B. To provide advanced analytics for event data",
       "C. To map services and their dependencies",
       "D. To manage change requests",
     ],
     "Correct Answer": "B. To provide advanced analytics for event data",
   },
   {
     "Question No.": 9,
     Question: "What is the role of the 'MID Server' in ServiceNow ITOM?",
     "Multiple Choice": [
       "A. To act as a database for storing configuration items",
       "B. To facilitate communication between ServiceNow and external systems",
       "C. To manage user authentication and authorization",
       "D. To provide a user interface for ITOM applications",
     ],
     "Correct Answer":
       "B. To facilitate communication between ServiceNow and external systems",
   },
   {
     "Question No.": 10,
     Question: "In ServiceNow's Event Management, what is an 'Alert'?",
     "Multiple Choice": [
       "A. A notification sent to users about a new incident",
       "B. A record that stores information about a significant event in the IT infrastructure",
       "C. A tool used to discover devices on the network",
       "D. A map showing the relationship between services",
     ],
     "Correct Answer":
       "B. A record that stores information about a significant event in the IT infrastructure",
   },
 ];
const Itom = () => {
 


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
      <div className=" mx-auto mb-[30px]">
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

export default Itom;
