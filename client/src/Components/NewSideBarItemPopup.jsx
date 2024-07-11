import React from "react";

const NewSideBarReminderPopup = ({
  isExpanded,
  colorScheme = {},
  newColor,
  handleColorChange,
  newReminder,
  handleNewReminderChange,
  handleNewReminderKeyPress
}) => {
  const backgroundColor = colorScheme?.SideBar?.reminder || "#ffffff"; // Default to white if undefined
  const textColor = colorScheme?.SideBar?.text || "#000000"; // Default to black if undefined

  return (
    <div
      className={`relative h-[40px] rounded-[10px] flex items-center cursor-pointer transition-all duration-300 left-[0.7rem] ${
        isExpanded ? "w-[13.5rem]" : "w-[2.6rem]"
      }`}
      style={{
        backgroundColor: backgroundColor,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#101010")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = backgroundColor)}
    >
      <div className="relative w-[27.5px] h-[27.5px] left-[calc((2.6rem-27.5px)/2)] overflow-hidden rounded-full transition-all duration-300">
        <input
          type="color"
          value={newColor}
          onChange={handleColorChange}
          className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] border-none cursor-pointer"
          style={{ backgroundColor: "transparent" }}
        />
      </div>
      {isExpanded && (
        <input
          className="font-thin text-[14px] truncate max-w-[150px] left-[0.8rem] relative bg-transparent border-none focus:outline-none transition-all duration-300"
          style={{ color: textColor }}
          type="text"
          value={newReminder}
          onChange={handleNewReminderChange}
          onKeyDown={handleNewReminderKeyPress}
          placeholder="Enter new reminder"
          autoFocus
        />
      )}
    </div>
  );
};

export default NewSideBarReminderPopup;
