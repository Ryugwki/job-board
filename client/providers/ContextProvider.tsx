"use client";

import React from "react";
import { GlobalContextProvider } from "../context/globalContext";
import { JobsContextProvider } from "../context/jobsContext";
import { CompanyContextProvider } from "../context/companyContext";

interface Props {
  children: React.ReactNode;
}

function ContextProvider({ children }: Props) {
  return (
    <GlobalContextProvider>
      <JobsContextProvider>
        <CompanyContextProvider>{children}</CompanyContextProvider>
      </JobsContextProvider>
    </GlobalContextProvider>
  );
}
export default ContextProvider;
