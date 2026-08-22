import React from 'react';
import PrimaryButton from '../../common/PrimaryButton';
import { Download, AlertCircle } from 'lucide-react';

const SubmissionGuidelinesSection = () => (
    <div>
        <div className="text-center">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Author Guidelines</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12">
                Adherence to JEMPA policies is mandatory for review.
            </p>
        </div>

        <div className="space-y-6 bg-blue-50 p-8 rounded-xl border border-blue-200">
            <h3 className="text-2xl font-bold text-blue-800">Submission Requirements</h3>
            <ul className="list-decimal pl-8 space-y-4 text-lg text-gray-800">
                <li><strong>Format:</strong> All manuscripts must be prepared using the official JEMPA <span className="font-mono bg-blue-100 px-1">LaTeX</span> template.</li>
                <li><strong>File Type:</strong> Submit only the compiled PDF for initial review. Source files are required upon acceptance.</li>
                <li><strong>Anonymity:</strong> For double-blind review, remove author names and affiliations from the manuscript PDF.</li>
                <li><strong>Declarations:</strong> You must declare that the work is original, not submitted elsewhere, and free of undisclosed conflicts of interest.</li>
                <li><strong>AI Policy:</strong> Use of AI for grammar checking is permitted but must be disclosed. AI cannot be an author.</li>
            </ul>
        </div>

        <div className="mt-8 flex justify-center gap-4">
            <PrimaryButton onClick={() => window.open("/downloads/JEMPA_Template.zip")}>
                <Download className="mr-2" size={18} /> Download LaTeX Template
            </PrimaryButton>
            <PrimaryButton 
    onClick={() => window.open("/downloads/JEMPA_full_guidelines.pdf")}
    className="!bg-white !text-gray-700 border border-gray-300 hover:!bg-gray-50 !shadow-none"
>
    <AlertCircle className="mr-2" size={18}/> View Full Author Guide
</PrimaryButton>
        </div>
    </div>
);

export default SubmissionGuidelinesSection;