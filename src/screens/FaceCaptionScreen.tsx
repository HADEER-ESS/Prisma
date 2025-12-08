import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Dimensions, Linking, StyleSheet, Text, View, Alert, Platform } from 'react-native'
import FaceDetection from '@react-native-ml-kit/face-detection'
import LoadCameraComp from '../components/LoadCameraComp'
import { Canvas, Oval, Rect } from '@shopify/react-native-skia'
import COLORS from '../constant/colors'
import ActionBtn from '../components/ActionBtn'
import { useNavigation } from '@react-navigation/native'
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera'
import { HomeNavigationProp } from '../stack/types'
import NativeCropToOvalImage from '../../specs/NativeCropToOvalImage'

const FaceCaptureScreen = () => {
    const { hasPermission, requestPermission } = useCameraPermission()
    const cameraRef = useRef<Camera>(null)
    const device = useCameraDevice('front')
    const [isCapturing, setIsCapturing] = useState(false)
    const [borderColor, setBorderColor] = useState(COLORS.WHITE)
    const [feedbackText, setFeedbackText] = useState('Position your face in the oval')
    const [faceDetectionActive, setFaceDetectionActive] = useState(true)

    const detectionIntervalRef = useRef<any>(null)
    const navigation = useNavigation<HomeNavigationProp>()

    // Define face guide position (centered oval)
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    const ovalWidth = screenWidth * 0.7
    const ovalHeight = ovalWidth * 1.3
    const ovalX = (screenWidth - ovalWidth) / 2
    const ovalY = (screenHeight - ovalHeight) / 2.5


    // Check if face is within oval bounds
    const isFaceInOval = (face: any): boolean => {
        console.log("face bounds:", face)
        // MLKit returns frame with {top, left, width, height}
        const { top, left, width, height } = face.frame

        const ovalCenterX = ovalX + (ovalWidth / 2)
        const ovalCenterY = ovalY + (ovalHeight / 2)

        // Calculate face center using 'left' and 'top' instead of 'x' and 'y'
        const faceCenterX = left + (width / 2)
        const faceCenterY = top + (height / 2)

        const distanceX = Math.abs(faceCenterX - ovalCenterX)
        const distanceY = Math.abs(faceCenterY - ovalCenterY)

        const tolerance = 3.7// 30% more lenient
        const withinX = distanceX < (ovalWidth / 2) * tolerance
        const withinY = distanceY < (ovalHeight / 2) * tolerance

        console.log("Distance X:", distanceX.toFixed(0), "/ Max:", ((ovalWidth / 2) * tolerance).toFixed(0))
        console.log("Distance Y:", distanceY.toFixed(0), "/ Max:", ((ovalHeight / 2) * tolerance).toFixed(0))


        return withinX && withinY
    }

    // Process detected faces
    const processFaces = (faces: any[]) => {
        if (faces.length === 0) {
            setBorderColor(COLORS.WHITE)
            setFeedbackText('No face detected')
            return
        }

        if (faces.length > 1) {
            setBorderColor(COLORS.TERTIARY)
            setFeedbackText('Multiple faces detected')
            return
        }

        const face = faces[0]

        if (!isFaceInOval(face)) {
            setBorderColor(COLORS.WHITE)
            setFeedbackText('Center your face in the oval')
            return
        }

        // Face is perfect - capture!
        setBorderColor(COLORS.SECONDARY)
        setFeedbackText('Perfect! Capturing...')
        capturePhoto()
    }

    // Periodic face detection
    const startFaceDetection = () => {
        setFaceDetectionActive(true)
        console.log("start face detection")

        detectionIntervalRef.current = setInterval(async () => {
            if (!cameraRef.current || isCapturing || !faceDetectionActive) return

            try {
                // Take low-quality snapshot for detection
                const snapshot = await cameraRef.current.takeSnapshot({
                    quality: 85,
                })


                // Add file:// prefix for Android
                const filePath = Platform.OS === 'android'
                    ? `file://${snapshot.path}`
                    : snapshot.path

                // Detect faces using MLKit
                const faces = await FaceDetection.detect(filePath, {
                    performanceMode: 'fast',
                    contourMode: 'none',
                    landmarkMode: 'none',
                    classificationMode: 'none',
                })

                processFaces(faces)

            } catch (error: any) {
                // Silently ignore errors during detection
                console.log('Detection error:', error.message)

            }
        }, 500) // Check every 500ms - adjust as needed
    }



    // Stop face detection interval
    const stopFaceDetection = () => {
        setFaceDetectionActive(false)
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current)
            detectionIntervalRef.current = null
        }
    }

    // CAMERA permission check
    // Request permission
    useEffect(() => {
        if (!hasPermission) {
            requestPermission()
        }
    }, [hasPermission])

    // Start/stop face detection when component mounts/unmounts
    // Start detection when component mounts
    useEffect(() => {
        if (hasPermission && device) {
            // Small delay to ensure camera is ready
            startFaceDetection()
        }

        return () => {
            stopFaceDetection()
        }
    }, [hasPermission, device])

    const capturePhoto = useCallback(async () => {
        const camera = cameraRef.current
        console.log("Capturing photo...")
        if (!camera || !device) {
            console.log("Camera not ready")
            return
        }

        stopFaceDetection()

        try {
            console.log("Taking screenshot of view...", camera)
            const photo = await camera.takePhoto({
                flash: 'on',
            })

            const path = `file://${photo.path}`
            console.log("Success:", path)
            const cropped = await NativeCropToOvalImage.cropToOvalImage(
                path,
                ovalWidth,
                ovalHeight,
                ovalX,
                ovalY,
                screenWidth,
                screenHeight,
            )

            console.log("Native Moduleresult path ", cropped)


            navigation.navigate('result_screen', {
                photoUri: cropped
            })

        } catch (error: any) {
            console.error("Error: capturePhoto", error)
            Alert.alert('Error', error.message, [
                {
                    text: 'OK',
                    onPress: () => { }
                },
                {
                    text: "Cancel",
                    onPress: () => navigation.goBack()
                }
            ])
            if (error.message.includes('User cancelled image selection')) {
                // User cancelled cropping - resume detection
                setIsCapturing(false)
                startFaceDetection()
            }
        }
    }, [stopFaceDetection, navigation])

    if (!hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>No Camera Access</Text>
                <ActionBtn
                    text="Activate Camera"
                    textColor={COLORS.WHITE}
                    backgroundColor={COLORS.PRIMARY}
                    onClick={() => requestPermission()}
                />
            </View>
        )
    }

    return (
        <View style={styles.container} collapsable={false}>
            {isCapturing ? (
                <LoadCameraComp loadingText="Capturing..." />
            ) : (
                <>
                    <Camera
                        ref={cameraRef}
                        device={device!!}
                        isActive={true}
                        photo={true}
                        style={StyleSheet.absoluteFill}

                    />

                    {/* Overlay with face guide */}
                    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
                        {/* Grey semi-transparent overlay */}
                        <Rect
                            x={0}
                            y={0}
                            width={screenWidth}
                            height={screenHeight}
                            // color="rgba(0, 0, 0, 0.5)"
                            color={'white'}
                        />

                        {/* Clear oval area (cutout effect) */}
                        <Oval
                            x={ovalX}
                            y={ovalY}
                            width={ovalWidth}
                            height={ovalHeight}
                            style="fill"
                            color="transparent"
                            blendMode="clear"
                        />

                        {/* Oval border guide */}
                        <Oval
                            x={ovalX}
                            y={ovalY}
                            width={ovalWidth}
                            height={ovalHeight}
                            style="stroke"
                            strokeWidth={4}
                            color={borderColor}
                        />
                    </Canvas>

                    {/* Instructions text */}
                    <View style={styles.instructionContainer}>
                        <Text style={styles.instructionText}>
                            {feedbackText}
                        </Text>
                        <Text style={styles.instructionSubtext}>
                            {borderColor === COLORS.SECONDARY
                                ? '✓ Face detected!'
                                : 'Hold still for detection'}
                        </Text>
                    </View>
                </>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    permissionText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#000',
    },
    instructionContainer: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    instructionText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    instructionSubtext: {
        fontSize: 14,
        color: '#fff',
        marginTop: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
})

export default FaceCaptureScreen