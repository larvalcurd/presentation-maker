import { slides } from '../../data/Slides.ts';
import styles from './SlideList.module.css';

const SlideList = () => (
    <div className={styles['slide-list']}>
        {slides.map((slide, index) => (
            <div
                key={slide.id}
                onClick={() => console.log('Slide:', slide.id, '№', index + 1)}
                className={styles['slide-list-item']}
            >
                {slide.name}
            </div>
        ))}
    </div>
);
export default SlideList;
