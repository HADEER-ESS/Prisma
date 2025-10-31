import React from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import COLORS from '../constant/colors'


type props = {
    loadingText: String
}

const LoadCameraComp = ({ loadingText }: props) => {
    return (
        <View style={styles.container}>
            {/* Circular Loader */}
            <ActivityIndicator
                size={'large'}
                color={COLORS.PRIMARY}
                style={{ transform: [{ scale: 6 }] }}
            />
            <Text style={styles.loadingText}>
                {loadingText}
            </Text>
        </View>
    )
}

export default LoadCameraComp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    loadingText: {
        marginTop: 80,
        fontSize: 22,
        color: COLORS.WHITE
    }
})
