import type {
    ImageObject,
    SlideObject,
    TextObject,
} from '../shared/types/EditorTypes.ts';

// --- TYPE GUARDS ---
export function isTextObject(obj: SlideObject): obj is TextObject {
    return obj.type === 'text';
}

export function isImageObject(obj: SlideObject): obj is ImageObject {
    return obj.type === 'image';
}
