import type { SlideObject } from '../../object/types/ObjectTypes.ts';

export type Slide = {
    id: string;
    title?: string;
    notes?: string;
    background: SlideBackground;
    objects: SlideObject[];
    transition?: SlideTransition;
};

export type SlideTransition = {
    type: 'fade' | 'slide' | 'zoom' | 'none';
    duration: number;
};

export type SlideBackground =
    | ColorBackground
    | ImageBackground
    | GradientBackground;

export type ColorBackground = {
    type: 'color';
    value: string;
};

export type ImageBackground = {
    type: 'image';
    value: string;
    fit?: 'cover' | 'contain' | 'stretch' | 'repeat';
    opacity?: number;
    blur?: number;
};

export type GradientBackground = {
    type: 'gradient';
    colors: string[];
    angle?: number;
};
