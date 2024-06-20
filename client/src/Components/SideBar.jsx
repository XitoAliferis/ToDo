import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SideBar = ({ reminders, setReminders, navItems, colorScheme, isExpanded, setIsExpanded }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState("");
  const [newColor, setNewColor] = useState("#acbda1");
  const [scrollY, setScrollY] = useState(0);
  const [shiftedReminder, setShiftedReminder] = useState(null);

  const location = useLocation();
  const currentPath = location.pathname;

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      setShiftedReminder(null);
    };
  
    if (shiftedReminder !== null) {
      document.addEventListener('click', handleClickOutside);
    }
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [shiftedReminder]);

  const handleToggle = () => {
    setShiftedReminder(null);
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
    if (e.key === "Escape") {
      setIsAdding(false);
    }
  };

  const handleColorChange = (e) => {
    setNewColor(e.target.value);
  };

  const handleContextMenu = (e, index) => {
    if (index >1){
      e.preventDefault();
    e.stopPropagation();
    setShiftedReminder(index);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      await axios.delete(`/reminderData/${id}`);
      setReminders(reminders.filter(reminder => reminder.id !== id));
      setShiftedReminder(!shiftedReminder)
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const getOpacity = (index) => {
    const itemOffset = index * 50;
    const opacity = Math.max(1 - scrollY / (itemOffset + 40), 0);
    return opacity;
  };

  return (
    <div
      className={`absolute top-0 left-0 h-[100dvh] transition-all duration-300 ${isExpanded ? 'w-[15rem]' : ' w-[4rem]'}`}
      style={{ backgroundColor: colorScheme.SideBar.background }}
      onClick={(e) => e.stopPropagation()}
    >
      {isExpanded && (
        <div
          className="absolute top-[4.5rem] left-[1rem] w-[7mm] rounded-2 cursor-pointer transition-all duration-300"
          onClick={handleNewReminder}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.55)`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </div>
      )}
      <div className={`max-sm:hidden absolute top-[4.4rem] left-[12rem] w-[8.5mm] rounded-2 cursor-pointer transition-all duration-300 ${isExpanded ? 'left-[12rem] rotate-0' : 'left-[1rem] rotate-180'}`} onClick={handleToggle}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.55)`}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="8mm" width="8.5mm" viewBox="0 0 16 9"><path fill="white" d="M12.5 5h-9c-.28 0-.5-.22-.5-.5s.22-.5.5-.5h9c.28 0 .5.22.5.5s-.22.5-.5.5" /><path fill="white" d="M6 8.5a.47.47 0 0 1-.35-.15l-3.5-3.5c-.2-.2-.2-.51 0-.71L5.65.65c.2-.2.51-.2.71 0s.2.51 0 .71L3.21 4.51l3.15 3.15c.2.2.2.51 0 .71c-.1.1-.23.15-.35.15Z" /></svg>
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
            <div className="relative">
              <div
                className={`absolute top-0 left-0 h-[39px] rounded-[11px] duration-300 justify-end cursor-pointer ${isExpanded ? 'w-[223px]' : 'w-[42px]'}`}
                style={{
                  backgroundColor: 'red',
                  opacity: shiftedReminder === index ? '1' : '0',
                  zIndex: 0,
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9e1b1b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'}
                onClick={() => handleDeleteReminder(item.id)}
              ><svg className={`absolute size-7 ${isExpanded ? 'left-[84%]' : 'left-[15%]'}  top-[15%]`} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="white"  d="m13.5 10l4 4m0-4l-4 4m6.095 4.5H9.298a2 2 0 0 1-1.396-.568l-5.35-5.216a1 1 0 0 1 0-1.432l5.35-5.216A2 2 0 0 1 9.298 5.5h10.297c.95 0 2.223.541 2.223 1.625v9.75c0 1.084-1.273 1.625-2.223 1.625"/></svg>
              </div>
              <a
                className={`no-underline relative ${shiftedReminder ? (isExpanded ? 'w-[225px]' : ' w-[43px]') : ''}`}
                href={item.href}
                style={{
                  display: 'block',
                  transform: shiftedReminder === index ? 'translateX(-40px)' : 'translateX(0)',
                  transition: 'transform 0.3s',
                }}
                onContextMenu={(e) => handleContextMenu(e, index)}
              >
                <div
                  className={`relative h-[40px] rounded-[10px] flex items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'w-[225px] pl-[5%]' : 'pl-[12.4%] w-[43px]'}`}
                  style={{
                    boxShadow: (currentItem.href === item.href && currentItem.id === item.id) ? `inset 0 0 0 1.3px ${item.bgColor}` : 'none',
                    backgroundColor: colorScheme.SideBar.reminder,
                    filter: currentItem.href === item.href ? "drop-shadow(0 3px 4px rgba(0, 0, 0, 0.2))" : 'none',
                    opacity: getOpacity(index),
                    transition: 'transform 0.3s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#101010"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorScheme.SideBar.reminder}
                >
                  <div
                    className={`w-[27.5px] h-[27.5px] rounded-full `}
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
            </div>
          </React.Fragment>
        ))}
        {isAdding && (
          <div
            className={`h-[40px] rounded-[10px] flex items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'w-[225px] pl-[5%]' : 'pl-[12.4%] w-[43px]'}`}
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
                onKeyDown={handleNewReminderKeyPress}
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