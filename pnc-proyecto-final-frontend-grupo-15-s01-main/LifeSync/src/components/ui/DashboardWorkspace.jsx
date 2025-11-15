import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../AppIcon';

const DashboardWorkspace = () => {
  const [leftPaneData, setLeftPaneData] = useState([]);
  const [rightPaneData, setRightPaneData] = useState([]);
  const [leftSearchTerm, setLeftSearchTerm] = useState('');
  const [rightSearchTerm, setRightSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasters'); // For mobile responsive

  // Mock data for demonstration
  const mockTasters = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', status: 'active', reviews: 45 },
    { id: 2, name: 'Mike Chen', email: 'mike@example.com', status: 'pending', reviews: 23 },
    { id: 3, name: 'Emma Davis', email: 'emma@example.com', status: 'active', reviews: 67 },
    { id: 4, name: 'James Wilson', email: 'james@example.com', status: 'inactive', reviews: 12 }
  ];

  const mockRecipes = [
    { id: 1, title: 'Spicy Thai Curry', author: 'Chef Maria', status: 'published', rating: 4.8 },
    { id: 2, title: 'Classic Margherita Pizza', author: 'Tony Romano', status: 'pending', rating: 4.5 },
    { id: 3, title: 'Chocolate Lava Cake', author: 'Baker Sue', status: 'draft', rating: 4.9 },
    { id: 4, title: 'Mediterranean Salad', author: 'Chef Alex', status: 'published', rating: 4.3 }
  ];

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      setLeftPaneData(mockTasters);
      setRightPaneData(mockRecipes);
      setIsLoading(false);
    }, 1000);
  }, []);

  const filteredTasters = leftPaneData.filter(taster =>
    taster.name.toLowerCase().includes(leftSearchTerm.toLowerCase()) ||
    taster.email.toLowerCase().includes(leftSearchTerm.toLowerCase())
  );

  const filteredRecipes = rightPaneData.filter(recipe =>
    recipe.title.toLowerCase().includes(rightSearchTerm.toLowerCase()) ||
    recipe.author.toLowerCase().includes(rightSearchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-badge status-success',
      pending: 'status-badge status-warning',
      inactive: 'status-badge status-error',
      published: 'status-badge status-success',
      draft: 'status-badge status-warning'
    };
    return statusClasses[status] || 'status-badge';
  };

  const LoadingSkeleton = ({ rows = 4 }) => (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="shimmer">
          <div className="skeleton h-16 w-full rounded-lg"></div>
        </div>
      ))}
    </div>
  );

  const TasterPane = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Taster Management</h2>
        <Link
          to="/add-edit-taster-profile"
          className="btn-primary flex items-center space-x-2"
        >
          <Icon name="Plus" size={16} />
          <span>Add Taster</span>
        </Link>
      </div>

      <div className="relative mb-4">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search tasters..."
          value={leftSearchTerm}
          onChange={(e) => setLeftSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          filteredTasters.map((taster) => (
            <div key={taster.id} className="card hover-lift cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon name="User" size={20} color="#2563EB" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{taster.name}</h3>
                    <p className="text-sm text-text-secondary">{taster.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-text-secondary">{taster.reviews} reviews</span>
                  <span className={getStatusBadge(taster.status)}>{taster.status}</span>
                  <button className="p-1 hover:bg-secondary-100 rounded">
                    <Icon name="MoreVertical" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const RecipePane = () => (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-text-primary">Recipe Publications</h2>
        <button className="btn-secondary flex items-center space-x-2">
          <Icon name="Filter" size={16} />
          <span>Filter</span>
        </button>
      </div>

      <div className="relative mb-4">
        <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search recipes..."
          value={rightSearchTerm}
          onChange={(e) => setRightSearchTerm(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="card hover-lift cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                    <Icon name="ChefHat" size={20} color="#0EA5E9" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{recipe.title}</h3>
                    <p className="text-sm text-text-secondary">by {recipe.author}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} color="#D97706" />
                    <span className="text-sm text-text-secondary">{recipe.rating}</span>
                  </div>
                  <span className={getStatusBadge(recipe.status)}>{recipe.status}</span>
                  <Link
                    to="/recipe-preview-modal"
                    className="p-1 hover:bg-secondary-100 rounded"
                  >
                    <Icon name="Eye" size={16} />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Desktop Dual-Pane Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 h-[calc(100vh-8rem)]">
          <div className="bg-surface rounded-lg shadow-base border border-border p-6">
            <TasterPane />
          </div>
          <div className="bg-surface rounded-lg shadow-base border border-border p-6">
            <RecipePane />
          </div>
        </div>

        {/* Tablet Stacked Layout */}
        <div className="hidden md:block lg:hidden space-y-6">
          <div className="bg-surface rounded-lg shadow-base border border-border p-6 h-96">
            <TasterPane />
          </div>
          <div className="bg-surface rounded-lg shadow-base border border-border p-6 h-96">
            <RecipePane />
          </div>
        </div>

        {/* Mobile Tabbed Layout */}
        <div className="md:hidden">
          <div className="bg-surface rounded-lg shadow-base border border-border">
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('tasters')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'tasters' ?'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>Tasters</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('recipes')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  activeTab === 'recipes' ?'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Icon name="ChefHat" size={16} />
                  <span>Recipes</span>
                </div>
              </button>
            </div>
            
            <div className="p-6 h-[calc(100vh-12rem)]">
              {activeTab === 'tasters' ? <TasterPane /> : <RecipePane />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardWorkspace;