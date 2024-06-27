import React from 'react';
import useSwipe from './Swipe';

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
    //const isSameDay = now.toDateString() >= inputDate.toDateString();
  
    // Check if the input time is before the current time
    const isBeforeNow = inputDate < now;
  
    return isBeforeNow;
  };

  const handleSwipeLeft = (e, item) => {
    handleReminderItemContextMenu(e, item.id);
  };
  const handleSwipeRight = (e, item) => {
    handleReminderItemContextMenu(e, null);
  };
  
  const swipeHandlers = useSwipe(
    handleSwipeLeft,
    handleSwipeRight,
    null, // onSwipeUp
    null  // onSwipeDown
  );

  
  return filteredReminderItems.map((item, idx) => {
   
    return(
    <div key={idx} className="relative transition-all duration-300"
      style={{
        left: shiftedReminderItem === item.id ? (isExpanded ? `calc(5rem - ${-138}px)` : `calc(5rem - ${30}px)`) : (isExpanded ? '15.5rem' : '5rem'),
        top: currentPath === "/" ? '3.2rem' : '3.2rem',
        width: isExpanded ? 'calc(100% - 16.5rem)' : 'calc(100% - 6rem)',
        transform: shiftedReminderItem === item.id ? `translateX(-${30 + 10}px)` : 'translateX(0)',
        transition: 'transform 0.3s, left 0.3s, width 0.3s',
      }}
      onContextMenu={(e) => handleReminderItemContextMenu(e, item.id)}
      onTouchStart={(e) => swipeHandlers.onTouchStart(e, item)} // Pass item to swipe handlers
      onTouchMove={(e) => swipeHandlers.onTouchMove(e, item)}
      onTouchEnd={(e) => swipeHandlers.onTouchEnd(e, item)}
    >
     
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
          <p
          className="transition-all duration-300"
          style={{
            width: isExpanded ? 'calc(100vw - 14rem - 50px - 120px)' : 'calc(100vw - 4rem - 50px - 120px)',
            color: colorScheme.Reminders.text
          }}
        >
          {(currentPath === "/Upcoming" || currentPath === "/" || currentPath === "/Daily") && (
                <span style={{ color: navItems.find(x => x.label === item.group)?.bgColor }}>{ }</span>
              )} {item.name}
            </p>
          )}
          {item.group === "" && (
                      <p
                      className="transition-all duration-300"
                      style={{
                        width: isExpanded ? 'calc(100vw - 14rem - 50px - 120px)' : 'calc(100vw - 4rem - 50px - 120px)',
                        color: colorScheme.Reminders.text
                      }}
                    >{item.name}</p>
          )}
        </div>
        <div className="flex justify-end space-x-3 transition-all duration-300">
          <div className="h-[14px] w-[14px] rounded-full relative transition-all duration-300"
            style={{
              top: item.allday ? '-4px' : '6.1px',
              right: item.allday ? '67.3px' : convertToStandardTime(item.date).length > 7 ? '0px' : '7.5px',
              backgroundColor: (currentPath !== "/" && currentPath !== "/Upcoming" && currentPath !== "/Daily") ? navItems.bgColor : navItems.find(x => x.label === item.group)?.bgColor,
              transition: 'top 0.3s, right 0.3s, background-color 0.3s'
            }}>
                     <div
  className={`absolute transform -translate-y-1/3 transition-all duration-300 cursor-pointer ${isExpanded ? 'right-[900%]' : 'left-[180%]'} h-[35px] w-[39px] rounded-r-md`}
  style={{
    top: '33%',
    transform: `${shiftedReminderItem === item.id ? (isExpanded ? `translate(${278 + 9}px, -50%)` : `translate(${105 + 6}px, -50%)`) : (isExpanded ? `translate(${380 + 5}px, -50%)` : `translate(${135 + 5}px, -50%)`)}`,
    opacity: shiftedReminderItem === item.id ? '1' : '0',
    zIndex: shiftedReminderItem === item.id ? '2' : '2',
    transition: 'transform 0.3s, opacity 0.3s',
    backgroundColor: 'red'
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9e1b1b'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'red'}
  onClick={() => handleDeleteReminderItem(item.id)}
>
  <svg className={`absolute size-7 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2`} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <path fill="none" stroke="white" d="m13.5 10l4 4m0-4l-4 4m6.095 4.5H9.298a2 2 0 0 1-1.396-.568l-5.35-5.216a1 1 0 0 1 0-1.432l5.35-5.216A2 2 0 0 1 9.298 5.5h10.297c.95 0 2.223.541 2.223 1.625v9.75c0 1.084-1.273 1.625-2.223 1.625" />
  </svg>
</div>
<div
  className={`absolute  transform -translate-y-1/3 transition-all cursor-pointer duration-300 ${isExpanded ? 'right-[900%]' : 'left-[180%]'} h-[35px] w-[39px] rounded-l-md bg-yellow-300`}
  style={{
    top: '33%',
    transform: `${shiftedReminderItem === item.id ? (isExpanded ? `translate(${244 + 5}px, -50%)` : `translate(${69 + 4}px, -50%)`) : (isExpanded ? `translate(${346 + 5}px, -50%)` : `translate(${99 + 5}px, -50%)`)}`,
    opacity: shiftedReminderItem === item.id ? '1' : '0',
    zIndex: shiftedReminderItem === item.id ? '2' : '2',
    transition: 'transform 0.3s, opacity 0.3s',
  }}
  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d4cb1e'}
  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(253, 224, 71)'}
  onClick={() => handleOpenEditMenu(item)}
>
  <svg className={`absolute size-7 left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2`} xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
    <g fill="none" stroke="white">
      <path d="m16.475 5.408l2.117 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 0 0-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 1 0-2.621-2.621" />
      <path d="M19 15v 3a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h3" />
    </g>
  </svg>
</div>
          </div>
          
          <p className="transition-all duration-300" style={{ color: (isTimeBeforeNow(item.date) && !item.done) ? '#e42f2f' : colorScheme.Reminders.text }}>{item.allday ? '' : convertToStandardTime(item.date)}</p>
            
       </div>


      </div>
    </div>
  )});
};

export default React.memo(ReminderItems);
