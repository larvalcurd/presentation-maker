import type {
    BaseObject,
    ImageCrop,
    ImageFilters,
    ImageMask,
    ImageObject,
} from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatch } from './helpers.ts';

type CreateImageObjectParams = Partial<BaseObject> & {
    x: number;
    y: number;
    width: number;
    height: number;
    src: string;
    preserveAspect?: boolean;
    fit?: 'contain' | 'cover' | 'fill' | 'tile';
    crop?: Partial<ImageCrop>;
    filters?: Partial<ImageFilters>;
    mask?: ImageMask;
    rotationOrigin?: ImageObject['rotationOrigin'];
};

export function createImageObject(
    params: CreateImageObjectParams
): ImageObject {
    const base = createBaseObject(params);
    const original: ImageObject = {
        ...base,
        type: 'image',
        src: params.src,
        preserveAspect: true,
        fit: 'contain',
        crop: undefined,
        filters: undefined,
        mask: undefined,
        rotationOrigin: 'center',
    };
    // defaults are in `original`, user-provided fields in `params` are applied last
    return applyPatch(original, params as Partial<ImageObject>);
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

export function createMaximalImage(overrides?: Partial<ImageObject>) {
    const maximalFilters: ImageFilters = {
        brightness: 1.2,
        contrast: 1.5,
        blur: 2,
        saturation: 1.3,
        grayscale: 0.5,
    };

    // ensure filters is a concrete object on maximal fixtures
    const mergedFilters: ImageFilters = overrides?.filters
        ? { ...maximalFilters, ...(overrides.filters as ImageFilters) }
        : maximalFilters;

    return createImageObject({
        x: 50,
        y: 50,
        width: 400,
        height: 300,
        src: 'big-image.png',
        preserveAspect: false,
        fit: 'cover',
        crop: { x: 0, y: 0, width: 200, height: 150 },
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

        // defaults first (above), overrides last
        ...overrides,
        filters: mergedFilters,
    });
}
/*
┌─────────────────────────────┐
│ 1. Максимальные дефолты     │
│                             │
│ style: {...}                │
│ transform: {...}            │
│ filters: maximalFilters     │
│ crop, mask, rotationOrigin  │
│ x, y, width, height, src    │
│ locked, visible             │
└─────────────┬───────────────┘
              │
              ▼
┌──────────────────────────────┐
│ 2. Пользовательские overrides│
│  - Любые поля ImageObject    │
│  - filters (особый случай)   │
└─────────────┬────────────────┘
              │
              │ merge filters:
              │ mergedFilters = { ...maximalFilters, ...overrides.filters }
              ▼
┌─────────────────────────────┐
│ 3. Вход в createImageObject │
│  - createBaseObject(params) │
│  - создаётся original       │
│    ImageObject с дефолтами  │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│ 4. applyPatch               │
│  - Накладывает все overrides│
│  - Обрабатывает style,      │
│    transform, crop,         │
│    filters, mask            │
│  - mergedFilters заменяет   │
│    filters                  │
└─────────────┬───────────────┘
              │
              ▼
┌─────────────────────────────┐
│ 5. Финальный ImageObject    │
│  - Все поля есть            │
│  - Максимальные дефолты     │
│    сохранены                │
│  - Пользовательские значения│ 
│    применены                │
│  - filters = mergedFilters  │
└─────────────────────────────┘
*/
