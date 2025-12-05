import React from 'react'
import { ColorValue, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native'

type Props = {
    text: String,
    backgroundColor: ColorValue,
    textColor: ColorValue,
    onClick: () => void
}

const ActionBtn = ({ text, textColor, backgroundColor, onClick }: Props) => {
    return (
        <TouchableOpacity
            style={[styles.btnContainer, { backgroundColor: backgroundColor }]}
            onPress={onClick}
        >
            <Text style={[styles.btnText, { color: textColor }]}>
                {text}
            </Text>
        </TouchableOpacity>
    )
}

export default ActionBtn

const styles = StyleSheet.create({
    btnContainer: {
        // flex: 1,
        marginHorizontal: 24,
        borderRadius: 12
    },
    btnText: {
        textAlign: 'center',
        fontSize: 21,
        paddingVertical: 12,
        paddingHorizontal: 12
    }
})
