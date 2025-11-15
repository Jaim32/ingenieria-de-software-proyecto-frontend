import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icon from "../AppIcon";
import clsx from "clsx";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      id: "today",
      label: "Today",
      path: "/daily-nutrition-overview-dashboard",
      icon: "Calendar",
      description: "Daily nutrition tracking and meal logging",
    },
    {
      id: "progress",
      label: "Progress",
      path: "/gamification-progress-tracking-dashboard",
      icon: "Trophy",
      description: "Achievements, challenges, and progress tracking",
    }
  ];

  const [hoveredItem, setHoveredItem] = useState(null);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="nutri-nav shadow">
        <ul className="nutri-container flex items-center gap-8 overflow-x-auto py-3 bg-[#FEFDFB]">
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <div key={item.id} className="relative">
                <button
                  onClick={() => handleNavigation(item.path)}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  className={clsx(
                    "flex items-center space-x-2 px-4 py-4 border-b-2 transition-smooth",
                    isActive(item.path)
                      ? "border-nutri-primary text-nutri-primary font-medium"
                      : "border-transparent text-nutri-text-secondary hover:text-nutri-text hover:border-nutri-border"
                  )}
                >
                  <Icon
                    name={item.icon}
                    size={20}
                    className={
                      isActive(item.path)
                        ? "text-nutri-primary"
                        : "text-current"
                    }
                  />
                  <span className="font-medium">{item.label}</span>
                </button>

                {/* Tooltip */}
                {hoveredItem === item.id && !isActive(item.path) && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-text-primary text-white text-sm rounded shadow-soft-hover whitespace-nowrap z-300">
                    {item.description}
                    <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-text-primary rotate-45"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ul>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#FEFDFB] border-t border-nutri-border z-100">
        <div className="flex items-center justify-around py-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              className={clsx(
                "flex flex-col items-center space-y-1 px-4 py-2 transition-smooth",
                isActive(item.path)
                  ? "text-nutri-primary"
                  : "text-nutri-text-secondary"
              )}
            >
              <Icon
                name={item.icon}
                size={24}
                className={
                  isActive(item.path) ? "text-primary" : "text-current"
                }
              />
              <span className="text-xs font-medium">{item.label}</span>
              {isActive(item.path) && (
                <div className="w-1 h-1 bg-nutri-primary rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Navigation;
