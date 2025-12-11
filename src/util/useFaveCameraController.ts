import { Alert, Platform } from "react-native"
import NativeCropToOvalImage from "../../specs/NativeCropToOvalImage"
import { DIMENSIONS } from "../constant/dimensions"
import { useCallback, useEffect, useRef, useState } from "react"
import FaceDetection from "@react-native-ml-kit/face-detection"
import COLORS from "../constant/colors"
import { useNavigation } from "@react-navigation/native"
import { Camera, useCameraDevice, useCameraPermission } from "react-native-vision-camera"
import { HomeNavigationProp } from "../stack/types"

export const useFaveCameraController = () => {
    const { hasPermission, requestPermission } = useCameraPermission()
    const cameraRef = useRef<Camera>(null)
    const device = useCameraDevice("front")

    const [isCapturing, setIsCapturing] = useState(false)
    const [borderColor, setBorderColor] = useState(COLORS.WHITE)
    const [feedbackText, setFeedbackText] = useState("Position your face in the oval")
    const [faceDetectionActive, setFaceDetectionActive] = useState(true)

    const detectionIntervalRef = useRef<any>(null)
    const navigation = useNavigation<HomeNavigationProp>()

    const ovalWidth = DIMENSIONS.SCREEN_WIDTH * 0.7
    const ovalHeight = ovalWidth * 1.3
    const ovalX = (DIMENSIONS.SCREEN_WIDTH - ovalWidth) / 2
    const ovalY = (DIMENSIONS.SCREEN_HEIGHT - ovalHeight) / 2.5


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



    /** ------------------------------
     * CAPTURE PHOTO
     --------------------------------*/
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
                DIMENSIONS.SCREEN_WIDTH,
                DIMENSIONS.SCREEN_HEIGHT,
            )

            console.log("Native Moduleresult path ", cropped)


            navigation.navigate('result_screen', {
                photoUri: cropped
            })

        } catch (error: any) {
            // console.error("Error: capturePhoto", error)
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


    return {
        cameraRef,
        hasPermission,
        isCapturing,
        requestPermission,
        borderColor,
        feedbackText,
        ovalWidth,
        ovalHeight,
        ovalX,
        ovalY,
        device,
    }
}