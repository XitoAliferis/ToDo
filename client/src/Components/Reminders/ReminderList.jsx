import React from 'react';
import ReminderItems from './ReminderItems';

const ReminderList = ({
  uniqueDates,
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
  today,
  yesterday,
  tomorrow,
  handleNewReminder,
  isTimeBeforeNow
}) => {
  const formatDateLabel = (date) => {
    const dateObj = new Date(date);
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];

    if (date === yesterday) return 'Yesterday';
    if (date === today) return 'Today';
    if (date === tomorrow) return 'Tomorrow';

    const mS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const formattedDate = `${dayOfWeek}, ${mS[parseInt(date.substring(5, 7)) - 1]} ${date.substring(8, 10)}${date.substring(0, 4) === today.substring(0, 4) ? '' : `, ${date.substring(0, 4)}`}`;
    
    return formattedDate;
  };

  const isDateBeforeToday = (date) => {
    return (new Date(date)) < new Date(today);
  };

  return uniqueDates.map((x, index) => (
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
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.35)`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" stroke="white" d="M12 4.5v15m7.5-7.5h-15" /></svg>
        </div>
      )}
      <ReminderItems
        filteredReminderItems={filteredReminderItems.filter(z => z.date.startsWith(x))}
        navItems={navItems}
        currentItem={currentItem}
        isExpanded={isExpanded}
        handleCheckItem={handleCheckItem}
        handleDeleteReminderItem={handleDeleteReminderItem}
        handleOpenEditMenu={handleOpenEditMenu}
        colorScheme={colorScheme}
        currentPath={currentPath}
        shiftedReminderItem={shiftedReminderItem}
        handleReminderItemContextMenu={handleReminderItemContextMenu}
        today = {today}
      />
    </div>
  ));
};

export default React.memo(ReminderList);
