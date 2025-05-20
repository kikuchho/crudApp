import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/context/themeContext";


export default function RootLayout() {
  // return(

  //   <SafeAreaProvider>
    
  //   <Stack />;
    
  //   </SafeAreaProvider>

  // )

  return(

    <ThemeProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen  name="index"    />
          <Stack.Screen  name="todos/[id]"   />
        </Stack>
      </SafeAreaProvider>
    </ThemeProvider>
    

  )

    
}
