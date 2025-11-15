import React from 'react';
import Icon from 'components/AppIcon';

const NavigationControls = ({
  currentQuestion,
  totalQuestions,
  isAnswered,
  isLastQuestion,
  isLoading,
  onPrevious,
  onNext,
  nextButtonText = 'Next Question'
}) => {
    return (
      <div className="mt-6 flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={currentQuestion === 1 || isLoading}
        className="btn-neutral"
      >
        <Icon 
          name="ChevronLeft" 
          size={18} 
          className="mr-2" 
        />
        Previous
      </button>

      {/* Question Counter */}
      <div className="text-sm text-text-secondary font-medium">
        Question {currentQuestion} of {totalQuestions}
      </div>

      {/* Next/Complete Button */}
      <button
        onClick={onNext}
        disabled={!isAnswered || isLoading}
        className="btn-primary"
      >
        {isLoading ? (
          <>
            <div className="animate-spin mr-2">
              <Icon name="Loader2" size={18} />
            </div>
            Saving...
          </>
        ) : (
          <>
            {nextButtonText}
            <Icon 
              name={isLastQuestion ? "ArrowRight" : "ChevronRight"} 
              size={18} 
              className="ml-2" 
            />
          </>
        )}
      </button>
    </div>
  );
};

export default NavigationControls;