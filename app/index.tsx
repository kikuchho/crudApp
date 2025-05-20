import { Link, useRouter } from "expo-router";
import { ReactNode, useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/themeContext";

import { Text, View, StyleSheet, Pressable, TextInput, FlatList } from "react-native";
import { SafeAreaView } from "react-native";
import { data } from "@/data/todos"
import AntDesign from '@expo/vector-icons/AntDesign';
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import { Octicons } from "@expo/vector-icons";
import Animated, {LinearTransition} from "react-native-reanimated";

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Index() {
  
  // const [todos , setTodos] = useState( data.sort( (a, b) => b.id - a.id ) ); // if not using the useeffect and asyncstorage this is it
  const [todos , setTodos] = useState<Todo[]>( [] ); 
  const [text, setText] = useState("");

  const themeContext = useContext(ThemeContext);
  //const { colorScheme, setColorScheme, theme} = useContext(ThemeContext) // if its in jsx 
  const [loaded, error] = useFonts({ Inter_500Medium,})
  const styles = createStyle(themeContext?.theme, themeContext?.colorScheme)
  const router = useRouter()

  //useeffect for fetching data 
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if (storageTodos && storageTodos.length){
          setTodos(storageTodos.sort( (a : any, b :any) => b.id -a.id    ))
          console.log(" todo item in async storage ")
        }else {
          setTodos(data.sort((a,b) => b.id -a.id ))
          console.log(" loading from 'data'  ")
        }
      } catch (e){
        console.error(e)
      }
    }

    //call the function just above
    fetchData()
  }, [data]  )

  //useeffect for saving the data 
  useEffect(() => {
      const storeData = async () => {
        try {
          const jsonValue = JSON.stringify(todos)
          await AsyncStorage.setItem("TodoApp",  jsonValue)

        } catch (e) {
          console.error(e)
        }
      }
      
      storeData()
    }, [todos]
  )

  //wait until the fonts is loaded 
  if(!loaded && !error){

    return null;
  }


  const addTodo = () => {
    if ( text.trim() ) {
      const newId  = todos.length > 0 ? todos[0].id + 1 : 1;

      setTodos([ { id: newId, title: text, completed: false    }, ...todos ])
      setText('');
    }
  }


  function toggleTodo(id : number) {
    setTodos( 
      todos.map( 
        (todo) => {
          //find the todo that matches the id and toggle the complete property 
          return todo.id === id ?      {...todo, completed: !todo.completed} : todo
        }
       )
    )
  }



  function removeTodo( id : number ) {
    // avoid splice since it mutate the original array 
    setTodos(todos.filter( (todo) => todo.id !== id )  )
  }


  const  handlePress = (id : number) => {
    router.push(`/todos/${id}`);
    
  }


  // or function renderItem({ item }: { item: Todo }) or { item }: any
  function renderItem( {item } : { item: Todo } ) {
    return(
    //logical and operator 
    <View style={styles.todoItem}>
      <Pressable 
        onPress={ () => handlePress(item.id)  } //this opens edit screen 
        onLongPress={ () => toggleTodo(item.id)   }>
        <Text style={[styles.todoText ,  item.completed && styles.completedText  ]}   > {item.title}  </Text>
        {/* <Text style={[styles.todoText ,  item.completed && styles.completedText  ]}   onPress={ () => toggleTodo(item.id)   }> {item.title}  </Text> */}
      </Pressable>
      <Text style={[styles.todoText ,  item.completed && styles.completedText  ]}   onPress={ () => toggleTodo(item.id)   }></Text>
      <Pressable   onPress={ () => removeTodo(item.id)   }>
        <AntDesign name="delete" size={36} color="orange" />
      </Pressable>
      <Pressable   onPress={ () => removeTodo(item.id)   }>
        <AntDesign name="delete" size={36} color="orange" />
      </Pressable>
      <Pressable   onPress={ () => themeContext?.setColorScheme( themeContext.colorScheme === 'light' ? "dark" : "light" )}  style={{ marginLeft: 10   }}  >
        { themeContext?.colorScheme === 'dark'? <Octicons name="moon" size={36} color={themeContext.theme.text} selectable={undefined} style={{width: 36}} />  
         :  <Octicons name="sun" size={36} color={themeContext?.theme.text} selectable={undefined} style={{width: 36}} /> }
      </Pressable>
    </View>
    )
  }


  //as child prop will forward all props to the first child of the Link component. 
  return (
    <SafeAreaView  style={ styles.container  } >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >

        <Link href={'/home'} >  
        <Pressable>
          
          {({ pressed }) => (
            <Text style={{ color: pressed ? "gray" : "black" }}>Go to Home</Text>
          )}
        </Pressable>  
        
        </Link>
      </View>

      <View style={styles.inputContainer} >
          {/* //pressable and textinput is exclusive to react native  */}
        <TextInput 
          style={styles.input   }
          maxLength={30}
          placeholder= " Add your new todo "
          placeholderTextColor= "gray" 
          value={text}
          onChangeText={((value) => setText(value))} // or {setText}

        />

        <Pressable  onPress={addTodo} style={styles.addButton} >
          <Text  style={styles.addButtonText} > Add to list  </Text>
        </Pressable>

        <Pressable
          onPress={() => themeContext?.setColorScheme(themeContext?.colorScheme === 'light' ? 'dark' : 'light')} style={{ marginLeft: 10 }}>

          <Octicons name={themeContext?.colorScheme === 'dark' ? "moon" : "sun"} size={36} color={themeContext?.theme.text} selectable={undefined} style={{ width: 36 }} />

        </Pressable>
        
      </View>

{/* unlike the noraml flatlist , yhis adds anination  */}
      <Animated.FlatList
        data={todos}
        // renderItem={ ( {item} ) => {
        //   return (
        //     <View>
        //       <Text> {item.title}</Text>

        //       <Text> {item.completed}  </Text>
        //     </View>
        //   )
        // }}
        renderItem={renderItem}
        keyExtractor={ todo =>  todo.id.toString() }
        contentContainerStyle =  { {flexGrow: 1}  }
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode={"on-drag"}
      />

    </SafeAreaView>
    
  );
}

function createStyle(theme : any, colorScheme : any) {

  return StyleSheet.create({
    container: {
      flex : 1,
      width: '100%',
      //backgroundColor: theme.background,
      backgroundColor: theme.background,
    },

    inputContainer: {

      flexDirection: 'row',
      alignContent: 'center', 
      marginBottom: 10 , 
      padding: 10,
      width: '100%', 
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',


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
      minWidth: 0,
      color: theme.text,

    },

    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10,
    },

    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'light'   ,

    },

    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10, 
      borderBottomColor: 'gray',
      borderBottomWidth: 1,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto',
    },

    todoText: {
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      color: theme.text,
    },
    completedText: {
      textDecorationColor: 'line-through',
      color: 'gray',
    }

  })

}


const styles = StyleSheet.create({
  container: {
    flex : 1,
    width: '100%',
    //backgroundColor: theme.background,
    backgroundColor: 'black',
  },

  inputContainer: {

    flexDirection: 'row',
    alignContent: 'center', 
    marginBottom: 10 , 
    padding: 10,
    width: '100%', 
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',


  },

  input: {
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10, 
    fontSize: 0, 
    fontFamily: 'Inter_500Medium',
    color: 'white',

  },

  addButton: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
  },

  addButtonText: {
    fontSize: 18,
    color: 'white'   ,

  },

  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    padding: 10, 
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
    maxWidth: 1024,
    marginHorizontal: 'auto',
    pointerEvents: 'auto',
  },

  todoText: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter_500Medium',
    color: 'white',
  },
  completedText: {
    textDecorationColor: 'line-through',
    color: 'gray',
  }

})
