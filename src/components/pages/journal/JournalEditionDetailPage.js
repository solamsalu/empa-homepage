import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../utils/constants';
import JournalCover from '../../common/JournalCover';
import { Download, BookOpen, User, ArrowLeft, FileText } from 'lucide-react';
import LatexRenderer from '../../common/LatexRenderer';

const JournalEditionDetailPage = () => {
    const { editionId } = useParams();
    const [edition, setEdition] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEdition = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/journals/editions/${editionId}`);
                setEdition(res.data.data);
            } catch (err) {
                setError("Edition not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchEdition();
    }, [editionId]);

    if (loading) return <div className="p-20 text-center">Loading Table of Contents...</div>;
    if (error) return <div className="p-20 text-center text-red-500">{error}</div>;

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="max-w-5xl mx-auto px-4">
                <Link to="/journals" className="inline-flex items-center gap-2 text-blue-600 mb-8 font-semibold">
                    <ArrowLeft size={20} /> Back to Archive
                </Link>

                <div className="grid md:grid-cols-3 gap-12">
                    <aside className="md:col-span-1">
                        <JournalCover edition={edition} className="shadow-2xl" />
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold">{edition.title}</h2>
                            <p className="text-slate-500">Vol. {edition.volume_number}, Issue {edition.issue_number}</p>
                            {edition.pdf_url && (
                                <a href={`${STATIC_ASSETS_BASE_URL}${edition.pdf_url}`} className="mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white p-3 rounded-lg font-bold">
                                    <Download size={20} /> Full Issue PDF
                                </a>
                            )}
                        </div>
                    </aside>

                    <main className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <BookOpen size={24} className="text-blue-900" /> Table of Contents
                        </h3>
                        <div className="space-y-4">
                            {edition.papers?.map((paper, i) => (
                                <div key={paper.id} className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                                    <span className="text-xs font-bold text-blue-600">ARTICLE #{i+1}</span>
                                    <h4 className="text-xl font-bold text-slate-800 mt-1">
                                        <LatexRenderer content={paper.title} />
                                    </h4>
                                    <p className="flex items-center gap-2 text-slate-600 mt-2 italic"><User size={16} /> {paper.author_name}</p>
                                    <div className="mt-4 flex justify-end gap-4">
                                        <Link to={`/journals/articles/${paper.id}`} className="text-sm font-semibold text-slate-500">Details</Link>
                                        <a href={`${STATIC_ASSETS_BASE_URL}${paper.production_file_url || paper.pdf_url}`} className="text-sm font-bold text-blue-600 flex items-center gap-1">
                                            <FileText size={16} /> PDF
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default JournalEditionDetailPage;


