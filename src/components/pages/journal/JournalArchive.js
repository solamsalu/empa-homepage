import React, { useState, useEffect } from 'react';
import ArchiveSection from './ArchiveSection'; // Import the file you just saved
import { useAuth } from '../../../hooks/useAuth'; // Assuming you have an auth hook

const JournalArchivePage = () => {
    const { user } = useAuth(); // Check if user is logged in
    const [editions, setEditions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Identify roles for the delete button
    const isAdminOrEditor = user && ['admin', 'managing_editor'].includes(user.role);

    const handleDelete = async (edition) => {
        if (window.confirm(`Are you sure you want to delete ${edition.title}?`)) {
            // Your API call to delete goes here
            console.log("Deleting edition:", edition.id);
        }
    };

    // Logic to separate 'Current' from 'Archive'
    const currentIssue = editions[0]; 
    const archiveIssues = editions.slice(1);

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <ArchiveSection 
                isLoading={isLoading}
                currentIssue={currentIssue}
                archiveIssues={archiveIssues}
                isAdminOrEditor={isAdminOrEditor}
                onDeleteClick={handleDelete}
            />
        </div>
    );
};