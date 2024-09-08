import NextAuth from "next-auth";

declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
        user: {
            /** The user's name. */
            id?: string | null;
            name?: string | null;
            email?: string | null;
            role?: string | null;
            position?: string | null;
            image?: string | null;
            activated?: boolean | null;
        };
    }
}
