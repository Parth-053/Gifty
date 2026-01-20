import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 animate-fade-in">
      <Link to="/dashboard" className="hover:text-blue-600 transition-colors flex items-center gap-1">
        <Home size={12} />
      </Link>
      
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;

        return (
          <React.Fragment key={name}>
            <ChevronRight size={10} className="text-gray-300" />
            {isLast ? (
              <span className="text-blue-600">{name.replace(/-/g, ' ')}</span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-600 transition-colors">
                {name.replace(/-/g, ' ')}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;