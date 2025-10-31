import { FavoriteFlow, HomeFlow } from ".";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "@react-native-vector-icons/entypo";
import COLORS from "../constant/colors";


export type RootStackParamList = {
    home_flow: undefined;
    favorite_flow: undefined;
}

const Tab = createBottomTabNavigator<RootStackParamList>();


const RootNavigator = () => {
    return (
        <Tab.Navigator
            initialRouteName="home_flow"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    marginHorizontal: 30,
                    borderRadius: 16,
                    overflow: 'hidden',
                },
                tabBarStyle: {
                    height: 70,
                    paddingHorizontal: 10,
                    borderTopWidth: 0,
                    elevation: 0
                }
            }}
        >
            <Tab.Screen
                options={{
                    tabBarActiveBackgroundColor: COLORS.PRIMARY,
                    tabBarInactiveBackgroundColor: COLORS.WHITE,
                    tabBarIcon: ({ focused }) =>
                        <Entypo name="home" size={24} color={focused ? COLORS.WHITE : COLORS.PRIMARY} />
                }}
                name="home_flow"
                component={HomeFlow}
            />
            <Tab.Screen
                options={{
                    tabBarActiveBackgroundColor: COLORS.PRIMARY,
                    tabBarInactiveBackgroundColor: COLORS.WHITE,
                    tabBarIcon: ({ focused }) =>
                        <Entypo name="heart" size={24} color={focused ? COLORS.WHITE : COLORS.PRIMARY} />

                }}
                name="favorite_flow"
                component={FavoriteFlow}
            />
        </Tab.Navigator>
    )
}

export default RootNavigator;