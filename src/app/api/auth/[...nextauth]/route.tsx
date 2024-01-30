import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "Password",
                },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }
                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                });
                if (!user) {
                    return null;
                }
                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                );
                if (!isPasswordValid) {
                    return null;
                }

                return {
                    id: user.id + "",
                    email: user.email,
                    name: user.firstname + " " + user.lastname,
                    position: user.position,
                };
            },
        }),
    ],
    callbacks: {
        session: ({ session, token }) => {
            return session;
        },
        jwt: ({ token, user }) => {
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
