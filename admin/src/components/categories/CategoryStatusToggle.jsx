import React from 'react';

const CategoryStatusToggle = ({ isActive, onToggle }) => {
  return (
    <div 
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ease-in-out ${
        isActive ? 'bg-green-500' : 'bg-gray-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ease-in-out ${
          isActive ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </div>
  );
};

export default CategoryStatusToggle;