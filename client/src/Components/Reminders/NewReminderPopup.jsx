import React from 'react';
import NavDropdown from 'react-bootstrap/NavDropdown';

const NewReminderPopup = ({
  isAdding,
  newReminder,
  setNewReminder,
  allday,
  daily,
  setDaily,
  handleAllday,
  navItems,
  currentItem,
  handleNewReminderChange,
  handleNewReminderKeyPress,
  popupRef
}) => {
  if (!isAdding) return null;

  return (
    <div ref={popupRef} className="absolute h-[355px] w-[225px] rounded-[6%] z-1" style={{ top: currentItem.href === "/" ? '13%' : '17%', backgroundColor: "#404040", left: 'calc(100% - 15.6rem)', filter: "drop-shadow(0 5px 5px rgba(0, 0, 0, 0.4))" }}>
      <div className="relative top-[9%] left-[5%] space-y-[20px]">
        <p className="text-white font-thin flex">Task:
          <input
            className="w-full bg-transparent pl-1 border-none focus:outline-none text-white"
            type="text"
            name="name"
            value={newReminder.name}
            onChange={handleNewReminderChange}
            onKeyDown={handleNewReminderKeyPress}
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
        <p className="text-white font-thin flex ">
          Daily:
          <div
            className="relative left-2 top-[3.2px] h-[20px] w-[20px] rounded-1"
            style={{ boxShadow: `inset 0 0 0 1px white`, backgroundColor: daily ? 'white' : 'transparent' }}
            onClick={() => {
              setDaily(prevState => {
                const newDailyState = !prevState;
                setNewReminder(prev => ({ ...prev, daily: newDailyState }));  // Update newReminder state
                return newDailyState;
              });
            }}
          />
        </p>

        <p className="text-white font-thin flex">Group:
          {(currentItem.href === "/" || currentItem.href === "/Upcoming" || currentItem.href === "/Daily") && (
            <NavDropdown
              className="pl-1"
              id="nav-dropdown-dark-example"
              title={newReminder.group || 'Select Group'}
              menuVariant="dark"
            >
              {navItems.filter(x => x.label !== "Today" && x.label !== "Upcoming"&& x.label !== "Daily").map((x, index) => (
                <NavDropdown.Item key={index} style={{ color: x.bgColor }} onClick={() => setNewReminder(prevState => ({ ...prevState, group: x.label }))}>
                  {x.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          )}
          {currentItem.href !== "/" && currentItem.href !== "/Upcoming" && currentItem.href !== "/Daily" && (
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
  );
};

export default React.memo(NewReminderPopup);
