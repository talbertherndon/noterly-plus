import Header from "@/components/Header";
import useWindowDimensions from "@/contexts/hooks/useWindowDimensions";
import {
  Box,
  Chip,
  TextField,
  Typography,
  Button,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Radio,
  IconButton,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import PropTypes from "prop-types";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { media } from "../../../mock/images";
import { motion } from "framer-motion";
import { createSet, editSet, getSet } from "@/utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import SessionHistory from "@/components/SessionHistory";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function editQuiz({ data }) {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const { id } = router.query;
  const [set, setSet] = useState({
    name: "",
    description: "",
    user_id: data?.user.id,
    photo: "",
    questions: [],
  });
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [type, setType] = useState("multi");
  const [choices, setChoices] = useState([]);
  const [selectedValue, setSelectedValue] = useState();
  const [value, setValue] = useState(0);

  function editSetHandler() {
    console.log(set);
    editSet(set, id)
      .then((res) => {
        toast.success("Set was successfully saved!");
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function addQuestionHandler() {
    if (choices[selectedValue]) {
      const cur_question = {
        question,
        type,
        options: choices,
        answer: choices[selectedValue],
        index: questions.length + 1,
      };
      console.log(cur_question);
      setQuestions((prev) => [...prev, cur_question]);
      setChoices([]);
      setQuestion("");
      setType("");
      console.log(questions);
    } else {
      toast.error("Please select an answer");
    }
  }

  useEffect(() => {
    setSet({ ...set, questions: questions });
  }, [questions]);

  const updateFieldChanged = (index) => (e) => {
    //     console.log("index: " + index);
    //       console.log("property value: " + e.target.value);
    let newArr = [...choices]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index] = e.target.value.toLowerCase(); // replace e.target.value with whatever you want to change it to
    setChoices(newArr);
  };

  const updateFieldChangedAnswer = (index) => (e) => {
    console.log("index: " + index);
    setSelectedValue(e.target.value);
    console.log("property isAnswer: " + e.target.value);
    console.log(choices);
  };

  function changeTypeHandler(e) {
    setChoices([]);
    console.log(e.target.value);
    if (e.target.value == "multi") {
      setType(e.target.value);
    }
    if (e.target.value == "truefalse") {
      setType(e.target.value);
      setChoices([`True`, `False`]);
    }
    if (e.target.value == "fillinblank") {
      setType(e.target.value);
    }
  }

  useEffect(() => {
    if (id) {
      getSet(id).then((res) => {
        console.log(res);
        setSet(res.data.sets);
        setQuestions(res.data.questions);
      });
    }
  }, [id]);

  return (
    <Box>
      <Header />
      <Box
        sx={{
          backgroundColor: "#F2F1F6",
          display: "flex",
          flexDirection: "column",
          pb: 10,
        }}
      >
        <Box sx={{ alignSelf: "center", p: width > 450 ? 5 : 1 }}>
          <Box
            sx={{
              overflow: "hidden",
            }}
          >
            <Box>
              <Chip
                clickable
                onClick={() => {
                  router.push("/dashboard");
                }}
                label="Go back"
              />
            </Box>
            <Typography
              sx={{
                color: "black",
                fontSize: 40,
                fontWeight: 600,
                fontFamily: "Montserrat",
                fontStyle: "bold",
              }}
            >
              Edit Set
            </Typography>
            <Box sx={{ my: 2, display: "flex" }}>
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    width: 150,
                    height: 150,
                    boxShadow: 3,
                  }}
                >
                  <Box sx={{ height: 150, overflow: "hidden" }}>
                    <motion.div
                      animate={{ y: 0, scale: 1.1 }}
                      whileHover={{ scale: 1.5 }}
                    >
                      <img
                        style={{
                          display: "block",
                          width: "100%",
                          marginLeft: "auto",
                          marginRight: "auto",
                          objectFit: "fill",
                        }}
                        src={set.photo}
                      />
                    </motion.div>
                  </Box>
                </Box>
              </Box>
              <Box sx={{ ml: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Name"
                  value={set.name}
                  onChange={(e) => {
                    setSet({ ...set, name: e.target.value });
                  }}
                />
                <TextField
                  fullWidth
                  sx={{ mt: 1 }}
                  multiline
                  rows={4}
                  size="small"
                  placeholder="Description"
                  value={set.description}
                  onChange={(e) => {
                    setSet({ ...set, description: e.target.value });
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={value}
                onChange={(event, newValue) => {
                  setValue(newValue);
                  console.log(newValue);
                }}
                aria-label="basic tabs example"
              >
                <Tab label="Questions" {...a11yProps(0)} />
                <Tab label="Metrics" {...a11yProps(1)} />
                <Tab label="Settings" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Box sx={{ my: 2 }}>
                <Typography>
                  Create questions to pop up during your discussion to make sure
                  your students are listening!
                </Typography>
              </Box>
              <Box sx={{ maxWidth: 600 }}>
                {questions.map((res) => {
                  return (
                    <Box
                      sx={{
                        p: 2,
                        border: 1,
                        borderRadius: 3,
                        my: 2,
                        borderColor: "white",
                        display: "flex",
                      }}
                    >
                      <Box>
                        <Typography>Question: {res.question}</Typography>
                        <Typography>Correct Answer: {res.answer}</Typography>
                      </Box>
                      <IconButton
                        onClick={() => {
                          setQuestions(
                            questions.filter((r) => {
                              return r != res;
                            })
                          );
                        }}
                        sx={{ ml: "auto" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  );
                })}
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Box sx={{ display: "flex" }}>
                    <TextField
                      value={question}
                      onChange={(e) => {
                        setQuestion(e.target.value);
                      }}
                      sx={{ flex: 2, mr: 1 }}
                      size="small"
                      placeholder="Untiled Question"
                    />
                    <FormControl sx={{ flex: 1, ml: 1 }} size="small">
                      <InputLabel id="demo-simple-select-label">
                        Question Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={type}
                        label="Question Type"
                        onChange={changeTypeHandler}
                      >
                        <MenuItem defaultValue={true} value={"multi"}>
                          Multiple Choice
                        </MenuItem>
                        <MenuItem defaultValue={false} value={"truefalse"}>
                          True or False
                        </MenuItem>
                        <MenuItem defaultValue={false} value={"fillInBlank"}>
                          Fill in Blank
                        </MenuItem>
                        <MenuItem
                          disabled
                          defaultValue={false}
                          value={"matching"}
                        >
                          Matching
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  {choices.map((res, index) => {
                    return (
                      <Box sx={{ mt: 1, display: "flex" }}>
                        <Radio
                          checked={selectedValue == index}
                          onChange={updateFieldChangedAnswer(index)}
                          value={index}
                          name="radio-buttons"
                          inputProps={{ "aria-label": `${index}` }}
                        />
                        <TextField
                          size="small"
                          value={res}
                          onChange={updateFieldChanged(index)}
                        />
                        {type != "truefalse" && (
                          <IconButton
                            sx={{ alignSelf: "center", ml: 1 }}
                            onClick={() => {
                              setChoices(
                                choices.filter((r) => {
                                  return r != res;
                                })
                              );
                            }}
                          >
                            <DeleteIcon sx={{ color: "black" }} />
                          </IconButton>
                        )}
                      </Box>
                    );
                  })}

                  {type == "multi" && (
                    <Box sx={{ my: 1 }}>
                      <Chip
                        onClick={() => {
                          if (choices.length < 4) {
                            setChoices((choices) => [
                              ...choices,
                              `Choice ${choices.length + 1}`,
                            ]);
                          } else {
                            toast.info("Max is 4 multiple choice");
                          }
                        }}
                        clickable
                        disabled={choices.length < 4 ? false : true}
                        label="Add Choice"
                      />
                    </Box>
                  )}
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ my: 2 }}>
                <Chip
                  disabled={question && selectedValue ? false : true}
                  clickable
                  onClick={addQuestionHandler}
                  label="Add Question"
                />
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <SessionHistory set={set} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <Box>
                <Typography>Length per question?</Typography>
                <TextField size="small" value={30} />
              </Box>
            </TabPanel>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          backgroundColor: "rgb(255,255,255,0.8)",
          width: "100%",
          boxShadow: 10,
          zIndex: 10,
          p: 2,
          px: 10,
        }}
      >
        <Button
          sx={{ mx: 1 }}
          variant="outlined"
          onClick={() => {
            router.back();
          }}
        >
          Cancel{" "}
        </Button>
        <Button variant="contained" onClick={editSetHandler}>
          Save Set
        </Button>
      </Box>
    </Box>
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
