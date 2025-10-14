import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const {auth, handlers, signIn, signOut} = NextAuth({
  providers: [GitHub],
  trustHost: true, // This allows localhost and other development URLs
  
  // Change this later on to, when we have our domains:
  //   trustHost: ["localhost:3000", "yourdomain.com"],
});