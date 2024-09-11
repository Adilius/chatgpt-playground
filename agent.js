import OpenAI from "openai";
import dotenv from 'dotenv';
import * as agentFunctions from './agent-functions.js';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let messagesLog = [
    { "role": "system",
        "content": `You are a helpful assistant answering questions for Dota 2 heroes.
        Imagine you are in the universe of Dota, and the users are the heroes from Dota.
        The user has stored data on the server, the user might ask to get that data or change the data.` 
    },
    { "role": "system",
    "content": `Greet the user with their localized name. 
    Get their localized name using getLocalizedName().`
    },
    { "role": "user", "content": userPrompt

    }
  ]

const runPrompt = async () => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: false,
      messages: messagesLog,
      tools: agentFunctions.tools,  
    });

    const responseMessage = completion["choices"][0]["message"];
    addToMessageLog(responseMessage);
    console.log(responseMessage);

    if(responseMessage.tool_calls){

    }
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
  }
}

// Adds messages to the end of message log
const addToMessageLog = (messageObject) => {
  messagesLog.push(messageObject);
}