import { Box, CardMedia, CssBaseline, Typography } from "@mui/material";
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
                    height: 75,
                    display: "flex",
                    alignContent: "center",
                    boxShadow: 3,
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
                <Box
                    sx={{ cursor: 'pointer' }}
                    onClick={() => {
                        signOut();
                    }}
                >
                    <Typography>Sign out</Typography>
                </Box>
            </Box>
        </>
    );
}
