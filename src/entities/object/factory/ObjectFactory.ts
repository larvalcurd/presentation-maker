import { nanoid } from 'nanoid';
import type {
    BaseObject,
    TextObject,
    ImageObject,
    ObjectStyle,
    Transform,
} from '../types/ObjectTypes.ts';

// ------------------ DEFAULTS ------------------

const DEFAULT_STYLE: ObjectStyle = {
    borderRadius: 0,
    borderColor: '#00000000',
    borderWidth: 0,
    shadow: undefined,
    backgroundColor: 'transparent',
};

const DEFAULT_TRANSFORM: Transform = {
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
};

const DEFAULT_FILTERS = {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    blur: 0,
    grayscale: 0,
};

const DEFAULT_CROP = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
};

const DEFAULT_BASE: Omit<BaseObject, 'id' | 'type'> = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    zIndex: 0,
    locked: false,
    visible: true,
    style: { ...DEFAULT_STYLE },
    transform: { ...DEFAULT_TRANSFORM },
};

// ------------------ UTILS ------------------

function createBaseObject(
    data: Partial<BaseObject> & {
        x: number;
        y: number;
        width: number;
        height: number;
    }
): BaseObject {
    return {
        ...DEFAULT_BASE,
        ...data,
        id: data.id ?? nanoid(),
        style: { ...DEFAULT_STYLE, ...data.style },
        transform: { ...DEFAULT_TRANSFORM, ...data.transform },
    };
}

// ------------------ TEXT OBJECT ------------------

export function createTextObject(
    params: {
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
    } & Partial<BaseObject>
): TextObject {
    const base = createBaseObject(params);
    return {
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
}

// ------------------ IMAGE OBJECT ------------------

export function createImageObject(
    params: {
        x: number;
        y: number;
        width: number;
        height: number;
        src: string;
        preserveAspect?: boolean;
        fit?: 'contain' | 'cover' | 'fill' | 'tile';
        crop?: Partial<typeof DEFAULT_CROP>;
        filters?: Partial<typeof DEFAULT_FILTERS>;
        mask?: {
            shape: 'circle' | 'rounded' | 'polygon' | 'none';
            radius?: number;
            points?: { x: number; y: number }[];
        };
        rotationOrigin?:
            | 'center'
            | 'top-left'
            | 'top-right'
            | 'bottom-left'
            | 'bottom-right'
            | { x: number; y: number };
    } & Partial<BaseObject>
): ImageObject {
    const base = createBaseObject(params);
    return {
        ...base,
        type: 'image',
        src: params.src,
        preserveAspect: params.preserveAspect ?? true,
        fit: params.fit ?? 'contain',
        crop: params.crop ? { ...DEFAULT_CROP, ...params.crop } : undefined,
        filters: params.filters
            ? { ...DEFAULT_FILTERS, ...params.filters }
            : undefined,
        mask: params.mask,
        rotationOrigin: params.rotationOrigin ?? 'center',
    };
}

// ------------------ TEST DATA FACTORIES ------------------

// Minimal
export function createMinimalText(overrides?: Partial<TextObject>) {
    return createTextObject({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        content: '',
        ...overrides,
    });
}
export function createMinimalImage(overrides?: Partial<ImageObject>) {
    return createImageObject({
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        src: '',
        ...overrides,
    });
}

// Maximal
export function createMaximalText(overrides?: Partial<TextObject>) {
    return createTextObject({
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
        style: {
            borderRadius: 10,
            borderColor: '#00ff00',
            borderWidth: 2,
            shadow: { offsetX: 2, offsetY: 2, blur: 5, color: '#00000088' },
            backgroundColor: '#ffff00',
        },
        transform: { rotate: 15, scaleX: 1.2, scaleY: 1.2, opacity: 0.8 },
        ...overrides,
    });
}
export function createMaximalImage(overrides?: Partial<ImageObject>) {
    return createImageObject({
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        src: 'big-image.png',
        preserveAspect: false,
        fit: 'cover',
        crop: { x: 0, y: 0, width: 200, height: 150 },
        filters: {
            brightness: 1.2,
            contrast: 1.5,
            blur: 2,
            saturation: 1.3,
            grayscale: 0.5,
        },
        mask: { shape: 'circle', radius: 50 },
        rotationOrigin: { x: 100, y: 50 },
        locked: true,
        visible: true,
        style: {
            borderRadius: 20,
            borderColor: '#123456',
            borderWidth: 3,
            shadow: { offsetX: 5, offsetY: 5, blur: 10, color: '#333333aa' },
            backgroundColor: '#abcdef',
        },
        transform: { rotate: 45, scaleX: 0.8, scaleY: 0.8, opacity: 0.9 },
        ...overrides,
    });
}
