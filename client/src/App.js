import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import SideBar from './Components/SideBar';
import Reminders from './Components/Reminders/Reminders';
import NavBar from './Components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import { auth, onAuthStateChanged, getRedirectResult } from './firebase.js';


const API_URL = process.env.REACT_APP_API_URL;

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
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    const handleAuthStateChange = new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });

      setTimeout(() => {
        unsubscribe();
        resolve(null);
      }, 2000);
    });

    handleAuthStateChange.then(async (user) => {
      if (!user) {
        const redirectResult = await getRedirectResult(auth).catch(() => null);
        if (redirectResult?.user) {
          user = redirectResult.user;
        }
      }

      if (user) {
        try {
          const userId = user.uid;
          console.log('Fetching data for userId:', userId);
          const [reminderResponse, reminderItemResponse] = await Promise.all([
            axios.get(`${API_URL}/reminderData`, { params: { userId } }),
            axios.get(`${API_URL}/reminderItemData`, { params: { userId } })
          ]);
          console.log('Reminder data:', reminderResponse.data);
          console.log('Reminder item data:', reminderItemResponse.data);
          setReminders(reminderResponse.data);
          setReminderItems(reminderItemResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        console.log('No user logged in, proceeding without user data');
        setReminders([]); // Set default reminders if needed
        setReminderItems([]); // Set default reminder items if needed
      }
      setIsLoading(false);
    });
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
      if (item.daily) await axios.post(`${API_URL}/editReminderItemData`, { ...item, date: item.date })
      await axios.post(`${API_URL}/checkReminderItem`, { id: item.id });
    } catch (error) {
      console.error('Error:', error);
    }
    setIsUpdating(false);
  };

  const handleAddReminder = async (name, date, group, allday, daily) => {
    const tempId = uuidv4();
    const userId = auth.currentUser?.uid;
    const reminderObject = { id: tempId, name, done: false, date, group, allday, daily, userId };
    setIsUpdating(true);
  
    try {
      const response = await axios.post(`${API_URL}/reminderItemData`, reminderObject);
      setReminderItems([...reminderItems, response.data]);
    } catch (error) {
      console.error('Error:', error);
    }
    setIsUpdating(false);
  };

  const navItems = [
    { href: "/", label: "Today", bgColor: "#EE6B6E" },
    { href: "/Upcoming", label: "Upcoming", bgColor: "#FFFFFF" },
    ...reminders.map(cls => ({
      id: cls.id,
      href: `/${cls.id}`,
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

  const handleEditReminder = async (updatedReminder) => {
    try {
      setReminders(prevItems => 
        prevItems.map(item => 
            item.id === updatedReminder.id ? updatedReminder : item
        )
    );
        const response = await axios.post(`${API_URL}/editReminderData`, updatedReminder);
        if (response.data.success) {
            
        } else {
            console.error('Failed to update reminder:', response.data.error);
        }
    } catch (error) {
        console.error('Error editing reminder:', error);
    }
};

  


  if (isLoading) {
    return <div className='overflow-x-hidden overflow-y-hidden h-[100vh] w-[100vh' style={{ backgroundColor: '#626262' }}></div>;
  }

  return (
    <Router>
    {auth.currentUser?.uid !== undefined && (
  <Reminders
    colorScheme={colorScheme[0]}
    navItems={navItems}
    isExpanded={isExpanded}
    reminderItems={reminderItems}
    setReminderItems={setReminderItems}
    handleCheckItem={handleCheckItem}
    handleAddReminder={handleAddReminder}
    isUpdating={isUpdating}
    setIsUpdating={setIsUpdating}
    handleEditReminder={handleEditReminder}
  />
)}
{auth.currentUser?.uid === undefined && (
  <div 
    className='flex items-center justify-center  h-screen w-screen'
    style={{ backgroundColor: colorScheme[0].Reminders.background, color: colorScheme[0].Reminders.text}}
  >
    You are Logged Out
  </div>
)}

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
