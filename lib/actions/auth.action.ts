"use server";

import { db, auth } from "@/firebase/admin";
import { cookies } from "next/headers";

const semana = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, username, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        sucess: false,
        message: "Usuário já existe",
      };
    }

    await db.collection("users").doc(uid).set({
      username,
      email,
    });

    return {
      sucess: true,
      message: "Usuário criado com sucesso. Por favor, faça login. 🚀",
    };
  } catch (error: any) {
    console.error("Error creating a user", error);

    if (error.code === "auth/email-already-exists") {
      return {
        sucess: false,
        message: " Email já está em uso",
      };
    }

    return {
      sucess: false,
      message: "Erro ao criar usuário",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: semana * 1000,
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: semana,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        sucess: false,
        message: "Usuário não encontrado. Crie uma conta.",
      };
    }
    await setSessionCookie(idToken);
  } catch (error) {
    console.log(error);
    return {
      sucess: false,
      message: "Erro ao fazer login",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return null;
    }

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}
