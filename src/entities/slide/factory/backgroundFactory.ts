import type {
    ColorBackground,
    ImageBackground,
    GradientBackground,
} from '../types/SlideTypes.ts';

export function createColorBackground(value: string): ColorBackground {
    return {
        type: 'color',
        value,
    };
}

export function createImageBackground(
    value: string,
    fit?: 'cover' | 'contain' | 'stretch' | 'repeat',
    opacity?: number,
    blur?: number
): ImageBackground {
    const background: ImageBackground = {
        type: 'image',
        value,
    };

    if (fit !== undefined) background.fit = fit;
    if (opacity !== undefined) background.opacity = opacity;
    if (blur !== undefined) background.blur = blur;

    return background;
}

export function createGradientBackground(
    colors: string[],
    angle?: number
): GradientBackground {
    const background: GradientBackground = {
        type: 'gradient',
        colors,
    };

    if (angle !== undefined) background.angle = angle;

    return background;
}
