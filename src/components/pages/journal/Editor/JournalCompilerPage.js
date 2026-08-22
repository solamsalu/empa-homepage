
import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import {
   Layers,
   FileText,
   CheckCircle,
   Plus,
   Eye,
   AlertCircle,
   ArrowLeft
} from 'lucide-react';
import { toast } from 'react-toastify';
import { API_BASE_URL, STATIC_ASSETS_BASE_URL } from '../../../../utils/constants';
import { AuthContext } from '../../../../context/AuthContext';
import { useNavigate } from 'react-router-dom'; // Add this to your imports

const JournalCompilerPage = () => {
   // 1. Authentication State

   const navigate = useNavigate();

   const { authToken } = useContext(AuthContext);

   // 2. Component State
   const [editions, setEditions] = useState([]);
   const [availablePapers, setAvailablePapers] = useState([]);
   const [selectedEdition, setSelectedEdition] = useState('');
   const [selectedPapers, setSelectedPapers] = useState([]);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isLoading, setIsLoading] = useState(true);

   // 3. Data Fetching Logic
   const fetchData = useCallback(async () => {
      if (!authToken) return;

      setIsLoading(true);
      try {
         const config = {
            headers: { Authorization: `Bearer ${authToken}` }
         };

         // Fetch Editions and Unassigned Papers in parallel
         const [editionsRes, papersRes] = await Promise.all([
            axios.get(`${API_BASE_URL}/journals`, config),
            axios.get(`${API_BASE_URL}/journals/papers/unassigned`, config)
         ]);

         setEditions(editionsRes.data.data || []);
         setAvailablePapers(papersRes.data.data || []);
      } catch (err) {
         console.error("Compiler Fetch Error:", err);
         toast.error("Unauthorized or Connection Error. Please log in again.");
      } finally {
         setIsLoading(false);
      }
   }, [authToken]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);

   // 4. Selection Handlers
   const togglePaperSelection = (paperId) => {
      setSelectedPapers(prev =>
         prev.includes(paperId) ? prev.filter(id => id !== paperId) : [...prev, paperId]
      );
   };

   const handleCompile = async () => {
      if (!selectedEdition || selectedPapers.length === 0) {
         return toast.warning("Please select a target edition and at least one paper.");
      }

      const currentEdition = editions.find(ed => ed.id.toString() === selectedEdition.toString());

      setIsSubmitting(true);
      try {
         const config = {
            headers: { Authorization: `Bearer ${authToken}` }
         };

         await axios.post(`${API_BASE_URL}/journals/assign-papers`, {
            editionId: selectedEdition,
            paperIds: selectedPapers
         }, config);

         toast.success(`Successfully linked to Vol ${currentEdition?.volume_number}, Issue ${currentEdition?.issue_number}!`);

         // UI Cleanup
         setAvailablePapers(prev => prev.filter(p => !selectedPapers.includes(p.id)));
         setSelectedPapers([]);
         setSelectedEdition('');
      } catch (err) {
         console.error("Compilation Error:", err);
         toast.error(err.response?.data?.message || "Compilation failed.");
      } finally {
         setIsSubmitting(false);
      }
   };

   if (isLoading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
            <p className="mt-4 text-gray-500 font-medium">Loading compiler resources...</p>
         </div>
      );
   }
   // <div className="p-8 max-w-6xl mx-auto">
   //    {/* Header Section */}
   //    <div className="flex items-center justify-between mb-8">
   //       <div className="flex items-center gap-3">
   //          <div className="p-2 bg-blue-100 rounded-lg">
   //             <Layers className="text-blue-700" size={28} />
   //          </div>
   //          <div>
   //             <h1 className="text-3xl font-bold text-gray-900">Journal Compiler</h1>
   //             <p className="text-gray-500 text-sm">Organize published papers into Volumes and Issues</p>
   //          </div>
   //       </div>
   //    </div>
   return (
      <div className="p-4 md:p-8 max-w-6xl mx-auto">
         {/* Header Section */}
         <div className="mb-8">
            {/* <-- ADDED BACK BUTTON HERE --> */}
            <button
               onClick={() => navigate(-1)}
               className="mt-2 mb-6 inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
               <ArrowLeft size={18} /> Back
            </button>

            <div className="flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                     <Layers className="text-blue-700" size={28} />
                  </div>
                  <div>
                     <h1 className="text-3xl font-bold text-gray-900">Journal Compiler</h1>
                     <p className="text-gray-500 text-sm">Organize published papers into Volumes and Issues</p>
                  </div>
               </div>
            </div>
         </div>
            <div className="grid lg:grid-cols-3 gap-8">

               {/* COLUMN 1: EDITION SELECTION */}
               <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                     <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-gray-800 flex items-center gap-2">
                           <span className="flex items-center justify-center w-6 h-6 bg-blue-900 text-white text-xs rounded-full">1</span>
                           Select Target Edition
                        </h2>
                        <button
                           onClick={() => navigate('/admin/manage-editions')} // Change this line
                           className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                        >
                           <Plus size={12} /> New Issue
                        </button>
                     </div>

                     <select
                        className="w-full p-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                        value={selectedEdition}
                        onChange={(e) => setSelectedEdition(e.target.value)}
                     >
                        <option value="">-- Choose Volume/Issue --</option>
                        {editions.map(ed => (
                           <option key={ed.id} value={ed.id}>
                              VOL: {ed.volume_number} | ISSUE: {ed.issue_number} ({ed.year})
                           </option>
                        ))}
                     </select>

                     <p className="mt-3 text-[11px] text-gray-400 italic">
                        Tip: Only "Published" status papers that are not currently in an issue appear on the right.
                     </p>
                  </div>

                  {/* SUBMIT COMPILATION CARD */}
                  {selectedPapers.length > 0 && (
                     <div className="bg-blue-900 text-white p-6 rounded-2xl shadow-lg animate-in fade-in slide-in-from-bottom-4">
                        <h3 className="font-bold text-lg mb-2">Ready to Compile</h3>
                        <p className="text-blue-100 text-sm mb-4">
                           You have selected {selectedPapers.length} paper(s) for assignment.
                        </p>
                        <button
                           onClick={handleCompile}
                           disabled={isSubmitting}
                           className="w-full py-3 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors shadow-md"
                        >
                           {isSubmitting ? 'Linking...' : <><Plus size={18} /> Finish Compilation</>}
                        </button>
                     </div>
                  )}
               </div>

               {/* COLUMN 2: PAPER LIST */}
               <div className="lg:col-span-2 space-y-4">
                  <h2 className="font-bold text-gray-800 flex items-center gap-2 px-2">
                     <span className="flex items-center justify-center w-6 h-6 bg-blue-900 text-white text-xs rounded-full">2</span>
                     Select Papers to Include
                  </h2>

                  {availablePapers.length === 0 ? (
                     <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-12 text-center">
                        <AlertCircle className="mx-auto text-gray-300 mb-2" size={40} />
                        <p className="text-gray-500">All published papers are already assigned to an issue.</p>
                     </div>
                  ) : (
                     <div className="grid gap-3">
                        {availablePapers.map(paper => (
                           <div
                              key={paper.id}
                              onClick={() => togglePaperSelection(paper.id)}
                              className={`group p-4 rounded-xl border-2 transition-all cursor-pointer flex justify-between items-center ${selectedPapers.includes(paper.id)
                                 ? 'border-blue-600 bg-blue-50 shadow-sm'
                                 : 'border-white bg-white shadow-sm hover:border-gray-200'
                                 }`}
                           >
                              <div className="flex items-start gap-4">
                                 <div className={`mt-1 ${selectedPapers.includes(paper.id) ? 'text-blue-600' : 'text-gray-400'}`}>
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                    <h3 className="font-bold text-gray-800 leading-tight">
                                       {paper.title.replace(/<\/?[^>]+(>|$)/g, "")}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                       <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">ID: {paper.id}</span>
                                       <span className="text-xs text-gray-400">|</span>
                                       <span className="text-xs text-gray-500">Published: {new Date(paper.submitted_at).toLocaleDateString()}</span>
                                    </div>
                                 </div>
                              </div>

                              <div className="flex items-center gap-3">
                                 <a
                                    href={`${STATIC_ASSETS_BASE_URL}/${paper.production_file_url || paper.manuscript_file_url}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-white rounded-lg transition-all"
                                    title="View Manuscript"
                                 >
                                    <Eye size={20} />
                                 </a>

                                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPapers.includes(paper.id)
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'bg-white border-gray-200'
                                    }`}>
                                    {selectedPapers.includes(paper.id) && <CheckCircle className="text-white" size={14} />}
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  )}
               </div>
            </div>
         </div>
         );
};

         export default JournalCompilerPage;