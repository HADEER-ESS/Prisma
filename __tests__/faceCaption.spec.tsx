import { render } from "@testing-library/react-native"
import FaceCaptureScreen from "../src/screens/FaceCaptionScreen"
import { useFaveCameraController } from "../src/util/useFaveCameraController"

jest.mock('../src/util/useFaveCameraController')

describe("Face Caption Screen Tests", () => {
    test("Show the default error screen when there is NO PERMISSION for CAMERA", () => {

        // Mock the hook to return hasPermission: false
        (useFaveCameraController as jest.Mock).mockReturnValue({
            cameraRef: { current: null },
            hasPermission: false,
            requestPermission: jest.fn(),
            isCapturing: false,
            borderColor: '#FFFFFF',
            feedbackText: 'Position your face in the oval',
            ovalWidth: 100,
            ovalHeight: 130,
            ovalX: 50,
            ovalY: 50,
            device: null,
        })
        const { getByTestId, queryByTestId } = render(<FaceCaptureScreen />)
        // Should show error message
        expect(getByTestId("error_message")).toBeTruthy()
        // Should NOT show camera view
        expect(queryByTestId("camera_view")).toBeNull()

    })

    test("Show the CAMERA VIEW when the premission is GRANTED for CAMERA", () => {

        // Mock the hook to return hasPermission: true
        (useFaveCameraController as jest.Mock).mockReturnValue({
            cameraRef: { current: null },
            hasPermission: true,
            requestPermission: jest.fn(),
            isCapturing: false,
            borderColor: '#FFFFFF',
            feedbackText: 'Position your face in the oval',
            ovalWidth: 100,
            ovalHeight: 130,
            ovalX: 50,
            ovalY: 50,
            device: null,
        })
        const { getByTestId, queryByTestId } = render(<FaceCaptureScreen />)

        expect(getByTestId("camera_view")).toBeTruthy()
        expect(queryByTestId("error_message")).toBeNull()

    })
})