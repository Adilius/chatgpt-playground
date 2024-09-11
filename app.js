import OpenAI from "openai";
import dotenv from 'dotenv';
import prompt from 'prompt';
import { toolsSchema, getHeroDataByID, getHeroDataByName}  from "./agent-functions.js"

dotenv.config();
prompt.start();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Contains the messages to be sent to Chatgpt
let messagesLog = [
  {
    role: "system",
    content: `You are a helpful assistant answering questions for Dota 2 heroes.
        Imagine you are in the universe of Dota, and the users are the heroes from Dota.
        The user has stored data on the server, the user might ask to get that data or change the data.`
  }
]

// Adds messages to the end of message log
const addToMessageLog = (messageObject) => {
  messagesLog.push(messageObject);
}

const runPrompt = async () => {

  // First request
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: messagesLog,
    tools: toolsSchema,
  });
  const responseMessage = completion["choices"][0]["message"];
  console.log('Response message:\n' + JSON.stringify(responseMessage, null, 2));
  addToMessageLog(responseMessage);

  // If any function was called in the response
  if (responseMessage.tool_calls) {

    // Get tool call
    const toolCall = responseMessage["tool_calls"][0];
    console.log("Tool call:\n" + JSON.stringify(toolCall, null, 2));

    // Extract function name and arguments
    const toolCallName = toolCall["function"]["name"];
    const toolCallArgs = JSON.parse(toolCall["function"]["arguments"]);
    console.log("Function name: " + JSON.stringify(toolCallName, null, 2));
    console.log("Arguments: " + JSON.stringify(toolCallArgs, null, 2));

    let functionResult;
    if(toolCallName=="getHeroDataByID"){
      functionResult = getHeroDataByID(toolCallArgs["id"]);
    }else if(toolCallName=="getHeroDataByName"){
      functionResult = getHeroDataByName(toolCallArgs["name"]);
    }else{
      console.log("unexpected")
    }

    addToMessageLog(
      {
        role: 'tool',
        content: functionResult,
        tool_call_id: toolCall["id"]
      });

    const completion2 = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: false,
      messages: messagesLog,
      tools: toolsSchema,
    });
    const responseMessage2 = completion2["choices"][0]["message"];
    console.log(responseMessage2);
  }


}

const callFunction = (functionCall) =>{

  // Extract function name
  const functionName = functionCall.name;
  console.log(`Function name: ${functionName}`);

  // Go through tools schema to find a function name that matches
  toolsSchema.filter(
    func => func.name == functionName).forEach((fn) => {
      const fnArgs = JSON.parse(functionCall.arguments);
      const fnResponse = fn.name(...Object.values(fnArgs));
      addToMessageLog(
        {
          role: 'tool',
          content: fnResponse,
          tool_call_id: toolCall["id"]
        });
    })
}


//console.log(toolsSchema);

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

