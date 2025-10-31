import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ActionBtn from '../components/ActionBtn'
import COLORS from '../constant/colors'
import { useNavigation } from '@react-navigation/native'

const HomeScreen = () => {
    const navigation = useNavigation()
    const takeLivePhoto = () => {
        navigation.navigate("caption_screen" as never)
    }
    return (
        <View style={styles.fullScreen}>
            <Text style={styles.mainTextStyle}>
                Let your skin tone
                <Text style={{ color: COLORS.PRIMARY }}>{' '}guide{' '}</Text>
                your style.
                Find the
                <Text style={{ color: COLORS.PRIMARY }}>{' '}colors{' '}</Text>
                that love you back.
            </Text>
            <ActionBtn
                text={"Take a Photo"}
                textColor={COLORS.WHITE}
                backgroundColor={COLORS.PRIMARY}
                onClick={takeLivePhoto}
            />
        </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        padding: 16,
        justifyContent: 'center'
    },
    mainTextStyle: {
        fontSize: 24,
        textAlign: 'center',
        marginVertical: 40,
        color: COLORS.BLACK,
        alignSelf: 'center',
        maxWidth: '65%'
    }
})
