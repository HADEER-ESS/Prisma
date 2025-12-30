import React, { useState } from 'react'
import { ColorValue, StyleSheet, Text, TextStyle, TouchableOpacity } from 'react-native'

type Props = {
    text: String,
    backgroundColor: ColorValue,
    textColor: ColorValue,
    onClick: () => void
}

const ActionBtn = ({ text, textColor, backgroundColor, onClick }: Props) => {
    const [showText, setShowText] = useState<boolean>(false)

    return (
        <TouchableOpacity
            style={[styles.btnContainer, { backgroundColor: backgroundColor }]}
            accessibilityRole="button"  //now we can test this component using _*ByRole
            // onPress={onClick}
            onPress={() => {
                setTimeout(() => {
                    setShowText(!showText)
                }, 5000)
            }}
            onLongPress={() => {
                setTimeout(() => {
                    setShowText(!showText)
                }, 5000)
            }}
        >
            <Text style={[styles.btnText, { color: textColor }]}>
                {text}
            </Text>
            {showText && <Text testID='show_text' style={{ textAlign: 'center', color: textColor as TextStyle['color'] }}>Hello For TEST...</Text>}
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
