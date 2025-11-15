import React from 'react';
import Icon from 'components/AppIcon';

const QuestionCard = ({
  question,
  currentAnswer,
  otherText,
  onAnswerChange,
  onOtherTextChange,
  isLoading
}) => {
  if (!question) return null;

  return (
    <div className="wellness-card p-8 mb-6 wellness-transition">
      <div className="flex items-start mb-6">
        <div className="flex-shrink-0 mr-4">
          <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center">
            <Icon 
              name={question.icon} 
              size={24} 
              color="var(--color-primary)" 
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-primary mb-2">
            {question.category}
          </div>
          <h2 className="text-xl font-semibold text-text-primary leading-relaxed">
            {question.question}
          </h2>
        </div>
      </div>

      {/* Numeric Answer Input */}
      <div className="mt-4">
        <label className="block text-sm text-text-secondary mb-2">
          {question.unit ? `Enter your ${question.label} (${question.unit})` : `Enter your ${question.label}`}
        </label>
        <input
          type="number"
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={`Enter ${question.label}`}
          className="w-full p-3 border border-secondary-200 rounded-wellness focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none wellness-transition"
          disabled={isLoading}
        />
      </div>

      {isLoading && (
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center text-sm text-text-secondary">
            <div className="animate-spin mr-2">
              <Icon name="Loader2" size={16} />
            </div>
            Saving your response...
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
