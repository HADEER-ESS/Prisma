import 'react-native';


//jest.mock(moduleName, callback function with METHODS that want to MOCK)
jest.mock('./specs/NativeCropToOvalImage', () => ({
    cropToOvalImage: jest.fn().mockResolvedValue("/path/to/cropped.jpg"),
}));