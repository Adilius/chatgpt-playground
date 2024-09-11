// Get hero data
import heroData from "./hero-data.js";

// Contains schema for every tool sent to ChatGPT
const toolsSchema = [
    {
      type: "function",
      function: {
        name: "getHeroDataByID",
        description: "Access the hero data describing by hero ID.",
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
    },
    {
        type: "function",
        function: {
          name: "getHeroDataByName",
          description: "Access the hero data describing by hero localized name.",
          parameters: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The hero localized name"
              }
            }
          },
          required: ["name"],
          additionalProperties: false,
        }
      }
  ]

  // Define function to get hero data
const getHeroDataByID = (id) => {
    console.log("\x1b[90m", 'In background: Agent retrives hero data by id with parameter ' + id + ".\x1b[37m");
    const hero = heroData.find(hero => hero.id == id);
    return JSON.stringify(hero);
  }

const getHeroDataByName = (name) => {
    console.log("\x1b[90m", 'In background: Agent retrives hero data by name with parameter ' + name + ".\x1b[37m");
    const hero = heroData.find(hero => hero.localized_name.toLocaleLowerCase() == name.toLocaleLowerCase());
    return JSON.stringify(hero);
  }

  export {toolsSchema, getHeroDataByID, getHeroDataByName};