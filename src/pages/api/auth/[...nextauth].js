import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { API_BASE_URL } from "../../../utils/config";
import axios from "axios";

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials) {
                console.log(credentials);
                const { data } = await axios
                    .post(API_BASE_URL + "/auth/login", {
                        email: credentials.email,
                        password: credentials.password,
                    })
                    .catch((e) => {
                        console.log(e);
                        return e;
                    });
                console.log(data)
                const token = data.authToken;
                if (data.user) {
                    return {
                        token,
                        name: data.user.name,
                        email: data.user.email,
                        details: data.user,
                    };
                } else {
                    return null;
                }
            },
        })
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                token.id = user.details;
                token.token = user.token;
            }
            return token;
        },
        session: async ({ session, token }) => {
            console.log(token)
            const now = Date.now();
            const expires = token.exp * 1000;
            console.log(`Now: ${now}`, `Expires: ${expires}`);
            if (expires > now) {
                session.user = token.id;
                session.token = token.token;
            } else {
                session = null;
            }

                // session.user = token.id;
                // session.token = token.token;
            return session;
        },
    },
    secret: process.env.NEXT_PUBLIC_SECRET,
    session: { jwt: true },
    jwt: {
        secret: process.env.NEXT_PUBLIC_SECRET,
    },
});
