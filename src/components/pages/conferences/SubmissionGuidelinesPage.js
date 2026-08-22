import React from 'react';
import { Link } from 'react-router-dom'; 
import { HelpCircle } from 'lucide-react';

const SubmissionGuidelinesPage = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-white rounded-lg shadow-xl prose-lg max-w-none mx-auto font-sans">
            <h2 className="text-4xl font-extrabold text-blue-900 mb-8 text-center leading-tight">Conference Paper Submission Guidelines</h2>
            <p className="text-xl text-gray-700 leading-relaxed text-center max-w-3xl mx-auto mb-12">
                Carefully review the guidelines below to ensure your submission meets all requirements for the EMPA Annual Conference. Adherence to these guidelines is crucial for a smooth review process.
            </p>

            <section className="mb-10 p-6 bg-blue-50 rounded-xl shadow-md border border-blue-200">
                <h3 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    1. Paper Format and Length
                </h3>
                <ul className="list-disc pl-8 space-y-3 text-gray-800 text-lg">
                    <li><strong>Language:</strong> Papers must be written exclusively in English.</li>
                    <li><strong>Page Setup:</strong> A4 paper format with 1-inch (2.54 cm) margins on all sides.</li>
                    <li><strong>Font:</strong> Times New Roman, 12-point.</li>
                    <li><strong>Line Spacing:</strong> 1.5 lines.</li>
                    <li><strong>Length:</strong> Maximum 8-10 pages, including figures, tables, and references.</li>
                    <li><strong>File Format:</strong> Submissions are accepted in PDF format ONLY. (Max 4MB file size as per submission portal)</li>
                </ul>
            </section>

            <section className="mb-10 p-6 bg-green-50 rounded-xl shadow-md border border-green-200">
                <h3 className="text-3xl font-bold text-green-800 mb-6 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 19.477 5.754 20 7.5 20s3.332-.477 4.5-1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 19.477 18.246 20 16.5 20c-1.746 0-3.332-.477-4.5-1.253"></path></svg>
                    2. Paper Structure
                </h3>
                <p className="text-gray-800 text-lg mb-4">
                    Your paper should follow a standard academic structure to ensure clarity and completeness. Recommended sections include:
                </p>
                <ol className="list-decimal pl-8 space-y-3 text-gray-800 text-lg">
                    <li><strong>Title:</strong> Concise, informative, and reflecting the paper's core content.</li>
                    <li><strong>Author(s) and Affiliation(s):</strong> Full names and institutional affiliations.</li>
                    <li><strong>Abstract:</strong> A summary of 250-300 words outlining the problem, methodology, key results, and conclusions.</li>
                    <li><strong>Keywords:</strong> 4-6 relevant keywords to facilitate indexing and search.</li>
                    <li><strong>Introduction:</strong> Background, problem statement, research objectives, and paper organization.</li>
                    <li><strong>Literature Review:</strong> Overview of existing research and how your work contributes.</li>
                    <li><strong>Methodology:</strong> Detailed description of the methods, materials, or theoretical framework used.</li>
                    <li><strong>Results and Discussion:</strong> Presentation of findings, analysis, and interpretation.</li>
                    <li><strong>Conclusion:</strong> Summary of key findings, implications, limitations, and future work.</li>
                    <li><strong>References:</strong> A comprehensive list of all cited works.</li>
                </ol>
            </section>

            <section className="mb-10 p-6 bg-yellow-50 rounded-xl shadow-md border border-yellow-200">
                <h3 className="text-3xl font-bold text-yellow-800 mb-6 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h.01M7 12h.01M7 15h.01M7 18h.01M17 12h.01M17 15h.01M17 18h.01M3 21h18a2 2 0 002-2V8a2 2 0 00-2-2H3a2 2 0 00-2 2v11a2 2 0 002 2z"></path></svg>
                    3. Submission Process & Important Dates
                </h3>
                <ol className="list-decimal pl-8 space-y-3 text-gray-800 text-lg">
                    <li>Navigate to the <span className="font-bold text-blue-800">"Submit a Paper"</span> tab on this Conference page.</li>
                    <li>Complete all required fields in the author and paper information sections.</li>
                    <li>Upload your paper ensuring it is in PDF format and does not exceed 4MB.</li>
                    <li>Carefully read and check the declaration boxes (Originality, Terms & Conditions).</li>
                    <li>Click the 'Submit Paper' button to finalize your submission.</li>
                </ol>
                <p className="text-gray-800 text-lg mt-6 font-semibold">Tentative Key Dates:</p>
                <ul className="list-disc pl-8 space-y-2 text-gray-800 text-lg">
                    <li><strong>Paper Submission Deadline:</strong> <span className="font-bold text-red-700">March 01, 2026</span></li>
                    <li><strong>Review Notification:</strong> <span className="font-bold text-green-700">April 15, 2026</span></li>
                    <li><strong>Camera-ready Submission:</strong> <span className="font-bold text-blue-700">May 01, 2026</span></li>
                    <li><strong>Conference Dates:</strong> <span className="font-bold text-indigo-700">May 15-17, 2026</span></li>
                </ul>
            </section>

            <section className="mb-10 p-6 bg-purple-50 rounded-xl shadow-md border border-purple-200">
                <h3 className="text-3xl font-bold text-purple-800 mb-6 flex items-center">
                    <svg className="w-8 h-8 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path></svg>
                    4. Review Process and Publication
                </h3>
                <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    All submitted papers will undergo a rigorous double-blind peer review process. This ensures fairness and the highest quality of accepted research. Each submission will be evaluated by at least two independent reviewers from the program committee, based on originality, methodology, significance, and clarity.
                </p>
                <p className="text-gray-800 text-lg leading-relaxed">
                    Accepted papers will be formally published in the official conference proceedings, which are planned for indexing in major academic databases. Authors will retain copyright of their work, allowing them to further publish their extended research in journals.
                </p>
            </section>

            <div className="mt-12 p-8 bg-blue-100 rounded-2xl border border-blue-300 text-gray-800 text-center shadow-lg">
                <h3 className="text-3xl font-bold text-blue-900 mb-4 flex items-center justify-center">
                <HelpCircle className="w-9 h-9 mr-3 text-blue-700" />
                Questions or Need Assistance?
                </h3>

                <p className="text-xl mb-6">
                    If you have any further questions or require assistance with your submission, please do not hesitate to contact our dedicated support team.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-lg font-medium">
                    <p>Email: <a href="mailto:conference@empa.org" className="text-blue-700 hover:underline transition-colors duration-200">conference@empa.org</a></p>
                    <span className="hidden sm:block text-gray-500">|</span>
                    <p>Phone: <a href="tel:+251111239461" className="text-blue-700 hover:underline transition-colors duration-200">+251-111239461</a></p>
                </div>
                <div className="mt-6">
                    <Link to="/contact" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white
                        bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                        transition-all duration-300 shadow-md">
                        Visit Our Contact Page
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default SubmissionGuidelinesPage;
