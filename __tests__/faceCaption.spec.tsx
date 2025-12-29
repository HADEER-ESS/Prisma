import { render, screen } from "@testing-library/react-native"
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

        // const { getByTestId, queryByTestId } = 
        //latest render result is kept in screen variable
        render(<FaceCaptureScreen />)
        // Should show error message
        expect(screen.queryByTestId("error_message")).toBeTruthy()
        // Should NOT show camera view
        expect(screen.queryByTestId("camera_view")).toBeNull()

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
        const { queryByTestId } = render(<FaceCaptureScreen />)

        expect(queryByTestId("camera_view")).toBeTruthy()
        expect(queryByTestId("error_message")).toBeNull()

    })
})

{/*
    getBy... query methods fail (throws error) when there is no matching element (null) but queryBy... 
    methods don’t throw an error when no element (null) is found. We don’t want to get error from the line of fetching element. 
    We want to get the error from the last line of TEST suit that is “expect”. So use queryBy... method instead of getBy...
*/}
{/**
 findBy* and findAllBy* queries accept optional waitForOptions object argument which can contain
  timeout, interval and onTimeout properties which have the same meaning as respective options for waitFor function.    
    
*/}