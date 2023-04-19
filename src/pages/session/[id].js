import {
  endSession,
  getSet,
  leaveSession,
  nextQuestion,
  postAnswer,
  startSession,
} from "@/utils/api";
import Image from "next/image";

import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  Grid,
  Typography,
} from "@mui/material";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import { media } from "@/mock/images";

import ReactHowler from "react-howler";

configureAbly({
  key: "SjNplQ.PeWp8Q:tMYZU6hygevKBg6iBkZyEAS2i3xoaP-9KCr2xltxccM",
  clientId: "quickstart",
});

export default function Session({ data }) {
  const router = useRouter();
  const { id } = router.query;

  const [session, setSession] = useState();
  const [users, setUsers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [question, setQuestion] = useState();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [answer, setAnswer] = useState();
  const [time, setTime] = useState(0);

  const [end, setEnd] = useState(false);
  const color = ["red", "blue", "green", "orange"];

  const [channel] = useChannel(`${session?.code}`, (message) => {
    console.log(message.name);
    if (message.name == "join-session") {
      getSet(id.split("-")[0]).then((res) => {
        console.log(res.data);
        setUsers(res.data.users);
      });
    }
    if (message.name == "next") {
      console.log("ADMIN MOVED TO NEXT QUESTION");
      getSet(id.split("-")[0]).then((res) => {
        console.log("YOur anser", answer);
        console.log("answers", answers);
        console.log(res.data.questions[res.data.sets.current - 1]);
        setSession(res.data.sets);
        setAnswer();
        setAnswers([]);
        setUsers(res.data.users);

        if (res.data.questions[res.data.sets.current - 1]) {
          setQuestion(res.data.questions[res.data.sets.current - 1]);
          //countdown(res.data.questions[res.data.sets.current - 1]);
          setTime(res.data.questions[res.data.sets.current - 1].time);
        } else {
          console.log("No more questions left!");
        }
      });
    }
    if (message.name == "end") {
      console.log("ADMIN ENDED noterly");
      // getSet(id).then((res) => {
      //   console.log(res.data.questions[res.data.sets.current - 1]);
      //   setSession(res.data.sets);
      //   setQuestion(res.data.questions[res.data.sets.current - 1]);
      // });
    }
    if (message.name == "responses") {
      console.log(message.data);
      setAnswers(message.data);
    }
    if (message.name == "end") {
      router.push("/");
    }
  });

  function responseCheck() {
    // needs to be updated by alby and check all the response and when its at max let teach know,
  }

  //STARTING SESSION

  useEffect(() => {
    if (session) {
      if (session.current != 0 || session.current < questions.length) {
        if (time == 0 && isAdmin) {
          nextHandler();
        }
        const timer = time > 0 && setInterval(() => setTime(time - 1), 1000);

        return () => clearInterval(timer);
      }
    }
  }, [time]);

  useEffect(() => {
    getSet(id.split("-")[0]).then((res) => {
      console.log(res.data);
      if (res.data.sets.user_id == data.user.id) {
        console.log("admin");
        setIsAdmin(true);
      }
      setQuestions(res.data.questions);
      setSession(res.data.sets);
      setQuestion(res.data.questions[res.data.sets.current - 1]);
      setUsers(res.data.users);
    });

    // startSession(data?.user.id, id).then((res) => {
    //   console.log(res);
    //   setSession(res);
    // });
  }, [id]);

  useEffect(() => {
    console.log(session);
    console.log(question);
  }, [session]);

  useEffect(() => {
    if (session) {
      if (answers.length == users.length && session.current != 0 && isAdmin) {
        nextHandler();
      }
    }
  }, [answers]);

  function nextHandler() {
    console.log("Starting noterly");
    if (session.current <= questions.length && isAdmin) {
      nextQuestion(data.user.id, id.split("-")[0]).then((res) => {
        console.log(res);
      });
    } else {
      console.log(session);
      console.log(questions);
      //session.current++;
      console.log("End of Quiz Totaling points!");
    }
  }

  function endHanlder() {
    console.log("Ending noterly");
    endSession(data.user.id, session.id).then((res) => {
      router.push("/");
    });
  }

  function leaveHandler() {
    const payload = {
      user_id: data.user.id,
      session_id: id.split("-")[1],
    };
    leaveSession(payload).then((res) => {
      router.push("/");
    });
  }

  function handleAnswer(res) {
    console.log(res);
    console.log(question.answer == res);
    console.log(session);

    //validate session to make sure user is real --- /{id}
    const payload = {
      user_id: data.user.id,
      session_id: id.split("-")[1],
      sets_id: question.sets_id,
      questions_id: question.id,
      correct: question.answer == res ? true : false,
      response: res,
    };
    setAnswer(payload);
    console.log(payload);
    postAnswer(payload).then((res) => {
      console.log(res);
      // setAnswer(res);
    });
  }

  if (session) {
    return (
      <>
        <CssBaseline />
        <Box sx={{ backgroundColor: "#5FCCFB" }}>
          <Box
            sx={{
              p: 3,
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
              width: "100vw",
              backgroundImage: `url(./images/bg_gradient.png)`,
              backgroundRepeat: `no-repeat, no-repeat`,
              backgroundPosition: `center`,
              backgroundSize: "cover",
            }}
          >
            <Box sx={{ m: "auto" }}>
              {isAdmin && (
                <>
                  {session.current == 0 ? (
                    <>
                      <Button onClick={nextHandler} variant="contained">
                        Start
                      </Button>
                      <Button onClick={endHanlder} variant="contained">
                        End
                      </Button>
                    </>
                  ) : (
                    <>
                      {session.current <= questions.length ? (
                        <>
                          <Button onClick={nextHandler} variant="contained">
                            Skip
                          </Button>
                          <Button
                            sx={{ ml: 3 }}
                            onClick={endHanlder}
                            variant="outlined"
                          >
                            End
                          </Button>
                        </>
                      ) : (
                        <Button onClick={endHanlder} variant="contained">
                          End
                        </Button>
                      )}
                    </>
                  )}
                </>
              )}{" "}
            </Box>
            {session.current == 0 ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: "white",
                      p: 3,
                      borderRadius: 3,
                      height: 200,
                      m: 1,
                    }}
                  >
                    <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                      SESSION PIN:
                    </Typography>
                    <Typography sx={{ fontSize: 75, fontWeight: 700 }}>
                      {session.code}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      m: 1,
                      overflow: "hidden",
                      borderRadius: 3,
                      height: 200,
                      flex: 1,
                      backgroundImage: `url(${
                        session.photo == "" ? media[4].photo : session.photo
                      }) ,url(${
                        session.photo == "" ? media[4].photo : session.photo
                      })`,
                      backgroundRepeat: `no-repeat, no-repeat`,
                      backgroundPosition: `center`,
                      backgroundSize: "cover",
                    }}
                  >
                    <Box
                      sx={{
                        mt: "auto",
                        backgroundImage:
                          "linear-gradient(to bottom, rgba(0, 0, 0, 0.4)20%, rgba(0, 0, 0, 0)100%)",
                        height: "100%",
                        p: 1,
                      }}
                    >
                      <Typography
                        sx={{ color: "white", fontSize: 20, fontWeight: 600 }}
                      >
                        {session.name}
                      </Typography>
                      <Typography
                        sx={{
                          color: "white",
                          fontSize: 16,
                          fontWeight: 50,
                          mb: 1,
                        }}
                      >
                        {session.description}
                      </Typography>
                      <Box sx={{ m: "auto" }}>
                        {isAdmin && (
                          <>
                            {session.current == 0 ? (
                              <Button onClick={nextHandler} variant="contained">
                                Start
                              </Button>
                            ) : (
                              <>
                                {session.current < questions.length ? (
                                  <Button
                                    onClick={nextHandler}
                                    variant="contained"
                                  >
                                    Next
                                  </Button>
                                ) : (
                                  <Button
                                    onClick={endHanlder}
                                    variant="contained"
                                  >
                                    End
                                  </Button>
                                )}
                              </>
                            )}
                          </>
                        )}{" "}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", flex: 1, m: 1 }}>
                  <Box sx={{ my: 1 }}>
                    <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                      Joined Users
                    </Typography>
                    <Grid
                      sx={{
                        my: 1,
                        alignItems: "center",
                      }}
                      container
                      spacing={2}
                      columns={{ xs: 2, sm: 4, md: 8 }}
                    >
                      {users?.map((res) => {
                        return (
                          <Grid item xs={1} sm={2} md={4}>
                            <Box
                              sx={{
                                backgroundColor: "white",
                                p: 1,
                                width: 250,
                                overflow: "hidden",
                                borderRadius: 4,
                              }}
                            >
                              <Typography
                                sx={{
                                  display: "-webkit-box",
                                  overflow: "hidden",
                                  WebkitBoxOrient: "vertical",
                                  WebkitLineClamp: 1,
                                  fontWeight: 600,
                                  textOverflow: "ellipsis",
                                  maxWidth: 250,
                                }}
                              >
                                {res.user.name} #{res.id}
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                </Box>
              </>
            ) : (
              <>
                {session.current <= questions.length ? (
                  <>
                    <Box
                      sx={{
                        my: 1,
                        backgroundColor: "white",
                        p: 3,
                        borderRadius: 3,
                        height: 200,
                        m: 1,
                        display: "flex",
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                          TIME LEFT:
                        </Typography>
                        <Typography sx={{ fontSize: 75, fontWeight: 700 }}>
                          {time}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", ml: "auto" }}>
                        {session.current != 0 &&
                          session.current <= questions.length && (
                            <>
                              <Box>
                                <Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 700,
                                      textAlign: "center",
                                      fontSize: 20,
                                    }}
                                  >
                                    Answers
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontWeight: 700,
                                      textAlign: "center",
                                      fontSize: 20,
                                    }}
                                  >
                                    {answers.length}
                                  </Typography>
                                </Box>{" "}
                              </Box>
                            </>
                          )}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        justifyContent: "center",
                        display: "flex",
                        alignContent: "center",
                      }}
                    >
                      <Typography variant="body1">{session.current}</Typography>
                      <Typography sx={{ fontSize: 40, fontWeight: 600 }}>
                        {question?.question}
                      </Typography>
                    </Box>
                    <Box sx={{}}>
                      <Grid
                        sx={{
                          my: 1,
                          alignItems: "center",
                        }}
                        container
                        spacing={2}
                        columns={{ xs: 2, sm: 4, md: 8 }}
                      >
                        {question?.options.map((res, index) => {
                          return (
                            <Grid item xs={1} sm={2} md={4}>
                              <Box
                                onClick={() => {
                                  if (!answer) {
                                    handleAnswer(res);
                                  }
                                }}
                                sx={{
                                  "&:hover": { opacity: 0.7 },
                                  borderRadius: 2,
                                  display: "flex",
                                  backgroundColor:
                                    answer?.response != res
                                      ? color[index]
                                      : "#dadada",
                                  cursor: answer ? "" : "pointer",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  p: 1,
                                  borderRadius: 2,
                                  alignSelf: "center",
                                  border: 1,
                                  borderColor: "#DADADA",
                                  opacity: answer ? 0.7 : 1,
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "white",
                                    fontWeight: 600,
                                    fontSize: 20,
                                  }}
                                >
                                  {res}
                                </Typography>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Box>
                  </>
                ) : (
                  <>
                    {!isAdmin && (
                      <Button onClick={leaveHandler} variant="contained">
                        Leave
                      </Button>
                    )}
                    <Box
                      sx={{
                        backgroundColor: "white",
                        p: 3,
                        borderRadius: 3,
                        height: 200,
                        m: 1,
                        display: "flex",
                      }}
                    >
                      {" "}
                      <Image
                        src="/images/gold.png"
                        alt="Gold"
                        width={100}
                        height={100}
                      />
                      <Box>
                        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                          1st Place Winner:
                        </Typography>
                        <Typography sx={{ fontSize: 30, fontWeight: 700 }}>
                          {users[0].user.name}
                        </Typography>
                        <Typography sx={{ fontSize: 30, fontWeight: 700 }}>
                          {users[0].points} Points!
                        </Typography>
                      </Box>
                    </Box>
                    {users[1] && (
                      <Box
                        sx={{
                          backgroundColor: "white",
                          p: 3,
                          borderRadius: 3,
                          height: 200,
                          m: 1,
                        }}
                      >
                        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>
                          2nd Place Winner:
                        </Typography>
                        <Typography sx={{ fontSize: 30, fontWeight: 700 }}>
                          {users[1].user.name}
                        </Typography>
                        <Typography sx={{ fontSize: 30, fontWeight: 700 }}>
                          {users[1].points} Points!
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </>
            )}
          </Box>
        </Box>
      </>
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
        <CircularProgress size={100} />
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
