import React from "react";
import Agent from "@/components/Agent";

const InterviewPage = () => {
  return (
    <>
      <h3>Geração de entrevista</h3>
      <Agent userName="Você" userId="user1" type="generate" />
    </>
  );
};

export default InterviewPage;
