import { faFile } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const File = ({ file }) => {
    return (
        <a target="_blank" href={file.url} className="btn btn-outline-dark text-truncate w-100">
            <FontAwesomeIcon className="mr-2" icon={faFile} />
            {file.name}
        </a>
    )
}

export default File;
