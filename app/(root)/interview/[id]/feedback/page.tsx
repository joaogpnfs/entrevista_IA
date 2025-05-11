import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";
import dayjs from "dayjs";
import Image from "next/image";
import {
  getFeedbackByInterviewId,
  getInterviewsById,
} from "@/lib/actions/general.action";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  if (!user) {
    redirect("/");
  }

  const interview = await getInterviewsById(id);
  if (!interview) {
    redirect("/");
  }

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });
  console.log(feedback);

  return (
    <section className="section-feedback">
      <div className="flex flex-row justify-center">
        <h1 className="text-4xl font-semibold">
          Feedback da Entrevista - Entrevista de{" "}
          <span className="capitalize">{interview.role}</span>
        </h1>
      </div>

      <div className="flex flex-row justify-center ">
        <div className="flex flex-row gap-5">
          {/* Overall Impression */}
          <div className="flex flex-row gap-2 items-center">
            <Image src="/star.svg" width={22} height={22} alt="estrela" />
            <p>
              Impressão Geral:{" "}
              <span className="text-primary-200 font-bold">
                {feedback?.totalScore}
              </span>
              /100
            </p>
          </div>

          {/* Date */}
          <div className="flex flex-row gap-2">
            <Image
              src="/calendar.svg"
              width={22}
              height={22}
              alt="calendário"
            />
            <p>
              {feedback?.createdAt
                ? dayjs(feedback.createdAt).format("DD/MM/YYYY HH:mm")
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      <hr />

      <p>{feedback?.finalAssessment}</p>

      {/* Interview Breakdown */}
      <div className="flex flex-col gap-4">
        <h2>Análise da Entrevista:</h2>
        {feedback?.categoryScores?.map((category, index) => (
          <div key={index}>
            <p className="font-bold">
              {index + 1}.{" "}
              {category.name === "Communication Skills"
                ? "Habilidades de Comunicação"
                : category.name === "Technical Knowledge"
                  ? "Conhecimento Técnico"
                  : category.name === "Problem Solving"
                    ? "Resolução de Problemas"
                    : category.name === "Cultural Fit"
                      ? "Fit Cultural"
                      : category.name === "Confidence and Clarity"
                        ? "Confiança e Clareza"
                        : category.name}{" "}
              ({category.score}/100)
            </p>
            <p>{category.comment}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Pontos Fortes</h3>
        <ul>
          {feedback?.strengths?.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3>Áreas para Melhorar</h3>
        <ul>
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <p className="text-sm font-semibold text-primary-200 text-center">
              Voltar ao dashboard
            </p>
          </Link>
        </Button>

        <Button className="btn-primary flex-1">
          <Link
            href={`/interview/${id}`}
            className="flex w-full justify-center"
          >
            <p className="text-sm font-semibold text-black text-center">
              Refazer Entrevista
            </p>
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default page;
