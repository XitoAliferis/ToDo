import React from 'react';
import { useLocation } from 'react-router-dom';

const ReminderHeader = ({ navItems, colorScheme, isExpanded }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const currentItem = navItems.find(item => item.href === currentPath) || { href: "/", label: "Today", bgColor: "#EE6B6E" };

  return (
    <p
      className={`absolute text-[28px] top-[3.7rem] transition-all duration-300 ${isExpanded ? 'left-[15.6rem]' : 'left-[5rem]'}`}
      style={{
        color: currentItem.bgColor,
        filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4))",
      }}
    >
      {currentItem.label}
    </p>
  );
};

export default React.memo(ReminderHeader);
