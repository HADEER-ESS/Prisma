import React from 'react'
import { Favorite, Result } from '../screens';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import COLORS from '../constant/colors';
import { FavoriteStackParamList } from './types';


const Stack = createNativeStackNavigator<FavoriteStackParamList>()


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
                name='result_screen'
                component={Result}
            />
        </Stack.Navigator>
    )
}

export default FavoriteStack
