import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { Box, Button, Grid, Typography, Modal, Avatar } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { motion } from "framer-motion";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { media } from "../../mock/images";
import { getMySets, getSets, joinSession, startSession } from "@/utils/api";
import { getSession } from "next-auth/react";
import SetCard from "@/components/SetCard";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 3,
};

export default function Dashboard({ data }) {
  const [open, setOpen] = useState(false);
  const [selectedSet, setSelectedSet] = useState();
  const handleOpen = (res) => {
    setSelectedSet(res);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const { width } = useWindowDimensions();
  const router = useRouter();
  const [sets, setSets] = useState([]);
  const [openOption, setOpenOption] = useState(false);
  useEffect(() => {
    console.log(data);
    getMySets(data?.user.id).then((res) => {
      console.log(res);
      setSets(res.data);
    });
  }, []);

  function startSessionHandler() {
    startSession(data?.user.id, selectedSet.id).then((res) => {
      console.log(res);
      //router.replace(`/session/${res.id}`)

      joinSession(res.code, data?.user.id).then((res) => {
        console.log(res);
        router.replace(`/session/${res.sets.id}-${res.session.id}`);
      });
    });
    // router.replace(`/session`)
  }

  function startNewSetHandler() {
    router.push("dashboard/quiz");
  }
  return (
    <>
      <Head>
        <title>noterly✏️</title>
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={data?.user} />
      <Box
        sx={{
          backgroundColor: "#F2F1F6",
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          display: "flex",
        }}
      >
        <Box sx={{ maxWidth: 1000, mt: 3, width: 1000 }}>
          <Typography sx={{ fontWeight: 600 }}>
            Welcome, {data?.user.name}
          </Typography>
          <Typography
            sx={{
              color: "black",
              fontSize: 40,
              fontWeight: 700,
              fontStyle: "bold",
            }}
          >
            My noterly
          </Typography>
          <Box sx={{ my: 2 }}>
            <Grid
              sx={{ overflow: "hidden" }}
              container
              spacing={{ xs: 1, md: 1 }}
              columns={{ xs: 1, sm: 2, md: 4 }}
            >
              <Grid item xs={1} sm={1} md={1}>
                <motion.div
                  whileHover={{
                    opacity: 0.8,
                    translateY: -2,
                  }}
                  transition={{
                    type: "spring",
                    duration: 0.2,
                    stiffness: 200,
                  }}
                >
                  <Box
                    onClick={startNewSetHandler}
                    sx={{
                      "&:hover": {
                        opacity: 0.7,
                      },
                      overflow: "hidden",
                      cursor: "pointer",
                      borderRadius: 3,
                      backgroundColor: "white",
                      m: 1,
                      height: 250,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        maxWidth: width / 2,
                        alignItems: "center",
                        flexDirection: "column",
                        py: 10,
                      }}
                    >
                      <Typography sx={{ fontWeight: 600 }}>
                        Start a New Set!
                      </Typography>
                      <AddCircleIcon />
                    </Box>
                    <Box
                      sx={{
                        p: 1,
                        minHeight: 30,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ display: "flex" }}></Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              {sets.map((res, index) => {
                console.log(res);
                return (
                  <Grid item xs={1} sm={1} md={1} key={index}>
                    <SetCard row={res} handleClick={() => handleOpen(res)} />
                    {/* <motion.div
                        whileHover={{
                          opacity: 0.8,
                          translateY: -2,
                        }}
                        transition={{
                          type: "spring",
                          duration: 0.2,
                          stiffness: 200,
                        }}
                      >
                        <Box
                          sx={{
                            maxHeight: 330,
                            overflow: "hidden",
                            cursor: "pointer",
                            borderRadius: 3,
                            backgroundColor: "white",
                            m: 1,
                          }}
                        >
                          <Box
                            sx={{
                              justifyContent: "flex-end",
                              overflow: "hidden",
                              maxWidth: width / 2,
                            }}
                          >
                            <img
                              style={{
                                display: "flex",
                                height: 200,
                                marginLeft: "auto",
                                marginRight: "auto",
                                objectFit: "cover",
                                width: "100%",
                              }}
                              src={res.photo == "" ? "" : res.photo}
                            />

                            <Box
                              sx={{ display: "flex", p: 1, height: 50, mt: 2 }}
                            >
                              <Button
                                sx={{ flex: 1, mr: 1 }}
                                onClick={() => {
                                  console.log("Edit");
                                  router.push(`/dashboard/quiz/${res.id}`);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                onClick={() => handleOpen(res)}
                                variant={"contained"}
                              >
                                Host
                              </Button>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              p: 1,
                              height: 60,
                              display: "flex",
                              flexDirection: "column",
                              overflow: "hidden",
                            }}
                          >
                            <Typography
                              sx={{
                                display: "-webkit-box",
                                overflow: "hidden",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 2,
                                fontWeight: 400,
                                fontSize: 12,
                              }}
                            >
                              {res?.description.toLowerCase()}
                            </Typography>
                          </Box>
                        </Box>
                      </motion.div> */}
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        </Box>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Host Your noterly{" "}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            It’s time to host your noterly. You won’t be able to edit anything
            while the noterly is running! You will have access to all the
            controls you need to create a fantastic experience for your
            students!{" "}
          </Typography>
          <Button
            sx={{ mt: 2, mr: 1 }}
            onClick={() => {
              router.push(`/dashboard/quiz/${selectedSet.id}`);
            }}
            variant={"contained"}
          >
            Edit
          </Button>
          <Button
            sx={{ mt: 2 }}
            onClick={startSessionHandler}
            variant={"contained"}
          >
            Continue
          </Button>
        </Box>
      </Modal>
    </>
  );
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
