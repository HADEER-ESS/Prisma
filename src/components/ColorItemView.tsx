import React, { memo } from 'react'
import { ColorValue, View } from 'react-native'

type Props = {
    color: ColorValue
}

const ColorItemView = memo(({ color }: Props) => (
    <View
        style={{
            backgroundColor: color,
            width: 50,
            height: 50,
            borderRadius: 20
        }}
    />
),
    (prevProp, nextProp) => prevProp.color === nextProp.color
)

export default ColorItemView
