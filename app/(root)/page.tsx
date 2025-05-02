import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import Image from "next/image";
import { dummyInterviews } from "@/constants";
import InterviewCard from "@/components/InterviewCard";
const page = () => {
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
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
          {/* <p>Você ainda não aplicou para nenhuma entrevista</p> */}
        </div>
      </section>

      <section className="flex flex-col gap-6 mt-8">
        <h2>Comece uma entrevista</h2>
        <div className="interviews-section">
          {dummyInterviews.map((interview) => (
            <InterviewCard key={interview.id} {...interview} />
          ))}
        </div>
      </section>
    </>
  );
};

export default page;
