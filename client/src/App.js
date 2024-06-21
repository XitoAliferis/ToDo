import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import SideBar from './Components/SideBar';
import Reminders from './Components/Reminders/Reminders';
import NavBar from './Components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

const colorScheme = [
  {
    NavBar: { background: "#242424", text: "#FFFFFF" },
    SideBar: { background: "#242424", line: "#FFFFFF", reminder: "#2e2e2e", text: "#FFFFFF" },
    Reminders: { background: "#2e2e2e", text: "#FFFFFF" }
  },
  {
    NavBar: { background: "#4F4F4F", text: "#FFFFFF" },
    SideBar: { background: "#4F4F4F", line: "#FFFFFF", reminder: "#404040", text: "#FFFFFF" },
    Reminders: { background: "#626262", text: "#FFFFFF" }
  },
];

function App() {
  const [reminders, setReminders] = useState([]);
  const [reminderItems, setReminderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false); // Add state to track if an update is in progress

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [reminderResponse, reminderItemResponse] = await Promise.all([
        axios.get('/reminderData'),
        axios.get('/reminderItemData')
      ]);
      setReminders(reminderResponse.data);
      setReminderItems(reminderItemResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    localStorage.setItem('reminderItems', JSON.stringify(reminderItems));
  }, [reminderItems]);

  const handleCheckItem = async (item) => {
    setIsUpdating(true);
    try {
      setReminderItems(reminderItems.map(rem => rem.id === item.id ? { ...rem, done: !rem.done } : rem));
      await axios.post('/checkReminderItem', { id: item.id });
    } catch (error) {
      console.error('Error:', error);
    }
    setIsUpdating(false);
  };

  const handleAddReminder = async (name, date, group, allday) => {
    const tempId = uuidv4(); // Generate a temporary ID
    const reminderObject = { id: tempId, name: name, done: false, date: date, group: group, allday: allday };
    setIsUpdating(true); // Set updating state

    try {
        const response = await axios.post('/reminderItemData', reminderObject);
        setReminderItems([...reminderItems, response.data]);
    } catch (error) {
        console.error('Error:', error);
    }
    setIsUpdating(false); // Clear updating state
};

  
  const navItems = [
    { href: "/", label: "Today", bgColor: "#EE6B6E" },
    { href: "/Upcoming", label: "Upcoming", bgColor: "#FFFFFF" },
    ...reminders.map(cls => ({
      id: cls.id, // Include the id here
      href: `/${cls.name.replace(/\s+/g, '')}`,
      label: `${cls.name}`,
      bgColor: cls.color
    }))
  ];

  const [isExpanded, setIsExpanded] = useState(() => {
    const savedState = localStorage.getItem('isExpanded');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    localStorage.setItem('isExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setIsExpanded(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (isLoading) {
    return <div className='overflow-x-hidden overflow-y-hidden h-[100vh] w-[100vh' style={{backgroundColor: '#626262'}}></div>; // Add a loading state to improve UX
  }

  return (
    <Router>
      <Reminders
        colorScheme={colorScheme[0]}
        navItems={navItems}
        isExpanded={isExpanded}
        reminderItems={reminderItems}
        setReminderItems={setReminderItems}
        handleCheckItem={handleCheckItem}
        handleAddReminder={handleAddReminder}
        isUpdating={isUpdating} // Pass isUpdating to Reminders component
        setIsUpdating={setIsUpdating}
      />
      <SideBar
        colorScheme={colorScheme[0]}
        reminders={reminders}
        setReminders={setReminders}
        navItems={navItems}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        setIsUpdating={setIsUpdating}
      />
      <NavBar colorScheme={colorScheme[0]} />
    </Router>
  );
}

export default App;