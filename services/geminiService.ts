import { GoogleGenAI, Type } from "@google/genai";
import { UserIdentity } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const RETRO_LOG_MODEL = 'gemini-3-flash-preview';
const MODERN_IDENTITY_MODEL = 'gemini-3-flash-preview';

// Curated fallbacks for when the API is busy or quota is exhausted
const FALLBACK_LOGS = [
  "OFFLOADING: Mental_Load_2025.dump",
  "COMPRESSING: Viral_Sneeze_Remix.mp4",
  "PURGING: Failed_Resolutions_List.txt",
  "SAVING: That_One_Good_Day_In_August.mem",
  "UNMOUNTING: Reality_Show_Obsession.drv",
  "ARCHIVING: The_Global_Glitch_Event",
  "DELETING: Procrastination_Protocols.exe",
  "SCANNING: 2025_Meme_Database.db",
  "ENCRYPTING: Late_Night_Thoughts.log",
  "BUFFERING: 2026_Hope_Module.pkg",
  "SYNCING: Nostalgia_Circuits_v25.0",
  "REFORMATTING: Social_Battery_Partition",
  "DETECTED: Cringe_Compilation_2025.zip"
];

const FALLBACK_IDENTITIES: UserIdentity[] = [
  { title: "Pilot of the Morning Star", mission: "To find beauty in chaos.", element: "Stardust" },
  { title: "Architect of Horizons", mission: "To build bridges where walls once stood.", element: "Glass" },
  { title: "Weaver of Light", mission: "To illuminate the shadows of the unknown.", element: "Neon" },
  { title: "Quantum Dreamer", mission: "To manifest the impossible into reality.", element: "Aether" },
  { title: "Digital Nomad", mission: "To traverse the boundaries of the new world.", element: "Data" },
  { title: "Echo of Tomorrow", mission: "To resonate with the frequency of change.", element: "Resonance" }
];

const getRandomFallback = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const generateRetroLog = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: RETRO_LOG_MODEL,
      contents: `Generate a single, short, witty, retro-terminal style system log entry about wrapping up the year 2025.
      
      Mix technical system commands (DELETE, ARCHIVE, UNMOUNT, PURGE, COMPRESS) with:
      1. Funny imaginary 2025 memes (e.g., 'Glow_Toad.gif', 'Hover_Fail_Compilation', 'Neural_Link_Pranks').
      2. Major fictional or realistic 2025 events (e.g., 'The_Great_WiFi_Crash', 'Mars_Water_Discovery', 'Skibidi_Legacy_Edition').
      3. Relatable human struggles of the year (e.g., 'Doomscrolling_hours', 'Unfinished_Projects', 'AI_Friend_Zone').

      Keep it cryptic, nostalgic, or funny.
      
      Examples:
      - 'OFFLOADING: Mental_Load_2025.dump'
      - 'COMPRESSING: Viral_Sneeze_Remix.mp4'
      - 'PURGING: Failed_Resolutions_List.txt'
      - 'SAVING: That_One_Good_Day_In_August.mem'
      - 'UNMOUNTING: Reality_Show_Obsession.drv'
      - 'ARCHIVING: The_Global_Glitch_Event'
      
      Strictly no timestamps. Just the message.`,
    });
    return response.text?.trim() || getRandomFallback(FALLBACK_LOGS);
  } catch (error: any) {
    // Gracefully handle quota exhaustion without spamming console
    const errorMsg = error?.message || error?.toString() || '';
    if (!errorMsg.includes('429') && !errorMsg.includes('quota')) {
       console.error("Gemini Retro Log Error:", error);
    }
    return getRandomFallback(FALLBACK_LOGS);
  }
};

export const generateUserIdentity = async (): Promise<UserIdentity> => {
  try {
    const response = await ai.models.generateContent({
      model: MODERN_IDENTITY_MODEL,
      contents: "Generate a mystical, futuristic, and inspiring user identity for the year 2026. Return valid JSON only.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
              description: "A cool futuristic title, e.g., 'Pilot of the Morning Star', 'Architect of Dreams', 'Void Walker'.",
            },
            mission: {
              type: Type.STRING,
              description: "A short, poetic mission statement for the new year, e.g., 'To find beauty in chaos.', 'To build bridges where walls once stood'.",
            },
            element: {
              type: Type.STRING,
              description: "A visual element or theme, e.g., 'Neon', 'Glass', 'Stardust'.",
            }
          },
          required: ["title", "mission"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as UserIdentity;
  } catch (error: any) {
    const errorMsg = error?.message || error?.toString() || '';
    if (!errorMsg.includes('429') && !errorMsg.includes('quota')) {
      console.error("Gemini Identity Error:", error);
    }
    return getRandomFallback(FALLBACK_IDENTITIES);
  }
};