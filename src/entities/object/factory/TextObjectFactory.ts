import type { BaseObject, TextObject } from '../types/ObjectTypes.ts';
import { createBaseObject } from './BaseObjectFactory.ts';
import { applyPatch } from './helpers.ts';
import { DEFAULT_STYLE } from './defaults.ts';

export function createTextObject(
    params: {
        x: number;
        y: number;
        width: number;
        height: number;
        content: string;
        fontFamily?: string;
        fontSize?: number;
        color?: string;
        fontWeight?: number | 'normal' | 'bold';
        fontStyle?: 'normal' | 'italic';
        textAlign?: 'left' | 'center' | 'right';
        lineHeight?: number;
        letterSpacing?: number;
    } & Partial<BaseObject>
): TextObject {
    const base = createBaseObject(params);
    const original: TextObject = {
        ...base,
        type: 'text',
        content: '',
        fontFamily: 'Arial',
        fontSize: 16,
        color: '#000000',
        fontWeight: 'normal',
        fontStyle: 'normal',
        textAlign: 'left',
        lineHeight: 1.2,
        letterSpacing: 0,
    };
    return applyPatch(original, params as Partial<TextObject>);
}

export function createMinimalText(overrides?: Partial<TextObject>) {
    return createTextObject({
        x: 0,
        y: 0,
        width: 100,
        height: 50,
        content: '',
        ...overrides,
    });
}

export function createMaximalText(overrides?: Partial<TextObject>) {
    const maximalStyle: NonNullable<TextObject['style']> = {
        borderRadius: 10,
        borderColor: '#00ff00',
        borderWidth: 2,
        shadow: { offsetX: 2, offsetY: 2, blur: 5, color: '#00000088' },
        backgroundColor: '#ffff00',
    };

    // merge incoming style overrides over the maximal style (preserve maximal-only fields)
    const incomingStyle = overrides?.style;
    const mergedShadow =
        incomingStyle && incomingStyle.shadow
            ? {
                  ...(maximalStyle.shadow ?? {}),
                  ...(incomingStyle.shadow ?? {}),
              }
            : maximalStyle.shadow
              ? { ...maximalStyle.shadow }
              : undefined;

    const finalStyle = {
        ...DEFAULT_STYLE,
        ...maximalStyle,
        ...(incomingStyle ?? {}),
        shadow: mergedShadow,
    };

    // pass through other overrides but avoid letting applyPatch treat `style` as a patch
    const rest = { ...(overrides ?? {}) } as Partial<TextObject>;
    delete rest.style; // it is already included in finalStyle

    return createTextObject({
        x: 10,
        y: 10,
        width: 300,
        height: 100,
        content: 'Full Text',
        fontFamily: 'Times New Roman',
        fontSize: 24,
        color: '#ff0000',
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        lineHeight: 1.5,
        letterSpacing: 2,
        locked: true,
        visible: true,
        transform: { rotate: 15, scaleX: 1.2, scaleY: 1.2, opacity: 0.8 },
        style: finalStyle,
        ...rest,
    });
}
/*Создание TextObject с дефолтами и пользовательскими изменениями

   Пользователь вызывает createTextObject(params)
        │
        │  - params могут содержать частичные поля TextObject
        ▼
[User overrides / params]
        │
        ▼
   createBaseObject(params)
        │
        │  - Создаёт BaseObject с дефолтами (x, y, width, height, style, transform)
        │  - Генерирует id, если его нет
        ▼
   Base Object с дефолтами
        │
        ▼
   Создаём "original" TextObject
        │
        │  - type: 'text'
        │  - дефолтный content, fontFamily, fontSize, color и др.
        ▼
   Original TextObject (с дефолтами)
        │
        ▼
┌─────────────────────────────────────────────┐
│   Подготовка пользовательских изменений     │
│                                             │
│ const rest = {...overrides};                │
│ delete rest.style;                          │
└─────────────────────────────────────────────┘
        │
        │  - Мы берём все поля, кроме style
        │  - Нужно, чтобы applyPatch не обрабатывал style как патч
        ▼
   Применяем applyPatch(original, rest)
        │
        │  - Все поля из rest накладываются на original
        │  - style уже не трогаем, т.к. он был объединён заранее в finalStyle
        ▼
   Финальный TextObject
        │
        │  - С дефолтами
        │  - С пользовательскими изменениями
        │  - С корректным style (merged)
        ▼
   Возвращается пользователю
*/
