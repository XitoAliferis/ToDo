import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const inputValue = (e) => e.target.value;

function isEnterOrEscapeKeyEvent(event) {
    return event.key === 'Enter' || event.key === 'Escape';
}

const ReminderHeader = ({ navItems, colorScheme, isExpanded, handleEditReminder }) => {
    const navigate = useNavigate();
    const EditableLabel = ({ currentItem }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [text, setText] = useState(currentItem.label);
    
        useEffect(() => {
            setText(currentItem.label);
        }, [currentItem.label]);
    
        const onEditEnd = () => {
            const updatedReminder = {id: currentItem.id, name: text, color: currentItem.bgColor, userId: currentItem.userId }; // Ensure 'label' is set to 'text'
            handleEditReminder(updatedReminder);
            setIsEditing(false);
            navigate(updatedReminder.id)
        };
    
        return isEditing ? (
            <input
                value={text}
                className="bg-transparent border-2 border-black border-solid"
                onKeyDown={(event) => {
                    if (isEnterOrEscapeKeyEvent(event)) {
                        event.preventDefault();
                        event.stopPropagation();
                        onEditEnd();
                    }
                }}
                onChange={(e) => setText(inputValue(e))}
                onBlur={onEditEnd}
                autoFocus
            />
        ) : (
            <div className="select-none" onDoubleClick={() => setIsEditing(true)}>
                {text}
            </div>
        );
    };
    
    const location = useLocation();
    const currentPath = location.pathname;
    const currentItem = navItems.find(item => item.href === currentPath) || { href: "/", label: "Today", bgColor: "#EE6B6E" };

    return (
        <p
            className={`relative mb-[-42px] text-[28px] top-[3.7rem] transition-all duration-300 ${isExpanded ? 'left-[15.6rem] max-w-[100vw-15.6rem]' : 'left-[5rem] max-w-[calc(100vw-5rem)]'}`}
            style={{
                color: currentItem.bgColor,
                filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.4))",
            }}
        >
            {currentPath !== "/" && currentPath !== "/Upcoming" ? (
                <EditableLabel currentItem={currentItem} />
            ) : (
                <div>{currentItem.label}</div>
            )}
        </p>
    );
};

export default React.memo(ReminderHeader);
