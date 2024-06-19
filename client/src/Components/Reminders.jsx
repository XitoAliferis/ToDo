import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import moment from 'moment-timezone';

const Reminders = ({ navItems, colorScheme, isExpanded, reminderItems, handleCheckItem, handleAddReminder }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ name: "", date: "", group: "", allday: false });
  const [allday, setAllday] = useState(false);
  const popupRef = useRef(null);
  const location = useLocation();
  const currentPath = location.pathname;
  const currentItem = navItems.find(item => item.href === currentPath) || { href: "/", label: "Today", bgColor: "#EE6B6E" };

  const handleAllday = () => {
    setAllday(prevState => !prevState);
    const localDate = new Date(newReminder.date);

    if (!allday) {
      const localDateString = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()).toISOString().slice(0, 10);
      setNewReminder(prevState => ({ ...prevState, date: localDateString, allday: true }));
    } else {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const currentDate = moment().tz(timezone).format('HH:mm');
      const localDateTimeString = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${(localDate.getDate()+1).toString().padStart(2, '0')}T${currentDate}`;
      setNewReminder(prevState => ({ ...prevState, date: localDateTimeString, allday: false }));
    }
  };

  function convertToLocal(date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    if (isNaN(date.getTime())) {
      throw new TypeError("Invalid date");
    }

    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return moment(date).tz(timezone).format('YYYY-MM-DDTHH:mm');
  }

  function convertToStandardTime(date) {
    const time = date.substring(11, 16);
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = time.substring(3, 5);
    const suffix = hours >= 12 ? "PM" : "AM";
    const standardHours = ((hours + 11) % 12 + 1);
    return `${standardHours}:${minutes} ${suffix}`;
  }

  const handleNewReminder = () => {
    setIsAdding(true);
    setNewReminder(prevState => ({
      ...prevState,
      date: convertToLocal(new Date())
    }));
  };

  const handleNewReminderChange = (e) => {
    const { name, value } = e.target;
    currentItem.href !== "/" && currentItem.href !== "/Upcoming" ? newReminder.group = currentItem.label : newReminder.group = "";
    setNewReminder(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNewReminderKeyPress = (e) => {
    if (e.key === "Enter" && newReminder.name.trim()) {
      handleAddReminder(newReminder.name, newReminder.date, newReminder.group, newReminder.allday);
      setNewReminder({ name: "", date: "", group: "", allday: false });
      setIsAdding(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsAdding(false);
        setAllday(false);
      }
    };

    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding]);

  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const tomorrow = new Date(Date.now() + 86400000).toISOString().slice(0, 10);

  const filteredReminderItems = currentItem.href === "/"
    ? reminderItems.filter(item => convertToLocal(item.date).startsWith(today))
    : currentItem.href === "/Upcoming"
      ? reminderItems.map(item => item.allday ? ({ ...item, date: (item.date) }) : ({ ...item, date: convertToLocal(item.date) }))
      : reminderItems.filter(item => item.group === currentItem.label).map(item => item.allday ? ({ ...item, date: (item.date) }) : ({ ...item, date: convertToLocal(item.date) }));

  const mS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  const uniqueDates = [...new Set(filteredReminderItems.map(item => item.date.slice(0, 10)))].sort();

  const isDateBeforeToday = (date) => {
    return new Date(date) < new Date(today);
  };

  const formatDateLabel = (date) => {
    if (date === yesterday) return 'Yesterday';
    if (date === today) return 'Today';
    if (date === tomorrow) return 'Tomorrow';
    return `${mS[parseInt(date.substring(5, 7)) - 1]} ${date.substring(8, 10)}${date.substring(0, 4) === today.substring(0, 4) ? '' : `, ${date.substring(0, 4)}`}`;
  };

  return (
    <div className="absolute top-0 left-0 overflow-x-hidden w-[100vw] h-[100vh] transition-all duration-300" style={{ backgroundColor: colorScheme.Reminders.background }}>
      {currentItem && (
        <p
          className={`absolute text-[28px] top-[3.7rem] transition-all duration-300 ${isExpanded ? 'left-[15.6rem]' : 'left-[5rem]'}`}
          style={{
            color: currentItem.bgColor,
            filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4))",
          }}
        >
          {currentItem.label}
        </p>
      )}
      {filteredReminderItems.length === 0 && (
        <div>
          {currentPath !== "/" && (
            <p
              className={`relative font-thin text-[20px] top-[6.25rem] transition-all duration-300 ${isExpanded ? 'left-[15.6rem]' : 'left-[5rem]'}`}
              style={{ color: colorScheme.Reminders.text }}
            >
              Today
            </p>
          )}
          <hr
            className={`relative opacity-90 h-[1.4px] w-[87.6%] transition-all duration-300 ${isExpanded ? 'left-[15.5rem]' : 'left-[5rem]'} top-[5.5rem]`}
            style={{
              backgroundColor: colorScheme.Reminders.text,
              border: `1px solid ${colorScheme.Reminders.text}`,
              width: isExpanded ? 'calc(100% - 16.5rem)' : 'calc(100% - 6rem)'
            }}
          />

          <div className="relative w-[7mm] rounded-2 cursor-pointer"
            style={{
              left: 'calc(100vw - 3.6rem)',
              top: currentPath === "/" ? '2.5rem' : '2.5rem'
            }}
            onClick={handleNewReminder}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.1)`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>
          <p
            className={`relative font-thin text-[18px] top-[3.25rem] transition-all duration-300 ${isExpanded ? 'left-[15.6rem]' : 'left-[5rem]'}`}
            style={{ color: colorScheme.Reminders.text }}
          >
            No New Reminders!
          </p>
        </div>
      )}
      {isAdding && (
        <div ref={popupRef} className="absolute h-[300px] w-[225px] top-[13%] rounded-[6%] z-1" style={{ backgroundColor: "#404040", left: 'calc(100% - 15.6rem)', filter: "drop-shadow(0 5px 5px rgba(0, 0, 0, 0.4))" }}>
          <div className="relative top-[9%] left-[5%] space-y-[20px]">
            <p className="text-white font-thin flex">Task:
              <input
                className="w-full bg-transparent pl-1 border-none focus:outline-none text-white"
                type="text"
                name="name"
                value={newReminder.name}
                onChange={handleNewReminderChange}
                onKeyPress={handleNewReminderKeyPress}
                placeholder="Enter Task Name"
                autoComplete="off"
                autoFocus
              />
            </p>
            <p className="text-white font-thin flex">Date:
              <input
                className="relative left-1 bg-transparent border-none focus:outline-none w-[75%]"
                style={{ colorScheme: "dark" }}
                type={allday ? "date" : "datetime-local"}
                name="date"
                value={newReminder.date}
                onChange={handleNewReminderChange}
                placeholder="Date and Time"
              />
            </p>
            <p className="text-white font-thin flex ">
              All Day:
              <div
                className="relative left-2 top-[3.2px] h-[20px] w-[20px] rounded-1"
                style={{ boxShadow: `inset 0 0 0 1px white`, backgroundColor: allday ? 'white' : 'transparent' }}
                onClick={handleAllday}
              />
            </p>
            <p className="text-white font-thin flex">Group:
              {(currentItem.href === "/" || currentItem.href === "/Upcoming") && (
                <NavDropdown
                  className="pl-1"
                  id="nav-dropdown-dark-example"
                  title={newReminder.group || 'Select Group'}
                  menuVariant="dark"
                >
                  {navItems.filter(x => x.label !== "Today" && x.label !== "Upcoming").map((x, index) => (
                    <NavDropdown.Item key={index} style={{ color: x.bgColor }} onClick={() => setNewReminder(prevState => ({ ...prevState, group: x.label }))}>
                      {x.label}
                    </NavDropdown.Item>
                  ))}
                </NavDropdown>
              )}
              {currentItem.href !== "/" && currentItem.href !== "/Upcoming" && (
                ` ${currentItem.label}`
              )}
            </p>
            <p className="text-white font-thin flex">Notify: TBD</p>
            <p className="text-white font-thin flex">Type:
              <NavDropdown
                className="pl-1"
                id="nav-dropdown-dark-example"
                title="Select Type"
                menuVariant="dark"
              >
                <NavDropdown.Item href="#action/3.1">Essay</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Homework</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Exam</NavDropdown.Item>
              </NavDropdown>
            </p>
          </div>
        </div>
      )}
      {
        uniqueDates.map((x, index) => (
          <div key={index}>
            {currentItem.href !== "/" && (
              <p
                className={`relative font-thin text-[20px] ${index === 0 ? 'top-[6.25rem]' : 'top-[4.25rem]'} transition-all duration-300 ${isExpanded ? 'left-[15.6rem]' : 'left-[5rem]'}`}
                style={{ color: isDateBeforeToday(x) ? '#e42f2f' : colorScheme.Reminders.text }}
              >
                {formatDateLabel(x)}
              </p>
            )}
            <hr
              className={`relative opacity-90 h-[1.4px] w-[87.6vw] transition-all duration-300 ${isExpanded ? 'left-[15.5rem]' : 'left-[5rem]'} ${index === 0 ? 'top-[5.5rem]' : 'top-[3.5rem]'}`}
              style={{
                backgroundColor: colorScheme.Reminders.text,
                border: `1px solid ${colorScheme.Reminders.text}`,
                width: isExpanded ? 'calc(100vw - 16.5rem)' : 'calc(100% - 6rem)'
              }}
            />
            {index === 0 && (
              <div className="relative w-[7mm] rounded-2 cursor-pointer"
                style={{
                  left: 'calc(100vw - 3.6rem)',
                  top: currentPath === "/" ? '2.5rem' : '2.5rem'
                }}
                onClick={handleNewReminder}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.1)`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" d="M12 4.5v15m7.5-7.5h-15" /></svg>
              </div>
            )}
            {filteredReminderItems.filter(z => z.date.startsWith(x)).map((item, idx) => (
              <div key={idx} className="relative transition-all duration-300"
                style={{
                  left: isExpanded ? '15.5rem' : '5rem',
                  top: currentPath === "/" ? '3.2rem' : '3.2rem',
                  width: isExpanded ? 'calc(100% - 16.5rem)' : 'calc(100% - 6rem)'
                }}>
                <div className={`flex justify-between items-center relative ${x === today ? 'top-[10px]' : 'top-[4px]'}`}>
                  <div className="flex items-center space-x-2 justify-left">
                    <div className="relative top-[-7px] h-[25px] w-[25px] rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: item.done ? currentItem.bgColor : 'transparent',
                        boxShadow: `inset 0 0 0 2px ${currentItem.bgColor}`
                      }}
                      onClick={() => handleCheckItem(item)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    />
                    {item.group !== "" && (
                      <p style={{ color: colorScheme.Reminders.text }}>
                        {(currentPath === "/Upcoming" || currentPath === "/") && (
                          <span style={{ color: navItems.find(x => x.label === item.group)?.bgColor }}>{ }</span>
                        )} {item.name}
                      </p>
                    )}
                    {item.group === "" && (
                      <p style={{ color: colorScheme.Reminders.text }}>{item.name}</p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3">
                    <div className="h-[14px] w-[14px] rounded-full relative " style={{ top: item.allday ? '-4px' : '6.1px', right: item.allday ? '67.3px' : convertToStandardTime(item.date).length > 7 ? '0px' : '7.5px', backgroundColor: (currentPath !== "/" && currentPath !== "/Upcoming") ? navItems.bgColor : navItems.find(x => x.label === item.group)?.bgColor }}></div>
                    <p style={{ color: colorScheme.Reminders.text }}>{item.allday ? '' : convertToStandardTime(item.date)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))
      }
    </div>
  );
};

export default React.memo(Reminders);
