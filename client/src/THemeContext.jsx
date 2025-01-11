import { createContext , useEffect , useState } from "react";

const ThemeContext = createContext();

function ThemeContextProvider({children}){
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setTheme(savedTheme);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    return(
        <ThemeContext.Provider value={{ theme , toggleTheme }}>{children}</ThemeContext.Provider>
    )
}

export { ThemeContext , ThemeContextProvider };