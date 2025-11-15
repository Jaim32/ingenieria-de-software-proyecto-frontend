import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const DashboardLayout = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isQueueVisible, setIsQueueVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsQueueVisible(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleQueue = () => {
    setIsQueueVisible(!isQueueVisible);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
      <main className="flex h-[calc(100vh-5rem)]">
        {/* Queue Management Panel */}
        <div
          className={`
            ${isMobile ? 'fixed inset-y-20 left-0 z-400' : 'relative'}
            ${isQueueVisible ? 'w-full lg:w-[30%]' : 'w-0'}
            ${isMobile && !isQueueVisible ? 'translate-x-[-100%]' : 'translate-x-0'}
            bg-surface border-r border-border transition-all duration-300 ease-out
            ${isMobile ? 'shadow-large' : ''}
          `}
        >
          {isQueueVisible && (
            <div className="h-full flex flex-col">
              {/* Queue Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-text-primary font-heading">
                    Recipe Queue
                  </h2>
                  {isMobile && (
                    <button
                      onClick={toggleQueue}
                      className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-micro"
                    >
                      <Icon name="X" size={20} />
                    </button>
                  )}
                </div>

                {/* Search Bar */}
                <div className="relative mb-4">
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
                  />
                  <input
                    type="text"
                    placeholder="Search recipes..."
                    className="w-full pl-10 pr-4 py-2 input-field text-sm"
                  />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap gap-2">
                  <button className="px-3 py-1 text-xs font-medium bg-primary text-white rounded transition-micro">
                    All (24)
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-secondary rounded transition-micro">
                    Priority (8)
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-secondary rounded transition-micro">
                    Flagged (3)
                  </button>
                </div>
              </div>

              {/* Recipe List */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div
                      key={item}
                      className={`card p-4 cursor-pointer hover:shadow-medium transition-all duration-150 ${selectedRecipe === item ? 'ring-2 ring-primary/20 border-primary' : ''
                        }`}
                      onClick={() => setSelectedRecipe(item)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 bg-secondary rounded-lg flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text-primary text-sm truncate">
                            Quinoa Buddha Bowl Recipe #{item}
                          </h3>
                          <p className="text-xs text-text-secondary mt-1">
                            Submitted 2 hours ago
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="px-2 py-1 text-xs bg-warning/10 text-warning rounded">
                              Priority
                            </span>
                            <span className="text-xs text-text-secondary">
                              3 flags
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        <div className={`flex-1 ${isMobile && isQueueVisible ? 'hidden' : 'block'}`}>
          <div className="h-full flex flex-col">
            {/* Detail Header */}
            <div className="p-6 border-b border-border bg-surface">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {!isQueueVisible && (
                    <button
                      onClick={toggleQueue}
                      className="p-2 text-text-secondary hover:text-text-primary hover:bg-secondary rounded-lg transition-micro"
                    >
                      <Icon name="Menu" size={20} />
                    </button>
                  )}
                  <h1 className="text-xl font-semibold text-text-primary font-heading">
                    {selectedRecipe ? `Recipe Review #${selectedRecipe}` : 'Select a Recipe'}
                  </h1>
                </div>

                {selectedRecipe && (
                  <div className="flex items-center space-x-2">
                    <button className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90 transition-micro text-sm font-medium">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-warning text-white rounded-lg hover:bg-warning/90 transition-micro text-sm font-medium">
                      Request Changes
                    </button>
                    <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90 transition-micro text-sm font-medium">
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Detail Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {selectedRecipe ? (
                <div className="space-y-6">
                  {/* Recipe Image */}
                  <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                    <Icon name="Image" size={48} className="text-text-secondary" />
                  </div>

                  {/* Recipe Info */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-2">Recipe Details</h3>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Title:</span> Quinoa Buddha Bowl</p>
                          <p><span className="font-medium">Category:</span> Healthy Bowls</p>
                          <p><span className="font-medium">Prep Time:</span> 15 minutes</p>
                          <p><span className="font-medium">Cook Time:</span> 20 minutes</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold text-text-primary mb-2">Nutritional Info</h3>
                        <div className="space-y-2 text-sm font-data">
                          <p><span className="font-medium">Calories:</span> 420 kcal</p>
                          <p><span className="font-medium">Protein:</span> 18g</p>
                          <p><span className="font-medium">Carbs:</span> 52g</p>
                          <p><span className="font-medium">Fat:</span> 16g</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients */}
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Ingredients</h3>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <ul className="space-y-1 text-sm">
                        <li>• 1 cup quinoa, cooked</li>
                        <li>• 2 cups mixed greens</li>
                        <li>• 1/2 avocado, sliced</li>
                        <li>• 1/4 cup chickpeas, roasted</li>
                        <li>• 2 tbsp tahini dressing</li>
                      </ul>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="font-semibold text-text-primary mb-3">Instructions</h3>
                    <div className="bg-secondary/50 rounded-lg p-4">
                      <ol className="space-y-2 text-sm">
                        <li>1. Cook quinoa according to package instructions</li>
                        <li>2. Arrange mixed greens in a bowl</li>
                        <li>3. Top with cooked quinoa and sliced avocado</li>
                        <li>4. Add roasted chickpeas</li>
                        <li>5. Drizzle with tahini dressing</li>
                      </ol>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Icon name="FileText" size={48} className="text-text-secondary mx-auto mb-4" />
                    <p className="text-text-secondary">Select a recipe from the queue to begin review</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Overlay */}
        {isMobile && isQueueVisible && (
          <div
            className="fixed inset-0 bg-black/50 z-300"
            onClick={toggleQueue}
          />
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;