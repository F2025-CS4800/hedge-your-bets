import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { DynamoDB, DynamoDBClientConfig } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb"
import { DynamoDBAdapter } from "@auth/dynamodb-adapter"
 
// AWS DynamoDB configuration for next-auth
const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.AUTH_DYNAMODB_ID!,
    secretAccessKey: process.env.AUTH_DYNAMODB_SECRET!,
  },
  region: process.env.AUTH_DYNAMODB_REGION!,
}
 
const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
})

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  adapter: DynamoDBAdapter(client, { tableName: "users" }),
  
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Be defensive: token may be undefined in some flows (middleware/session retrieval),
      // so guard property access to avoid runtime TypeErrors which surface as SessionTokenError.
      try {
        if (token) {
          (session as any).accessToken = (token as any).accessToken ?? null;
          (session as any).provider = (token as any).provider ?? null;
        } else if (user) {
          // When token isn't available but we have a user (adapter-backed session),
          // attach any useful information from the user record if present.
          (session as any).provider = (user as any).provider ?? null;
          (session as any).accessToken = null;
        } else {
          (session as any).accessToken = null;
          (session as any).provider = null;
        }
      } catch (e) {
        // If anything goes wrong, ensure we return a valid session object and
        // surface the error for debugging rather than crashing middleware.
        console.error('session callback error', e);
        (session as any).accessToken = null;
        (session as any).provider = null;
      }

      return session;
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
  },
});