import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import SideBar from './Components/SideBar';
import Reminders from './Components/Reminders';
import NavBar from './Components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

const colorScheme = [
  {
    NavBar: { background: "#4F4F4F", text: "#FFFFFF" },
    SideBar: { background: "#4F4F4F", line: "#FFFFFF", reminder: "#404040", text: "#FFFFFF" },
    Reminders: { background: "#626262", text: "#FFFFFF" }
  },
  {
    NavBar: { background: "#C5BBA7", text: "#FFFFFF" },
    SideBar: { background: "#C5BBA7", line: "#FFFFFF", reminder: "#b0a494", text: "#FFFFFF" },
    Reminders: { background: "#d8ccbc", text: "#FFFFFF" }
  }
];

function App() {
  const [reminders, setReminders] = useState([]);
  const [reminderItems, setReminderItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const response = await axios.post('/checkReminderItem', { id: item.id });
      setReminderItems(reminderItems.map(rem => rem.id === item.id ? { ...rem, done: !rem.done } : rem));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleAddReminder = async (name, date, group, allDay) => {
    const reminderObject = { name: name, done: false, date: date, group: group, allDay: allDay };

    try {
      const response = await axios.post('/reminderItemData', reminderObject);
      setReminderItems([...reminderItems, response.data]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const navItems = [
    { href: "/", label: "Today", bgColor: "#EE6B6E" },
    { href: "/Upcoming", label: "Upcoming", bgColor: "#FFFFFF" },
    ...reminders.map(cls => ({
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
    return <div className='overflow-x-hidden overflow-y-hidden h-[100vh] w-[100vh]'></div>; // Add a loading state to improve UX
  }

  return (
    <Router>
      <Reminders
        colorScheme={colorScheme[0]}
        navItems={navItems}
        isExpanded={isExpanded}
        reminderItems={reminderItems}
        handleCheckItem={handleCheckItem}
        handleAddReminder={handleAddReminder}
      />
      <SideBar
        colorScheme={colorScheme[0]}
        reminders={reminders}
        setReminders={setReminders}
        navItems={navItems}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
      />
      <NavBar colorScheme={colorScheme[0]} />
    </Router>
  );
}

export default App;
