// src/pages/ai-wellness-chat/index.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { getStreamingChatCompletion } from '../../utils/openaiService';

const AIWellnessChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente de bienestar con IA. Estoy aquí para ayudarte con consultas sobre salud, bienestar, nutrición, ejercicio y más. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamingMessage, setCurrentStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);
  const conversationHistory = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamingMessage]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add to conversation history for OpenAI
    conversationHistory.current.push({ role: 'user', content: message });
    
    setIsTyping(true);
    setCurrentStreamingMessage('');

    try {
      let aiResponse = '';
      
      await getStreamingChatCompletion(
        conversationHistory.current,
        (chunk) => {
          aiResponse += chunk;
          setCurrentStreamingMessage(aiResponse);
        }
      );

      // Add complete AI response to messages
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Add to conversation history
      conversationHistory.current.push({ role: 'assistant', content: aiResponse });
      
      // Keep conversation history manageable (last 10 exchanges)
      if (conversationHistory.current.length > 20) {
        conversationHistory.current = conversationHistory.current.slice(-20);
      }
      
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Lo siento, hubo un problema al procesar tu consulta. Por favor, intenta de nuevo.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setCurrentStreamingMessage('');
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        content: '¡Hola! Soy tu asistente de bienestar con IA. Estoy aquí para ayudarte con consultas sobre salud, bienestar, nutrición, ejercicio y más. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }
    ]);
    conversationHistory.current = [];
    setCurrentStreamingMessage('');
  };

  const suggestedQuestions = [
    '¿Cómo puedo mejorar mi rutina de sueño?',
    '¿Qué ejercicios recomiendas para principiantes?',
    '¿Cómo manejar el estrés diario?',
    '¿Qué alimentos son mejores para tener energía?'
  ];

  return (
     <div className="theme-questions theme-ai-wellness-chat min-h-screen bg-questions-gradient flex justify-center pt-8 px-6">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="wellness-card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mr-4">
                <Icon name="Bot" size={24} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">
                  Asistente de Bienestar IA
                </h1>
                <p className="text-text-secondary">
                  Consulta sobre salud, nutrición, ejercicio y bienestar
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleClearChat}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-wellness wellness-transition"
                title="Limpiar conversación"
              >
                <Icon name="RotateCcw" size={20} />
              </button>
              <button
                onClick={() => navigate(-1)}
                className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-wellness wellness-transition"
                title="Volver"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="wellness-card flex flex-col h-[75vh]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-wellness">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {/* Streaming Message */}
            {isTyping && currentStreamingMessage && (
              <ChatMessage 
                message={{
                  id: 'streaming',
                  type: 'ai',
                  content: currentStreamingMessage,
                  timestamp: new Date(),
                  isStreaming: true
                }} 
              />
            )}
            
            {/* Typing Indicator */}
            {isTyping && !currentStreamingMessage && (
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Bot" size={16} color="var(--color-primary)" />
                </div>
                <div className="bg-secondary-100 rounded-wellness p-3 max-w-xs">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-secondary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          {messages.length <= 1 && (
            <div className="px-6 pb-4">
              <p className="text-sm text-text-secondary mb-3">Preguntas sugeridas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleSendMessage(question)}
                    className="px-3 py-2 text-sm bg-primary-50 text-primary rounded-wellness hover:bg-primary-100 wellness-transition"
                    disabled={isTyping}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="border-t border-secondary-200 p-6">
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={isTyping}
              placeholder="Escribe tu consulta sobre bienestar..."
            />
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            <Icon name="Info" size={14} className="inline mr-1" />
            Este asistente proporciona información general. Para problemas médicos serios, consulta a un profesional de la salud.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIWellnessChat;