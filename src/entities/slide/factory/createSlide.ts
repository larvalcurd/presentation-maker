import { nanoid } from 'nanoid';
import type { Slide } from '../types/SlideTypes.ts';
import type {
    SlideObject,
    TextObject,
    ImageObject,
} from '../../object/types/ObjectTypes.ts';
import { defaultSlide } from './defaults.ts';

function cloneTextObject(obj: TextObject): TextObject {
    return {
        ...obj,
        style: obj.style
            ? {
                  ...obj.style,
                  shadow: obj.style.shadow
                      ? { ...obj.style.shadow }
                      : undefined,
              }
            : undefined,
        transform: obj.transform ? { ...obj.transform } : undefined,
    };
}

function cloneImageObject(obj: ImageObject): ImageObject {
    return {
        ...obj,
        style: obj.style
            ? {
                  ...obj.style,
                  shadow: obj.style.shadow
                      ? { ...obj.style.shadow }
                      : undefined,
              }
            : undefined,
        transform: obj.transform ? { ...obj.transform } : undefined,
        crop: obj.crop ? { ...obj.crop } : undefined,
        filters: obj.filters ? { ...obj.filters } : undefined,
        mask: obj.mask
            ? {
                  ...obj.mask,
                  points: obj.mask.points
                      ? obj.mask.points.map((p) => ({ ...p }))
                      : undefined,
              }
            : undefined,
    };
}

function isTextObject(obj: SlideObject): obj is TextObject {
    return obj.type === 'text';
}

function isImageObject(obj: SlideObject): obj is ImageObject {
    return obj.type === 'image';
}

function cloneSlideObject(obj: SlideObject): SlideObject {
    if (isTextObject(obj)) {
        return cloneTextObject(obj);
    }
    if (isImageObject(obj)) {
        return cloneImageObject(obj);
    }
    return { ...(obj as SlideObject) };
}

export function createSlide(params: Partial<Slide> = {}): Slide {
    const defaults = defaultSlide();

    return {
        id: params.id ?? nanoid(),
        title: params.title ?? defaults.title,
        notes: params.notes ?? defaults.notes,
        background: params.background
            ? { ...params.background }
            : defaults.background,
        transition: params.transition
            ? { ...params.transition }
            : defaults.transition,
        objects: params.objects ? params.objects.map(cloneSlideObject) : [],
    };
}
