import type {
    BaseObject,
    ObjectStyle,
    TextObject,
} from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatch } from './helpers.ts';

type CreateTextObjectParams = Partial<BaseObject> & {
    x: number;
    y: number;
    width: number;
    height: number;
    content: string;
    fontFamily?: string;
    fontSize?: number;
    color?: string;
    fontWeight?: number | 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    style?: Partial<ObjectStyle>;
};

export function createTextObject(params: CreateTextObjectParams): TextObject {
    const base = createBaseObject(params);

    const original: TextObject = {
        ...base,
        type: 'text',
        content: params.content,
        fontFamily: params.fontFamily ?? 'Arial',
        fontSize: params.fontSize ?? 16,
        color: params.color ?? '#000000',
        fontWeight: params.fontWeight ?? 'normal',
        fontStyle: params.fontStyle ?? 'normal',
        textAlign: params.textAlign ?? 'left',
        lineHeight: params.lineHeight ?? 1.2,
        letterSpacing: params.letterSpacing ?? 0,
    };

    return original;
}

export function createMinimalText(overrides?: Partial<TextObject>) {
    return applyPatch(
        createTextObject({
            x: 0,
            y: 0,
            width: 100,
            height: 50,
            content: '',
        }),
        overrides ?? {}
    );
}

export function createMaximalText(overrides?: Partial<TextObject>) {
    const text = createTextObject({
        x: 10,
        y: 10,
        width: 300,
        height: 100,
        content: 'Full Text',
        fontFamily: 'Times New Roman',
        fontSize: 24,
        color: '#ff0000',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 2,
        locked: true,
        visible: true,
        transform: { rotate: 15, scaleX: 1.2, scaleY: 1.2, opacity: 0.8 },
        style: {
            borderRadius: 10,
            borderColor: '#00ff00',
            borderWidth: 2,
            shadow: { offsetX: 2, offsetY: 2, blur: 5, color: '#00000088' },
            backgroundColor: '#ffff00',
        },
    });

    return overrides ? applyPatch(text, overrides) : text;
}
