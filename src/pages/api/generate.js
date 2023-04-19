import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  const user_input = req.body.response;
  const user_id = req.body.userID;
  console.log(user_id, req.body.response);

  try {
    const response = await openai
      .createCompletion({
        model: "text-davinci-002",
        prompt: `Bullet point 5 advaced questions from this lecture:\n${user_input}\n-`,
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

    console.log(response.data.choices[0].text);
    res.status(200).json({ result: response.data.choices[0].text });
  } catch (err) {
    res.status(500).json({ error: "failed to load data!" });
  }
}

// Answer the following in a super short summary for the user to answer on their own in bullet points

// What can strategic leaders do to develop and sustain an effective organizational culture? What actions can a strategic leader take to establish and maintain ethical practices within a firm?

// Here are 3 short bullet points:

// -Strategic leaders can develop and sustain an effective organizational culture by establishing clear goals and expectations, communicating regularly, and modeling desired behav

//  prompt: `Answer the following in a super short summary for the user to answer on their own in bullet points\n${user_input}\nHere are 1 short bullet points:\n`,
