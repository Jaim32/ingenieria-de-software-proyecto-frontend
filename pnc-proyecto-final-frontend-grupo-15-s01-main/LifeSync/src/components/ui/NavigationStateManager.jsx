import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const NavigationStateContext = createContext();

const initialState = {
  activeTab: 'assessment',
  currentQuestion: 1,
  totalQuestions: 10,
  assessmentProgress: {},
  assessmentComplete: false,
  resultsAvailable: false,
  navigationHistory: [],
  lastVisitedTab: null
};

const navigationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
        lastVisitedTab: state.activeTab,
        navigationHistory: [...state.navigationHistory, action.payload]
      };

    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload
      };

    case 'SET_TOTAL_QUESTIONS':
      return {
        ...state,
        totalQuestions: action.payload
      };

    case 'UPDATE_ASSESSMENT_PROGRESS':
      const updatedProgress = {
        ...state.assessmentProgress,
        [action.payload.questionId]: action.payload.answer
      };
      const completedQuestions = Object.keys(updatedProgress).length;
      const isComplete = completedQuestions >= state.totalQuestions;

      return {
        ...state,
        assessmentProgress: updatedProgress,
        assessmentComplete: isComplete,
        resultsAvailable: isComplete
      };

    case 'NEXT_QUESTION':
      const nextQuestion = Math.min(state.currentQuestion + 1, state.totalQuestions);
      return {
        ...state,
        currentQuestion: nextQuestion
      };

    case 'PREVIOUS_QUESTION':
      const prevQuestion = Math.max(state.currentQuestion - 1, 1);
      return {
        ...state,
        currentQuestion: prevQuestion
      };

    case 'RESET_ASSESSMENT':
      return {
        ...state,
        currentQuestion: 1,
        assessmentProgress: {},
        assessmentComplete: false,
        resultsAvailable: false
      };

    case 'COMPLETE_ASSESSMENT':
      return {
        ...state,
        assessmentComplete: true,
        resultsAvailable: true
      };

    case 'SYNC_WITH_URL':
      let tabFromUrl = 'assessment';
      if (action.payload.includes('/results-summary-screen')) {
        tabFromUrl = 'results';
      } else if (action.payload.includes('/component-library-preview')) {
        tabFromUrl = 'components';
      } else if (action.payload.includes('/question-flow-interface')) {
        tabFromUrl = 'assessment';
      }

      return {
        ...state,
        activeTab: tabFromUrl
      };

    default:
      return state;
  }
};

export const NavigationStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({ type: 'SYNC_WITH_URL', payload: location.pathname });
  }, [location.pathname]);

  const navigationActions = {
    setActiveTab: (tab) => {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    },

    setCurrentQuestion: (questionNumber) => {
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: questionNumber });
    },

    setTotalQuestions: (total) => {
      dispatch({ type: 'SET_TOTAL_QUESTIONS', payload: total });
    },

    updateAssessmentProgress: (questionId, answer) => {
      dispatch({ 
        type: 'UPDATE_ASSESSMENT_PROGRESS', 
        payload: { questionId, answer } 
      });
    },

    nextQuestion: () => {
      dispatch({ type: 'NEXT_QUESTION' });
    },

    previousQuestion: () => {
      dispatch({ type: 'PREVIOUS_QUESTION' });
    },

    resetAssessment: () => {
      dispatch({ type: 'RESET_ASSESSMENT' });
    },

    completeAssessment: () => {
      dispatch({ type: 'COMPLETE_ASSESSMENT' });
    },

    navigateToTab: (tabId) => {
      const routes = {
        assessment: '/question-flow-interface',
        results: '/results-summary-screen',
        components: '/component-library-preview'
      };

      if (routes[tabId]) {
        navigate(routes[tabId]);
        dispatch({ type: 'SET_ACTIVE_TAB', payload: tabId });
      }
    },

    navigateToResults: () => {
      if (state.resultsAvailable) {
        navigate('/results-summary-screen');
        dispatch({ type: 'SET_ACTIVE_TAB', payload: 'results' });
      }
    },

    canAccessResults: () => {
      return state.resultsAvailable || state.assessmentComplete;
    },

    getProgressPercentage: () => {
      return Math.round((Object.keys(state.assessmentProgress).length / state.totalQuestions) * 100);
    },

    isQuestionAnswered: (questionId) => {
      return state.assessmentProgress.hasOwnProperty(questionId);
    },

    getQuestionAnswer: (questionId) => {
      return state.assessmentProgress[questionId] || null;
    }
  };

  const contextValue = {
    ...state,
    ...navigationActions
  };

  return (
    <NavigationStateContext.Provider value={contextValue}>
      {children}
    </NavigationStateContext.Provider>
  );
};

export const useNavigationState = () => {
  const context = useContext(NavigationStateContext);
  if (!context) {
    throw new Error('useNavigationState must be used within a NavigationStateProvider');
  }
  return context;
};

export default NavigationStateProvider;

