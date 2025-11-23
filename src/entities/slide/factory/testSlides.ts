import { createSlide } from './createSlide.ts';
import { createGradientBackground } from './backgroundFactory.ts';
import { createSlideTransition } from './transitionFactory.ts';
import {
    createTextObject,
    createImageObject,
} from '../../object/factory/ObjectFactory.ts';
import type { Slide } from '../types/SlideTypes.ts';

export function createMinimalSlide(overrides?: Partial<Slide>) {
    return createSlide(overrides);
}

export function createMaximalSlide(overrides?: Partial<Slide>) {
    return createSlide({
        title: 'Max Slide',
        notes: 'Speaker notes example',
        background: createGradientBackground(
            ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            45
        ),
        transition: createSlideTransition('slide', 1000),
        objects: [
            createTextObject({
                x: 50,
                y: 50,
                width: 300,
                height: 40,
                content: 'Main Heading',
                fontSize: 32,
            }),
            createTextObject({
                x: 50,
                y: 100,
                width: 500,
                height: 120,
                content: 'Sample text',
                fontSize: 16,
            }),
            createImageObject({
                x: 400,
                y: 80,
                width: 300,
                height: 200,
                src: 'sample.jpg',
                fit: 'cover',
            }),
        ],
        ...overrides,
    });
}
