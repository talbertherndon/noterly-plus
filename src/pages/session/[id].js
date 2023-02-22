import { startSession } from "@/utils/api";
import { Box, CircularProgress } from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Session({ data }) {
  const router = useRouter();
  const { id } = router.query;
  const [session, setSession] = useState();
  const [users, setUsers] = useState();

  //STARTING SESSION

  useEffect(() => {
    startSession(data?.user.id, id).then((res) => {
      console.log(res);
      setSession(res);
    });
  }, [id]);

  if (session) {
    return (
      <Box>
        {session.name}: {session.code}
      </Box>
    );
  } else {
    return (
      <Box
        sx={{
          background: "#00000017",
          display: "flex",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          top: 0,
          left: 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={100} style={{ color: "#dfd6c9" }} />
      </Box>
    );
  }
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  console.log(session);
  if (!session) {
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
