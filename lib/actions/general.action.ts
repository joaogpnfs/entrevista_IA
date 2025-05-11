"use server";

import { feedbackSchema } from "@/constants";
import { db } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";

export async function getInterviewsByUserId(
  userId: string,
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams,
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .orderBy("createdAt", "desc")
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsById(id: string): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content} \n`,
      )
      .join("");

    const {
      object: {
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
      },
    } = await generateObject({
      model: google("gemini-2.0-flash-001", { structuredOutputs: false }),
      schema: feedbackSchema,
      prompt: `
        Você é um entrevistador AI analisando uma entrevista simulada. Sua tarefa é avaliar o candidato com base em categorias estruturadas. Seja minucioso e detalhado em sua análise. Não seja condescendente com o candidato. Se houver erros ou áreas para melhoria, aponte-os.
        Transcrição:
        ${formattedTranscript}

        Por favor, pontue o candidato de 0 a 100 nas seguintes áreas. Não adicione categorias além das fornecidas:
        - **Habilidades de Comunicação**: Clareza, articulação, respostas estruturadas.
        - **Conhecimento Técnico**: Compreensão dos conceitos-chave para a função.
        - **Resolução de Problemas**: Capacidade de analisar problemas e propor soluções.
        - **Fit Cultural**: Alinhamento com os valores da empresa e função.
        - **Confiança e Clareza**: Confiança nas respostas, engajamento e clareza.

        IMPORTANTE: Todas as suas respostas (comentários, pontos fortes, áreas de melhoria e avaliação final) devem ser em português do Brasil.
        `,
      system:
        "Você é um entrevistador profissional analisando uma entrevista simulada. Sua tarefa é avaliar o candidato com base em categorias estruturadas. Todas as suas respostas devem ser em português do Brasil.",
    });

    const feedback = await db.collection("feedbacks").add({
      userId,
      interviewId,
      totalScore,
      categoryScores,
      strengths,
      areasForImprovement,
      finalAssessment,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      feedbackId: feedback.id,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams,
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const feedback = await db
    .collection("feedbacks")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (feedback.empty) {
    return null;
  }

  const feedbackDoc = feedback.docs[0];
  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}
