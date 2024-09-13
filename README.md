# Playground for ChatGPT
This is a little proof-of-concept for using ChatGPT API with their [function calling](https://platform.openai.com/docs/assistants/tools/function-calling) tool to retrive locally stored data and pass it to the user. The user prompts the question of getting [Dota 2](https://www.dota2.com/) hero data, if the user provides for example an hero ID then the function calling tool will respond with the function name `getHeroDataByID` and the parameter `id`, if the user instead provides a hero name then the function calling tool will respond with the function name `getHeroByName` and the parameter `name`. With both the function name and parameter we simply run a dynamic function call with the parameter and return the value as `{role: 'tool', content: ...` back to ChatGPT which creates a response that can be sent to the user.

## Install & Run
1. Create a `.env` with line `OPENAI_API_KEY=sk-.....`
2. Install depdencies: `npm install`
3. Run application: `node app.js`

## Demo
![chatgpt_playground](https://github.com/user-attachments/assets/6299202c-bf79-493b-b4a0-099e59ffc5f8)
