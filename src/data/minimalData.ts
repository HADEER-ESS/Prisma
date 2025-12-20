import { PersonalColorId } from "../types/personalColorSeason";

type MinimalSeason = {
    id: PersonalColorId;
    icon: string;
    displayName: string;
};


export const seasons: MinimalSeason[] = [
    { id: "spring_warm", displayName: "Spring Warm", icon: "🌸" },
    { id: "summer_cool", displayName: "Summer Cool", icon: "🌊" },
    { id: "autumn_warm", displayName: "Autumn Warm", icon: "🍂" },
    { id: "winter_cool", displayName: "Winter Cool", icon: "❄️" },
];