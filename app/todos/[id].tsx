import { useLocalSearchParams } from "expo-router"; 
import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import { useState, useEffect, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "@/context/themeContext";
import { StatusBar } from "expo-status-bar";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import { Octicons } from "@expo/vector-icons"; //"@expo/vector-icons/Octicons"
import  AsyncStorage  from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Todo } from "..";


export default function EditScreen() {

    const { id  } = useLocalSearchParams() as { id: string } ; // In JavaScript, curly braces {} are used for object literals and destructuring. 
    const [todo, setTodo] = useState<Todo | null >( null );
    // const obj = { name: "Yuto", age: 1980 };
    // const { name, age } = obj;
    // console.log(name); // "Yuto"
    // console.log(age);  // 1980
    const themeContext = useContext(ThemeContext);
    const styles = createStyle(themeContext?.theme, themeContext?.colorScheme)
    const [loaded, error] = useFonts({ Inter_500Medium,})
    const router = useRouter()
    

    // load data 
    useEffect( () => {

        const fetchData = async (id : string) => {

            try {
                const jsonValue = await AsyncStorage.getItem('@key')
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null;

                
                if(storageTodos && storageTodos.length){
                    const myTodo = storageTodos.find( (todo: Todo)  => todo.id.toString() === id )
                    //setTodo(storageTodos[id])
                    setTodo( myTodo  )
                }
                

              } catch(e) {
                console.log(e)
              } 
        }
        fetchData(id);

    } , [id] )

    //wait until the fonts is loaded 
    if(!loaded && !error){

        return null;
    }


    //save data
    const handleSave = async () => {

        try {
            const savedTodo = { ...todo, title : todo?.title }

            const jsonValue = await AsyncStorage.getItem('TodoApp');
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            //filter out the oldtodo that was being edited 
            if(storageTodos && storageTodos.length){
                const otherTodos = storageTodos.filter( (todo : Todo) => todo.id !== savedTodo.id  )

                //combine all together and store to asyncstorage 
                const allTodos = [ ...otherTodos, savedTodo]

                await AsyncStorage.setItem('TodoApp', JSON.stringify(allTodos) )

            }else{
                //or else everything was deleted for some reason and there was no todo in list 
                await AsyncStorage.setItem('TodoApp', JSON.stringify([savedTodo])    )
            }
            
            router.push('/')
        } catch (e) {
            console.log(e)
        }

    }



    //const styles = createStyle(themeContext?.theme, themeContext?.colorScheme)
    

    return(
        <SafeAreaView  style = {styles.container} >
            <View style={styles.inputContainer}  >
                <TextInput
                    style={styles.input}
                    maxLength={30}
                    placeholder="edit the text"
                    placeholderTextColor={'gray'}
                    value={todo?.title || ''}
                    onChangeText={(text) => { setTodo( (prev1) => (prev1 ? {...prev1, title: text} : prev1 ))  }} //it is doing this : setTodo( { ...Todo, title: text  }  ) , prev1 is the current state of Todo
                
                />
                <Pressable   onPress={ () => themeContext?.setColorScheme( themeContext.colorScheme === 'light' ? "dark" : "light" )}  style={{ marginLeft: 10   }}  >
                    { themeContext?.colorScheme === 'dark'? <Octicons name="moon" size={36} color={themeContext.theme.text} selectable={undefined} style={{width: 36}} />  
                    :  <Octicons name="sun" size={36} color={themeContext?.theme.text} selectable={undefined} style={{width: 36}} /> }
                </Pressable>
            </View>
            <View style={styles.container} >
                <Pressable
                    onPress={handleSave}
                    style = {styles.saveButton}
                >
                    <Text style={styles.saveButtonText}> save  </Text>
                </Pressable>

                <Pressable 
                     onPress={ () => { router.push('/')   } }
                     style = { [  styles.saveButton  , { backgroundColor: 'red'  } ]   }
                >
                    <Text style={  [ styles.saveButtonText , {color: 'white'}  ]    }> cancel  </Text>
                </Pressable>
            </View>
            <StatusBar style={themeContext?.colorScheme  === 'dark' ? 'light' : 'dark' } />
        </SafeAreaView>
        

    )
}


const createStyle  = (theme : any, colorScheme: any) => {
    return(
        StyleSheet.create(
            {
                container: {
                    flex: 1,
                    width: '100%',
                    backgroundColor: theme.background
                },
                inputContainer: {
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    gap: 6,
                    width: '100%',
                    maxWidth: 1024,
                    marginHorizontal: 'auto', //center horizontally 
                    pointerEvents: 'auto', // to avoid the warning 

                },
                input: {
                    flex: 1, 
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    marginRight: 10,
                    fontSize: 18,
                    fontFamily: 'Inter_500Medium',
                    minWidth: 0, //shrink input field for smaller screen 
                    color: theme.text,
                },
                saveButton: {
                    backgroundColor: theme.button,
                    borderRadius: 5,
                    padding: 10,
                },
                saveButtonText: {
                    fontSize: 18,
                    color: colorScheme === 'dark'? 'black' : 'white',
                }


            }
        )
    )
}