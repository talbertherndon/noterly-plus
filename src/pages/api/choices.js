import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const user_input = req.body.response;
  const user_id = req.body.userID;
  console.log(req.body.response);
  try {
    const response = await openai
      .createCompletion({
        model: "text-davinci-002",
        prompt: `List 4 multiple choice for this question:\n${user_input}\n1.`,
        temperature: 0.5,
        max_tokens: 120,
        top_p: 1,
        frequency_penalty: 1,
        presence_penalty: 1.5,
        user: user_id,
      })
      .then((res) => {
        return res;
      });
    const correctPrompt = `multiple choice from this question:\n${user_input}\n1.${response.data.choices[0].text}\nWhat is the correct number from the choices?\n`;
    console.log(correctPrompt);
    const correct = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: correctPrompt,
        temperature: 0.5,
        max_tokens: 120,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: user_id,
      })
      .then((res) => {
        return res;
      });

    console.log(response.data.choices[0].text);
    console.log("CORRECT:", correct.data.choices[0].text.split("."));
    res.status(200).json({
      result: "1." + response.data.choices[0].text,
      answer: correct.data.choices[0].text.split(".")[0],
    });
  } catch (err) {
    res.status(500).json({ error: "failed to load data!" });
  }
}

// Answer the following in a super short summary for the user to answer on their own in bullet points

// What can strategic leaders do to develop and sustain an effective organizational culture? What actions can a strategic leader take to establish and maintain ethical practices within a firm?

// Here are 3 short bullet points:

// -Strategic leaders can develop and sustain an effective organizational culture by establishing clear goals and expectations, communicating regularly, and modeling desired behav

//  prompt: `Answer the following in a super short summary for the user to answer on their own in bullet points\n${user_input}\nHere are 1 short bullet points:\n`,
