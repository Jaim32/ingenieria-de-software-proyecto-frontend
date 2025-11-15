// src/utils/openaiService.js
import openai from './openaiClient';

/**
 * Generates a chat completion response based on user input.
 * @param {Array} messages - Array of conversation messages
 * @returns {Promise<string>} The assistant's response.
 */
export async function getChatCompletion(messages) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful AI wellness assistant. Provide supportive, encouraging, and informative responses about health, wellness, mental health, nutrition, fitness, and general well-being. Keep responses concise but comprehensive. Always encourage users to consult healthcare professionals for serious medical concerns.' 
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw new Error('Lo siento, hubo un problema al procesar tu consulta. Por favor, intenta de nuevo.');
  }
}

/**
 * Streams a chat completion response chunk by chunk.
 * @param {Array} messages - Array of conversation messages
 * @param {Function} onChunk - Callback to handle each streamed chunk.
 */
export async function getStreamingChatCompletion(messages, onChunk) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful AI wellness assistant. Provide supportive, encouraging, and informative responses about health, wellness, mental health, nutrition, fitness, and general well-being. Keep responses concise but comprehensive. Always encourage users to consult healthcare professionals for serious medical concerns.' 
        },
        ...messages
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 300,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
  } catch (error) {
    console.error('Error in streaming chat completion:', error);
    throw new Error('Lo siento, hubo un problema al procesar tu consulta. Por favor, intenta de nuevo.');
  }
}