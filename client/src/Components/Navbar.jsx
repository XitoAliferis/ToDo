import React from "react";
import profileImg from "../Images/profile.jpg"
const NavBar = ({ colorScheme }) => {
  return (
    <div className="font-thin drop-shadow absolute top-0 left-0 h-[3.4rem] w-[100vw] flex items-center justify-between" style={{ backgroundColor: colorScheme.NavBar.background }}>
      <a className="no-underline" href="/">
      <p className="flex h-[3.4rem] items-center pl-[24px] pt-[15px] text-[24px]" style={{ color: colorScheme.NavBar.text }}>
        ToDo
      </p>
      </a>

      <div className="flex h-[3.4rem] items-center pr-5">
      <img src={profileImg} className="h-[45px] w-[45px] rounded-full"></img> 
      </div>
    </div>
  );
}

export default React.memo(NavBar);
