import React from 'react';
import PillNav from './PillNav';

interface NavigationProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ searchValue, onSearchChange }) => {
  // Create a simple logo (you can replace with an actual logo file)
  const logoDataUri = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxOCIgZmlsbD0iI2Y2YzQ1MyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LXNpemU9IjI0IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iIzAwMCI+RjwvdGV4dD4KPC9zdmc+';

  return (
    <div className="sticky top-4 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <PillNav
          logo={logoDataUri}
          logoAlt="Finance AI Catalog"
          searchValue={searchValue}
          onSearchChange={onSearchChange}
          placeholder="Search papers by title, authors, or summary..."
          baseColor="#ffffff"
          pillColor="#1a1a2e"
          pillTextColor="#ffffff"
        />
      </div>
    </div>
  );
};

export default Navigation;

