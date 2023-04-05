import { Box, Button, CardMedia, CssBaseline, Typography } from "@mui/material";
import { maxWidth } from "@mui/system";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Header({ user }) {
  const router = useRouter();
  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          backgroundColor: "white",
          height: 50,
          display: "flex",
          alignContent: "center",
          boxShadow: 1,
          p: 1,
          px: 10,
        }}
      >
        <Typography
          onClick={() => {
            router.push("/");
          }}
          sx={{
            alignSelf: "center",
            cursor: "pointer",
            justifyContent: "left",
            color: "black",
            fontSize: 20,
            fontWeight: 600,
            fontFamily: "Montserrat",
            fontStyle: "bold",
            my: 1,
          }}
        >
          Seminary✏️
        </Typography>
        <Box sx={{ ml: "auto", display: "flex" }}>
          <Button
           sx={{mx:1}}
            onClick={() => {
              signOut();
            }}
            variant="outlined"
          >
            <Typography>Sign out</Typography>
          </Button>
          <Button
            sx={{mx:1}}
             onClick={() => {
                router.push("/dashboard");
              }}
            variant="contained"
          >
            <Typography>Create a Set</Typography>
          </Button>
  
        </Box>
      </Box>
    </>
  );
}
