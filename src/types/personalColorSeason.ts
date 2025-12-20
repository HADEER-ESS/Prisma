export interface PersonalColorSeason {
    id: PersonalColorId
    displayName: string
    icon: string
    description: string

    bestColors: string[]
    worstColors: string[]

    makeup: {
        foundation: string[]
        blush: string[]
        lipstick: string[]
        eyeshadow: string[]
    }

    accessories: {
        metals: string[]
        glasses: string[]
    }

    hairColors: {
        best: string[]
        avoid: string[]
    }
}


export type PersonalColorId =
    "spring_warm" |
    "summer_cool" |
    "autumn_warm" |
    "winter_cool"