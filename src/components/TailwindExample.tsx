import React from 'react';

const TailwindExample: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">
        Tailwind CSS Integration Example
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Card 1
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            This is a Tailwind CSS styled card using utility classes.
          </p>
          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Click me
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Card 2
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Tailwind works alongside CoreUI styles seamlessly.
          </p>
          <button className="mt-4 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Click me
          </button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Card 3
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Responsive grid layout with Tailwind utilities.
          </p>
          <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Click me
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4">
        <p className="text-blue-700 dark:text-blue-300">
          <strong>Note:</strong> Tailwind CSS is now integrated! You can use utility classes throughout your application.
        </p>
      </div>
    </div>
  );
};

export default TailwindExample;