import { Children, createContext, ReactNode, useState } from "react";
import { Appearance } from "react-native";
import { Colors } from "@/constants/Colors";

interface ThemeContextType {
    colorScheme: "light" | "dark" ;
    setColorScheme: (scheme: "light" | "dark" ) => void;
    theme: typeof Colors.light | typeof Colors.dark;
  }

export const ThemeContext = createContext<ThemeContextType| undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
  }

//export const ThemeProvider =
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children  }) => {
    
    const [colorScheme, setColorScheme ]  = useState<"light" | "dark" >( Appearance.getColorScheme() ?? "light") // get current colorscheme and pull it to here 

    const theme = colorScheme === 'dark' ? Colors.light : Colors.dark;

    return(

        <ThemeContext.Provider  value={
            {colorScheme, setColorScheme, theme }
        }>

        {children}

        </ThemeContext.Provider >


    )

}

// if it is in jsx
// import { createContext, useState } from 'react'
// import { Appearance } from 'react-native'
// import { Colors } from '../constants/Colors'

// export const ThemeContext = createContext({})

// export const ThemeProvider = ({ children }) => {
//     const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme())

//     const theme = colorScheme === 'dark'
//         ? Colors.dark
//         : Colors.light

//     return (
//         <ThemeContext.Provider value={{
//             colorScheme, setColorScheme, theme
//         }}>
//             {children}
//         </ThemeContext.Provider>
//     )
// }