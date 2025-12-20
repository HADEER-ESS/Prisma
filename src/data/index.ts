import springWarm from "./Spring.json"
import summerCool from "./Summer.json"
import autumnWarm from "./Autum.json"
import winterCool from "./Winter.json"

import type { PersonalColorSeason } from "../types/personalColorSeason"

export const PERSONAL_COLORS: PersonalColorSeason[] = [
    springWarm as PersonalColorSeason,
    summerCool as PersonalColorSeason,
    autumnWarm as PersonalColorSeason,
    winterCool as PersonalColorSeason,
]