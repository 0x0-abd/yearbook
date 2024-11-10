import { Link } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";

let tabs = [
    { id: "", label: "Home" },
    { id: "onboarding", label: "Profile" },
    { id: "friends", label: "Friends" },
    { id: "yearbook", label: "Yearbook" },
];

export default function AnimatedTabs() {
    const location = useLocation();
    const isBg = location.pathname === "/bg"
    let path = location.pathname.substring(1)
    const dropdownRef = useRef(null);

    let [activeTab, setActiveTab] = useState(isBg ? tabs[0].id : path);
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    const [buttonWidth, setButtonWidth] = useState(0);
    const buttonRef = useRef(null);

    useEffect(() => {
        if (buttonRef.current) {
            setButtonWidth(buttonRef.current.getBoundingClientRect().width);
        }
    }, [showYearDropdown]);

    useEffect(() => {
        setActiveTab(location.pathname.substring(1));
        setShowYearDropdown(false); // Close dropdown on tab change
    }, [location.pathname]);

    const handleYearbookClick = (event) => {
        event.stopPropagation();
        if (showYearDropdown) {
            setShowYearDropdown(false); // Close the dropdown if it's already open
        } else {
            setShowYearDropdown(true); // Open the dropdown if it's closed
        }
        // console.log('button click' + showYearDropdown)
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !event.target.classList.contains('yearbook-button')) {
                setShowYearDropdown(false);
            }
            // console.log('useeffect')
        };

        document.addEventListener('pointerdown', handleClickOutside);
        return () => {
            document.removeEventListener('pointerdown', handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <>
            <nav className={`z-10 flex w-full justify-center left-0 top-0 ${isBg ? "hidden" : ""}`}>
                <div className="flex rounded-full backdrop-blur-xl fixed space-x-1 z-30 top-4 lg:space-x-4 ">
                    {tabs.map((tab) => (
                        <div key={tab.id} className="relative">
                            {tab.id === "yearbook" ? (
                                // Yearbook as a button to toggle dropdown
                                <button 
                                    ref={buttonRef}
                                    onClick={handleYearbookClick}
                                    className={`${showYearDropdown ? " bg-sky-500 bg-opacity-40" : "hover:opacity-50"} yearbook-button duration-300 text-[18px] rounded-full px-3 py-1.5 font-medium text-white outline-2 outline-sky-400 focus-visible:outline lg:text-2xl lg:px-5`}
                                >
                                    {tab.label}
                                </button>
                            ) : (
                                // Other tabs as links
                                <Link to={`/${tab.id}`}>
                                    <button
                                        className={`${activeTab === tab.id ? " bg-sky-500 bg-opacity-40" : "hover:opacity-50"} duration-300 text-[18px] rounded-full px-3 py-1.5 font-medium text-white outline-2 outline-sky-400 focus-visible:outline lg:text-2xl lg:px-5`}
                                    >
                                        {tab.label}
                                    </button>
                                </Link>
                            )}
                            {/* Render dropdown for Yearbook when it's clicked */}
                            {tab.id === "yearbook" && showYearDropdown && (
                                <div ref={dropdownRef} style={{ width: buttonWidth }} className="absolute left-0 mt-2 w-48 backdrop-blur-lg bg-sky-800 bg-opacity-90 rounded-lg shadow-lg z-40 lg:text-md">
                                    <ul className="py-2 text-white">
                                        <li>
                                            <Link to="/yearbook" className="block px-4 py-2 hover:bg-sky-700">
                                                Y-20
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/yearbook" className="block px-4 py-2 hover:bg-sky-700">
                                                Y-21
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/yearbook" className="block px-4 py-2 hover:bg-sky-700">
                                                Y-22
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/yearbook" className="block px-4 py-2 hover:bg-sky-700">
                                                Y-23
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

            </nav>
            {/* <div className="z-10 flex w-full justify-center left-0 top-0 pb-6 pt-6">
                <div className="z-20 h-5 w-5 fixed rounded-full bg-red-500">Bleh</div>
            </div> */}
        </>
    );
}