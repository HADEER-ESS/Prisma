import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Details, Home, Result } from '../screens'
import COLORS from '../constant/colors'

const Stack = createNativeStackNavigator()

const HomeStack = () => {
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
