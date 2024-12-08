import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons"
import { useLocalSearchParams } from "expo-router";
import Acasa from "./acasa";
import Cont from "./cont";
import Cosulmeu from "./cosulmeu";


const Tab = createBottomTabNavigator();

export default function Mainpage() {

    const {idUtilizator} = useLocalSearchParams<{idUtilizator:string}>();

    return (
        <Tab.Navigator 
        initialRouteName="Cosul meu"
        screenOptions={{
            headerShown:true,
            tabBarShowLabel:false,
            tabBarActiveTintColor:"#FF0000",
            tabBarInactiveTintColor:"grey"
        }}
        >

            <Tab.Screen name = "Cosul meu"
            component={Cosulmeu} 
            options={{
                tabBarIcon: ({color,size})=>{
                    return <Ionicons name={"add-circle"} size={30} color={color} />
                },
                unmountOnBlur: true
            }}
            initialParams={{ idUtilizator: idUtilizator}}
            >
            </Tab.Screen>

            <Tab.Screen name = "Cont"
            component={Cont}
            options={{
                tabBarIcon: ({color,size})=>{
                    return <Ionicons name={"settings-sharp"} size={30} color={color} />
                },
                unmountOnBlur: true
            }}
            initialParams={{idUtilizator: idUtilizator}}
            >
            </Tab.Screen>

        </Tab.Navigator>

    );
}