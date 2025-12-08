import React from 'react'
import { Text, View } from 'react-native'


type props = {
    title: string,
    data?: any[]
}

const DetailsSection = ({ title, data }: props) => {
    return (
        <View>
            {/* Section Title */}
            <Text>{title}</Text>
            {/* the Render data  */}
            <View></View>
        </View>
    )
}

export default DetailsSection
