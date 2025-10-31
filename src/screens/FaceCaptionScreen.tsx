import React, { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, Linking, StyleSheet, Text, View } from 'react-native'
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import LoadCameraComp from '../components/LoadCameraComp'
import { Canvas, Oval, Rect } from '@shopify/react-native-skia'
import COLORS from '../constant/colors'
import ActionBtn from '../components/ActionBtn'

const FaceCaptionScreen = () => {
    const deviceCamera = useCameraDevice('front')
    const [hasPermission, setHasPermission] = useState(false)
    const cameraRef = useRef<Camera>(null)
    const [isCapturing, setIsCapturing] = useState(false)


    // Define face guide position (centered oval)
    const screenWidth = Dimensions.get('window').width
    const screenHight = Dimensions.get('window').height

    const ovalWidth = screenWidth * 0.8
    const ovalHeight = ovalWidth * 1.2
    const ovalX = (screenWidth - ovalWidth) / 2
    const ovalY = (screenHight - ovalHeight) / 2

    useEffect(() => {
        const getPermission = async () => {
            const status = await Camera.getCameraPermissionStatus()
            console.log("Camera permission status: ", status)
            if (status === 'denied') {
                const newStatus = await Camera.requestCameraPermission()
                setHasPermission(newStatus === 'granted')
                return;
            }
            setHasPermission(status === 'granted')
        }
        getPermission()
    }, [])

    const capturePhoto = async () => {
        if (!cameraRef.current) return;

        setIsCapturing(true)

        try {
            const photo = await cameraRef.current.takePhoto({
                flash: 'off',
                enableShutterSound: false,
            })
            console.log("Photo captured: ", photo)

            //send photo to google AI api for skin tone detection

        } catch (error) {
            console.error("Error capturing photo: ", error)
        } finally {
            setIsCapturing(false)
        }
    }


    if (!hasPermission) return (
        <View>
            <Text>No Camera Access</Text>
            <ActionBtn
                text={"activate Camera"}
                textColor={COLORS.WHITE}
                backgroundColor={COLORS.PRIMARY}
                onClick={() => Linking.openSettings()}
            />
        </View>
    )
    if (!deviceCamera) return <LoadCameraComp loadingText="Loading camera..." />

    return (
        <View style={{ flex: 1 }}>
            {
                cameraRef.current && !isCapturing ?
                    <LoadCameraComp loadingText="Detecting Skin Tone..." /> :
                    <>
                        <Camera
                            ref={cameraRef}
                            device={deviceCamera}
                            isActive={true}
                            photo={true}
                            style={StyleSheet.absoluteFill}
                        />

                        {/* Overlay with face guide */}
                        <Canvas style={StyleSheet.absoluteFill} pointerEvents='none'>
                            {/* Grey semi-transparent overlay */}
                            <Rect
                                x={0}
                                y={0}
                                width={screenWidth}
                                height={screenHight}
                                color={'rgba(0, 0, 0, 0.5)'}
                            />

                            {/* Clear oval area (cutout effect) */}
                            <Oval
                                x={ovalX}
                                y={ovalY}
                                width={ovalWidth}
                                height={ovalHeight}
                                style={'fill'}
                                color={'transparent'}
                                blendMode={'clear'}
                            />

                            {/* Oval border guide */}
                            <Oval
                                x={ovalX}
                                y={ovalY}
                                width={ovalWidth}
                                height={ovalHeight}
                                style={'stroke'}
                                strokeWidth={3}
                                color={COLORS.WHITE}
                            />
                        </Canvas>

                        {/* Capture Section */}
                    </>

            }
        </View>
    )
}

export default FaceCaptionScreen
