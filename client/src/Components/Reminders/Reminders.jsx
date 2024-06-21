
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import moment from 'moment-timezone';
import ReminderHeader from "./ReminderHeader";
import NewReminderPopup from "./NewReminderPopup";
import ReminderList from "./ReminderList";
import { convertToLocal } from "./ReminderUtils";

const Reminders = ({ navItems, colorScheme, isExpanded, reminderItems, setReminderItems, handleCheckItem, handleAddReminder, isUpdating, setIsUpdating }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newReminder, setNewReminder] = useState({ name: "", date: "", group: "", allday: false });
  const [allday, setAllday] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [shiftedReminderItem, setShiftedReminderItem] = useState(null);
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
      const localDateTimeString = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${(localDate.getDate() + 1).toString().padStart(2, '0')}T${currentDate}`;
      setNewReminder(prevState => ({ ...prevState, date: localDateTimeString, allday: false }));
    }
  };

  
  const handleDeleteReminderItem = async (id) => {
    setIsUpdating(true); // Set updating state
    try {
      setReminderItems(reminderItems.filter(reminder => reminder.id !== id));
        const response = await axios.delete(`/reminderItemData/${id}`);
        if (response.status === 200 && response.data.success) {
            
            setShiftedReminderItem(!shiftedReminderItem);
        } else {
            console.error('Failed to delete reminder:', response.data.error);
        }
    } catch (error) {
        console.error('Error deleting reminder:', error);
    } finally {
        setIsUpdating(false); // Clear updating state
    }
};

  
  

  const handleEditReminderItem = async (reminder) => {
    setIsUpdating(true); // Set updating state
    try {
      await axios.post(`/editReminderItemData`, reminder);
      setReminderItems(reminderItems.map(x => (x.id === reminder.id) ? reminder : x));
    } catch (error) {
      console.error('Error editing reminder:', error);
    }
    setIsUpdating(false); // Clear updating state
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

  const handleNewReminder = () => {
    setIsAdding(true);
    setEditingReminder(null); // Clear the editing state
    setNewReminder({ name: "", date: convertToLocal(new Date()), group: "", allday: false });
  };
  
  const handleNewReminderChange = (e) => {
    const { name, value } = e.target;
    setNewReminder(prevState => ({
      ...prevState,
      [name]: value,
      group: prevState.group || (currentItem.href !== "/" && currentItem.href !== "/Upcoming" ? currentItem.label : "")
    }));
  };

  const handleOpenEditMenu = (item) => {
    setNewReminder({
      ...item,
      date: item.allday ? item.date.split('T')[0] : moment(item.date).format('YYYY-MM-DDTHH:mm')
    });
    setAllday(item.allday);
    setIsAdding(true);
    setEditingReminder(item);
  };

  const handleNewReminderKeyPress = async (e) => {
    if (e.key === "Enter" && newReminder.name.trim()) {
      setIsUpdating(true); // Set updating state
      if (editingReminder) {
        const updatedReminder = { ...editingReminder, ...newReminder };
        await handleEditReminderItem(updatedReminder);
      } else {
        handleAddReminder(newReminder.name, newReminder.date, newReminder.group, newReminder.allday);
      }
      setNewReminder({ name: "", date: "", group: "", allday: false });
      setIsAdding(false);
      setEditingReminder(null); // Clear the editing state
      setIsUpdating(false); // Clear updating state
    }
    if (e.key === "Escape") {
      setIsAdding(false);
      setEditingReminder(null); // Clear the editing state
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsAdding(false);
        setAllday(false);
      }
    };
    const handleClickOutsideItem = (e) => {
      setShiftedReminderItem(null);
    };
    if (isAdding) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    if (shiftedReminderItem !== null) {
      document.addEventListener('click', handleClickOutsideItem);
    }
    return () => {
      document.removeEventListener('click', handleClickOutsideItem);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isAdding, shiftedReminderItem]);
  

  useEffect(() => {
    setShiftedReminderItem(null);
  }, [isExpanded]);

  const removeOutdatedCheckedItems = async () => {
    const todayDate = new Date().toISOString().split('T')[0];
    const outdatedCheckedItems = reminderItems.filter(item => 
      (item.done && (new Date(item.date) < new Date(todayDate)) && !item.allday) ||
      (item.done && isTimeBeforeNow(item.date) && !item.allday)
    );

    for (const item of outdatedCheckedItems) {
      await handleDeleteReminderItem(item.id);
    }
  };

  useEffect(() => {
    removeOutdatedCheckedItems();
  }, [reminderItems]);

  const today = convertToLocal(new Date()).substring(0, 10);
  const yesterday = convertToLocal(new Date(Date.now() - 86400000)).substring(0, 10);
  const tomorrow = convertToLocal(new Date(Date.now() + 86400000)).substring(0, 10);

  const filteredReminderItems = currentItem.href === "/"
  ? reminderItems
      .filter(item => convertToLocal(item.date).startsWith(today))
      .map(item => ({ ...item, date: convertToLocal(item.date) }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  : currentItem.href === "/Upcoming"
    ? reminderItems
        .map(item => item.allday ? ({ ...item, date: item.date }) : ({ ...item, date: convertToLocal(item.date) }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))
    : reminderItems
        .filter(item => item.group === currentItem.label)
        .map(item => item.allday ? ({ ...item, date: item.date }) : ({ ...item, date: convertToLocal(item.date) }))
        .sort((a, b) => new Date(a.date) - new Date(b.date))

  const uniqueDates = [...new Set(filteredReminderItems.map(item => item.date.slice(0, 10)))].sort();

  const handleReminderItemContextMenu = (e, itemId) => {
    e.preventDefault();  // Prevent the default right-click context menu
    e.stopPropagation();
    setShiftedReminderItem(itemId);
  };

  return (
    <div className="absolute top-0 left-0 overflow-x-hidden w-[100vw] h-[100%] transition-all duration-300" style={{ backgroundColor: colorScheme.Reminders.background }}>
      <ReminderHeader navItems={navItems} colorScheme={colorScheme} isExpanded={isExpanded} />
      <NewReminderPopup
        isAdding={isAdding}
        newReminder={newReminder}
        setNewReminder={setNewReminder}
        allday={allday}
        handleAllday={handleAllday}
        navItems={navItems}
        currentItem={currentItem}
        handleNewReminderChange={handleNewReminderChange}
        handleNewReminderKeyPress={handleNewReminderKeyPress}
        popupRef={popupRef}
      />
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
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.35)'}
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
      <ReminderList
        uniqueDates={uniqueDates}
        filteredReminderItems={filteredReminderItems}
        navItems={navItems}
        currentItem={currentItem}
        isExpanded={isExpanded}
        handleCheckItem={handleCheckItem}
        handleDeleteReminderItem={handleDeleteReminderItem}
        handleOpenEditMenu={handleOpenEditMenu}
        handleNewReminder={handleNewReminder}
        colorScheme={colorScheme}
        currentPath={currentPath}
        shiftedReminderItem={shiftedReminderItem}
        handleReminderItemContextMenu={handleReminderItemContextMenu}
        today={today}
        yesterday={yesterday}
        tomorrow={tomorrow}
      />
    </div>
  );
};

export default React.memo(Reminders);
