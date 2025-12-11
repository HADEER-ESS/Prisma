import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
    home_flow: undefined;
    favorite_flow: undefined;
}

export type HomeStackParamList = {
    home_screen: undefined;
    caption_screen: undefined;
    result_screen: { photoUri: string, data: any[] };
    details_screen: { caption: string };
}

export type FavoriteStackParamList = {
    favorite_screen: undefined;
    result_screen: { photoUri: string, data: any[] };
}

export type StackProps = {
    navigation: BottomTabNavigationProp<RootStackParamList, "home_flow">,
    route: RouteProp<RootStackParamList, 'home_flow'>
}

export type HomeNavigationProp = NativeStackNavigationProp<HomeStackParamList>;