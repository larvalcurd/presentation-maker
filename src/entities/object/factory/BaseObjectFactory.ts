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
        // always return cloned defaults for nested objects;
        // do not apply/clone partial nested inputs here
        style: cloneStyle(DEFAULT_BASE.style),
        transform: cloneTransform(DEFAULT_BASE.transform),
    };
}

export { createBaseObject };
