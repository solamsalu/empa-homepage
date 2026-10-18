import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../../utils/constants';
import { X, UserPlus, Calendar, Info } from 'lucide-react';
import { toast } from 'react-toastify';

const AssignReviewerModal = ({ paperId, authToken, onClose, onAssignmentComplete }) => {
   const [reviewers, setReviewers] = useState([]);
   const [selectedUniqueKey, setSelectedUniqueKey] = useState("");
   const [dueDate, setDueDate] = useState("");
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchReviewers = async () => {
         try {
            const res = await axios.get(`${API_BASE_URL}/journal-papers/potential-reviewers`, {
               headers: { Authorization: `Bearer ${authToken}` }
            });
            setReviewers(res.data.data);
         } catch (err) {
            console.error("Error loading reviewer pool", err);
         }
      };
      fetchReviewers();
   }, [authToken]);

   // In your AssignReviewerModal.jsx, ensure handleAssign looks like this:
   const handleAssign = async () => {
      setLoading(true);
      // Find the full person object from the 'reviewers' state
      const person = reviewers.find(r => r.unique_key === selectedUniqueKey);

      try {
         await axios.post(`${API_BASE_URL}/journal-papers/${paperId}/assign-reviewer`, {
            reviewer_id: person.id,      // The numeric ID
            reviewer_type: person.reviewer_type, // 'MEMBER' or 'AUTHOR'
            due_date: dueDate
         }, {
            headers: { Authorization: `Bearer ${authToken}` }
         });

         toast.success("Reviewer successfully assigned!");
         onAssignmentComplete();
         onClose();
      } catch (err) {
         toast.error(err.response?.data?.message || "Assignment failed");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
         <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                  <UserPlus size={20} className="text-blue-600" /> Assign Reviewer
               </h3>
               <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
               </button>
            </div>

            <div className="p-6 space-y-5">
               <div className="bg-blue-50 p-3 rounded-lg flex gap-3 items-start border border-blue-100">
                  <Info size={18} className="text-blue-600 mt-0.5" />
                  <p className="text-xs text-blue-800 font-medium">
                     You can now select from both <strong>EMPA Members</strong> and registered <strong>Authors</strong>.
                  </p>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Select Person</label>
                  <select
                     className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700"
                     value={selectedUniqueKey}
                     onChange={(e) => setSelectedUniqueKey(e.target.value)}
                  >
                     <option value="">-- Choose Reviewer (Members & Authors) --</option>
                     {reviewers.map((rev) => (
                        <option key={rev.unique_key} value={rev.unique_key}>
                           [{rev.reviewer_type}] {rev.full_name}
                           {rev.affiliation ? ` — ${rev.affiliation}` : ''}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 ml-1">Review Deadline</label>
                  <div className="relative">
                     <input
                        type="date"
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                     />
                  </div>
               </div>
            </div>

            <div className="p-4 bg-slate-50 flex gap-3 border-t border-slate-100">
               <button onClick={onClose} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-200 rounded-xl transition-all">
                  Cancel
               </button>
               <button
                  onClick={handleAssign}
                  disabled={loading || !selectedUniqueKey || !dueDate}
                  className="flex-1 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 transition-all"
               >
                  {loading ? 'Assigning...' : 'Confirm Assignment'}
               </button>
            </div>
         </div>
      </div>
   );
};

export default AssignReviewerModal;