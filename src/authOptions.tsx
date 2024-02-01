import { NextAuthOptions } from "next-auth";

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
                    image: user.image,
                };
            },
        }),
    ],
    // pages: {
    //     signIn: "/signin",
    // },
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    name: token.name,
                    email: token.email,
                    position: token.position,
                },
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id,
                    email: u.email,
                    name: u.name,
                    position: u.position,
                    image: u.image,
                };
            }
            return token;
        },
    },
};