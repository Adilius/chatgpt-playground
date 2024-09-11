let heroData = {
    "id": 1,
    "name": "npc_dota_hero_antimage",
    "localized_name": "Anti-Mage",
    "primary_attr": "agi",
    "attack_type": "Melee",
    "roles": [
        "Carry",
        "Escape",
        "Nuker"
    ],
    "legs": 2
}

const tools = [
    {
        "name": "getHeroData",
        "description": "Access the hero data describing the hero.",
        "parameters": {
            "type": "object",
            "properties": {
                "id": {
                    "type": "string",
                    "description": "The hero id"
                }
            },
            "reason": {
                "type": "string",
                "description": "The motivation and reason behind calling this function"
            }
        },
        "required": ["id", "reason"],
        "additionalProperties": false,
    }
]

const getHeroData = (id, reason) => {
    console.log("\x1b[90m", 'In background: Agent retrives hero data.');
    logReasoning(reason);
    if(heroData.id === id){
        return JSON.stringify(heroData);
    }
    return null;
}

const logReasoning = (reason) => {
    console.log("\x1b[90m", 'Reason:', reason);
}

export { tools, getHeroData };