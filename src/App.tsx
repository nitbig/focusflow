/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp, ActiveTab } from './context/AppContext';
import { NavigationRail } from './components/NavigationRail';
import { MobileDrawer } from './components/MobileDrawer';
import { AppHeader } from './components/AppHeader';
import { OverviewView } from './components/OverviewView';
import { PlannerView } from './components/PlannerView';
import { FocusView } from './components/FocusView';
import { InsightsView } from './components/InsightsView';
import { SettingsView } from './components/SettingsView';
import { TaskFormModal } from './components/TaskFormModal';
import { AppFooter } from './components/AppFooter';
import {
  LayoutDashboard,
  CalendarDays,
  Timer,
  BarChart2,
  Settings,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, notice, data } = useApp();

  const isFocusMode = activeTab === 'focus';

  const mobileNavItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'planner', label: 'Planner', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'focus', label: 'Focus', icon: <Timer className="w-4 h-4" /> },
    { id: 'insights', label: 'Insights', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)] flex flex-col font-sans transition-colors duration-150">
      {/* Toast Notification */}
      {notice && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-6 z-50 bg-[var(--ink)] text-[var(--surface)] px-4 py-2.5 rounded-xl text-xs font-medium shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-150 flex items-center gap-2 border border-[var(--line)]"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)]" />
          <span>{notice}</span>
        </div>
      )}

      {/* When in Focus Mode: Distraction-free full viewport without navigation rail */}
      {isFocusMode ? (
        <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <FocusView />
        </main>
      ) : (
        /* Standard Workspace: Stable 236px Left Navigation Rail (Desktop) + Header + Main Viewport */
        <div className="flex-1 flex flex-row min-h-screen">
          {/* Desktop Left Rail (>= 1024px) */}
          <div className="hidden lg:flex">
            <NavigationRail />
          </div>

          {/* Off-canvas drawer for mobile & tablet (< 1024px) */}
          <MobileDrawer />

          {/* Main Content Column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Top 72px Header */}
            <AppHeader />

            <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 pt-6 sm:pt-8 pb-12">
              {activeTab === 'overview' && <OverviewView />}
              {activeTab === 'planner' && <PlannerView />}
              {activeTab === 'insights' && <InsightsView />}
              {activeTab === 'settings' && <SettingsView />}
            </main>

            {/* Useful Application Footer (CSSAuthor principle: Make the footer useful) */}
            <AppFooter />
          </div>
        </div>
      )}

      {/* Mobile Navigation Bar (<1024px, hidden during focus mode) */}
      {!isFocusMode && (
        <nav
          aria-label="Mobile Navigation"
          className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[var(--surface)]/95 backdrop-blur-md border-t border-[var(--line)] px-2 py-1 flex items-center justify-around shadow-lg"
        >
          {mobileNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`min-h-[44px] min-w-[52px] flex flex-col items-center justify-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-[var(--forest)] dark:text-[var(--lime)] font-semibold'
                    : 'text-[var(--muted)] hover:text-[var(--ink)]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* Task Creation / Editing Dialog */}
      <TaskFormModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
