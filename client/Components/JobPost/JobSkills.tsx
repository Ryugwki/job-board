"use client";

import { useGlobalContext } from "@/context/globalContext";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";

function JobSkills() {
  const [newSkill, setNewSkill] = useState("");
  const [newTag, setNewTag] = useState("");
  const { skills, setSkills, tags, setTags } = useGlobalContext();

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev: string) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill: string) => skill !== skillToRemove));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags((prev: string) => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div className="p-6 flex flex-col gap-4 bg-background border border-border rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Skills</h3>
          <Label
            htmlFor="skills"
            className="text-sm text-muted-foreground mt-2"
          >
            Add the skills required for this job. You can add multiple skills by
            separating them with commas.
          </Label>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              id="skills"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
              className="flex-1"
            />

            <Button type={"button"} onClick={handleAddSkill}>
              Add skill
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {skills.map((skill: string, index: number) => (
              <div
                key={index}
                className="bg-primary rounded-full px-3 py-1 text-sm text-primary-foreground flex items-center gap-2"
              >
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-primary-foreground hover:text-red-600 focus:outline-none"
                  aria-label={`Remove skill ${skill}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Tags</h3>
          <Label htmlFor="tags" className="text-sm text-muted-foreground mt-2">
            Add tags to help candidates find your job listing. You can add
            multiple tags by separating them with commas.
          </Label>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              id="tags"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="e.g. JavaScript, React, Node.js"
              className="flex-1"
            />

            <Button type={"button"} onClick={handleAddTag}>
              Add tag
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string, index: number) => (
              <div
                key={index}
                className="bg-primary rounded-full px-3 py-1 text-sm text-primary-foreground flex items-center gap-2"
              >
                <span>{tag}</span>
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="text-primary-foreground hover:text-red-600 focus:outline-none"
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobSkills;
