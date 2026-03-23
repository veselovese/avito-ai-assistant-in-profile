import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

const callOllama = async (prompt: string) => {
  try {
    const response = await axios.post(OLLAMA_URL, {
      model: 'llama3', 
      prompt,
      stream: false, 
    });
    
    return response.data.response; 
  } catch (error) {
    console.error('Ollama API Error:', error);
    throw error;
  }
};

export const generateDescription = async (prompt: string) => {
  return await callOllama(prompt);
};

export const suggestPrice = async (prompt: string) => {
  return await callOllama(prompt);
};