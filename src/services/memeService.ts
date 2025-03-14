
import { toast } from "sonner";

// Sample meme templates - in a production app, you would fetch these from an API
const memeTemplates = [
  {
    id: "drake",
    url: "https://i.imgflip.com/30b1gx.jpg",
    name: "Drake Hotline Bling",
    box_count: 2,
  },
  {
    id: "distracted",
    url: "https://i.imgflip.com/1ur9b0.jpg",
    name: "Distracted Boyfriend",
    box_count: 3,
  },
  {
    id: "buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    name: "Two Buttons",
    box_count: 3,
  },
  {
    id: "change-mind",
    url: "https://i.imgflip.com/24y43o.jpg",
    name: "Change My Mind",
    box_count: 2,
  },
  {
    id: "buff-doge",
    url: "https://i.imgflip.com/43a45p.png",
    name: "Buff Doge vs. Cheems",
    box_count: 4,
  },
  {
    id: "wait-always-has-been",
    url: "https://i.imgflip.com/3lmzyx.jpg",
    name: "Always Has Been",
    box_count: 2,
  },
  {
    id: "surprised-pikachu",
    url: "https://i.imgflip.com/2kbn1e.jpg",
    name: "Surprised Pikachu",
    box_count: 1,
  },
  {
    id: "woman-yelling",
    url: "https://i.imgflip.com/345v97.jpg",
    name: "Woman Yelling At Cat",
    box_count: 2,
  }
];

// In a full implementation, this function would analyze the prompt and select an appropriate template
export const selectMemeTemplate = (prompt: string) => {
  // For now, just randomly select a template
  const randomIndex = Math.floor(Math.random() * memeTemplates.length);
  return memeTemplates[randomIndex];
};

// In a full implementation, this would call an AI service to generate or select a meme
export const generateMeme = async (prompt: string): Promise<string> => {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Select a template based on the prompt
    const template = selectMemeTemplate(prompt);
    
    // Return the template URL (in a real implementation, this would be the generated meme)
    return template.url;
  } catch (error) {
    console.error("Error generating meme:", error);
    toast.error("Failed to generate meme. Please try again.");
    throw error;
  }
};
