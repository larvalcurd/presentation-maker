import type { Slide } from '../types/SlideTypes.ts';
import { createSlide } from './createSlide.ts';
import {
    createGradientBackground,
    createImageBackground,
} from './backgroundFactory.ts';

export function createTitleSlide(title: string, subtitle?: string): Slide {
    return createSlide({
        title,
        notes: subtitle,
        background: createGradientBackground(['#667eea', '#764ba2']),
    });
}

export function createImageSlide(imageSrc: string, title?: string): Slide {
    return createSlide({
        title,
        background: createImageBackground(imageSrc, 'cover'),
    });
}

export function createBlankSlide(): Slide {
    return createSlide();
}
