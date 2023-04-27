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
  Modal,
} from "@mui/material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { media } from "../../../mock/images";
import { motion } from "framer-motion";
import { createSet } from "@/utils/api";
import DeleteIcon from "@mui/icons-material/Delete";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";

import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

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

export default function Quiz({ data }) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [set, setSet] = useState({
    name: "",
    description: "",
    user_id: data?.user.id,
    photo: "",
    questions: [],
  });
  const [type, setType] = useState("multi");
  const [questions, setQuestions] = useState([]);
  const [choices, setChoices] = useState([]);
  const [question, setQuestion] = useState("");
  const [selectedValue, setSelectedValue] = useState();
  const [value, setValue] = useState(0);
  const [generatedQuestion, setGeneratedQuestion] = useState([]);

  const [imageIndex, setImageIndex] = useState(0);
  const [open, setOpen] = useState(false);
  console.log(generatedQuestion);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  function createSetHandler() {
    console.log(set);
    createSet(set)
      .then((res) => {
        console.log("SET CREATED");
        console.log(res);
        router.push("/dashboard");
      })
      .catch((e) => {
        toast.error("Set is not finished!");
      });
  }

  useEffect(() => {
    console.log("IMAGED CHANGED");
    setSet({ ...set, photo: media[imageIndex]?.photo });
  }, [imageIndex]);

  const updateFieldChanged = (index) => (e) => {
    console.log("index: " + index);
    console.log("property value: " + e.target.value);
    let newArr = [...choices]; // copying the old datas array
    // a deep copy is not needed as we are overriding the whole object below, and not setting a property of it. this does not mutate the state.
    newArr[index] = e.target.value.toLowerCase(); // replace e.target.value with whatever you want to change it to
    setChoices(newArr);
  };

  function addGeneratedQuestionHandler(question, index) {
    delete generatedQuestion[index];
    console.log(question);
    setQuestion(question);
    setOpen(false);
  }

  const updateFieldChangedAnswer = (index) => (e) => {
    console.log("index: " + index);
    setSelectedValue(e.target.value);
    console.log("property isAnswer: " + e.target.value);
    console.log(choices);
  };
  function addQuestionHandler() {
    if (choices[selectedValue]) {
      const cur_question = {
        question,
        type,
        choices,
        answer: choices[selectedValue],
        index: questions.length,
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

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    const srcI = source.index;
    const desI = destination.index;

    questions.splice(desI, 0, questions.splice(srcI, 1)[0]);
    //TODO:
    console.log(result);

    // console.log(Object.keys(attachments));

    const updatedAttachments = questions.map((res, i) => {
      console.log(res, "Changing", res.index, "to", i);

      return (res.index = i);
    });

    console.log(questions);

    //orderResource(attachments);
  }
  function handleAutoGenerate() {
    setOpen(true);
  }
  async function generateMultipleChoiceHandler() {
    const response = await fetch(`/api/choices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: question,
        userID: `${data?.user.id}`,
      }),
    });
    const res = await response.json();
    const choicesParsed = res.result.split("\n");
    setChoices(choicesParsed);
    setSelectedValue(res.answer - 1);
    console.log(choicesParsed);
  }
  async function finishLectureHandler() {
    const response = await fetch(`/api/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        response: transcript,
        userID: `${data?.user.id}`,
      }),
    });
    resetTranscript();
    const res = await response.json();
    const questionParsed = res.result.split("\n-");
    setGeneratedQuestion(questionParsed);
    console.log(questionParsed);
  }
  return (
    <Box>
      <Header />
      <Box
        sx={{
          backgroundColor: "#F2F1F6",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ alignSelf: "center", p: width > 450 ? 5 : 1 }}>
          <Box
            sx={{
              width: width > 450 ? width - 200 : width - 100,
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
              Create a new Set
            </Typography>
            <Box sx={{ maxWidth: 300 }}>
              <Carousel
                index={imageIndex}
                onChange={(e) => {
                  setImageIndex(e);
                }}
                navButtonsAlwaysVisible={true}
                indicators={false}
                cycleNavigation={false}
                height={200}
                autoPlay={false}
              >
                {media.map((item, i) => (
                  <Box
                    key={i}
                    sx={{
                      justifyContent: "center",
                      alignItems: "center",
                      display: "flex",
                      height: "100%",
                    }}
                  >
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
                            src={item.photo}
                          />
                        </motion.div>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Carousel>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <TextField
                size="small"
                placeholder="Name"
                value={set.name}
                onChange={(e) => {
                  setSet({ ...set, name: e.target.value });
                }}
              />
              <TextField
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
                <Tab label="Settings" {...a11yProps(1)} />
              </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
              <Button
                onClick={handleAutoGenerate}
                sx={{ my: 2 }}
                variant="contained"
              >
                AI Generate
              </Button>
              <Box sx={{ my: 2 }}>
                <Typography>
                  Create questions to pop up during your discussion to make sure
                  your students are listening!
                </Typography>
              </Box>

              <Box sx={{ maxWidth: 600 }}>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable-1">
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{ minHeight: 50 }}
                      >
                        {questions.map((res, index) => (
                          <Draggable
                            key={index}
                            draggableId={"draggable-" + index}
                            index={index}
                          >
                            {(provided) => (
                              <Box
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
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
                                  <Typography>
                                    Question: {res.question}
                                  </Typography>
                                  <Typography>
                                    Correct Answer: {res.answer}
                                  </Typography>
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
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext>
              </Box>
              <Box>
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
                        <MenuItem defaultValue={false} value={"fillinblank"}>
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
                      <Chip
                        onClick={generateMultipleChoiceHandler}
                        clickable
                        sx={{ mx: 1 }}
                        disabled={choices.length < 4 ? false : true}
                        label="Generate"
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
              <Box>
                <Button variant="contained" onClick={createSetHandler}>
                  Create Set
                </Button>
              </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <Box sx={{ width: 700 }}>
                <Typography>Length per question?</Typography>
                <TextField fullWidth size="small" value={30} />
              </Box>
            </TabPanel>
          </Box>
        </Box>
      </Box>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          {generatedQuestion.length > 0 ? (
            <div>
              {generatedQuestion.map((res, index) => (
                <Box sx={{ display: "flex", my: 1 }}>
                  <TextField multiline fullWidth value={res} />
                  <Button
                    onClick={() => addGeneratedQuestionHandler(res, index)}
                    sx={{ mx: 1 }}
                    variant="contained"
                  >
                    Add
                  </Button>
                </Box>
              ))}
              <Button
                onClick={() => {
                  setGeneratedQuestion([]);
                }}
              >
                Generate New Questions
              </Button>
            </div>
          ) : (
            <div>
              <Typography>
                AI Generate your questions based off your lecture!
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={10}
                value={transcript}
                //onChange={(event) => setValue(event.target.value)}
              />
              {!listening ? (
                <Button
                  onClick={() =>
                    SpeechRecognition.startListening({ continuous: true })
                  }
                >
                  Start Lecutre 🎤
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    SpeechRecognition.stopListening();
                    finishLectureHandler();
                  }}
                >
                  End Lecutre
                </Button>
              )}
            </div>
          )}
        </Box>
      </Modal>
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
