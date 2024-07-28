import React, { useState } from "react";
import theme1Img from "../Images/theme1Img.png";
import theme2Img from "../Images/theme2Img.png";

const ThemePopup = ({ colorScheme, currentColorSchemeIndex, setThemeMenu, setCurrentColorSchemeIndex }) => {
    const [tempColorSchemeIndex, setTempColorSchemeIndex] = useState(currentColorSchemeIndex);
    return (
        <div className="absolute h-[70vh] w-[90vw] left-[5vw] top-[15vh] rounded-xl drop-shadow-lg flex flex-col justify-center items-center"
            style={{ background: colorScheme.NavBar.background }}>
            <div className="absolute top-[10%] text-center" style={{ color: colorScheme?.SideBar?.text }}>
                <p className="text-2xl">Choose Your Theme</p>
            </div>
            <div className="flex flex-col lg:flex-row justify-center items-center space-x-0 lg:space-x-4 space-y-4 lg:space-y-0 mb-16 mt-12">
                <img src={theme1Img} onClick={() => setTempColorSchemeIndex(0)} className={`h-auto md:max-h-[200px] xl:max-h-[300px] w-auto max-w-[90%] object-contain hover:opacity-50 ${tempColorSchemeIndex === 0 ? 'border-3 border-white rounded-md' : ''}`} />
                <img src={theme2Img} onClick={() => setTempColorSchemeIndex(1)} className={`h-auto md:max-h-[200px] xl:max-h-[300px] w-auto max-w-[90%] object-contain hover:opacity-50 ${tempColorSchemeIndex === 1 ? 'border-3 border-white rounded-md' : ''}`} />
            </div>
            <div className="absolute bottom-[5%] flex space-x-4">
                <button className='rounded-md w-[120px] text-white'
                    onClick={() => {
                        setCurrentColorSchemeIndex(tempColorSchemeIndex);
                        setThemeMenu(false);
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.35)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                    Save
                </button>
                <button className='rounded-md w-[120px] text-white'
                    onClick={() => setThemeMenu(false)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.35)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ''}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ThemePopup;
