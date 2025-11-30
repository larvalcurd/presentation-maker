import type { BaseObject } from '../types/ObjectTypes.ts';
import { DEFAULT_BASE } from './defaults.ts';
import { nanoid } from 'nanoid';
import {
    mergeStyleWithDefaults,
    mergeTransformWithDefaults,
} from './helpers.ts';

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
        style: mergeStyleWithDefaults(data.style),
        transform: mergeTransformWithDefaults(data.transform),
    };
}

export { createBaseObject };
