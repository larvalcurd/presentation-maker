import type { SlideTransition } from '../types/SlideTypes.ts';

export function createSlideTransition(
    type: 'fade' | 'slide' | 'zoom' | 'none' = 'fade',
    duration: number = 500
): SlideTransition {
    return {
        type,
        duration,
    };
}
