import React from "react";
import Agent from "@/components/Agent";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewPage = async () => {
  const user = await getCurrentUser();

  return (
    <>
      <h3>Geração de entrevista</h3>
      <Agent username={user?.username!} userId={user?.id!} type="generate" />
    </>
  );
};

export default InterviewPage;
