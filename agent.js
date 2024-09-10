import OpenAI from "openai";
import dotenv from 'dotenv';
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
    Get their localized name using getLocalizedName().`}
  ]