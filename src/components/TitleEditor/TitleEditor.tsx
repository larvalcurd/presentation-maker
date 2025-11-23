import type { JSX } from 'react';

type TitleProps = {
    title: string;
    onChangeTitle: (newTitle: string) => void;
};

function TitleEditor({ title, onChangeTitle }: TitleProps): JSX.Element {
    return (
        <header>
            <input
                type="text"
                value={title}
                onChange={(e) => {
                    const newTitle = e.target.value;
                    console.log('New title:', newTitle);
                    onChangeTitle(newTitle);
                }}
            />
        </header>
    );
}

export default TitleEditor;
