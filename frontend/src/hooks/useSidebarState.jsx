import React from 'react';

const STORAGE_KEY = 'gametrix-sidebar-collapsed';

export const useSidebarState = () => {
  const [collapsed, setCollapsed] = React.useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === 'true';
    }
    return false;
  });

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, String(collapsed));
  }, [collapsed]);

  const toggle = () => setCollapsed(prev => !prev);

  return { collapsed, setCollapsed, toggle };
};

export default useSidebarState;
