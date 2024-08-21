import React, {useEffect} from 'react';
import Select, {components} from 'react-select';

const NewReminderPopup = ({
  isAdding,
  newReminder,
  setNewReminder,
  allday,
  daily,
  setDaily,
  handleAllday,
  navItems,
  currentItem,
  handleNewReminderChange,
  handleNewReminderKeyPress,
  popupRef,
  handleNewReminderSaveButton,
  handleNewReminderCancelButton,
  addReminderError
}) => {
  
  const getGroupNameById = (id) => {
    const group = navItems.find(item => item.id === id);
    return group ? group.label : 'Select Group';
  };

  const groupOptions = navItems
    .filter(x => x.label !== "Today" && x.label !== "Upcoming")
    .map(x => ({ value: x.id, label: x.label, color: x.bgColor }));

  const handleGroupChange = (selectedOption) => {
    console.log("Selected Option:", selectedOption); // Debug line
    setNewReminder(prevState => ({ ...prevState, group: selectedOption.value }));
  };

  useEffect(() => {
    if (isAdding && !(currentItem.href === "/" || currentItem.href === "/Upcoming")) {
      setNewReminder(prevState => ({ ...prevState, group: currentItem.id }));
    }
  }, [isAdding, currentItem, setNewReminder]); // Ensure the effect runs when isAdding or currentItem changes

  if (!isAdding) return null;
  return (
    <div ref={popupRef} className="absolute h-[335px] w-[225px] rounded-[6%] z-1" style={{ top: currentItem.href === "/" ? '13%' : '17%', backgroundColor: "rgba(36,36,36,1)", left: 'calc(100% - 15.6rem)', filter: "drop-shadow(0 5px 5px rgba(0, 0, 0, 0.4))" }}>
      <div className="relative top-[4%] left-[10.5%]">
        <p className='text-white text-[17px] font-semibold mb-[7px]'>Add New Reminder</p>

        <div className="mb-[12px]">
          <p className="text-[13px] font-semibold mb-[4px]"
            style={{ color: (addReminderError) ? '#c73232' : 'white' }}>{addReminderError ? 'Name*' : 'Name'}</p>
          <input
            className="w-[78%] pl-[7px] bg-transparent text-[14px]  focus:outline-none text-white rounded-[3px]"
            type="text"
            name="name"
            style={{
              border: "1px solid rgba(255, 255, 255, 0.75)",
              borderRadius: "3px",
            }}
            value={newReminder.name}
            onChange={handleNewReminderChange}
            onKeyDown={handleNewReminderKeyPress}
            placeholder="Pickup Groceries"
            autoComplete="off"
            autoFocus
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.75)'}
          />
        </div>

        <div className="mb-[12px]">
          <p className="text-white text-[13px] font-semibold mb-[4px]">Date</p>
          <input
            className="w-[78%] pl-[7px] bg-transparent text-[14px] focus:outline-none text-white rounded-[3px]"
            style={{
              colorScheme: "dark",
              border: "1px solid rgba(255, 255, 255, 0.75)",
              borderRadius: "3px",
            }}
            type={allday ? "date" : "datetime-local"}
            name="date"
            value={newReminder.date}
            onChange={handleNewReminderChange}
            placeholder="Date and Time"
            onMouseEnter={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)'}
            onMouseLeave={(e) => e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.75)'}
          />

        </div>

        <div className="mb-[12px] flex ml-[11.5%] space-x-[40px]">
          <div className="flex flex-col items-center">
            <p className="text-white text-[13px] font-semibold mb-[4px]">All Day</p>
            <div
              className="h-[20px] w-[20px] rounded-full"
              style={{ boxShadow: `inset 0 0 0 1.2px white`, backgroundColor: allday ? 'white' : 'transparent' }}
              onClick={handleAllday}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = allday ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = allday ? 'white' : 'transparent'}
            />
          </div>
          <div className="flex flex-col items-center">
            <p className="text-white text-[13px] font-semibold mb-[4px]">Repeat</p>
            <div
              className="h-[20px] w-[20px] rounded-full"
              style={{ boxShadow: `inset 0 0 0 1.2px white`, backgroundColor: daily ? 'white' : 'transparent' }}
              onClick={() => {
                setDaily(prevState => {
                  const newDailyState = !prevState;
                  setNewReminder(prev => ({ ...prev, daily: newDailyState }));
                  return newDailyState;
                });
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = daily ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.8)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = daily ? 'white' : 'transparent'}
            />
          </div>
        </div>
        <div className="mb-[20px]">
          <p className="text-white text-[13px] font-semibold mb-[4px]">Group</p>
            <Select
              components={{ 
                 DropdownIndicator: (props) => 
      (currentItem.href === "/" || currentItem.href === "/Upcoming") 
        ? <components.DropdownIndicator {...props} /> 
        : null,
    IndicatorSeparator: () => null
              }}
              
              className="w-[78%] text-[14px]"
              value={groupOptions.find(option => option.value === newReminder.group)}
              onChange={handleGroupChange}
              options={groupOptions}
              isDisabled={!(currentItem.href === "/" || currentItem.href === "/Upcoming")} // Conditionally disable the dropdown
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: 'transparent',
                  borderColor: 'white',
                  color: 'white',
                  borderWidth: '1px',
                  borderRadius: '3px',
                  height: '25px', // Adjust to match your text boxes
                  minHeight: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '7px', // Ensure padding matches other text boxes
                  
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: '0px', // Remove default padding
                }),
                input: (base) => ({
                  ...base,
                  margin: '0px', // Remove default margin
                  padding: '0px', // Remove default padding
                  lineHeight: '20px', // Match the line height to vertically center text
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  padding: '0px', // Ensure no extra padding around the arrow
                }),
                indicatorsContainer: (base) => ({
                  ...base,
                  alignItems: 'center', // Vertically center the arrow
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: '#404040', // Match the main popup background color
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? '#333333' : '#404040', // Darker background on hover
                  color: 'white',
                }),
                singleValue: (base) => ({
                  ...base,
                  color: 'white',
                }),
              }}
              placeholder={(currentItem.href === "/" || currentItem.href === "/Upcoming") ? "Select Group" : currentItem.label}
            />
          
        </div>

        <div className="flex space-x-[4%]">
          <div className='mt-1 w-[37%] rounded-[3px] text-center text-white font-semibold text-[15px]'
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(0, 0, 0, 0.35)`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0)'}
            onClick={handleNewReminderCancelButton}>
            Cancel
          </div>

          <div className='mt-1 w-[37%] rounded-[3px] text-center  font-semibold text-[15px]'
            style={{ color: '#404040', backgroundColor: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `rgba(255,255, 255, 0.6)`}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
            onClick={handleNewReminderSaveButton}>
            Save
          </div>
        </div>
      </div>
    </div>
  );
};
export default React.memo(NewReminderPopup);
