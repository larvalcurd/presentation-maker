import type {
    BaseObject,
    ObjectStyle,
    ObjectTransform,
    ImageFilters,
    ImageCrop,
} from '../types/ObjectTypes.ts';

const DEFAULT_STYLE: ObjectStyle = {
    borderRadius: 0,
    borderColor: '#00000000',
    borderWidth: 0,
    shadow: undefined,
    backgroundColor: 'transparent',
};

const DEFAULT_TRANSFORM: ObjectTransform = {
    rotate: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
};

const DEFAULT_FILTERS: ImageFilters = {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    blur: 0,
    grayscale: 0,
};

const DEFAULT_CROP: ImageCrop = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
};

const DEFAULT_BASE: Omit<BaseObject, 'id'> = {
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

export {
    DEFAULT_STYLE,
    DEFAULT_TRANSFORM,
    DEFAULT_FILTERS,
    DEFAULT_CROP,
    DEFAULT_BASE,
};
