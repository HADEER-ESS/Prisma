import React, { useLayoutEffect } from 'react'
import { Text, View, Image, StyleSheet } from 'react-native'
import DetailsSection from '../components/DetailsSection'
import ActionBtn from '../components/ActionBtn'
import COLORS from '../constant/colors'

type Props = {
    route: {
        params: {
            photoUri: string
        }
    }
}

const ResultScreen = ({ route }: Props) => {
    const { photoUri } = route.params;

    console.log('Received photo URI:', photoUri);

    //CALL GOOGLE AI API here to get the image analysis result
    useLayoutEffect(() => { }, [])
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: photoUri }}
                resizeMode='contain'
                style={styles.imageStyle}
            />
            <DetailsSection
                title="Undertone"
            />
            <DetailsSection
                title="Season"
            />
            <DetailsSection
                title="Best Colors"
            />
            <DetailsSection
                title="Avoid Colors"
            />
            <DetailsSection
                title="Clothing Colors"
            />
            <DetailsSection
                title="Makeup"
            />
            <DetailsSection
                title="Accessories"
            />
            {/* <ActionBtn
                text={"Show Details"}
                textColor={COLORS.WHITE}
                backgroundColor={COLORS.PRIMARY}
                onClick={() => {
                    //Navigate to Details Screen
                    //Navigate with Data from Google AI API
                }}
            /> */}
            <ActionBtn
                text={"Save Palette"}
                textColor={COLORS.PRIMARY}
                backgroundColor={COLORS.WHITE}
                onClick={() => {
                    //Where Caching the Palatte data in MMKV Storage
                }}
            />
        </View>
    )
}

export default ResultScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
