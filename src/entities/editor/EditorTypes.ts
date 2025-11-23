import type { Presentation } from '../presentation/PresentationTypes.ts';
import type { ObjectSelection } from '../object/types/ObjectTypes.ts';

export type Editor = {
    presentation: Presentation;
    selection: ObjectSelection | null;
    selectedSlideId?: string | null;
};
