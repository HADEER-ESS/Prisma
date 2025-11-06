import React, { useEffect, useRef, useState } from 'react'
import { Dimensions, Linking, StyleSheet, Text, View, Alert, PermissionsAndroid, Platform } from 'react-native'
import { Camera, CameraType } from 'react-native-camera-kit'
import FaceDetection from '@react-native-ml-kit/face-detection'
import LoadCameraComp from '../components/LoadCameraComp'
import { Canvas, Oval, Rect } from '@shopify/react-native-skia'
import COLORS from '../constant/colors'
import ActionBtn from '../components/ActionBtn'

const FaceCaptureScreen = () => {
    const [hasPermission, setHasPermission] = useState(false)
    const cameraRef = useRef<any>(null)
    const [isCapturing, setIsCapturing] = useState(false)
    const [borderColor, setBorderColor] = useState(COLORS.WHITE)
    const [feedbackText, setFeedbackText] = useState('Position your face in the oval')
    const detectionIntervalRef = useRef<any>(null)

    // Define face guide position (centered oval)
    const screenWidth = Dimensions.get('window').width
    const screenHeight = Dimensions.get('window').height

    const ovalWidth = screenWidth * 0.7
    const ovalHeight = ovalWidth * 1.3
    const ovalX = (screenWidth - ovalWidth) / 2
    const ovalY = (screenHeight - ovalHeight) / 2.5

    // Check if face is within oval bounds
    const isFaceInOval = (face: any): boolean => {
        // ML Kit returns bounds as { left, top, width, height } or { x, y, width, height }
        const faceBounds = face.bounds
        if (!faceBounds) return false

        const faceX = faceBounds.left ?? faceBounds.x ?? 0
        const faceY = faceBounds.top ?? faceBounds.y ?? 0
        const faceWidth = faceBounds.width ?? 0
        const faceHeight = faceBounds.height ?? 0

        if (faceWidth === 0 || faceHeight === 0) return false

        // Calculate face center
        const faceCenterX = faceX + faceWidth / 2
        const faceCenterY = faceY + faceHeight / 2

        // Calculate oval center and bounds
        const ovalCenterX = ovalX + ovalWidth / 2
        const ovalCenterY = ovalY + ovalHeight / 2

        // Check if face center is within oval using ellipse equation
        const normalizedX = (faceCenterX - ovalCenterX) / (ovalWidth / 2)
        const normalizedY = (faceCenterY - ovalCenterY) / (ovalHeight / 2)

        const isInside = (normalizedX * normalizedX + normalizedY * normalizedY) <= 1.2

        // Also check if face is roughly the right size (not too close or far)
        const sizeRatio = faceWidth / ovalWidth
        const isGoodSize = sizeRatio > 0.4 && sizeRatio < 1.0

        return isInside && isGoodSize
    }

    // Detect face and check quality
    const detectFace = async () => {
        if (!cameraRef.current || isCapturing) return

        try {
            // Capture a snapshot for analysis using camera-kit's capture method
            const photo = await cameraRef.current.capture({
                quality: 0.7,
                saveToCameraRoll: false
            })

            if (!photo || !photo.uri) {
                console.warn('No photo URI returned from capture')
                return
            }

            // Detect faces in the captured image
            const faces = await FaceDetection.detect(photo.uri, {
                performanceMode: 'fast',
                contourMode: 'none',
                landmarkMode: 'none',
            })

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

            // Check if face is in the oval
            if (!isFaceInOval(face)) {
                setBorderColor(COLORS.WHITE)
                setFeedbackText('Center your face in the oval')
                return
            }

            // Face is good - turn green and capture
            setBorderColor(COLORS.SECONDARY)
            setFeedbackText('Perfect! Capturing...')

            // Wait a moment then capture the actual photo
            setTimeout(() => {
                capturePhoto()
            }, 500)

        } catch (error: any) {
            // Silently ignore camera busy errors during detection
            if (error?.message?.includes('Not bound') || error?.message?.includes('takePicture')) {
                console.log('Camera busy, skipping this detection cycle')
                return
            }
            console.error('Face detection error:', error)
        }
    }

    // Start face detection interval
    const startFaceDetection = () => {
        if (detectionIntervalRef.current) return

        detectionIntervalRef.current = setInterval(() => {
            detectFace()
        }, 2000) // Check every 2 seconds to avoid camera busy errors
    }

    // Stop face detection interval
    const stopFaceDetection = () => {
        if (detectionIntervalRef.current) {
            clearInterval(detectionIntervalRef.current)
            detectionIntervalRef.current = null
        }
    }

    // CAMERA permission check
    useEffect(() => {
        const getPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'This app needs access to your camera to capture your selfie.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                )
                setHasPermission(granted === PermissionsAndroid.RESULTS.GRANTED)
            } else {
                // iOS permissions are handled automatically by camera-kit
                setHasPermission(true)
            }
        }
        getPermission()
    }, [])

    // Start/stop face detection when component mounts/unmounts
    useEffect(() => {
        if (hasPermission) {
            startFaceDetection()
        }

        return () => {
            stopFaceDetection()
        }
    }, [hasPermission])

    const capturePhoto = async () => {
        if (!cameraRef.current || isCapturing) return

        setIsCapturing(true)
        stopFaceDetection()

        try {
            // Capture high-quality photo for analysis
            const photo = await cameraRef.current.capture({
                quality: 1.0,
                saveToCameraRoll: true
            })

            console.log("Photo captured: ", photo.uri)

            // TODO: Send to Google AI API for analysis and store in MMKV
            // Example:
            // const analysis = await analyzeWithGoogleAI(photo.uri)
            // MMKV.set('user_color_palette', JSON.stringify(analysis))
            // navigation.navigate('ResultScreen', { analysis })

            Alert.alert(
                'Photo Captured!',
                'Your selfie has been captured successfully. Ready for analysis.',
                [{
                    text: 'OK', onPress: () => {
                        setBorderColor(COLORS.WHITE)
                        setFeedbackText('Position your face in the oval')
                        setIsCapturing(false)
                        startFaceDetection()
                    }
                }]
            )

        } catch (error: any) {
            console.error("Error capturing photo: ", error)
            Alert.alert('Error', 'Failed to capture photo. Please try again.')
            setBorderColor(COLORS.WHITE)
            setFeedbackText('Position your face in the oval')
            setIsCapturing(false)
            startFaceDetection()
        }
    }

    if (!hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionText}>No Camera Access</Text>
                <ActionBtn
                    text="Activate Camera"
                    textColor={COLORS.WHITE}
                    backgroundColor={COLORS.PRIMARY}
                    onClick={() => Linking.openSettings()}
                />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            {isCapturing ? (
                <LoadCameraComp loadingText="Capturing..." />
            ) : (
                <>
                    <Camera
                        ref={cameraRef}
                        cameraType={CameraType.Front}
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
                            color="rgba(0, 0, 0, 0.5)"
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