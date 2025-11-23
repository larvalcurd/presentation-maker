import type {
    Slide,
    SlideBackground,
    SlideTransition,
} from '../types/SlideTypes.ts';
import { createColorBackground } from './backgroundFactory.ts';
import { createSlideTransition } from './transitionFactory.ts';

export function defaultSlide(): Omit<Slide, 'id'> {
    return {
        title: '',
        notes: '',
        background: defaultBackground(),
        objects: [],
        transition: defaultTransition(),
    };
}

export function defaultBackground(): SlideBackground {
    return createColorBackground('#FFFFFF');
}

export function defaultTransition(): SlideTransition {
    return createSlideTransition('fade', 500);
}
