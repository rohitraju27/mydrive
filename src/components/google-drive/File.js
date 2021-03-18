import { faFile, faFilePdf, faFileExcel, faFilePowerpoint, faFileWord, faFileImage } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileIcon, defaultStyles } from 'react-file-icon';
import React from 'react';

const File = ({ file }) => {
    const fileName = file.name.split('.');
    const fileExtension = fileName[fileName.length - 1];
    return (
        <a target="_blank" href={file.url} className="btn btn-outline-dark text-truncate w-100">
            {
                fileExtension === 'pdf' ? <FontAwesomeIcon color="red" className="mr-2" icon={faFilePdf} /> :
                    fileExtension === 'docx' ? <FontAwesomeIcon color="blue" className="mr-2" icon={faFileWord} /> :
                        fileExtension === 'xlsx' ? <FontAwesomeIcon color="green" className="mr-2" icon={faFileExcel} /> :
                            fileExtension === 'pptx' ? <FontAwesomeIcon color="orange" className="mr-2" icon={faFilePowerpoint} /> :
                                (fileExtension === 'png' || fileExtension === 'jpeg' || fileExtension === 'jpg') ? <FontAwesomeIcon color="#1FCCEC" className="mr-2" icon={faFileImage} /> :
                                    <FontAwesomeIcon className="mr-2" icon={faFile} />
            }
            {file.name}
        </a>
    )
}

export default File;
