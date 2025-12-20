import React, { memo } from 'react'
import { Text, TouchableOpacity } from 'react-native'

type Props = {
    title: string,
    icon: string,
    fun: () => void,
}

const SeasonItem = memo(({ title, icon, fun }: Props) => {
    return (
        <TouchableOpacity onPress={fun}>
            <Text>{icon}</Text>
            <Text>{title}</Text>
        </TouchableOpacity>
    )
})

export default SeasonItem
