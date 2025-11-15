import React, { useState, useEffect } from 'react';
import { useNavigationState } from 'components/ui/NavigationStateManager';
import { useNavigate } from 'react-router-dom';
import ProgressIndicatorBar from 'components/ui/ProgressIndicatorBar';
import QuestionCard from './components/QuestionCard';
import Icon from 'components/AppIcon';

export default function QuestionFlowInterface() {
  const navigate = useNavigate();
  const {
    currentQuestion,   // 1-based
    totalQuestions,
    assessmentProgress,
    updateAssessmentProgress,
    nextQuestion,
    previousQuestion,
    setTotalQuestions,
    completeAssessment,
    getProgressPercentage,
  } = useNavigationState();

  /* ───────────── Preguntas ───────────── */
  const wellnessQuestions = [
    { id: 1, category: 'Edad',     icon: 'Calendar', question: '¿Cuál es tu edad?',          label: 'edad',         unit: 'años' },
    { id: 2, category: 'Peso',     icon: 'Weight',   question: '¿Cuál es tu peso actual?',   label: 'peso',         unit: 'kg'   },
    { id: 3, category: 'Altura',   icon: 'Ruler',    question: '¿Cuál es tu altura?',        label: 'altura',       unit: 'cm'   },
    { id: 4, category: 'Objetivo', icon: 'Target',   question: '¿Cuál es tu peso objetivo?', label: 'objetivoPeso', unit: 'kg'   },
  ];

  const currentData = wellnessQuestions[currentQuestion - 1];        // 1-based → 0-based
  const isLast      = currentQuestion === wellnessQuestions.length;

  const [currentAnswer, setCurrentAnswer] = useState('');
  const [otherText,    setOtherText]      = useState('');
  const [isLoading,    setIsLoading]      = useState(false);

  /* Total de preguntas en contexto */
  useEffect(() => {
    if (totalQuestions !== wellnessQuestions.length) {
      setTotalQuestions(wellnessQuestions.length);
    }
  }, [totalQuestions, setTotalQuestions]);

  /* Cargar respuesta guardada */
  useEffect(() => {
    const saved = assessmentProgress[currentData.id];
    if (saved) {
      if (typeof saved === 'object') {
        setCurrentAnswer(saved.answer);
        setOtherText(saved.otherText || '');
      } else {
        setCurrentAnswer(saved);
        setOtherText('');
      }
    } else {
      setCurrentAnswer('');
      setOtherText('');
    }
  }, [currentQuestion, assessmentProgress, currentData.id]);

  /* ───────────── Handlers ───────────── */
  const handleAnswerChange = (value) => {
    setCurrentAnswer(value);
    updateAssessmentProgress(currentData.id, value);
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) previousQuestion();
  };

  const handleNext = async () => {
    if (!currentAnswer) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));          // simula petición
    setIsLoading(false);

    if (isLast) {
      completeAssessment();

      /* 1️⃣ Construir objeto para el registro */
      const prefill = {
        edad:          assessmentProgress[1] ?? '',
        peso:          assessmentProgress[2] ?? '',
        altura:        assessmentProgress[3] ?? '',
        objetivoPeso:  assessmentProgress[4] ?? '',
      };

      /* 2️⃣ Navegar con state */
      navigate(
        '/authentication-flow-interface?tab=register',
        { state: { prefill } },
      );
    } else {
      nextQuestion();
    }
  };

  /* ───────────── UI ───────────── */
  return (
    <div className="theme-questions bg-questions-gradient min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Progress */}
        <div className="bg-surface border-border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-primary font-medium">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <span className="text-secondary text-sm">
              {getProgressPercentage()}% Complete
            </span>
          </div>
          <ProgressIndicatorBar
            currentStep={currentQuestion}
            totalSteps={totalQuestions}
            activeColor="var(--color-primary-600)"
            inactiveColor="var(--color-border)"
          />
        </div>

        {/* Card de la pregunta */}
        <div className="bg-surface border-border rounded-lg p-6 mb-6 max-w-2xl mx-auto">
          <div className="flex items-center mb-4">
            <Icon name={currentData.icon} size={24} className="text-primary mr-2" />
            <h3 className="text-primary font-semibold">{currentData.category}</h3>
          </div>
          <h2 className="text-primary text-xl mb-4">{currentData.question}</h2>

          <QuestionCard
            question={currentData}
            currentAnswer={currentAnswer}
            otherText={otherText}
            onAnswerChange={handleAnswerChange}
            isLoading={isLoading}
          />
        </div>

        {/* Controles */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          <button
            onClick={handlePrevious}
            className="btn-neutral"
            disabled={currentQuestion === 1}
          >
            ‹ Previous
          </button>
          <span className="text-secondary">
            Question {currentQuestion} of {totalQuestions}
          </span>
          <button
            onClick={handleNext}
            className="btn-primary"
            disabled={!currentAnswer || isLoading}
          >
            {isLast ? 'Continue to Register' : 'Next Question'} ›
          </button>
        </div>
      </div>
    </div>
  );
}
