import React, { useState } from "react";

interface QuestionCardProps {
  question: string;
  options: string[];
  questionNumber: number;
  selectedAnswer: number | null;
  onAnswerSelect: (index: number) => void;
}

const QuestionCard = ({
  question,
  options,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
}: QuestionCardProps) => {
  return (

  

    <div className=" w-[1007px] rounded-lg bg-white p-6 shadow-md">

      <div className="mb-4">
        <h3 className="text-[20px] font-medium text-gray-800">
          <span className="font-bold"> Q {questionNumber}.</span> {question}
        </h3>
      </div>
      <div className="space-y-3 rounded-md  border-[1.5px] border-gray-300 p-[20px]">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex cursor-pointer items-center space-x-3"
          >
            <input
              type="radio"
              className="relative h-4 w-4 appearance-none rounded-full border-2 border-[#2C2C2C] checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2 checked:after:w-2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 checked:after:rounded-full checked:after:bg-[#5A5A5A]"
              checked={selectedAnswer === index}
              onChange={() => onAnswerSelect(index)}
            />

            <span className="font-m text-[14px] text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
