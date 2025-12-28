import React from 'react'
import { Dimensions, StyleSheet } from 'react-native';
import Svg, { Line } from 'react-native-svg';


const { width } = Dimensions.get("window");
const center = width / 2;
const radius = 100;

type SunShinePreviewProps = {
    colorsList: string[]
}

const SunShinePreview = ({ colorsList }: SunShinePreviewProps) => {
    const rayCount = colorsList && colorsList.length ? colorsList.length : 6;
    const rayColors = colorsList ?? Array(6).fill("#ffffff")

    const start = 180
    const end = 360


    return (
        <Svg height={radius + 60} width={width} style={StyleSheet.absoluteFill}>
            {rayColors.map((color, index) => {
                // evenly distribute rays along 180 degrees
                const angle = ((start + ((end - start) / (rayCount - 1)) * index) * Math.PI) / 180;
                const x1 = center;
                const y1 = 60; // top offset
                const x2 = center + radius * Math.cos(angle);
                const y2 = 60 + radius * Math.sin(angle);

                return (
                    <Line
                        key={index}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke={color}
                        strokeWidth={8}
                        strokeLinecap="round"
                    />
                );
            })}
        </Svg>
    )
}

export default SunShinePreview
