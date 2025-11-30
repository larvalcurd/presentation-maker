import type { TextObject } from '../types/ObjectTypes.ts';
import { cloneStyle, cloneTransform } from '../factory/helpers.ts';

function copyNested(object: TextObject): TextObject {
    return {
        ...object,
        style: cloneStyle(object.style),
        transform: cloneTransform(object.transform),
    };
}

export function updateTextContent(obj: TextObject, content: string) {
    return { ...copyNested(obj), content };
}
export function updateTextFontSize(obj: TextObject, fontSize: number) {
    return { ...copyNested(obj), fontSize };
}
export function updateTextFontFamily(obj: TextObject, fontFamily: string) {
    return { ...copyNested(obj), fontFamily };
}
export function updateTextColor(obj: TextObject, color: string) {
    return { ...copyNested(obj), color };
}
export function updateTextStyle(
    obj: TextObject,
    styleUpdates: Partial<Omit<TextObject, 'style' | 'transform'>>
) {
    return { ...copyNested(obj), ...styleUpdates };
}
