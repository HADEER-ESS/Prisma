import React from 'react'
import { Text, View, Image } from 'react-native'

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
    return (
        <View>
            <Text> Welcome in Result screen </Text>
            <Image
                source={{ uri: photoUri }}
                resizeMode='contain'
                style={{ width: 300, height: 400 }}
            />
        </View>
    )
}

export default ResultScreen
