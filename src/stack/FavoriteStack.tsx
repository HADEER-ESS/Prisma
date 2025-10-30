import React from 'react'
import { Favorite, Preview } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '../constant/colors';


const Stack = createNativeStackNavigator()


const FavoriteStack = () => {
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
                name='favorite_screen'
                component={Favorite}
            />
            <Stack.Screen
                name='preview_screen'
                component={Preview}
            />
        </Stack.Navigator>
    )
}

export default FavoriteStack
