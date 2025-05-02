"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, Button } from "@/components/ui";
import FormField from "@/components/FormField";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const authFormSchema = (type: FormType) => {
  return z.object({
    username:
      type === "sign-up" ? z.string().min(3) : z.string().min(3).optional(),
    email: z.string().email(),
    password: z.string().min(8),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        console.log("SIGN UP", values);
        toast.success("Conta criada com sucesso! Por favor, faça login.");
        router.push("/sign-in");
      } else {
        console.log("SIGN IN", values);
        toast.success("Login realizado com sucesso!");
        router.push("/");
      }
    } catch (error) {
      console.log(error);
      toast.error(
        `Erro ao ${type === "sign-up" ? "criar" : "fazer"} login: ${error}`,
      );
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-row gap-2 justify-center">
          <Image src="/logo.svg" alt="logo" width={38} height={32} />
          <h2 className="text-primary-100">PrepTalk</h2>
        </div>

        <h3>Pratique entrevistas com IA</h3>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                name="username"
                label="Nome de usuário"
                placeholder="Nome de usuário"
              />
            )}
            <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Email"
              type="email"
            />
            <FormField
              control={form.control}
              name="password"
              label="Senha"
              placeholder="Senha"
              type="password"
            />
            <Button className="btn" type="submit">
              {isSignIn ? "Entrar" : "Criar uma conta"}
            </Button>
          </form>
        </Form>

        <p className="text-center">
          {isSignIn ? "Não tem uma conta? " : "Já possui uma conta? "}
          <Link
            className=" text-user-primary ml-1 font-bold "
            href={isSignIn ? "/sign-up" : "/sign-in"}
          >
            {isSignIn ? "Crie uma conta" : "Faça login"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
