"use client";

import React, { useState } from "react";
import ProgressBar from "@/components/EmployerProfile/ProgressBar";

interface Question {
  QuestionNo: number;
  Question: string;
  Response: string;
  Rating: number;
  Weightage: number;
  WeightedScore: number;
}

interface EvaluationSummary {
  AverageRating: number;
  WeightedScore: number;
  RecommendedForTechEvaluation: string;
}

const questions: Question[] = [
  {
    QuestionNo: 1,
    Question: "What ServiceNow modules have you worked on other than ITSM?",
    Response:
      "Modules such as ITOM, ITAM, CMDB, CSM, WSD, HRSD, GRC, SecOps (Vulnerability Management), etc",
    Rating: 0,
    Weightage: 10,
    WeightedScore: 0,
  },
  {
    QuestionNo: 2,
    Question:
      "What is your understanding about Incident, Problem and Change modules?",
    Response:
      "Incident: An Incident is an unplanned interruption or reduction in the quality of service, i.e. something is broken or not working as expected. Examples such as laptop not working, emails not getting refreshed, server performance issues.., are all use cases for incident management.\n\nProblem: A problem is a cause, or potential cause, of one or more incidents. Problems can be raised in response to a single significant incident or multiple similar incidents. They can even be raised without the existence of a corresponding incident.\n\nChange: A change request involves a significant change to the service or infrastructure. A change requires authorization by the CAB (Change Advisory Board) and needs to be approved before it can be implemented in production. It might carry a high degree of risk.",
    Rating: 0,
    Weightage: 10,
    WeightedScore: 0,
  },
  {
    QuestionNo: 3,
    Question:
      "What is meant by Inbound and Outbound integrations in ServiceNow?",
    Response:
      "Inbound integration is making call from third party application to ServiceNow's REST API to get information from ServiceNow, or create/update records.\nOutbound integration is making calls from ServiceNow to other applications API to get information or create/update records.",
    Rating: 0,
    Weightage: 15,
    WeightedScore: 0,
  },
  {
    QuestionNo: 4,
    Question: "Why do we need a MID server for integration purposes?",
    Response:
      "A MID server acts as connection between the internal network and the ServiceNow instance. It allows ServiceNow to connect to data sources/applications on the internal network (like SQL servers, internal APIs etc).",
    Rating: 0,
    Weightage: 5,
    WeightedScore: 0,
  },
  {
    QuestionNo: 5,
    Question:
      "What is the difference between a Scripted REST API and a standard REST API",
    Response:
      "A REST API provides pre-defined endpoints to make it possible for external applications to connect with ServiceNow, whereas a scripted REST API allows the ability to create a custom API endpoint within the ServiceNow platform enabling the developers to define custom logic and data retrieval to expose specific functionalities or data.",
    Rating: 0,
    Weightage: 15,
    WeightedScore: 0,
  },
  {
    QuestionNo: 6,
    Question: "What is meant by a workflow?",
    Response:
      "A Workflow consists of a sequence of activities, such as generating records, notifying users of pending approvals, or running server side scripts. A workflow is used if the process requires complicated or scripted logic.",
    Rating: 0,
    Weightage: 20,
    WeightedScore: 0,
  },
  {
    QuestionNo: 7,
    Question: "What is a Flow Designer and when is it used?",
    Response:
      "A flow designer is a low code way to automate approvals, task, notifications and record operations. It is also used when a new logic needs to be developed and it has not been created in workflow.",
    Rating: 0,
    Weightage: 5,
    WeightedScore: 0,
  },
  {
    QuestionNo: 8,
    Question:
      "What is a Service Catalog Item and what are the 4 types of Catalog Items?",
    Response:
      "A Catalog Item is a form used to submit information, a request, or to create a task. Catalog Items contain questions that gather information from users to create a record in a table. The 4 types of Catalog Items are - i) Standard Catalog Items; ii) Record Producers; iii) Order Guides; iv) Content Items.",
    Rating: 0,
    Weightage: 10,
    WeightedScore: 0,
  },
  {
    QuestionNo: 9,
    Question: "What is an ACL?",
    Response:
      "An access control is a security rule defined to restrict the permissions of a user from viewing and interacting with data. Most security settings are implemented using access controls",
    Rating: 0,
    Weightage: 5,
    WeightedScore: 0,
  },
  {
    QuestionNo: 10,
    Question:
      "What are the different ways to move an update set from one instance to another?",
    Response:
      "There are 3 different ways - i) Transferring with an XML file; ii) Transferring via update sources; iii) Transferring with IP access control",
    Rating: 0,
    Weightage: 5,
    WeightedScore: 0,
  },
];

const Common = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill(""),
  );
  const questionsPerPage = 2;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const getCurrentQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
  };

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const newAnswers = [...answers];
    const actualIndex = currentPage * questionsPerPage + questionIndex;
    newAnswers[actualIndex] = answer;
    setAnswers(newAnswers);
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
    <div className="flex w-full flex-col items-center">
      <div className=" w-[1077px]">
        <ProgressBar currentStep={currentPage} totalSteps={totalPages} />
      </div>

      <div className="mb-[30px] flex w-[1077px] flex-col gap-[30px]">
        <div className="space-y-8">
          {getCurrentQuestions().map((q, index) => (

            <div key={q.QuestionNo} className="rounded-lg border bg-white p-6">
              <h3 className="mb-4 text-[20px] font-bold">
                Q{q.QuestionNo}.{" "}
                <span className="text-[#5A5A5A]"> {q.Question}</span>

              </h3>
              <textarea
                value={answers[currentPage * questionsPerPage + index]}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="min-h-[150px] w-full rounded-md border p-3 focus:outline-none focus:ring-2 focus:ring-[#13B5CF]"
                placeholder="Type your answer here..."
              />
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentPage === 0}
            className={`rounded-sm px-6 py-2 text-white transition-colors ${
              currentPage === 0 ? "bg-gray-400" : "bg-[#293E40]"
            }`}
          >
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className={`rounded-sm px-6 py-2 text-white transition-colors ${
              currentPage === totalPages - 1 ? "bg-gray-400" : "bg-[#13B5CF]"
            }`}
          >
            {currentPage === totalPages - 1 ? "Finish" : "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Common;
