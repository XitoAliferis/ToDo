import React from "react";
import profileImg from "../Images/profile.jpg"
import logoWhite from "../Images/logo-transparent-white.png"
import logoBlack from "../Images/logo-transparent-black.png"
const NavBar = ({ colorScheme }) => {
  var logo = logoWhite;
  if (colorScheme.NavBar.background === "#4F4F4F") logo = logoBlack;
  return (
    <div className="font-thin drop-shadow absolute top-0 left-0 h-[3.4rem] w-[100vw] flex items-center justify-between" style={{ backgroundColor: colorScheme.NavBar.background }}>
      <a className="no-underline" href="/">
      <img src={logo} alt={"logo"} className="flex h-[3.4rem] items-center  text-[24px]" style={{ color: colorScheme.NavBar.text }}>
      </img>
      </a>

      <div className="flex h-[3.4rem] items-center pr-5">
      <img src={profileImg} alt={"profile"} className="h-[45px] w-[45px] rounded-full"></img> 
      </div>
    </div>
  );
}

export default React.memo(NavBar);
