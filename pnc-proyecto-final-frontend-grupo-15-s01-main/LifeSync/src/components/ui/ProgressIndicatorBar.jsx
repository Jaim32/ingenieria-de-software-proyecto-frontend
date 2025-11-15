import React from 'react';

const ProgressIndicatorBar = ({ 
  currentStep = 1, 
  totalSteps = 10, 
  showNumbers = true, 
  showPercentage = true,
  className = "" 
}) => {
  const progressPercentage = Math.min((currentStep / totalSteps) * 100, 100);
  const isComplete = currentStep >= totalSteps;

  return (
    <div className={`w-full bg-surface rounded-wellness p-4 shadow-wellness ${className}`}>
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-3">
        {showNumbers && (
          <div className="flex items-center space-x-2">
            <span className="font-mono text-sm text-text-secondary">
              Question
            </span>
            <span className="font-mono text-lg font-medium text-primary">
              {currentStep}
            </span>
            <span className="font-mono text-sm text-text-secondary">
              of {totalSteps}
            </span>
          </div>
        )}
        
        {showPercentage && (
          <div className="text-sm font-medium text-text-secondary">
            {Math.round(progressPercentage)}% Complete
          </div>
        )}
      </div>

      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Track */}
        <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <div 
            className={`h-full transition-all duration-300 ease-out rounded-full ${
              isComplete 
                ? 'bg-success' :'bg-gradient-to-r from-primary to-accent'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Markers */}
        <div className="absolute top-0 left-0 w-full h-2 flex justify-between items-center">
          {Array.from({ length: totalSteps }, (_, index) => {
            const stepNumber = index + 1;
            const isCurrentStep = stepNumber === currentStep;
            const isCompletedStep = stepNumber < currentStep;
            const isFutureStep = stepNumber > currentStep;

            return (
              <div
                key={stepNumber}
                className={`w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                  isCurrentStep
                    ? 'bg-primary border-primary scale-125 shadow-lg'
                    : isCompletedStep
                    ? 'bg-success border-success' :'bg-surface border-secondary-200'
                } ${isCurrentStep ? 'animate-pulse' : ''}`}
                style={{
                  marginLeft: index === 0 ? '0' : '-6px',
                  marginRight: index === totalSteps - 1 ? '0' : '-6px'
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Progress Text */}
      <div className="mt-3 text-center">
        <p className="text-sm text-text-secondary">
          {isComplete ? (
            <span className="text-success font-medium">Assessment Complete!</span>
          ) : (
            <>
              <span className="font-medium text-text-primary">
                {totalSteps - currentStep}
              </span>
              {' '}
              {totalSteps - currentStep === 1 ? 'question' : 'questions'} remaining
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicatorBar;