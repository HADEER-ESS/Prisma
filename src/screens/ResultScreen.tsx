import React, { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { Text, View, Image, StyleSheet, FlatList } from 'react-native'
import DetailsSection from '../components/DetailsSection'
import ActionBtn from '../components/ActionBtn'
import COLORS from '../constant/colors'
import SeasonItem from '../components/SeasonItem'
import { seasons } from '../data/minimalData'
import { PERSONAL_COLORS } from '../data'
import { PersonalColorId } from '../types/personalColorSeason'
import { useNavigation } from '@react-navigation/native'
import { HomeNavigationProp } from '../stack/types'
import SunShinePreview from '../components/SunShinePreview'

type Props = {
    route: {
        params: {
            photoUri: string,
        }
    }
}

const ResultScreen = ({ route }: Props) => {
    const { photoUri } = route.params;
    const [seasonName, setSeasonName] = useState<PersonalColorId>();
    const navigation = useNavigation<HomeNavigationProp>()

    const colorPallate = useMemo(() => {
        return PERSONAL_COLORS.find(season => season.id === seasonName)?.bestColors || []
    }, [seasonName])


    return (
        <View style={styles.container}>
            <SunShinePreview colorsList={colorPallate} />
            <View style={styles.pallateContainerView}>
                <Image
                    source={{ uri: photoUri }}
                    resizeMode='contain'
                    style={styles.imageStyle}
                />
            </View>

            <Text>Select The Sweatable Color Season</Text>
            <FlatList
                data={seasons}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <SeasonItem fun={() => setSeasonName(item.id)} title={item.displayName} icon={item.icon} />
                )}
            />
            <ActionBtn
                text={"Show Details"}
                textColor={COLORS.WHITE}
                backgroundColor={COLORS.PRIMARY}
                onClick={() => {
                    //Navigate to Details Screen
                    navigation.navigate("details_screen", { season: seasonName })
                }}
            />
            {/* Make save in the next screen where user have the ability to test all colors in pallete separatly */}
            {/* and contain the rest information about the tone color */}
            {/* <ActionBtn
                text={"Save Palette"}
                textColor={COLORS.PRIMARY}
                backgroundColor={COLORS.WHITE}
                onClick={() => {
                    //Where Caching the Palatte data in MMKV Storage
                }}
            /> */}
        </View>
    )
}

export default ResultScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    pallateContainerView: {

    },
    imageStyle: {
        width: 300,
        height: 350,
        // borderRadius: 25,
        resizeMode: 'contain',
        justifyContent: 'flex-end',
        alignItems: 'flex-end'
    }
})
