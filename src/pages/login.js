import { Box } from "@mui/material"
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router"
import { useState } from "react";
import LoginContainer from "../components/LoginContainer"

export default function Login({ data }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const router = useRouter();

    function handleLogin() {
        // router.push("/dashboard")
        const data = {
            email,
            password
        }
        signIn('credentials', {
            ...data,
            redirect: false,
            callbackUrl: '/',
        }).then((res) => {
            console.log(res);
            if (res.ok) {
                router.push('/dashboard');
            } else {
                setError("Please try again!");
                setEmail();
                setPassword();
            }
        })
            .catch((error) => {
                console.log(error);
                setEmail();
                setPassword();
                setError("Please try again!");

            });

    }


    return (
        <Box>
            <LoginContainer error={error} setEmail={setEmail} password={password} setPassword={setPassword} email={email} handleLogin={handleLogin} />
        </Box>
    )
}

export async function getServerSideProps({ req }) {
    const session = await getSession({ req });
    console.log(session);
    if (session) {
        return {
            redirect: {
                destination: "/dashboard",
                permanent: false,
            },
        };
    }
    return {
        props: { data: session },
    };
}