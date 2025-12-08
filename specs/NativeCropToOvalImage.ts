import { TurboModule, TurboModuleRegistry } from "react-native";



export interface Spec extends TurboModule {
    cropToOvalImage(
        imageUri: string,
        ovalWidth: number,
        ovalHeight: number,
        ovalX: number,
        ovalY: number,
        screenWidth: number,
        screenHeight: number,
    ): Promise<string>;
}


export default TurboModuleRegistry.getEnforcing<Spec>(
    "NativeCropToOvalImage"
)