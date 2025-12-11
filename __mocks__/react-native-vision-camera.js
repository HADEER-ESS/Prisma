import React from 'react';

export const useCameraDevices = jest.fn(() => ({
    back: {
        id: 'back',
        position: 'back',
        hasFlash: true,
        isMultiCam: false,
        supportsDepthCapture: false,
        supportsRawCapture: false,
        supportsLowLightBoost: false,
        minZoom: 1,
        maxZoom: 10,
        neutralZoom: 1,
        formats: [],
    },
    front: {
        id: 'front',
        position: 'front',
        hasFlash: true,
        isMultiCam: false,
        supportsDepthCapture: false,
        supportsRawCapture: false,
        supportsLowLightBoost: false,
        minZoom: 1,
        maxZoom: 10,
        neutralZoom: 1,
        formats: [],
    },
}));

export const Camera = jest.fn(({ children }) => <>{children}</>);

export const useFrameProcessor = jest.fn();
export const useCameraDevice = jest.fn(() => ({}));
export const useCameraFormat = jest.fn(() => ({}));
export const useFlash = jest.fn(() => ({}));
export const useTorch = jest.fn(() => ({}));
export const useZoom = jest.fn(() => ({}));
export const useIsForeground = jest.fn(() => true);
export const useIsAppActive = jest.fn(() => true);
export const useCameraPermission = jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(() => Promise.resolve(true)),
}));
export const useMicrophonePermission = jest.fn(() => ({
    hasPermission: true,
    requestPermission: jest.fn(() => Promise.resolve(true)),
}));

// You might also need to mock specific methods on the Camera ref
// if you are calling them directly in your component.
// For example:
// Camera.mockImplementation(() => ({
//   takePhoto: jest.fn(() => Promise.resolve({ path: 'mocked-photo.jpg' })),
//   startRecording: jest.fn(),
//   stopRecording: jest.fn(),
// }));