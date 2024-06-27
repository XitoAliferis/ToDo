import React, {useState, useEffect} from "react";
import profileImg from "../Images/profile.jpg";
import logoWhite from "../Images/logo-transparent-white.png";
import logoBlack from "../Images/logo-transparent-black.png";
import { auth, provider, signInWithPopup, signInWithRedirect, signOut } from '../firebase';

const NavBar = ({ colorScheme }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user); // Sets user to the authenticated user or null if signed out
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);


  const handleProfileClick = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
        console.log('User signed out.');
        window.location.reload();
      } else {
        provider.setCustomParameters({ prompt: 'select_account' });
        await signInWithPopup(auth, provider);
        console.log('Redirecting for sign-in...');
        window.location.reload();
      }
    } catch (error) {
      console.error('Error during sign-in or sign-out: ', error);
    }
  };
  const logo = colorScheme.NavBar.background === "#4F4F4F" ? logoBlack : logoWhite;

  return (
    <div className="font-thin drop-shadow absolute top-0 left-0 h-[3.4rem] w-[100vw] flex items-center justify-between" style={{ backgroundColor: colorScheme.NavBar.background }}>
      <a className="no-underline" href="/">
        <img src={logo} alt="logo" className="flex h-[3.4rem] items-center text-[24px]" style={{ color: colorScheme.NavBar.text }} />
      </a>

      <div className="flex h-[3.4rem] items-center pr-5">
 {currentUser ? (
          <img 
            src={currentUser.photoURL} 
            referrerpolicy="no-referrer"
            alt="profile" 
            className="h-[40px] w-[40px] rounded-full cursor-pointer"
            onClick={handleProfileClick}
          />
        ) : (
          <div 
            className="h-[45px] w-[45px] rounded-full cursor-pointer"
            style={{ backgroundColor: colorScheme.Reminders.background }}
            onClick={handleProfileClick}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(NavBar);
