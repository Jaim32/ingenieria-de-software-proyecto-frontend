// src/routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Helpers */
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

/* Layouts / Providers */
import MainLayout from "./layouts/MainLayout"; // ← Import correcto del layout
import NavigationStateProvider from "components/ui/NavigationStateManager";
import QuestionsLayout from "layouts/QuestionsLayout";

/* Páginas */
import WellnessJourneyLandingPage from "pages/WellnessJourneyLandingPage";
import SleepCycleCalculatorDashboard from "pages/sleep-cycle-calculator-dashboard";
import CalorieTrackingDashboard from "pages/calorie-tracking-dashboard";
import DailyNutritionOverviewDashboard from "pages/daily-nutrition-overview-dashboard";
import GamificationProgressTrackingDashboard from "pages/gamification-progress-tracking-dashboard";
import HydrationTrackingDashboard from "pages/hydration-tracking-dashboard";
import CommunityRecipeBrowse from "pages/community-recipe-browse";
import RecipeCreationForm from "pages/recipe-creation-form";
import RecipeDetailView from "pages/recipe-detail-view";
import AdministrativeDashboard from "pages/administrative-dashboard";
import AddEditTasterProfile from "pages/add-edit-taster-profile";
import RecipePreviewModal from "pages/recipe-preview-modal";
import RecipeModerationDashboard from "pages/recipe-moderation-dashboard";
import NotFound from "pages/NotFound";
import AIWellnessChat from "./pages/ai-wellness-chat";
import QuestionFlowInterface from ".//pages/question-flow-interface";
import AuthenticationFlowInterface from "./pages/authentication-flow-interface";
import ModuleNavigationHeader from "./components/ui/ModuleNavigationHeader";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <Routes>
          {/* ─────────┐
             PÚBLICAS │ (sin header)
          ──────────┘ */}
          <Route path="/" element={<WellnessJourneyLandingPage />} />

          {/* ────────────────────────────────────────────────────────────────────────────
             RUTAS CON HEADER (MainLayout)
             Aquí MainLayout renderiza el ModuleNavigationHeader + <Outlet/>
          ──────────────────────────────────────────────────────────────────────────── */}
          <Route element={< ModuleNavigationHeader />}>
            <Route
              path="recipe-moderation-dashboard"
              element={<RecipeModerationDashboard />}
            />
            <Route
              path="sleep-cycle"
              element={<SleepCycleCalculatorDashboard />}
            />
            <Route
              path="administrative-dashboard"
              element={<AdministrativeDashboard />}
            />
            <Route
              path="add-edit-taster-profile"
              element={<AddEditTasterProfile />}
            />
            <Route
              path="recipe-preview-modal"
              element={<RecipePreviewModal />}
            />
            <Route
              path="daily-nutrition-overview-dashboard"
              element={<DailyNutritionOverviewDashboard />}
            />
            <Route
              path="gamification-progress-tracking-dashboard"
              element={<GamificationProgressTrackingDashboard />}
            />
            <Route path="ai-wellness-chat" element={<AIWellnessChat />} />
            <Route
              path="calorie-tracking-dashboard"
              element={<CalorieTrackingDashboard />}
            />
            <Route
              path="hydration-tracking-dashboard"
              element={<HydrationTrackingDashboard />}
            />
            <Route
              path="community-recipe-browse"
              element={<CommunityRecipeBrowse />}
            />
            <Route
              path="recipe-creation-form"
              element={<RecipeCreationForm />}
            />
            <Route path="recipe-detail-view" element={<RecipeDetailView />} />
          </Route>

          {/* ────────────────────────────────────────────────────────────────────
             CUESTIONARIO (provider + layout propio)
          ──────────────────────────────────────────────────────────────────── */}
          <Route path="/questionaire" element={<QuestionsLayout />}>
            <Route index element={<QuestionFlowInterface />} />
            {/* add any other nested routes here */}
          </Route>
          <Route
            element={
              <NavigationStateProvider>
                <QuestionsLayout />
              </NavigationStateProvider>
            }
          >
            

            <Route
              path="authentication-flow-interface"
              element={<AuthenticationFlowInterface />}
            />

            {/* … otras subrutas del questionnaire si las tienes */}
          </Route>

          {/* ─────────┐
             CATCH-ALL │ 404
          ──────────┘ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}