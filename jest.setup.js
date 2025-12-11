import 'react-native';

jest.mock('./specs/NativeCropToOvalImage', () => ({
    cropToOvalImage: jest.fn().mockResolvedValue("/path/to/cropped.jpg"),
}));