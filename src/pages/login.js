import { Box } from "@mui/material"
import { useRouter } from "next/router"
import { useState } from "react";
import LoginContainer from "../components/LoginContainer"

export default function Login() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();
    const router = useRouter();
    function handleLogin() {
        router.push("/dashboard")
    }
    return (
        <Box>
            <LoginContainer error={error} setEmail={setEmail} password={password} setPassword={setPassword} email={email} handleLogin={handleLogin} />

        </Box>
    )
}