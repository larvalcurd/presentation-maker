import type { BaseObject } from '../types/ObjectTypes.ts';
import { DEFAULT_BASE } from './defaults.ts';
import { nanoid } from 'nanoid';
import {
    mergeStyleWithDefaults,
    mergeTransformWithDefaults,
} from './helpers.ts';

type CreateBaseObjectParams = Partial<BaseObject> & {
    x: number;
    y: number;
    width: number;
    height: number;
};

function createBaseObject(params: CreateBaseObjectParams): BaseObject {
    const { style, transform, ...rest } = params as Partial<BaseObject> & {
        x: number;
        y: number;
        width: number;
        height: number;
    };

    return {
        ...DEFAULT_BASE,
        ...rest,
        id: params.id ?? nanoid(),
        // Merge partials with defaults so missing fields come from DEFAULT_*
        // If caller didn't provide style/transform, the merge helpers will return cloned defaults.
        style: mergeStyleWithDefaults(style),
        transform: mergeTransformWithDefaults(transform),
    };
}

export { createBaseObject };
