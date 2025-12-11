import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack'
import React, { useLayoutEffect } from 'react'
import { FaceCaption, Home, Result } from '../screens'
import COLORS from '../constant/colors'
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native'
import { HomeStackParamList, StackProps } from './types'




const Stack = createNativeStackNavigator<HomeStackParamList>()



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
        </Stack.Navigator>
    )
}

export default HomeStack


