// src/pages/ai-wellness-chat/components/ChatMessage.jsx
import React from 'react';
import Icon from 'components/AppIcon';
import { format } from 'date-fns';

const ChatMessage = ({ message }) => {
  const isUser = message.type === 'user';
  const isError = message.isError;
  const isStreaming = message.isStreaming;

  return (
    <div className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        ${isUser 
          ? 'bg-primary text-surface' 
          : isError 
            ? 'bg-danger-50' :'bg-primary-50'
        }
      `}>
        <Icon 
          name={isUser ? "User" : "Bot"} 
          size={16} 
          color={isUser ? "white" : isError ? "var(--color-danger)" : "var(--color-primary)"} 
        />
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-xs sm:max-w-md lg:max-w-lg ${
        isUser ? 'text-right' : 'text-left'
      }`}>
        <div className={`
          rounded-wellness p-3 wellness-transition
          ${isUser 
            ? 'bg-primary text-surface ml-auto' 
            : isError 
              ? 'bg-danger-50 text-danger-700 border border-danger-200' :'bg-secondary-100 text-text-primary'
          }
          ${isStreaming ? 'animate-pulse' : ''}
        `}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
          
          {isStreaming && (
            <div className="mt-2 flex items-center">
              <div className="w-1 h-4 bg-primary animate-pulse rounded-full"></div>
            </div>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={`
          mt-1 text-xs text-text-tertiary
          ${isUser ? 'text-right' : 'text-left'}
        `}>
          {format(message.timestamp, 'HH:mm')}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;