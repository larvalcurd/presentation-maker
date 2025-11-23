import type { Slide } from '../slide/types/SlideTypes.ts';
import type { ObjectSelection } from '../object/types/ObjectTypes.ts';

// export type PresentationMeta = {
//     author?: string;
//     createdAt: string;
//     updatedAt: string;
//     thumbnail?: string;
// };

export type Presentation = {
    id: string;
    title: string;
    slides: Slide[];
    selectedObjects?: ObjectSelection | null;
    selectedSlideId?: string | null;

    //meta?: PresentationMeta;
};
