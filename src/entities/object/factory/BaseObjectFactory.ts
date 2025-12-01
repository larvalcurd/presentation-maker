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
    return {
        ...DEFAULT_BASE,
        ...params,
        id: params.id ?? nanoid(),
        style: mergeStyleWithDefaults(params.style),
        transform: mergeTransformWithDefaults(params.transform),
    };
}

export { createBaseObject };
