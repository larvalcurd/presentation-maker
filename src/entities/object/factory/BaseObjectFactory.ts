import type { BaseObject } from '../types/ObjectTypes.ts';
import { DEFAULT_BASE } from './defaults.ts';
import { nanoid } from 'nanoid';
import { cloneStyle, cloneTransform } from './helpers.ts';

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
        style: cloneStyle(params.style ?? DEFAULT_BASE.style),
        transform: cloneTransform(params.transform ?? DEFAULT_BASE.transform),
    };
}

export { createBaseObject };
