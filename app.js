import OpenAI from "openai";
import dotenv from 'dotenv';
import prompt from 'prompt';
import * as agentFunctions from "./agent-functions.js"

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


const callAgentFunction = (functionName, functionParameters, toolCallID) => {
  console.log(`callAgentFunction on: ${functionName} with parameters: ${JSON.stringify(functionParameters)}`);
  agentFunctions.toolsSchema.filter(f => f.function.name == functionName).forEach((fn) => {
    console.log(`Calling found function: ${JSON.stringify(fn["function"]["name"])}`);
    const functionResponse = agentFunctions[functionName](...Object.values(functionParameters));
    addToMessageLog(
      {
        role: 'tool',
        content: functionResponse,
        tool_call_id: toolCallID
      });
  })
}

const runPrompt = async () => {

  // First request
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: messagesLog,
    tools: agentFunctions.toolsSchema,
  });
  const responseMessage = completion["choices"][0]["message"];
  console.log('Response message:\n' + JSON.stringify(responseMessage, null, 2));
  addToMessageLog(responseMessage);

  // If any function was called in the response
  if (responseMessage.tool_calls) {

    // Get tool call values
    const toolCall = responseMessage["tool_calls"][0];
    console.log("Tool call:\n" + JSON.stringify(toolCall, null, 2));

    //Get tool call ID
    //Used in tool call response
    const toolCallID = toolCall["id"];

    // Extract function name and arguments
    const toolCallName = toolCall["function"]["name"];
    const toolCallArgs = JSON.parse(toolCall["function"]["arguments"]);
    console.log("Function name: " + JSON.stringify(toolCallName, null, 2));
    console.log("Arguments: " + JSON.stringify(toolCallArgs, null, 2));

    callAgentFunction(toolCallName, toolCallArgs, toolCallID);    

    const completion2 = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: false,
      messages: messagesLog,
      tools: agentFunctions.toolsSchema,
    });
    const responseMessage2 = completion2["choices"][0]["message"];
    console.log(responseMessage2);
  } else {
    console.log("No function call made.");
  }


}

function main(){
  getUserInput();
}

function getUserInput(){
// Define function for user prompt
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
}

main()
  


