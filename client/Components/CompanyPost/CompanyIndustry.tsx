"use client";

import { useGlobalContext } from "@/context/globalContext";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function CompanyIndustry() {
  const [newTechnology, setNewTechnology] = useState("");
  const {
    industry,
    setIndustry,
    technologies = [],
    setTechnologies = () => {},
    marketPosition,
    setMarketPosition,
    marketFocus,
    setMarketFocus,
  } = useGlobalContext();

  const handleAddTechnology = () => {
    if (newTechnology.trim() && !technologies.includes(newTechnology.trim())) {
      setTechnologies((prev = []) => [...prev, newTechnology.trim()]);
      setNewTechnology("");
    }
  };

  const handleRemoveTechnology = (technologyToRemove: string) => {
    setTechnologies(
      technologies.filter((tech: string) => tech !== technologyToRemove)
    );
  };

  return (
    <div className="p-6 flex flex-col gap-6 bg-background border border-border rounded-lg">
      {/* Primary Industry Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Primary Industry</h3>
          <Label
            htmlFor="industry"
            className="text-sm text-muted-foreground mt-2"
          >
            Select the main industry your company operates in.
          </Label>
        </div>
        <div className="flex-1">
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="media">Media & Entertainment</SelectItem>
              <SelectItem value="transportation">Transportation</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="hospitality">Hospitality & Tourism</SelectItem>
              <SelectItem value="agriculture">Agriculture</SelectItem>
              <SelectItem value="energy">Energy & Utilities</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="nonprofit">Non-profit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Technologies Used Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Technologies & Tools</h3>
          <Label
            htmlFor="technologies"
            className="text-sm text-muted-foreground mt-2"
          >
            Add key technologies, frameworks, or tools that your company uses or
            specializes in.
          </Label>
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex gap-2">
            <Input
              type="text"
              id="technologies"
              value={newTechnology}
              onChange={(e) => setNewTechnology(e.target.value)}
              placeholder="e.g. React, AWS, Machine Learning"
              className="flex-1"
            />

            <Button type="button" onClick={handleAddTechnology}>
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {technologies &&
              technologies.map((tech: string, index: string) => (
                <div
                  key={index}
                  className="bg-primary rounded-full px-3 py-1 text-sm text-primary-foreground flex items-center gap-2"
                >
                  <span>{tech}</span>
                  <button
                    onClick={() => handleRemoveTechnology(tech)}
                    className="text-primary-foreground hover:text-red-600 focus:outline-none"
                    aria-label={`Remove ${tech}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Market Focus Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Market Focus</h3>
          <Label
            htmlFor="marketFocus"
            className="text-sm text-muted-foreground mt-2"
          >
            Describe your target market or business model (B2B, B2C, enterprise,
            startups, etc.)
          </Label>
        </div>
        <div className="flex-1">
          <Select value={marketFocus} onValueChange={setMarketFocus}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select market focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="b2b">Business to Business (B2B)</SelectItem>
              <SelectItem value="b2c">Business to Consumer (B2C)</SelectItem>
              <SelectItem value="b2g">Business to Government (B2G)</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
              <SelectItem value="smb">Small-Medium Business</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="mixed">Mixed/Multiple Markets</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-2" />

      {/* Market Position Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Market Position</h3>
          <Label
            htmlFor="marketPosition"
            className="text-sm text-muted-foreground mt-2"
          >
            Select your company's current position in the market
          </Label>
        </div>
        <div className="flex-1">
          <Select value={marketPosition} onValueChange={setMarketPosition}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select market position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leader">Market Leader</SelectItem>
              <SelectItem value="challenger">Challenger</SelectItem>
              <SelectItem value="niche">Niche Player</SelectItem>
              <SelectItem value="startup">Early-stage Startup</SelectItem>
              <SelectItem value="established">Established Business</SelectItem>
              <SelectItem value="disruptor">Market Disruptor</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export default CompanyIndustry;
