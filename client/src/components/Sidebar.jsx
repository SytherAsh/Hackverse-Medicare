import { createContext, useContext, useState , useEffect } from "react";

import { Link, Navigate } from "react-router-dom";
import { AiOutlineMenuFold } from "react-icons/ai";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import { ThemeContext } from "../THemeContext";

const SidebarContext = createContext();

function Sidebar({ children, isOpen, toggleSidebar }) {
    const [expanded, setExpanded] = useState(isOpen);
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        setExpanded(isOpen);
    }, [isOpen]);


    return (
        <>
            <aside className={`fixed h-screen ${theme === 'light' ? '' : 'bg-black text-white'}`}>
                <nav className="h-full flex flex-col border-r shadow-sm">
                    <div className="p-6 pb-2 flex justify-between items-center">
                        <div className={`flex items-center overflow-hidden transition-all ${expanded ? "" : "w-0"}`}>
                            <h1 className="font-extrabold  ml-2 text-3xl">BeyondCare</h1>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button onClick={toggleSidebar} className="p-1.5 rounded-lg m-4 hover:bg-gray-100">
                            {expanded ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />  }
                        </button>
                    </div>
                    <SidebarContext.Provider value={{ expanded }}>
                        <ul className="flex-grow px-3 mb-1">
                            {children}
                        </ul>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    );
}

export default Sidebar;

export function SidebarItem({ icon, text, active, alert, to }) {
    const { expanded } = useContext(SidebarContext);
    return (
        <Link to={to} className={`relative flex items-center py-2 px-3 my-1 font-md rounded-md cursor-pointer transition-colors group ${active ? "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-700" : "hover:bg-indigo-50 text-gray-600"}`} >
            {icon}
            <span className={`overflow-hidden transition-all ${expanded ? "ml-3" : "w-0"}`}>{text}</span>
            {alert && (
                <div className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${expanded ? "" : "top-2"}`}>

                </div>
            )}

            {!expanded && (
                <div className={`absolute left-full rounded-md px-2 py-1 ml-6 bg-indigo-100 text-indigo-800 invisible opacity-20 translate-x-3 transition-all group-hover:visible group-hover:opacity-100 group-hover:translate-x-0`}>
                    {text}
                </div>
            )}
        </Link>
    );
}