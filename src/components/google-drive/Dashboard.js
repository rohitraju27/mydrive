import React from 'react';
import { Container } from 'react-bootstrap';
import AddFolderButton from './AddFolderButton';
import Header from './Header';
import { useAuth } from '../../contexts/AuthContext';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { useFolder } from '../hooks/useFolder';
import Folder from './Folder';
import FolderBreadcrumbs from './FolderBreadcrumbs';
import AddFileButton from './AddFileButton';
import File from "./File";

export default function Dashboard() {
    const { folderId } = useParams();
    const { state = {} } = useLocation();
    const { folder, childFolders, childFiles } = useFolder(folderId, state.folder);
    const { currentUser } = useAuth();
    const history = useHistory();

    if (!currentUser)
        history.push("/login");

    return (
        <>
            <Header />
            <Container fluid>
                <div className="d-flex align-items-center">
                    <FolderBreadcrumbs currentFolder={folder} />
                    <AddFileButton currentFolder={folder} />
                    <AddFolderButton currentFolder={folder} />
                </div>
                {childFolders.length > 0 && (
                    <div className="d-flex flex-wrap">
                        {
                            childFolders.map(childFolder => (
                                <div style={{ maxWidth: '250px' }} key={childFolder.id} className="p-2">
                                    <Folder folder={childFolder} />
                                </div>
                            ))
                        }
                    </div>
                )}
                {childFolders.length > 0 && childFiles.length > 0 && <hr />}
                {childFiles.length > 0 && (
                    <div className="d-flex flex-wrap">
                        {
                            childFiles.map(childFile => (
                                <div style={{ maxWidth: '250px' }} key={childFile.id} className="p-2">
                                    <File file={childFile} />
                                </div>
                            ))
                        }
                    </div>
                )}
            </Container>
        </>
    )
}
