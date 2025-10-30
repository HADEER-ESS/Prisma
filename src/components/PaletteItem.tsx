import React from 'react'
import { ColorValue, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import ColorItemView from './ColorItemView'
import COLORS from '../constant/colors'

type Props = {
    name: String,
    toneType: String,
    date: String,
    colorSchemeList: ColorValue[],
}


const PaletteItem = ({ name, toneType, date, colorSchemeList }: Props) => {
    return (
        <View style={styles.container}>
            {/* Text for NAME and TONE */}
            <Text style={styles.textStyle}>
                {name} - {toneType}
            </Text>

            {/* Text for SAVED date */}
            <Text style={styles.textStyle}>{date}</Text>

            <View style={styles.previewActionContainer}>

                {/* container for COLORS SCHEME hint */}
                <FlatList
                    style={styles.colorsSchemeContainer}
                    data={colorSchemeList}
                    renderItem={({ item }) => <ColorItemView color={item} />}
                />
                {/* ACTION btn for preview */}
                <TouchableOpacity
                    style={styles.actionBtnContainer}
                >
                    {/* ICON */}
                </TouchableOpacity>
            </View>


        </View>
    )
}

export default PaletteItem

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderColor: COLORS.PRIMARY,
        borderWidth: 2,
        borderRadius: 12,
        marginVertical: 16
    },
    textStyle: {
        color: COLORS.BLACK,
        fontSize: 16,
        marginVertical: 4
    },
    previewActionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12
    },
    colorsSchemeContainer: {
        flexDirection: 'row',
    },
    actionBtnContainer: {
        backgroundColor: COLORS.PRIMARY,
        padding: 8,
        borderRadius: 8
    },
    actionBtnTextStyle: {
        color: COLORS.WHITE,
        fontSize: 16
    }
})