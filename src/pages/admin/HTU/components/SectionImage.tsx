import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload'
import { SectionProps } from '../../../../interfaces/Unit'
import { useRef } from 'react';
import { RequestService } from '../../../../services/RequestService';

export default function SectionImage({ section, setSection }: SectionProps) {
    const fileRef = useRef<FileUpload>(null);

    const onUpload = () => {
        fileRef.current?.clear();
    };

    const onSelect = async (event: FileUploadSelectEvent) => {
        const image = event.files[0]

        const formData = new FormData()
        formData.append('image', image as File)

        try {
            const response = await RequestService('units/section/image', 'POST', formData, 'form-data');
            if (response) {
                console.log(response)
            } else {
                console.error('Error uploading data and image')
                alert('Error Details, Coming soon')
            }
        } catch (error) {
            console.error('Request error:', error)
        }



        console.log('onSelect')
    };
    return (
        <>
            <FileUpload
                ref={fileRef}
                mode="basic" name="demo[]" onSelect={onSelect} uploadHandler={onUpload} customUpload={true} accept="image/*" maxFileSize={1000000}
            />
        </>
    )
}
