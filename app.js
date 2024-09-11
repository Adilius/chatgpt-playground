import OpenAI from "openai";
import dotenv from 'dotenv';
import prompt from 'prompt';
import heroData from "./hero-data.js";

dotenv.config();
prompt.start();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Contains functions definitions
const tools = [
  {
    type: "function",
    function: {
      name: "getHeroData",
      description: "Access the hero data describing the hero.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The hero id"
          }
        }
      },
      required: ["id"],
      additionalProperties: false,
    }
  }

]

// Contains the messages to be sent to Chatgpt
let messagesLog = [
  {
    role: "system",
    content: `You are a helpful assistant answering questions for Dota 2 heroes.
        Imagine you are in the universe of Dota, and the users are the heroes from Dota.
        The user has stored data on the server, the user might ask to get that data or change the data.`
  },
  {
    role: "system",
    content: `Greet the user with their localized name. 
    Get their localized name using getLocalizedName().`
  },

]

// Adds messages to the end of message log
const addToMessageLog = (messageObject) => {
  messagesLog.push(messageObject);
}

// Define function to get hero data
const getHeroData = (id) => {
  console.log("\x1b[90m", 'In background: Agent retrives hero data for id: ' + id + ".\x1b[37m");
  const hero = heroData.find(hero => hero.id == id);
  return JSON.stringify(hero);
}

const logReasoning = (reason) => {
  console.log("\x1b[90m", 'Reason:', reason);
}


const runPrompt = async () => {

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: messagesLog,
    tools: tools,
  });
  const responseMessage = completion["choices"][0]["message"];
  console.log('Response message:\n' + JSON.stringify(responseMessage, null, 2));
  //console.log(responseMessage);
  addToMessageLog(responseMessage);




  if (responseMessage.tool_calls) {
    // Get tool call
    const toolCall = responseMessage["tool_calls"][0];
    //console.log("Tool call:\n" + JSON.stringify(toolCall, null, 2));

    // Get tool call function name and arguments
    const toolCallName = toolCall["function"]["name"];
    const toolCallArgs = JSON.parse(toolCall["function"]["arguments"]);
    console.log("Function name: " + JSON.stringify(toolCallName, null, 2));
    console.log("Arguments:\n" + JSON.stringify(toolCallArgs, null, 2));

    // Execute the function call
    const functionResult = getHeroData(toolCallArgs["id"]);

    addToMessageLog(
      {
        role: 'tool',
        content: functionResult,
        tool_call_id: toolCall["id"]
      });
    //console.log(funcName);
  }

  const completion2 = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: messagesLog,
    tools: tools,
  });
  const responseMessage2 = completion2["choices"][0]["message"];
  console.log(responseMessage2);
}



// Define function for user prompt
var userPrompt;
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
  var userPrompt = {
    role: 'user',
    content: result.prompt
  }
  addToMessageLog(userPrompt);
  runPrompt();
});

