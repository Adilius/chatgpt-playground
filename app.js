import OpenAI from "openai";
import dotenv from 'dotenv';
import prompt from 'prompt';

dotenv.config();
prompt.start();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

prompt.get({
  properties: {
    prompt: {
      description: "DotaGPT prompt",
      type: 'string'
    }
  }
}, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }
  var userPrompt = result.prompt;
  main(userPrompt);
});

async function main(userPrompt) {
  try {
    const completion = await openai.chat.completions.create({
      messages: [
      { "role": "user", "content": userPrompt }
      ],
      model: "gpt-4o-mini",
    });

    console.log(completion.choices[0]);
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
  }
}