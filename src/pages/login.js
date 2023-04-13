import { signUp } from "@/utils/api";
import { Box } from "@mui/material";
import { getSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import LoginContainer from "../components/LoginContainer";
import SignUpContainer from "../components/SignUpContainer";

export default function Login({ data }) {
  const [name, setName] = useState();
  const [newUser, setNewUser] = useState(false);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();
  const router = useRouter();

  function handleSignUp() {

    //router.push("/dashboard");
    const data = {
      name,
      email,
      password,
    };
    signUp(data).then((res) => {
      if (res.data.authToken) {
        signIn("credentials", {
          ...data,
          redirect: false,
          callbackUrl: "/",
        }).then((res) => {
          console.log(res);
          if (res.ok) {
            router.push("/dashboard");
          } else {
            toast.error("Please try agiain!");
            setError("Please try again!");
            setEmail("");
            setPassword("");
          }
        })
      }
      console.log(res)
    }).catch((e) => { toast.error(e.response.data?.message); console.log(e); })
  }

  function handleLogin() {
    // router.push("/dashboard")
    const data = {
      email,
      password,
    };
    signIn("credentials", {
      ...data,
      redirect: false,
      callbackUrl: "/",
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          router.push("/");
        } else {
          toast.error("Please try agiain!");
          setError("Please try again!");
          setEmail("");
          setPassword("");
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
      {newUser ? (
        <SignUpContainer
          newUser={newUser}
          setNewUser={setNewUser}
          error={error}
          name={name}
          setName={setName}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          email={email}
          handleSignUp={handleSignUp}
        />
      ) : (
        <LoginContainer
          newUser={newUser}
          setNewUser={setNewUser}
          error={error}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          email={email}
          handleLogin={handleLogin}
        />
      )}
    </Box>
  );
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  console.log(session);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { data: session },
  };
}
