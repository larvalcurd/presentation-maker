// typescript
export type BaseObject = {
    id: string;
    x: number;
    y: number;
    zIndex: number;
    width: number;
    height: number;

    locked?: boolean;
    visible?: boolean;
    transform?: ObjectTransform;
    style?: ObjectStyle;
};

export type ObjectTransform = {
    rotate?: number;
    scaleX?: number;
    scaleY?: number;
    opacity?: number;
};

export type ObjectStyle = {
    borderRadius?: number;
    borderColor?: string;
    borderWidth?: number;
    shadow?: {
        offsetX?: number;
        offsetY?: number;
        blur?: number;
        color?: string;
    };

    backgroundColor?: string;
};

export type TextObject = BaseObject & {
    type: 'text';
    content: string;

    fontFamily: string;
    fontSize: number;
    color: string;

    fontWeight?: number | 'normal' | 'bold';
    fontStyle?: 'normal' | 'italic';
    textAlign?: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
};

export type ImageObject = BaseObject & {
    type: 'image';
    src: string;

    preserveAspect?: boolean;
    fit?: 'contain' | 'cover' | 'fill' | 'tile';

    crop?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };

    filters?: {
        brightness?: number;
        contrast?: number;
        saturation?: number;
        blur?: number;
        grayscale?: number;
    };

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
};

export type SlideObject = TextObject | ImageObject;

export type ObjectSelection = {
    slideId: string;
    objectIds: string[];
};
