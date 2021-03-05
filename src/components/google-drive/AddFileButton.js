import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { storage, database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { ROOT_FOLDER } from '../hooks/useFolder';
import { v4 as uuidV4 } from 'uuid';
import ReactDOM from 'react-dom';
import { ProgressBar, Toast } from 'react-bootstrap';

const AddFileButton = ({ currentFolder }) => {

    const { currentUser } = useAuth();
    const [fileUploading, setFileUploading] = useState([]);

    function handleUpload(e) {
        const file = e.target.files[0];
        if (currentFolder == null || file == null) return;

        const id = uuidV4();
        setFileUploading(prevFileUploading => [
            ...prevFileUploading,
            { id: id, name: file.name, error: false, progress: 0 }
        ])

        let path = currentFolder === ROOT_FOLDER ? [] : [ROOT_FOLDER];
        if (currentFolder) path = [...path, ...currentFolder.path];
        path = [...path, currentFolder];

        let filePath = "";
        path.length > 0
            ? (
                path.map(folder => {
                    filePath += `${folder.name}/`
                })
            ) : filePath = ''

        filePath = filePath.concat(file.name);
        const upload = storage.ref(`files/${currentUser.uid}/${filePath}`).put(file);

        upload.on("state_changed", snapshot => {
            const progress = snapshot.bytesTransferred / snapshot.totalBytes;
            setFileUploading(prevFileUploading => {
                return prevFileUploading.map(uploadFile => {
                    if (uploadFile.id === id)
                        return { ...uploadFile, progress: progress }

                    return uploadFile
                })
            })
        }, () => {
            setFileUploading(prevFileUploading => {
                return prevFileUploading.map(fileUpload => {
                    if (fileUpload.id === id)
                        return { ...fileUpload, error: true }
                    return fileUpload
                })
            })
        }, () => {
            setFileUploading(prevFileUploading => {
                return prevFileUploading.filter(fileUpload => fileUpload.id !== id)
            })

            upload.snapshot.ref.getDownloadURL().then(url => {
                database.files
                    .where('name', '==', file.name)
                    .where('userId', '==', currentUser.uid)
                    .where('folderId', '==', currentFolder.id)
                    .get().then(existingFiles => {
                        const existingFile = existingFiles.docs[0];
                        if (existingFile) {
                            existingFile.ref.update({ url: url })
                        } else {
                            database.files.add({
                                name: file.name,
                                url: url,
                                createdAt: database.getCurrentTimestamp(),
                                userId: currentUser.uid,
                                folderId: currentFolder.id
                            })
                        }
                    })
            })
        })
    };

    return (
        <>
            <label className="btn btn-outline-success btn-sm m-0 mr-2 mt-2 ml-2">
                <FontAwesomeIcon icon={faFileUpload} />
                <input
                    type="file"
                    onChange={handleUpload}
                    style={{ opacity: '0', position: 'absolute', left: '-9999px' }}
                />
            </label>
            {fileUploading.length > 0 &&
                ReactDOM.createPortal(
                    <div
                        style={{
                            position: "absolute",
                            bottom: "1rem",
                            right: "1rem",
                            maxWidth: "250px"
                        }}
                    >
                        {fileUploading.map(file => (
                            <Toast key={file} onClose={() => {
                                setFileUploading(prevFileUploading => {
                                    return prevFileUploading.filter(fileUpload => {
                                        return fileUpload.id !== file.id
                                    })
                                })
                            }}>
                                <Toast.Header
                                    closeButton={file.error}
                                    className="text-truncate w-100 d-block">
                                    {file.name}
                                </Toast.Header>
                                <Toast.Body>
                                    <ProgressBar
                                        animated={!file.error}
                                        variant={file.error ? "danger" : "primary"}
                                        now={file.error ? 100 : file.progress * 100}
                                        label={
                                            file.error ? "Error" : `${Math.round(file.progress * 100)}%`
                                        }
                                    />
                                </Toast.Body>
                            </Toast>
                        ))}
                    </div>,
                    document.body
                )
            }
        </>
    )
}

export default AddFileButton;
