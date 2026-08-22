import React from 'react';
import { Link } from 'react-router-dom';
import JournalCover from '../../common/JournalCover';
import { BookOpen, Book, Download, Trash2, Pencil } from 'lucide-react'; 
import { STATIC_ASSETS_BASE_URL } from '../../../utils/constants';

/**
 * A professional component to display the current journal issue and the full archive.
 * Includes admin-only actions for Editing and Deleting.
 */
const ArchiveSection = ({ 
    isLoading, 
    error, 
    currentIssue, 
    archiveIssues, 
    isAdminOrEditor, 
    onDeleteClick, 
    onEditClick 
}) => {
    
    if (isLoading) {
        return (
            <div className="space-y-16 animate-pulse">
                <div className="bg-white p-8 rounded-xl shadow-2xl grid md:grid-cols-3 gap-8 items-center border">
                    <div className="flex justify-center md:col-span-1"><div className="w-48 h-64 bg-gray-300 rounded-md"></div></div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
                        <div className="h-6 w-1/2 bg-gray-300 rounded"></div>
                        <div className="h-4 w-full bg-gray-200 rounded"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, i) => <div key={i} className="w-full h-48 bg-gray-300 rounded-md"></div>)}
                </div>
            </div>
        );
    }

    if (error) return <p className="text-center text-red-500 py-10 font-semibold">{error}</p>;

    if (!currentIssue) {
        return (
            <div className="text-center py-16 bg-white rounded-xl shadow-md border">
                <Book size={48} className="mx-auto text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-700">The Journal Archive is Empty</h3>
                <p className="mt-2 text-gray-500">Check back later for our first publication!</p>
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* CURRENT ISSUE SECTION */}
            <section>
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-extrabold text-blue-900 mb-2">Current Issue</h2>
                    <p className="text-lg text-gray-600">Explore the latest mathematical research.</p>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-2xl grid md:grid-cols-3 gap-8 items-center border border-gray-200 hover:border-blue-300 transition-all relative group">
                    {isAdminOrEditor && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                            <button onClick={() => onEditClick(currentIssue)} className="p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                                <Pencil size={18} />
                            </button>
                            <button onClick={() => onDeleteClick(currentIssue)} className="p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors">
                                <Trash2 size={18} />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-center md:col-span-1">
                        <Link to={`/journals/edition/${currentIssue.id}`}><JournalCover edition={currentIssue} /></Link>
                    </div>
                    <div className="md:col-span-2 text-center md:text-left">
                        <h3 className="text-2xl font-bold text-gray-800">{currentIssue.title}</h3>
                        <p className="text-lg font-semibold text-gray-600">Volume {currentIssue.volume_number}, Issue {currentIssue.issue_number}</p>
                        <p className="mt-4 text-gray-700">{currentIssue.description}</p>
                        <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
                             <Link to={`/journals/edition/${currentIssue.id}`} className="inline-flex items-center gap-2 bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700">
                                <BookOpen size={20} /> Table of Contents
                             </Link>
                             {currentIssue.pdf_url && (
                                <a href={`${STATIC_ASSETS_BASE_URL}${currentIssue.pdf_url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-gray-700 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-800">
                                    <Download size={20} /> PDF
                                </a>
                             )}
                        </div>
                    </div>
                </div>
            </section>

            {/* FULL ARCHIVE SECTION */}
            {archiveIssues.length > 0 && (
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-extrabold text-blue-900">Full Archive</h2>
                    </div>
                    <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-10 gap-x-6 justify-items-center">
                            {archiveIssues.map(edition => (
                                <div key={edition.id} className="relative text-center group">
                                    <Link to={`/journals/edition/${edition.id}`} className="block">
                                        <JournalCover edition={edition} />
                                        <p className="mt-2 text-sm font-semibold text-gray-700 group-hover:text-blue-600">
                                            Vol. {edition.volume_number}, Iss. {edition.issue_number}
                                        </p>
                                    </Link>
                                    
                                    {isAdminOrEditor && (
                                        <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 translate-x-2 -translate-y-2">
                                            <button onClick={() => onEditClick(edition)} className="p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700">
                                                <Pencil size={14} />
                                            </button>
                                            <button onClick={() => onDeleteClick(edition)} className="p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ArchiveSection;