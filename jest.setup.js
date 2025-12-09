import 'react-native';

jest.mock('./specs/NativeCropToOvalImage', () => ({
    cropToOvalImage: jest.fn().mockResolvedValue("mocked-output-path"),
}));