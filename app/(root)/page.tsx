import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import Image from "next/image";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

const Page = async () => {
  const user = await getCurrentUser();
  const [userInterviews, latestInterviews] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({
      userId: user?.id!,
    }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = latestInterviews?.length! > 0;

  return (
    <>
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>
            Fique pronto para entrevistas com ajuda de Inteligência Artificial e
            feedbacks personalizados
          </h2>
          <p className="text-lg">
            Pratique com perguntas reais e receba feedback instantâneos.
          </p>
          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Comece uma entrevista</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robot"
          width={400}
          height={400}
          className=" max-sm:hidden"
        />
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Suas entrevistas</h2>
        <div className="interviews-section">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>Você ainda não aplicou para nenhuma entrevista</p>
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Comece uma entrevista</h2>
        <div className="interviews-section">
          {hasUpcomingInterviews ? (
            latestInterviews?.map((interview) => (
              <InterviewCard key={interview.id} {...interview} />
            ))
          ) : (
            <p>Não há nenhuma entrevista disponível</p>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
