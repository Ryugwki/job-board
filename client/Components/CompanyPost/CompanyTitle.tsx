"use client";

import React from "react";
import { useGlobalContext } from "@/context/globalContext";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

function CompanyTitle() {
  const {
    companyName,
    companyDescription,
    setCompanyName,
    setCompanyDescription,
  } = useGlobalContext();

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-background border border-border rounded-lg">
      {/* Company Name Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Company Name</h3>
          <Label
            htmlFor="companyName"
            className="text-sm text-muted-foreground mt-2"
          >
            Enter the official name of your company
          </Label>
        </div>
        <div className="flex-1">
          <Input
            type="text"
            id="companyName"
            value={companyName}
            onChange={handleCompanyNameChange}
            className="w-full"
            placeholder="Enter company name"
          />
        </div>
      </div>

      <Separator />

      {/* Company Description Section */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Company Description</h3>
          <Label
            htmlFor="companyDescription"
            className="text-sm text-muted-foreground mt-2"
          >
            Provide a detailed description of your company, including its
            history, mission, values, and work culture
          </Label>
        </div>

        <ReactQuill
          value={companyDescription}
          onChange={setCompanyDescription}
          placeholder="Describe your company here..."
          style={{
            minHeight: "250px",
            marginBottom: "60px", // Add margin to account for the editor toolbar
          }}
          modules={{
            toolbar: [
              [{ header: [1, 2, 3, 4, 5, 6, false] }],
              ["bold", "italic", "underline", "strike"],
              [{ list: "ordered" }, { list: "bullet" }],
              [{ indent: "-1" }, { indent: "+1" }],
              [{ align: [] }],
              ["clean"],
            ],
          }}
          className="custom-quill-editor"
        />
      </div>
    </div>
  );
}

export default CompanyTitle;
