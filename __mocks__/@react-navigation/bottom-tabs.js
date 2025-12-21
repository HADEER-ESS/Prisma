import React from 'react';

export const createBottomTabNavigator = () => ({
    Navigator: ({ children }) => <>{children}</>,
    Screen: ({ children }) => <>{children}</>,
});