import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import NavDropdown from 'react-bootstrap/NavDropdown';
import moment from 'moment-timezone';
const Reminders = ({ navItems, colorScheme, isExpanded, reminderItems, handleCheckItem, handleAddReminder }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ name: "", date: "", group: "", allDay: false });

  const [allDay, setAllDay] = useState(false);

  const popupRef = useRef(null); // Create a ref for the popup

  const location = useLocation();
  const currentPath = location.pathname;

  const currentItem = navItems.find(item => item.href === currentPath) || { href: "/", label: "Today", bgColor: "#EE6B6E" };

  const handleAllDay = () => {
    setAllDay(prevState => !prevState);
    if (!allDay) {
      // If allDay is being turned on, remove time from date and handle local time correctly
      const localDate = new Date(newReminder.date);
      const localDateString = new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()).toISOString().slice(0, 10);
      setNewReminder(prevState => ({ ...prevState, date: localDateString, allDay: true }));
    } else {
      // If allDay is being turned off, add time to date
      const localDate = new Date(newReminder.date);
      setNewReminder(prevState => ({ ...prevState, date: convertToLocal(new Date(localDate.getFullYear(), localDate.getMonth(), localDate.getDate())), allDay: false }));
    }
  };
  
  

  
  function convertToLocal(date) {
    // Ensure the input is a valid Date object
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    // Check if the conversion to Date was successful
    if (isNaN(date.getTime())) {
      throw new TypeError("Invalid date");
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const currentTime = moment().tz(timezone);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), currentTime.hours(), currentTime.minutes(), currentTime.seconds())).toISOString().slice(0, 16);

  }

  function convertToStandardTime(date) {
    const time = date.substring(11, 16);
    //12:11
    //01234
    if (time.substring(0, 2) == "00") return "12" + time.substring(2, 5) + " AM"
    if (time.substring(0, 2) == "12") return time + " PM"
    if (time.substring(1, 2) > 2 && time.substring(0, 1) > 0) return (-12 + parseInt(time.substring(0, 2))) + time.substring(2, 5) + " PM"
    else return time.substring(1, 5) + " AM";
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
    { currentItem.href !== "/" && currentItem.href !== "/Upcoming" ? newReminder.group = currentItem.label : newReminder.group = "" }
    setNewReminder(prevState => ({ ...prevState, [name]: value }));
  };

  const handleNewReminderKeyPress = (e) => {
    if (e.key === "Enter" && newReminder.name.trim()) {
      handleAddReminder(newReminder.name, newReminder.date, newReminder.group, newReminder.allDay);
      setNewReminder({ name: "", date: "", group: "", allDay: false });
      setIsAdding(false);
    }
  };
  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsAdding(false);
        setAllDay(prevState => prevState = false);
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
    ? reminderItems.filter(item => item.date.startsWith(today))
    : currentItem.href === "/Upcoming"
      ? reminderItems
      : reminderItems.filter(item => item.group === currentItem.label);

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

          <div className="relative w-[7mm] cursor-pointer"
            style={{
              left: 'calc(100vw - 3.6rem)',
              top: currentPath === "/" ? '2.5rem' : '2.5rem'
            }}
            onClick={handleNewReminder}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v15m7.5-7.5h-15" /></svg>
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
              type={allDay ? "date" : "datetime-local"}
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
                    style={{ boxShadow: `inset 0 0 0 1px white`, backgroundColor: allDay ? 'white' : 'transparent' }}
                    onClick={handleAllDay}
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
              <div className="relative w-[7mm] cursor-pointer"
                style={{
                  left: 'calc(100vw - 3.6rem)',
                  top: currentPath === "/" ? '2.5rem' : '2.5rem'
                }}
                onClick={handleNewReminder}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.5v15m7.5-7.5h-15" /></svg>
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
                    <div className="relative top-[-7px] h-[25px] w-[25px] rounded-full"
                      style={{
                        backgroundColor: item.done ? currentItem.bgColor : 'transparent',
                        boxShadow: `inset 0 0 0 2px ${currentItem.bgColor}`
                      }}
                      onClick={() => handleCheckItem(item)}
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
                    <div className="h-[14px] w-[14px] rounded-full relative top-[6.1px]" style={{ right: item.allDay ? '57.3px' : '0px',backgroundColor: (currentPath !== "/" && currentPath !=="/Upcoming") ?  navItems.bgColor : navItems.find(x => x.label === item.group)?.bgColor}}></div>
                    <p style={{ color: colorScheme.Reminders.text }}>{item.allDay ? '' : convertToStandardTime(item.date)}</p>
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
