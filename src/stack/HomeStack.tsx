import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useLayoutEffect } from 'react'
import { Details, FaceCaption, Home, Result } from '../screens'
import COLORS from '../constant/colors'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { RootStackParamList } from './RootNavigator'

type HomeStackParamList = {
    home_screen: undefined;
    caption_screen: undefined;
    result_screen: { photoUri: string };
    details_screen: { caption: string };
}

const Stack = createNativeStackNavigator<HomeStackParamList>()

type StackProps = {
    navigation: BottomTabNavigationProp<RootStackParamList, "home_flow">,
    route: RouteProp<RootStackParamList, 'home_flow'>
}

const HomeStack = ({ navigation, route }: StackProps) => {

    useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? "home_screen"

        if (routeName === "caption_screen") {
            navigation.setOptions({ tabBarStyle: { display: 'none' } })
        } else {
            navigation.setOptions({ tabBarStyle: { display: 'flex' } })
        }
    })


    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                contentStyle: {
                    backgroundColor: COLORS.WHITE
                }
            }}
        >
            <Stack.Screen
                name='home_screen'
                component={Home}
            />
            <Stack.Screen
                name='caption_screen'
                component={FaceCaption}
            />
            <Stack.Screen
                name='result_screen'
                component={Result}
            />
            <Stack.Screen
                name='details_screen'
                component={Details}
            />
        </Stack.Navigator>
    )
}

export default HomeStack

export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;
