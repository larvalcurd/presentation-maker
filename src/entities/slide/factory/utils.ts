import { nanoid } from 'nanoid';
import type { Slide } from '../types/SlideTypes.ts';
import { createSlide } from './createSlide.ts';
import type { SlideObject } from '../../object/types/ObjectTypes.ts';

export function validateSlide(slide: Slide): boolean {
    if (!slide.id) return false;

    const hasInvalidObjects = slide.objects.some((obj) => !obj.id);
    if (hasInvalidObjects) return false;

    return true;
}

export function duplicateSlide(slide: Slide): Slide {
    const duplicatedObjects: SlideObject[] = slide.objects.map((obj) => ({
        ...obj,
        id: nanoid(),
        x: obj.x + 20,
        y: obj.y + 20,
    }));

    return createSlide({
        ...slide,
        id: nanoid(),
        title: slide.title ? `${slide.title} (Copy)` : slide.title,
        objects: duplicatedObjects,
    });
}
