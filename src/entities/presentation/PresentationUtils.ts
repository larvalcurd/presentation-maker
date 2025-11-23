import type { Slide } from '../slide/types/SlideTypes.ts';
import type { Presentation } from './PresentationTypes.ts';

export function createPresentation(
    id: string,
    title: string,
    slides: Slide[] = []
): Presentation {
    return {
        id,
        title,
        slides,
        selectedSlideId: slides[0]?.id || null,
        selectedObjects: null,
    };
}

export function updatePresentationTitle(
    presentation: Presentation,
    newTitle: string
): Presentation {
    return {
        ...presentation,
        title: newTitle,
    };
}

export function addSlide(
    presentation: Presentation,
    slide: Slide
): Presentation {
    return {
        ...presentation,
        slides: [...presentation.slides, slide],
    };
}

export function removeSlide(
    presentation: Presentation,
    slideId: string
): Presentation {
    const newSlides = presentation.slides.filter(
        (slide) => slide.id !== slideId
    );

    const newSelectedSlideId =
        presentation.selectedSlideId === slideId
            ? newSlides[0]?.id || null
            : presentation.selectedSlideId;

    return {
        ...presentation,
        slides: newSlides,
        selectedSlideId: newSelectedSlideId,
        selectedObjects:
            presentation.selectedObjects?.slideId === slideId
                ? null
                : presentation.selectedObjects,
    };
}

export function moveSlide(
    presentation: Presentation,
    slideId: string,
    newIndex: number
): Presentation {
    const slides = [...presentation.slides];
    const currentIndex = slides.findIndex((slide) => slide.id === slideId);

    if (currentIndex === -1 || currentIndex === newIndex) return presentation;

    const [movedSlide] = slides.splice(currentIndex, 1);
    slides.splice(newIndex, 0, movedSlide);

    return {
        ...presentation,
        slides,
    };
}

export function updateSlideInPresentation(
    presentation: Presentation,
    slideId: string,
    updatedSlide: Slide
): Presentation {
    return {
        ...presentation,
        slides: presentation.slides.map((slide) =>
            slide.id === slideId ? updatedSlide : slide
        ),
    };
}
