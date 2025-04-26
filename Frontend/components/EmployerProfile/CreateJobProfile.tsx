'use client';
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
interface CreateJobProfileProps  {
  onNext: () => void;
  onBack: () => void;
}

const CreateJobProfile = ({ onNext, onBack }: CreateJobProfileProps) => {
  const [postType, setPostType] = React.useState("new");

  return (
    <div className="min-h-screen flex justify-center pt-[100px]">
      <div className="w-full max-w-[550px]">
        <h1 className="text-[36px] font-bold text-center text-[#293E40] mb-[25px]">
          Create a new job
        </h1>
        <h2 className="mb-[25px] text-[26px] text-center opacity-60 text-[#13B5CF]">Add job basics</h2>
      </div>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <span className="label_color">
              How would you like to post your job?
            </span>
            <span className="text-[#900B09]">*</span>
          </div>

          <RadioGroup
            defaultValue="new"
            value={postType}
            onValueChange={setPostType}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="template" id="template" />
              <Label htmlFor="template" className="label_color">
                Use a previous job as a template
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new" className="label_color">
                Create a brand new post
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            className="bg-gray-600 text-white hover:bg-gray-700"
            onClick={onBack}
          >
            Back
          </Button>
          <Button className="bg-[#13B5CF] rounded-sm text-white " onClick={onNext}>
            Continue
          </Button>
        </div>
      </CardContent>
    </div>
  );
};

export { CreateJobProfile };
