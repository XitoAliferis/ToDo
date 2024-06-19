import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import leftArrow from "../Images/leftarrow.svg";
import plus from "../Images/plus.svg";
import axios from "axios";

const SideBar = ({ reminders, setReminders, navItems, colorScheme, isExpanded, setIsExpanded }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState("");
  const [newColor, setNewColor] = useState("#acbda1");
  const [scrollY, setScrollY] = useState(0);

  const location = useLocation();
  const currentPath = location.pathname;

   // Check if the current path exists in navItems, if not set it to an empty string
  const currentItem = navItems.find(item => item.href === currentPath) || { href: "/", label: "Today", bgColor: "#EE6B6E" };


  useEffect(() => {
    const handleScroll = (e) => {
      setScrollY(e.target.scrollTop);
    };

    const sidebar = document.querySelector('.sidebar-content');
    sidebar.addEventListener('scroll', handleScroll);

    return () => {
      sidebar.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewReminder = () => {
    setIsAdding(true);
  };

  const handleNewReminderChange = (e) => {
    setNewReminder(e.target.value);
  };

  const handleNewReminderKeyPress = async (e) => {
    if (e.key === "Enter" && newReminder.trim()) {
      const newReminderObject = { name: newReminder, component: "/", color: newColor };
      try {
        const response = await axios.post('/reminderData', newReminderObject);
        setReminders([
          ...reminders,
          response.data
        ]);
      } catch (error) {
        console.error('Error adding new reminder:', error);
      }
      setNewReminder("");
      setNewColor("#acbda1");
      setIsAdding(false);
    }
  };

  const handleColorChange = (e) => {
    setNewColor(e.target.value);
  };

  const getOpacity = (index) => {
    const itemOffset = index * 50; // Adjust the multiplier based on the height of your items
    const opacity = Math.max(1 - scrollY / (itemOffset + 40), 0); // Adjust the denominator for more/less sensitivity
    return opacity;
  };

  return (
    <div
      className={`absolute top-0 left-0 h-[100dvh] transition-all duration-300 ${isExpanded ? 'w-[15rem]' : ' w-[4rem]'
        }`}
      style={{ backgroundColor: colorScheme.SideBar.background }}
    >
      {isExpanded && (
        <div 
         className="absolute top-[4.5rem] left-[1rem] w-[7mm] rounded-2 cursor-pointer transition-all duration-300" 
         onClick={handleNewReminder}
         onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.1)`}
         onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                  
          </div>
      )}
      <div  className={`max-sm:hidden absolute top-[4.4rem] left-[12rem] w-[8.5mm] rounded-2 cursor-pointer transition-all duration-300 ${isExpanded ? 'left-[12rem] rotate-0' : 'left-[1rem] rotate-180'
          }`} onClick={handleToggle}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.1)`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
         >
 
      <svg xmlns="http://www.w3.org/2000/svg" height="8mm" width="8.5mm" viewBox="0 0 16 9"><path fill="white" d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5"/><path fill="white" d="M6 8.5a.47.47 0 0 1-.35-.15l-3.5-3.5c-.2-.2-.2-.51 0-.71L5.65.65c.2-.2.51-.2.71 0s.2.51 0 .71L3.21 4.51l3.15 3.15c.2.2.2.51 0 .71c-.1.1-.23.15-.35.15Z"/></svg>
      </div>
      <div className={`pt-[6.5rem] max-sm:pt-[4.2rem] overflow-y-auto overflow-x-hidden max-h-full flex flex-col space-y-[15px] ${isExpanded ? 'pl-[2%]' : 'pl-[0.5rem]'} scrollbar-hide sidebar-content`}>
        {navItems.map((item, index) => (
          <React.Fragment key={index}>
            {index === 2 && (
              <hr
                className={`opacity-70 h-[1.4px] ${isExpanded ? ' w-[95%]' : 'w-[75%]'}`}
                style={{
                  backgroundColor: colorScheme.SideBar.line,
                  border: `1px solid ${colorScheme.SideBar.line}`,
                }}
              />
            )}
            <a className="no-underline" href={item.href}>
              <div
                className={`h-[40px] rounded-[10px] flex items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'w-[225px] pl-[5%]' : 'pl-[12.4%] w-[43px]'
                  }`}
                style={{
                  boxShadow: currentItem.href === item.href ? `inset 0 0 0 1.3px ${item.bgColor}` : 'none',
                  backgroundColor: colorScheme.SideBar.reminder,
                  filter: currentItem.href === item.href ? "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.2))" : 'none',
                  opacity: getOpacity(index),
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.4)`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorScheme.SideBar.reminder}
              >
                <div
                  className="w-[27.5px] h-[27.5px] rounded-full"
                  style={{ backgroundColor: item.bgColor }}
                />
                {isExpanded && (
                  <p
                    className="font-thin text-[14px] relative top-[18%] truncate max-w-[150px] ml-[4%]"
                    style={{ color: currentItem.href === item.href ? item.bgColor : colorScheme.SideBar.text }}
                  >
                    {item.label}
                  </p>
                )}
              </div>
            </a>
          </React.Fragment>
        ))}
        {isAdding && (
          <div
            className={`h-[40px] rounded-[10px] flex items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'w-[225px] pl-[5%]' : 'pl-[12.4%] w-[43px]'
              }`}
            style={{
              backgroundColor: colorScheme.SideBar.reminder,
            }}
          >
            <div className="relative w-[27.5px] h-[27.5px] overflow-hidden rounded-full">
              <input
                type="color"
                value={newColor}
                onChange={handleColorChange}
                className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] border-none cursor-pointer"
                style={{ backgroundColor: "transparent" }}
              />
            </div>
            {isExpanded && (
              <input
                className="font-thin text-[14px] truncate max-w-[150px] ml-[4%] bg-transparent border-none focus:outline-none"
                style={{ color: colorScheme.SideBar.text }}
                type="text"
                value={newReminder}
                onChange={handleNewReminderChange}
                onKeyPress={handleNewReminderKeyPress}
                placeholder="Enter new reminder"
                autoFocus
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(SideBar);
