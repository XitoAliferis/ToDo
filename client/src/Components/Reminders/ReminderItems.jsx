import React from 'react';


const ReminderItems = ({
  filteredReminderItems,
  navItems,
  currentItem,
  isExpanded,
  handleCheckItem,
  handleDeleteReminderItem,
  handleOpenEditMenu,
  colorScheme,
  currentPath,
  shiftedReminderItem,
  handleReminderItemContextMenu,
  today
}) => {
  const convertToStandardTime = (date) => {
    const time = date.substring(11, 16);
    const hours = parseInt(time.substring(0, 2), 10);
    const minutes = time.substring(3, 5);
    const suffix = hours >= 12 ? "PM" : "AM";
    const standardHours = ((hours + 11) % 12 + 1);
    return `${standardHours}:${minutes} ${suffix}`;
  };

  const isTimeBeforeNow = (date) => {
    const now = new Date();
    const inputDate = new Date(date);
  
    // Check if the input date is today
    const isSameDay = now.toDateString() <= inputDate.toDateString();
  
    // Check if the input time is before the current time
    const isBeforeNow = inputDate < now;
  
    return isSameDay && isBeforeNow;
  };

  return filteredReminderItems.map((item, idx) => (
    <div key={idx} className="relative transition-all duration-300"
      style={{
        left: shiftedReminderItem === item.id ? (isExpanded ? `calc(5rem - ${-138}px)` : `calc(5rem - ${30}px)`) : (isExpanded ? '15.5rem' : '5rem'),
        top: currentPath === "/" ? '3.2rem' : '3.2rem',
        width: isExpanded ? 'calc(100% - 16.5rem)' : 'calc(100% - 6rem)',
        transform: shiftedReminderItem === item.id ? `translateX(-${30 + 10}px)` : 'translateX(0)',
        transition: 'transform 0.3s, left 0.3s, width 0.3s',
      }}
      onContextMenu={(e) => handleReminderItemContextMenu(e, item.id)}
    >
      <div
        className={`absolute transition-all duration-300 cursor-pointer ${isExpanded ? 'left-[calc(100%-15rem)]' : 'left-[calc(100%-4rem)]'} h-[35px] w-[39px] rounded-r-md`}
        style={{
          transform: shiftedReminderItem === item.id ? (isExpanded ? `translateX(${278 + 9}px)` : `translateX(${105 + 6}px)`) : (isExpanded ? `translateX(${380 + 5}px)` : `translateX(${135 + 5}px)`),
          opacity: shiftedReminderItem === item.id ? '1' : '0',
          zIndex: shiftedReminderItem === item.id ? '2' : '2',
          transition: 'transform 0.3s, opacity 0.3s',
          backgroundColor: 'red'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9e1b1b'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'}
        onClick={() => handleDeleteReminderItem(item.id)}
      >
        <svg className={`absolute size-7 ${isExpanded ? 'left-[18%]' : 'left-[13%]'}  top-[13%]`} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path fill="none" stroke="white" d="m13.5 10l4 4m0-4l-4 4m6.095 4.5H9.298a2 2 0 0 1-1.396-.568l-5.35-5.216a1 1 0 0 1 0-1.432l5.35-5.216A2 2 0 0 1 9.298 5.5h10.297c.95 0 2.223.541 2.223 1.625v9.75c0 1.084-1.273 1.625-2.223 1.625" />
        </svg>
      </div>
      <div
        className={`absolute transition-all cursor-pointer duration-300 ${isExpanded ? 'left-[calc(100%-15rem)]' : 'left-[calc(100%-4rem)]'} h-[35px] w-[39px] rounded-l-md bg-yellow-300`}
        style={{
          transform: shiftedReminderItem === item.id ? (isExpanded ? `translateX(${244 + 5}px)` : `translateX(${69 + 4}px)`) : (isExpanded ? `translateX(${346 + 5}px)` : `translateX(${99 + 5}px)`),
          opacity: shiftedReminderItem === item.id ? '1' : '0',
          zIndex: shiftedReminderItem === item.id ? '2' : '2',
          transition: 'transform 0.3s, opacity 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4cb1e'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(253, 224, 71)'}
        onClick={() => handleOpenEditMenu(item)}
      >
        <svg className={`absolute size-7 ${isExpanded ? 'left-[14%]' : 'left-[13%]'}  top-[11%]`} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <g fill="none" stroke="white">
            <path d="m16.475 5.408l2.117 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621" />
            <path d="M19 15v 3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
          </g>
        </svg>
      </div>
      <div className={`flex justify-between items-center relative transition-all duration-300 ${item.date === today ? 'top-[4px]' : 'top-[4px]'}`}>
        <div className="flex items-center space-x-2 justify-left transition-all duration-300">
          <div className="relative top-[-7px] h-[25px] w-[25px] rounded-full transition-all duration-300"
            style={{
              backgroundColor: item.done ? currentItem.bgColor : 'transparent',
              boxShadow: `inset 0 0 0 2px ${currentItem.bgColor}`,
              transition: 'background-color 0.3s, box-shadow 0.3s'
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
            <p className="transition-all duration-300" style={{ color: colorScheme.Reminders.text }}>
              {(currentPath === "/Upcoming" || currentPath === "/") && (
                <span style={{ color: navItems.find(x => x.label === item.group)?.bgColor }}>{ }</span>
              )} {item.name}
            </p>
          )}
          {item.group === "" && (
            <p className="transition-all duration-300" style={{ color: colorScheme.Reminders.text }}>{item.name}</p>
          )}
        </div>
        <div className="flex justify-end space-x-3 transition-all duration-300">
          <div className="h-[14px] w-[14px] rounded-full relative transition-all duration-300"
            style={{
              top: item.allday ? '-4px' : '6.1px',
              right: item.allday ? '67.3px' : convertToStandardTime(item.date).length > 7 ? '0px' : '7.5px',
              backgroundColor: (currentPath !== "/" && currentPath !== "/Upcoming") ? navItems.bgColor : navItems.find(x => x.label === item.group)?.bgColor,
              transition: 'top 0.3s, right 0.3s, background-color 0.3s'
            }}>
          </div>
          <p className="transition-all duration-300" style={{ color: isTimeBeforeNow(item.date) ? '#e42f2f' : colorScheme.Reminders.text }}>{item.allday ? '' : convertToStandardTime(item.date)}</p>
        </div>
      </div>
    </div>
  ));
};

export default React.memo(ReminderItems);
