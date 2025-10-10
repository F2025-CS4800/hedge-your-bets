"use server";
import { signIn, signOut } from "@/auth";

export const login = async () => {
    await signIn("github", {redirectTo: "/"});
    // Placeholder for server-side login logic
}

export const logout = async () => {
    // Placeholder for server-side logout logic
    await signOut({redirectTo: "/"});
}