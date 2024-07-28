import React from "react";

const NavbarPopup = ({
    colorScheme,
    handleSignOut,
    openThemeMenu
}) => {

    return (
        <div className="menu-container space-y-[1%] w-[140px] h-[5.5rem] drop-shadow-md justify-center right-[1.3%] top-[110%] rounded-3 absolute "
            style={{ background: colorScheme.NavBar.background }}
        >
            <div className="flex space-x-1 pl-[17.5%] top-[14%] h-[2rem] w-[100%] items-center relative "
                onClick={openThemeMenu}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.55)`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorScheme?.NavBar?.background}>
               <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 14 14"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" d="M.64 7.86c.785-1.097 3.164-4.214 5.947-5.967c2.093-1.318 4.07.422 2.537 2.174c-1.499 1.714-3.51 4.073-4.368 5.244c-.89 1.214.633 2.682 2.157 1.285c1.019-.934 2.08-2.008 3.158-2.802c1.456-1.071 2.705-.125 2.07 1.082c-.46.873-.793 1.258-1.177 1.992c-.383.735.023 1.615.604 1.691c.72.094 1.176-.423 1.791-1.228"/></svg>
                <p className="text-white top-[0.45rem] relative">Theme</p>
            </div>
            <div className="flex space-x-1 pl-[17.5%] top-[14%] h-[2rem] w-[100%] items-center relative "
                onClick={handleSignOut}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.55)`}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colorScheme?.NavBar?.background}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="white" d="M9 20.75H6a2.64 2.64 0 0 1-2.75-2.53V5.78A2.64 2.64 0 0 1 6 3.25h3a.75.75 0 0 1 0 1.5H6a1.16 1.16 0 0 0-1.25 1v12.47a1.16 1.16 0 0 0 1.25 1h3a.75.75 0 0 1 0 1.5Zm7-4a.74.74 0 0 1-.53-.22a.75.75 0 0 1 0-1.06L18.94 12l-3.47-3.47a.75.75 0 1 1 1.06-1.06l4 4a.75.75 0 0 1 0 1.06l-4 4a.74.74 0 0 1-.53.22"/><path fill="white" d="M20 12.75H9a.75.75 0 0 1 0-1.5h11a.75.75 0 0 1 0 1.5"/></svg>
                <p className="text-white top-[0.45rem] relative">Sign Out</p>
            </div>
        </div>
    );
};

export default NavbarPopup;
