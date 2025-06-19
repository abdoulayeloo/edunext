// src/actions/logout.ts
"use server";

import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export const logout = async () => {
    await signOut();
    redirect("/connexion")
};