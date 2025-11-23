import type { SlideObject } from '../types/ObjectTypes.ts';

export function resizeObject(
    object: SlideObject,
    width: number,
    height: number
): SlideObject {
    return { ...object, width, height };
}

export function moveObject(
    object: SlideObject,
    x: number,
    y: number
): SlideObject {
    return {
        ...object,
        x,
        y,
    };
}
