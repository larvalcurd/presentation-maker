// SlideUtils.ts
import type { Slide } from '../types/SlideTypes.ts';
import type { SlideObject } from '../../object/types/ObjectTypes.ts';

export function addObjectToSlide(slide: Slide, object: SlideObject): Slide {
    return {
        ...slide,
        objects: [...slide.objects, object],
    };
}

export function removeObjectFromSlide(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter((obj) => obj.id !== objectId),
    };
}

export function updateObjectInSlide(
    slide: Slide,
    objectId: string,
    updatedObject: SlideObject
): Slide {
    return {
        ...slide,
        objects: slide.objects.map((obj) =>
            obj.id === objectId ? updatedObject : obj
        ),
    };
}

export function findObjectInSlide(
    slide: Slide,
    objectId: string
): SlideObject | undefined {
    return slide.objects.find((obj) => obj.id === objectId);
}

export function reorderObjectsInSlide(
    slide: Slide,
    objectIds: string[]
): Slide {
    const objectMap = new Map(slide.objects.map((obj) => [obj.id, obj]));
    const reorderedObjects: SlideObject[] = [];

    for (const id of objectIds) {
        const obj = objectMap.get(id);
        if (obj) {
            reorderedObjects.push(obj);
            objectMap.delete(id);
        }
    }

    return {
        ...slide,
        objects: [...reorderedObjects, ...Array.from(objectMap.values())],
    };
}

export function updateSlideBackground(
    slide: Slide,
    background: Slide['background']
): Slide {
    return {
        ...slide,
        background,
    };
}

export function updateSlideTransition(
    slide: Slide,
    transition: Slide['transition']
): Slide {
    return {
        ...slide,
        transition,
    };
}
