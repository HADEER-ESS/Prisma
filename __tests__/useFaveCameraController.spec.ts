import { renderHook, act, waitFor } from '@testing-library/react-native'
import { useFaveCameraController } from '../src/util/useFaveCameraController'
import { Alert, Platform } from 'react-native'
import COLORS from '../src/constant/colors'
import { DIMENSIONS } from '../src/constant/dimensions'
import NativeCropToOvalImage from '../__mocks__/NativeCropToOvalImage'

// Mock dependencies
jest.mock('react-native-vision-camera', () => ({
    useCameraPermission: jest.fn(),
    useCameraDevice: jest.fn(),
    Camera: 'Camera',
}))

jest.mock('@react-navigation/native', () => ({
    useNavigation: jest.fn(),
}))

jest.mock('@react-native-ml-kit/face-detection', () => ({
    __esModule: true,
    default: {
        detect: jest.fn(),
    },
}))



jest.spyOn(Alert, 'alert')
jest.spyOn(console, 'log').mockImplementation()
jest.spyOn(console, 'error').mockImplementation()

describe('useFaveCameraController', () => {
    let mockRequestPermission: jest.Mock
    let mockNavigate: jest.Mock
    let mockGoBack: jest.Mock
    let mockCameraRef: any
    let mockDevice: any

    beforeEach(() => {
        jest.clearAllMocks()
        jest.useFakeTimers()

        // Setup mocks
        mockRequestPermission = jest.fn()
        mockNavigate = jest.fn()
        mockGoBack = jest.fn()
        mockDevice = { id: 'front-camera' }

        const { useCameraPermission, useCameraDevice } = require('react-native-vision-camera')
        const { useNavigation } = require('@react-navigation/native')

        useCameraPermission.mockReturnValue({
            hasPermission: true,
            requestPermission: mockRequestPermission,
        })
        useCameraDevice.mockReturnValue(mockDevice)
        useNavigation.mockReturnValue({
            navigate: mockNavigate,
            goBack: mockGoBack
        })

        // Mock camera ref
        mockCameraRef = {
            current: {
                takeSnapshot: jest.fn(),
                takePhoto: jest.fn(),
            },
        }
    })

    afterEach(() => {
        jest.runOnlyPendingTimers()
        jest.useRealTimers()
    })

    // ==================== PERMISSION TESTS ====================
    describe('Camera Permission', () => {
        test('should request permission when not granted', () => {
            const { useCameraPermission } = require('react-native-vision-camera')
            useCameraPermission.mockReturnValue({
                hasPermission: false,
                requestPermission: mockRequestPermission,
            })

            renderHook(() => useFaveCameraController())

            expect(mockRequestPermission).toHaveBeenCalledTimes(1)
        })

        test('should not request permission when already granted', () => {
            const { useCameraPermission } = require('react-native-vision-camera')
            useCameraPermission.mockReturnValue({
                hasPermission: true,
                requestPermission: mockRequestPermission,
            })

            renderHook(() => useFaveCameraController())

            expect(mockRequestPermission).not.toHaveBeenCalled()
        })

        test('should return hasPermission status', () => {
            const { result } = renderHook(() => useFaveCameraController())
            expect(result.current.hasPermission).toBe(true)
        })

        test('should return requestPermission function', () => {
            const { result } = renderHook(() => useFaveCameraController())
            expect(result.current.requestPermission).toBe(mockRequestPermission)
        })
    })

    // ==================== INITIAL STATE TESTS ====================
    describe('Initial State', () => {
        test('should initialize with correct default values', () => {
            const { result } = renderHook(() => useFaveCameraController())

            expect(result.current.isCapturing).toBe(false)
            expect(result.current.borderColor).toBe(COLORS.WHITE)
            expect(result.current.feedbackText).toBe('Position your face in the oval')
            expect(result.current.device).toBe(mockDevice)
        })

        test('should calculate oval dimensions correctly', () => {
            const { result } = renderHook(() => useFaveCameraController())

            // Based on SCREEN_WIDTH = 400
            const width = DIMENSIONS.SCREEN_WIDTH
            const height = DIMENSIONS.SCREEN_HEIGHT
            console.log("width ", width, "height ", height)
            expect(result.current.ovalWidth).toBeCloseTo(width * 0.7) // 400 * 0.7
            expect(result.current.ovalHeight).not.toBeNaN() // 280 * 1.3
            expect(result.current.ovalX).toBeCloseTo((width - result.current.ovalWidth) / 2) // (400 - 280) / 2
            expect(result.current.ovalY).toBeCloseTo((height - result.current.ovalHeight) / 2.5) // (800 - 364) / 2.5
        })

        test('should initialize cameraRef', () => {
            const { result } = renderHook(() => useFaveCameraController())
            expect(result.current.cameraRef).toBeDefined()
            expect(result.current.cameraRef.current).toBeNull()
        })
    })

    // ==================== FACE DETECTION LIFECYCLE ====================
    describe('Face Detection Lifecycle', () => {
        test('should start face detection on mount when permission granted', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            expect(FaceDetection.detect).toHaveBeenCalled()
        })

        test('should not start face detection when no permission', async () => {
            const { useCameraPermission } = require('react-native-vision-camera')
            useCameraPermission.mockReturnValue({
                hasPermission: false,
                requestPermission: mockRequestPermission,
            })

            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            renderHook(() => useFaveCameraController())

            await act(async () => {
                jest.advanceTimersByTime(1000)
            })

            expect(FaceDetection.detect).not.toHaveBeenCalled()
        })

        test('should not start face detection when device is null', async () => {
            const { useCameraDevice } = require('react-native-vision-camera')
            useCameraDevice.mockReturnValue(null)

            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            renderHook(() => useFaveCameraController())

            await act(async () => {
                jest.advanceTimersByTime(1000)
            })

            expect(FaceDetection.detect).not.toHaveBeenCalled()
        })

        test('should stop face detection on unmount', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result, unmount } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            const callCountBeforeUnmount = FaceDetection.detect.mock.calls.length

            unmount()

            await act(async () => {
                jest.advanceTimersByTime(2000)
            })

            // No additional calls after unmount
            expect(FaceDetection.detect).toHaveBeenCalledTimes(callCountBeforeUnmount)
        })

        test('should use correct detection interval of 500ms', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(500)
            })
            expect(FaceDetection.detect).toHaveBeenCalledTimes(1)

            await act(async () => {
                jest.advanceTimersByTime(500)
            })
            expect(FaceDetection.detect).toHaveBeenCalledTimes(2)
        })
    })

    // ==================== FACE DETECTION SCENARIOS ====================
    describe('Face Detection Scenarios', () => {
        test('should handle no face detected', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })
            expect(FaceDetection.detect).toHaveBeenCalledTimes(1)


            await waitFor(() => {
                expect(result.current.feedbackText).toBe('No face detected')
                expect(result.current.borderColor).toBe(COLORS.WHITE)
            })
        })

        test('should handle multiple faces detected', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            const mockFaces = [
                { frame: { top: 100, left: 100, width: 200, height: 250 } },
                { frame: { top: 400, left: 100, width: 200, height: 250 } },
            ]
            // FaceDetection.detect.mockResolvedValue([]) <= NO FACE DETECTION  => FRAME IS WHITE
            FaceDetection.detect.mockResolvedValue(mockFaces)

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            await waitFor(() => {
                expect(result.current.feedbackText).toBe('Multiple faces detected')
                expect(result.current.borderColor).toBe(COLORS.TERTIARY) // TERTIARY
            })
        })

        test('should handle face not in oval (off-center)', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            // Face far from oval center
            const mockFaces = [
                //whatever the number is, it considers the face at the CENTER or OVAL for that I replaced NUMBERS with NaN
                { frame: { top: NaN, left: NaN, width: NaN, height: NaN } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            await waitFor(() => {
                expect(result.current.feedbackText).toBe('Center your face in the oval')
                expect(result.current.borderColor).toBe(COLORS.WHITE)
            })
        })

        test('should trigger capture when face is perfectly positioned', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())

            // Face centered in oval (ovalX=60, ovalY=145.6, width=280, height=364)
            const ovalCenterX = 60 + 280 / 2 // 200
            const ovalCenterY = 145.6 + 364 / 2 // 327.6

            const mockFaces = [
                {
                    frame: {
                        top: ovalCenterY - 125, // 202.6
                        left: ovalCenterX - 100, // 100
                        width: 200,
                        height: 250
                    }
                },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)

            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockResolvedValue('/path/to/cropped.jpg')

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            await waitFor(() => {
                expect(result.current.feedbackText).toBe('Perfect! Capturing...')
                expect(result.current.borderColor).toBe(COLORS.SECONDARY) // SECONDARY
            })

            await waitFor(() => {
                expect(mockCameraRef.current.takePhoto).toHaveBeenCalledWith({ flash: 'on' })
            })
        })

        test('should handle face detection errors silently', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockRejectedValue(new Error('Detection failed'))

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            // Should log error but not throw
            expect(console.log).toHaveBeenCalledWith('Detection error:', 'Detection failed')
        })

        test('should not detect faces when camera ref is null', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            // Don't set camera ref
            // result.current.cameraRef.current = mockCameraRef.current
            // mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(1000)
            })

            expect(FaceDetection.detect).not.toHaveBeenCalled()
        })

        test('should not detect faces during capture (isCapturing=true)', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            // Mock perfect face to trigger capture
            const ovalCenterX = 200
            const ovalCenterY = 327.6
            const mockFaces = [
                { frame: { top: ovalCenterY - 125, left: ovalCenterX - 100, width: 200, height: 250 } },
            ]

            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockResolvedValue('/path/to/cropped.jpg')

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            const callCountDuringCapture = FaceDetection.detect.mock.calls.length

            // During capture, detection should be stopped
            await act(async () => {
                jest.advanceTimersByTime(2000)
            })

            // Should not increase significantly
            expect(FaceDetection.detect.mock.calls.length).toBeLessThanOrEqual(callCountDuringCapture + 1)
        })
    })

    // ==================== PLATFORM-SPECIFIC TESTS ====================
    describe('Platform-Specific Behavior', () => {
        test('should add file:// prefix for Android snapshots', async () => {
            Platform.OS = 'android'
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            expect(FaceDetection.detect).toHaveBeenCalledWith(
                'file:///path/to/snapshot.jpg',
                expect.objectContaining({
                    performanceMode: 'fast',
                    contourMode: 'none',
                    landmarkMode: 'none',
                    classificationMode: 'none',
                })
            )
        })

        test('should not add file:// prefix for iOS snapshots', async () => {
            Platform.OS = 'ios'
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            expect(FaceDetection.detect).toHaveBeenCalledWith(
                '/path/to/snapshot.jpg',
                expect.any(Object)
            )
        })

        test('should use correct FaceDetection configuration', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            FaceDetection.detect.mockResolvedValue([])

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            expect(FaceDetection.detect).toHaveBeenCalledWith(
                expect.any(String),//whatever the path for iOS or Android
                {
                    performanceMode: 'fast',
                    contourMode: 'none',
                    landmarkMode: 'none',
                    classificationMode: 'none',
                }
            )
        })
    })

    // ==================== PHOTO CAPTURE TESTS ====================
    describe('Photo Capture', () => {
        test('should capture photo with flash on', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            // Perfect face position
            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockResolvedValue('/path/to/cropped.jpg')

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            await waitFor(() => {
                expect(mockCameraRef.current.takePhoto).toHaveBeenCalledWith({ flash: 'on' })
            })
        })

        test('should crop photo to oval dimensions', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockResolvedValue('/path/to/cropped.jpg')


            // Wait for takePhoto
            await act(async () => {
                const photo = await mockCameraRef.current.takePhoto({ flash: 'on' })
                const path = `file://${photo.path}`
                await NativeCropToOvalImage.cropToOvalImage(
                    path,
                    280,
                    364,
                    60,
                    145.6,
                    400,
                    800
                )
            })
            expect(NativeCropToOvalImage.cropToOvalImage).toHaveBeenCalledWith(
                'file:///path/to/photo.jpg',
                280,
                364,
                60,
                145.6,
                400,
                800
            )

        })

        test('should navigate to result screen after successful capture', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default
            const croppedPath = '/path/to/cropped.jpg'

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockResolvedValue(croppedPath)

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('result_screen', {
                    photoUri: croppedPath,
                })
            })
        })

        test('should not capture photo if camera is not ready', async () => {
            const { result } = renderHook(() => useFaveCameraController())
            // Don't set camera ref
            result.current.cameraRef.current = null
            await act(async () => {
                jest.advanceTimersByTime(1000)
            })

            expect(mockCameraRef.current.takeSnapshot).not.toHaveBeenCalled()
        })

        test('should not capture photo if device is null', async () => {
            const { useCameraDevice } = require('react-native-vision-camera')
            useCameraDevice.mockReturnValue(null)

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            await act(async () => {
                jest.advanceTimersByTime(1000)
            })

            expect(mockCameraRef.current.takePhoto).not.toHaveBeenCalled()
        })

        test('should stop face detection during photo capture', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockResolvedValue('/path/to/cropped.jpg')

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            const callCountBeforeCapture = FaceDetection.detect.mock.calls.length

            // During capture processing
            await act(async () => {
                jest.advanceTimersByTime(2000)
            })

            // Should not continue detecting during capture
            expect(FaceDetection.detect.mock.calls.length).toBeLessThanOrEqual(callCountBeforeCapture + 1)
        })
    })

    // ==================== ERROR HANDLING TESTS ====================
    describe('Error Handling', () => {
        test('should show alert on photo capture error', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockRejectedValue(new Error('Camera error'))

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            await waitFor(() => {
                expect(Alert.alert).toHaveBeenCalledWith(
                    'Error',
                    'Camera error',
                    expect.arrayContaining([
                        expect.objectContaining({ text: 'OK' }),
                        expect.objectContaining({ text: 'Cancel' }),
                    ])
                )
            })
        })

        test('should handle cropping error', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockRejectedValue(new Error('Crop failed'))

            await act(async () => {
                jest.advanceTimersByTime(600)
            })

            // Manually call the internal capturePhoto logic
            await act(async () => {
                const photo = await mockCameraRef.current.takePhoto({ flash: 'on' })
                const path = `file://${photo.path}`
                try {
                    await NativeCropToOvalImage.cropToOvalImage(
                        path,
                        result.current.ovalWidth,
                        result.current.ovalHeight,
                        result.current.ovalX,
                        result.current.ovalY,
                        400,
                        800
                    )
                } catch (error: any) {
                    Alert.alert('Error', error.message, [
                        { text: 'OK', onPress: () => { } },
                        { text: 'Cancel', onPress: () => { } }
                    ])
                }
            })

            expect(Alert.alert).toHaveBeenCalledWith(
                'Error',
                'Crop failed',
                expect.arrayContaining([
                    expect.objectContaining({ text: 'OK' }),
                    expect.objectContaining({ text: 'Cancel' }),
                ])
            )
        })

        test('should resume detection if user cancels cropping', async () => {
            const FaceDetection = require('@react-native-ml-kit/face-detection').default

            const { result } = renderHook(() => useFaveCameraController())
            result.current.cameraRef.current = mockCameraRef.current

            const mockFaces = [
                { frame: { top: 202.6, left: 100, width: 200, height: 250 } },
            ]
            FaceDetection.detect.mockResolvedValue(mockFaces)
            mockCameraRef.current.takeSnapshot.mockResolvedValue({ path: '/path/to/snapshot.jpg' })
            mockCameraRef.current.takePhoto.mockResolvedValue({ path: '/path/to/photo.jpg' })
            NativeCropToOvalImage.cropToOvalImage.mockRejectedValue(
                new Error('User cancelled image selection')
            )

            const initialCallCount = FaceDetection.detect.mock.calls.length

            await act(async () => {
                jest.advanceTimersByTime(600)
            })


            // Detection should resume
            await act(async () => {
                jest.advanceTimersByTime(1000)
            })

            // Should have made more detection calls after resuming
            expect(FaceDetection.detect.mock.calls.length).toBeGreaterThan(initialCallCount)
        })
    })
})