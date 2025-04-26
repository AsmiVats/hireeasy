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
      Question: "What is the unplanned interruption called?",
      "Multiple Choice": [
        "A. Configuration Item",
        "B. Problem",
        "C. Change",
        "D. Incident",
      ],
      "Correct Answer": "D. Incident",
    },
    {
      "Question No.": 2,
      Question: "Incdent priority is based on which two fields?",
      "Multiple Choice": ["A. Urgency", "B. Risk", "C. Category", "D. Impact"],
      "Correct Answer": "A. Urgency D. Impact",
    },
    {
      "Question No.": 3,
      Question: "What table contains incident category and sub-category values",
      "Multiple Choice": ["A. Choice", "B. sys_choice", "C. cmdb_ci_choice"],
      "Correct Answer": "B. sys_choice",
    },
    {
      "Question No.": 4,
      Question:
        "For a problem created fron an incident, what module should be used to change values copied from the incident?",
      "Multiple Choice": [
        "A. Script Includes",
        "B. Problem Properties",
        "C. Client Scripts",
        "D. Business Rules",
      ],
      "Correct Answer": "B. Problem Properties",
    },
    {
      "Question No.": 5,
      Question:
        "What modules can be used to configure change approvals without editing the workflow?",
      "Multiple Choice": [
        "A. Change Approvals",
        "B. Change Properties",
        "C. Approval Definitions",
        "D. Change Approval Policies",
      ],
      "Correct Answer": "C. Approval Definitions D. Change Approval Policies",
    },
    {
      "Question No.": 6,
      Question: "Where are Standard Change Templates stored?",
      "Multiple Choice": [
        "A. Proposed Change Templates",
        "B. Change Templates",
        "C. Service Catalog",
      ],
      "Correct Answer": "C. Service Catalog",
    },
    {
      "Question No.": 7,
      Question: "Where All tables will be stored ?",
      "Multiple Choice": [
        "A.sys_choice",
        "B.sys_db_object table",
        "C.sys_db_table",
      ],
      "Correct Answer": "B.sys_db_object table",
    },
    {
      "Question No.": 8,
      Question:
        "What agreement is required to track the incident record in ITSM?",
      "Multiple Choice": ["A. SLA", "B.OLA", "C.UC", "D.None of the above"],
      "Correct Answer": "A.SLA",
    },
    {
      "Question No.": 9,
      Question: "Glide Record will work on which side ?",
      "Multiple Choice": ["A.Server side", "B.Client side", "C.Both Sides"],
      "Correct Answer": "A. Server side",
    },
    {
      "Question No.": 10,
      Question: "Can tables be deleted in ServiceNow?",
      "Multiple Choice": [
        "A. Yes we can format them",
        "B. All tables can be deleted",
        "C. Only custom tables can be deleted",
        "D. Only system tables can be deleted",
      ],
      "Correct Answer": "C. Only custom tables can be deleted",
    },
    {
      "Question No.": 11,
      Question:
        "Which tool can be used to change the layout of the form view for all users?",
      "Multiple Choice": [
        "A.User Administration",
        "B. Flow Designer",
        "C. Form Designer",
        "D. Automated test framework",
      ],
      "Correct Answer": "C. Form Designer",
    },
    {
      "Question No.": 12,
      Question:
        "Which tool is used to determine the relationship between fields in an import set of an existing table?",
      "Multiple Choice": [
        "A.Transform Map",
        "B.Import Set",
        "C.Target Table",
        "D.Coalesce",
      ], 
      "Correct Answer": "A. Transform Map",
    },
    {
      "Question No.": 13,
      Question:
        "Select the report visualization types that can be generated from a list of records.",
      "Multiple Choice": [
        "A.Single Score",
        "B. Bar Chart",
        "C.Line Chart",
        "D.Pie Chart",
      ],
      "Correct Answer": "B.Bar Chart & D.pie Chart",
    },
    {
      "Question No.": 14,
      Question: "Which of the following can trigger a flow designer flow?",
      "Multiple Choice": [
        "A.Schedule Time Interval",
        "B.Record being created or updated on a table",
        "C.A user clicking a button on a form",
        "D.All of the above",
      ],
      "Correct Answer": "D.All of the above",
    },
  ];
const Itsm = () => {

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

export default Itsm;
