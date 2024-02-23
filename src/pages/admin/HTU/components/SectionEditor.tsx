import { Editor, EditorTextChangeEvent } from "primereact/editor";
import { SectionProps } from "../../../../interfaces/Unit";


export default function SectionEditor({ section, setSection }: SectionProps) {

    const renderHeader = () => {
        return (
            <>
                <select className="ql-header">
                </select>
                <select className="ql-font">
                </select>
                <span className="ql-formats">
                    <button className="ql-bold" aria-label="Bold"></button>
                    <button className="ql-italic" aria-label="Italic"></button>
                    <button className="ql-underline" aria-label="Underline"></button>
                </span>
                <span className="ql-formats">
                    <select className="ql-color" ></select>
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <select className="ql-align"></select>
                </span>
                <span className="ql-formats">
                    <button className="ql-link"></button>
                    <button className="ql-image"></button>
                    <button className="ql-video"></button>
                </span>
            </>
        );
    };

    const header = renderHeader();

    return (
        <>
            <div className="card">
                <Editor value={section} onTextChange={(e: EditorTextChangeEvent) => setSection(e.htmlValue as string)}
                    headerTemplate={header}
                />

            </div>
        </>
    )
}
