import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Alert, AlertTitle } from '@material-ui/lab';
import { database } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';

const InfoModal = ({ currentFolder, filename, url }) => {

    const [open, setOpen] = useState(true);
    const { currentUser } = useAuth();

    function closeModal() {
        setOpen(false)
    }

    const overwrite = () => {
        database.files
            .where('name', '==', filename)
            .where('folderId', '==', currentFolder.id)
            .where('userId', '==', currentUser.uid)
            .get().then(existingFiles => {
                const existingFile = existingFiles.docs[0];
                if (existingFile) {
                    existingFile.ref.update({
                        url: url
                    })
                }
            })
    };

    return (
        <Modal show={open} onHide={closeModal}>
            <Modal.Body>
                <Alert severity="warning">
                    <AlertTitle>Warning</AlertTitle>
                    Warning! The file you are trying to add already exists. Do you want to override this file?
                </Alert>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={overwrite}>
                    Yes
                </Button>
                <Button variant="secondary" type="submit" onClick={closeModal}>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default InfoModal
