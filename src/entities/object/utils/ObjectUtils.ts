import type { BaseObject } from '../types/ObjectTypes.ts';

export function moveObject<T extends BaseObject>(
    object: T,
    x: number,
    y: number
): T {
    return { ...object, x, y };
}

export function resizeObject<T extends BaseObject>(
    object: T,
    width: number,
    height: number
): T {
    return { ...object, width, height };
}
