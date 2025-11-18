
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Persona, GameEvent, Item, FactCheckState, WikipediaResult, LogEntry, GameSummary } from "../types";

// Initialize the Gemini API client
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper constant for model selection
export const MODELS = {
  NARRATOR: 'gemini-2.5-flash', 
  DIRECTOR: 'gemini-3-pro-preview',
  VISION: 'gemini-2.5-flash-image', 
  IMAGEN: 'imagen-4.0-generate-001', 
  FACT_CHECKER: 'gemini-2.5-flash',
  CRITIC: 'gemini-3-pro-preview'
};

// ... (Existing functions: generateDialogueResponse, generateRumor, etc.) ...

export const generateDialogueResponse = async (
    persona: Persona, 
    playerText: string, 
    tone: string,
    context: string
): Promise<string> => {
    const prompt = `
    Roleplay Context: ${persona.voicePrompt}
    Current Situation: ${context}
    
    Henry James (Player) says to you with a ${tone} tone: "${playerText}"
    
    Reply as ${persona.name}. Keep it brief (under 50 words), in character, and reactive to the tone.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
        });
        return response.text || "...";
    } catch (e) {
        return "The noise of the fair drowns out their response.";
    }
};

export const generateRumor = async (zoneName: string): Promise<string> => {
    const prompt = `Generate a single sentence of 19th-century gossip or rumor relevant to the 1889 Paris World's Fair, specifically regarding ${zoneName}. It can be true or scandalous fiction.`;
    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
        });
        return response.text || "You hear nothing but static.";
    } catch (e) {
        return "Indistinct chatter.";
    }
};

export const generateStrayThought = async (zoneName: string, recentEvents: string): Promise<string> => {
    const prompt = `
    You are Henry James's internal monologue.
    Location: ${zoneName}.
    Recent Context: ${recentEvents}.
    
    Generate a single, fragmentary "Stream of Consciousness" thought.
    Style: Impressionistic, sensory, slightly anxious or critical, very brief (under 15 words).
    Use Present Tense.
    
    Examples:
    "The vulgarity of the iron..."
    "A face in the crowd, reminding me of Alice..."
    "Too much noise, simply too much..."
    `;
    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
            config: { temperature: 1.2 }
        });
        return response.text || "The crowd overwhelms...";
    } catch (e) {
        return "Thoughts scatter...";
    }
};

export const generateNarratorResponse = async (
    history: {role: string, text: string}[], 
    userMessage: string,
    gameStateContext: string
): Promise<string> => {
    const prompt = `
    You are the Narrator/Dungeon Master for a text-based RPG where the player is Henry James at the 1889 Paris World's Fair.
    Game Context: ${gameStateContext}
    
    User Question: "${userMessage}"
    
    Answer the player directly in the **Second Person Present Tense** (e.g., "You see...", "You recall...").
    Be helpful, descriptive, slightly literary but functional. 
    If they ask what they see, describe the current zone. 
    If they ask about mechanics, explain them.
    Keep it under 60 words.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
        });
        return response.text || "I cannot discern that.";
    } catch (e) {
        return "The narrator is silent.";
    }
};

export const resolveCombatTurn = async (
    attacker: string,
    defender: string,
    moveName: string,
    zoneName: string,
    personaPrompt?: string
): Promise<string> => {
    const prompt = `
    Write a 1-sentence description of a social combat interaction at the 1889 Paris World's Fair (${zoneName}).
    Attacker: ${attacker}
    Defender: ${defender}
    Move Used: "${moveName}"
    
    ${personaPrompt ? `Defender Persona: ${personaPrompt}` : ''}
    
    Describe the witticism, insult, or look given, and the defender's reaction. 
    Style: Oscar Wilde meets Pokemon. Witty, stinging, dramatic.
    Use Present Tense.
    `;

    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
        });
        return response.text || `${attacker} uses ${moveName}. It is effective.`;
    } catch (e) {
        return `${attacker} attempts to speak, but falters.`;
    }
};

export const generateProceduralEvent = async (zoneName: string, context: string): Promise<GameEvent | null> => {
    const prompt = `
    Create a short narrative vignette/random encounter for a player (Henry James) exploring the ${zoneName} at the 1889 Paris World's Fair.
    Context: ${context}
    
    Provide a title, a description (2-3 sentences, literary style, **Second Person Present Tense** e.g. "You notice..."), and 3 distinct choices for the player.
    Each choice should have a logical outcome type.
    
    Choices should be interesting actions, not just "Leave".
    `;

    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            id: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            choices: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        outcomeType: { type: Type.STRING, enum: ['GAIN_ITEM', 'GAIN_RUMOR', 'CHANGE_STAT', 'NOTHING'] },
                        outcomeValue: { type: Type.STRING }
                    },
                    required: ['id', 'text', 'outcomeType']
                }
            }
        },
        required: ['id', 'title', 'description', 'choices']
    };

    try {
        const response = await ai.models.generateContent({
            model: MODELS.DIRECTOR, 
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        
        if (response.text) {
            return JSON.parse(response.text) as GameEvent;
        }
        return null;
    } catch (e) {
        console.error("Event Gen Error", e);
        return null;
    }
};

// Artifact Inspection
export const generateArtifactDescription = async (item: Item): Promise<string> => {
    const prompt = `
    Describe the following 1889 artifact in the style of Henry James: "${item.name}".
    Keep it under 60 words. Focus on texture, history, and sensory details.
    Use **Second Person Present Tense** ("You run your finger along...").
    `;
    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
        });
        return response.text || "A curious object.";
    } catch (e) {
        return "Details are obscured.";
    }
};

export const generateArtifactImage = async (item: Item): Promise<string | null> => {
    const prompt = `A photorealistic close-up studio shot of a Victorian ${item.name}, 1889, vintage photography style, detailed texture, isolated on black background.`;
    try {
        const response = await ai.models.generateImages({
            model: MODELS.IMAGEN,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '1:1',
                outputMimeType: 'image/jpeg'
            },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    } catch (e) {
        return null;
    }
};

// --- Educational Layer ---

export const generateIntro = async (zoneName: string): Promise<string> => {
    const prompt = `
    Write an 'In Media Res' opening paragraph for a novel starring Henry James at the 1889 Paris World's Fair.
    Setting: ${zoneName}.
    Style: Literary, Jamesian, detailed, sensory.
    **Perspective: Second Person Present Tense** ("You stand before the tower...", "The crowd jostles you...").
    The player has just arrived. What do they see/smell/hear?
    Max 80 words.
    `;
    try {
        const response = await ai.models.generateContent({
            model: MODELS.NARRATOR,
            contents: prompt,
        });
        return response.text || "Paris, 1889. The world has gathered here.";
    } catch (e) {
        return "The fairgrounds stretch out before you.";
    }
};

export const generateFactCheck = async (gameEventText: string, wikiContext?: WikipediaResult): Promise<{score: number, analysis: string}> => {
    const prompt = `
    You are a strict 19th-century historian. 
    Analyze the historical veracity of this game event: "${gameEventText}".
    ${wikiContext ? `Reference Material: ${wikiContext.extract}` : ''}
    
    Return a JSON with:
    - score (0-100, 100 is perfectly accurate)
    - analysis (One witty sentence explaining why it is true or anachronistic).
    `;
    
    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.NUMBER },
            analysis: { type: Type.STRING }
        },
        required: ['score', 'analysis']
    };

    try {
        const response = await ai.models.generateContent({
            model: MODELS.FACT_CHECKER,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        if (response.text) {
            return JSON.parse(response.text);
        }
        return { score: 50, analysis: "Historical records are unclear." };
    } catch (e) {
        return { score: 0, analysis: "Error consulting the archives." };
    }
};

// --- Phase 9: The Critic ---

export const generateEndGameReview = async (
    logs: LogEntry[], 
    inventory: Item[], 
    stats: any
): Promise<GameSummary | null> => {
    // Compress logs to save context window
    const logSummary = logs.filter(l => l.source !== 'SYSTEM').slice(-20).map(l => l.text).join("\n");
    
    const prompt = `
    You are a sharp-tongued, sarcastic 19th-century literary critic (like a meaner Oscar Wilde or H.L. Mencken).
    Review the "performance" of Henry James (the player) at the 1889 World's Fair.
    
    Player Stats: ${JSON.stringify(stats)}
    Inventory: ${inventory.map(i => i.name).join(', ')}
    Recent Events:
    ${logSummary}
    
    Output a JSON with:
    1. review: A 2-paragraph scathing or praising review of their journey.
    2. score: Object with 'subtlety', 'verbosity', 'socialStanding', and 'total' (0-100).
    3. titleAwarded: A short, witty title for the player (e.g. "The Master of Mumbling", "The Tourist").
    `;

    const schema: Schema = {
        type: Type.OBJECT,
        properties: {
            review: { type: Type.STRING },
            titleAwarded: { type: Type.STRING },
            score: {
                type: Type.OBJECT,
                properties: {
                    subtlety: { type: Type.NUMBER },
                    verbosity: { type: Type.NUMBER },
                    socialStanding: { type: Type.NUMBER },
                    total: { type: Type.NUMBER }
                },
                required: ['subtlety', 'verbosity', 'socialStanding', 'total']
            }
        },
        required: ['review', 'score', 'titleAwarded']
    };

    try {
        const response = await ai.models.generateContent({
            model: MODELS.CRITIC,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: schema
            }
        });
        if (response.text) {
            return JSON.parse(response.text) as GameSummary;
        }
        return null;
    } catch (e) {
        console.error("Critic Error", e);
        return null;
    }
};
