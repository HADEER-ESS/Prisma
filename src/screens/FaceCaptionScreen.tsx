import { StyleSheet, Text, View } from 'react-native'
import LoadCameraComp from '../components/LoadCameraComp'
import { Canvas, Oval, Rect } from '@shopify/react-native-skia'
import COLORS from '../constant/colors'
import ActionBtn from '../components/ActionBtn'
import { Camera } from 'react-native-vision-camera'
import { DIMENSIONS } from '../constant/dimensions'
import { useFaveCameraController } from '../util/useFaveCameraController'

const FaceCaptureScreen = () => {
    const { cameraRef, hasPermission, requestPermission, isCapturing, borderColor, feedbackText, ovalWidth, ovalHeight, ovalX, ovalY, device } = useFaveCameraController()


    if (!hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text testID='error_message' style={styles.permissionText}>No Camera Access</Text>
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
        <View style={styles.container} collapsable={false} testID='camera_view'>
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
                            width={DIMENSIONS.SCREEN_WIDTH}
                            height={DIMENSIONS.SCREEN_HEIGHT}
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