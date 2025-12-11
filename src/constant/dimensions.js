import { Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const DIMENSIONS = {
    SCREEN_WIDTH: width,
    SCREEN_HEIGHT: height,
}