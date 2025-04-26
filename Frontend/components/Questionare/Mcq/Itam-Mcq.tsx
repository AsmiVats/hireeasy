"use client";
import React, { useState, useEffect, Suspense } from "react";
import QuestionCard from "../index";
import ProgressBar from "@/components/EmployerProfile/ProgressBar";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

// Create a wrapper component that uses useSearchParams
function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const skillName = searchParams.get('skillName') || 'SecOps';
  
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const questionsPerPage = 2;

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/questionarre/getMCQ?skillName=${skillName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        
        const result = await response.json();
        
        if (result.success && result.data) {
          setQuestions(result.data);
          setSelectedAnswers(new Array(result.data.length).fill(null));
        } else {
          throw new Error(result.message || 'Failed to fetch questions');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast.error('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [skillName]);

  // Calculate total pages
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  // Get current questions
  const getCurrentQuestions = () => {
    const start = currentPage * questionsPerPage;
    const end = start + questionsPerPage;
    return questions.slice(start, end);
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

  const handleSubmit = () => {
    // Calculate score
    let correctCount = 0;
    questions.forEach((question, index) => {
      const selectedAnswerIndex = selectedAnswers[index];
      if (selectedAnswerIndex !== null) {
        const selectedOption = question.options[selectedAnswerIndex];
        if (question.correctAnswer.includes(selectedOption)) {
          correctCount++;
        }
      }
    });
    
    const score = (correctCount / questions.length) * 100;
    toast.success(`Your score: ${score.toFixed(2)}%`);
    
    // Here you could also send the results to an API
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[300px]">Loading questions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center min-h-[300px]">{error}</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center min-h-[300px]">No questions available for this skill.</div>;
  }

  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-between bg-[#F5F6F8] ">
        <div className="h-[120px] w-full bg-white pt-[20px]  ">
          <h1 className="mb-[25px] text-center text-[26px] font-medium  text-[#293E40]">
            Questionare for Candidates
          </h1>
          <h2 className="mb-[25px] text-center text-[20px] font-medium text-[#13B5CF] opacity-60">
            {skillName} Assessment
          </h2>
        </div>
        <div className="mb-[30px]">
          <ProgressBar currentStep={currentPage} totalSteps={totalPages} />
          <div className="space-y-6">
            {getCurrentQuestions().map((question, index) => (
              <QuestionCard
                key={question._id}
                question={question.question}
                options={question.options}
                questionNumber={(currentPage * questionsPerPage) + index + 1}
                selectedAnswer={
                  selectedAnswers[currentPage * questionsPerPage + index]
                }
                onAnswerSelect={(selectedIndex) =>
                  handleAnswerSelect(index, selectedIndex)
                }
              />
            ))}

            <div className="mt-[30px] flex items-center justify-between px-1">
              <button
                onClick={handleBack}
                disabled={currentPage === 0}
                className={`rounded-sm px-6 py-2 text-white transition-colors ${
                  currentPage === 0 ? "bg-gray-400" : "bg-[#293E40]"
                }`}
              >
                Back
              </button>

              {currentPage === totalPages - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="rounded-sm px-6 py-2 text-white transition-colors bg-[#13B5CF]"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="rounded-sm px-6 py-2 text-white transition-colors bg-[#13B5CF]"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Main component with Suspense boundary
interface MCQQuestion {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: string[];
  skillName: string;
}

const Itam = () => {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <QuestionnaireContent />
    </Suspense>
  );
};

export default Itam;
