import React from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    CardMedia,
    CssBaseline,
    ThemeProvider,
} from "@mui/material";
import Image from "next/image";
import useWindowDimensions from "../contexts/hooks/useWindowDimensions";

export default function LoginContainer({
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleLogin,
}) {
    const { width, height } = useWindowDimensions();



    return (
        <Box
            style={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Box
                sx={{
                    width: { mobile: "100vw", desktop: "544px" },
                    height: "548px",
                    p: 5,
                }}
            >
                <Box
                    style={{
                        marginHorizontal: width >= 450 ? 20 : 20,
                        minWidth: 250,
                        maxWidth: 450,
                    }}
                >
                </Box>
                <Typography sx={{ color: "black", fontSize: 30, fontWeight: 600, fontFamily: "Montserrat", fontStyle: "bold", mt: 3 }}>
                    Sign in to Seminary✏️
                </Typography>
                <Typography style={{ color: "black", fontSize: 16, color: "grey", fontFamily: "montserrat" }}>
                    Please enter your account info to sign in
                </Typography>

                {/* TODO --- google button, use later ---- */}
                {/* <Button
          disabled
          sx={{
            borderRadius: 2,
            backgroundColor: "#E0E0E0",
            // boxShadow: "2px 2px 10px 1px #f2f2f2",
            textTransform: "none",
            px: 5,
            opacity: 0.5,
            py: 1.5,
            my: 3,
          }}
        >
          <Image
            width="20"
            height="20"
            // sx={{ mx: 10 }}
            src="/images/icons/google.svg"
            resizeMode="contain"
          />
          <Typography
            sx={{
              justifyContent: "center",
              color: "grey",
              mx: 1,
            }}
          >
            Continue with Google
          </Typography>
        </Button> */}

                <Box
                    sx={{
                        mt: 2,
                    }}
                >
                    <Box style={{ flex: 1, fontFamily: "montserrat" }}>
                        <TextField
                            fullWidth
                            placeholder="Email"
                            variant="outlined"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                backgroundColor: "rgba(28, 117, 188, 0.09)",
                            }}
                        />
                        <TextField
                            fontFamily="montserrat"
                            fullWidth
                            placeholder="Password"
                            variant="outlined"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                backgroundColor: "rgba(28, 117, 188, 0.09)",
                                mt: 2,
                            }}
                        />

                        <Box sx={{ mt: 5, display: "flex" }}>
                            <Button
                                variant="contained"
                                sx={{
                                    display: "flex",
                                    width: "100%",
                                    textTransform: "none",
                                    backgroundColor: "#189EE5",
                                    height: 55
                                }}
                                onClick={handleLogin}
                            >
                                <Typography style={{ textAlign: "center", fontFamily: "montserrat" }}>Log in</Typography>
                            </Button>
                        </Box>
                        <Typography style={{ color: "red" }}>{error}</Typography>
                    </Box>
                </Box>
            </Box>
        </Box>

    );
}
