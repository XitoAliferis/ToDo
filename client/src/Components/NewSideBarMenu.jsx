import React from "react";

const NewSideBarMenu = ({ onAddGroup, onAddFolder, colorScheme }) => {
  return (
    <div className="menu-container drop-shadow-lg space-y-[1%] w-[90%] h-[5.5rem] left-[4.5%] top-[11%] rounded-3 absolute"
    style={{
      backgroundColor: colorScheme?.SideBar?.reminder,
    }}>
      <div className="flex space-x-1 pl-[2.5%] top-[14%] h-[2rem] w-[100%] items-center relative " 
           onClick={onAddGroup} 
           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.55)`}
           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorScheme?.SideBar?.reminder}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" color="white"><path d="M2.5 12c0-4.478 0-6.718 1.391-8.109S7.521 2.5 12 2.5c4.478 0 6.718 0 8.109 1.391S21.5 7.521 21.5 12c0 4.478 0 6.718-1.391 8.109S16.479 21.5 12 21.5c-4.478 0-6.718 0-8.109-1.391S2.5 16.479 2.5 12"/><path d="M11 7.5h6m-9 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m3 4.5h6m-9 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0m3 4.5h6m-9 0a.5.5 0 1 1-1 0a.5.5 0 0 1 1 0"/></g></svg>
        <p className="text-white top-[0.45rem] relative">New Group</p>
      </div>
      <div className="flex space-x-1 pl-[2.5%] top-[14%] h-[2rem] w-[100%] items-center relative" 
           onClick={onAddFolder}
           onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.55)`}
           onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorScheme?.SideBar?.reminder}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
        <p className="text-white top-[0.45rem] relative">New Folder</p>
      </div>
    </div>
  );
};

export default NewSideBarMenu;
