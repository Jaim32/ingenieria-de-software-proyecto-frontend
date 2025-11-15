// src/pages/ai-wellness-chat/components/ChatInput.jsx
import React, { useState, useRef } from 'react';
import Icon from 'components/AppIcon';

const ChatInput = ({ onSendMessage, disabled, placeholder = "Escribe tu mensaje..." }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end space-x-3">
      <div className="flex-1">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={`
            w-full px-4 py-3 border border-secondary-200 rounded-wellness 
            focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none 
            resize-none wellness-transition scrollbar-wellness
            ${disabled ? 'bg-secondary-50 text-text-secondary cursor-not-allowed' : 'bg-surface'}
          `}
          style={{ minHeight: '48px', maxHeight: '120px' }}
        />
      </div>
      
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`
          p-3 rounded-wellness wellness-transition flex items-center justify-center
          ${!message.trim() || disabled
            ? 'bg-secondary-200 text-text-secondary cursor-not-allowed' :'bg-primary text-surface hover:bg-primary-600 shadow-wellness'
          }
        `}
        title="Enviar mensaje"
      >
        {disabled ? (
          <div className="animate-spin">
            <Icon name="Loader2" size={20} />
          </div>
        ) : (
          <Icon name="Send" size={20} />
        )}
      </button>
    </form>
  );
};

export default ChatInput;