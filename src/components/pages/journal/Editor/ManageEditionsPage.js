import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, BookOpen, Calendar, Hash, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../../../utils/constants';
import { AuthContext } from '../../../../context/AuthContext';

const ManageEditionsPage = () => {
   const { authToken } = useContext(AuthContext);
   const [editions, setEditions] = useState([]);
   const [isLoading, setIsLoading] = useState(true);

   // Form State
   const [formData, setFormData] = useState({
      volume_number: '',
      issue_number: '',
      year: '',
      title: ''
   });

   const config = { headers: { Authorization: `Bearer ${authToken}` } };

   const fetchEditions = async () => {
      try {
         const res = await axios.get(`${API_BASE_URL}/journals`, config);
         setEditions(res.data.data || []);
      } catch (err) {
         toast.error("Failed to load editions");
      } finally {
         setIsLoading(false);
      }
   };

   useEffect(() => { if (authToken) fetchEditions(); }, [authToken]);

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         await axios.post(`${API_BASE_URL}/journals/editions`, formData, config);
         toast.success("New Edition Created!");
         setFormData(prev => ({ ...prev, volume_number: '', issue_number: '', title: '' }));         fetchEditions(); // Refresh the list
      } catch (err) {
         toast.error(err.response?.data?.message || "Creation failed");
      }
   };

   const handleDelete = async (id) => {
      if (!window.confirm("Are you sure? This will unassign any papers linked to this edition.")) {
         return;
      }

      try {
         const config = { headers: { Authorization: `Bearer ${authToken}` } };
         await axios.delete(`${API_BASE_URL}/journals/${id}`, config);

         toast.success("Edition removed");
         // Update the UI list immediately without a full refresh
         setEditions(prev => prev.filter(ed => ed.id !== id));
      } catch (err) {
         toast.error("Failed to delete edition");
      }
   };
   return (
      <div className="p-8 max-w-5xl mx-auto">
         <h1 className="text-3xl font-black text-slate-900 mb-2">Manage Editions</h1>
         <p className="text-slate-500 mb-8">Create and organize Volumes and Issues for the Journal.</p>

         <div className="grid md:grid-cols-3 gap-8">
            {/* FORM COLUMN */}
            <div className="md:col-span-1">
               <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-8">
                  <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                     <Plus size={20} className="text-blue-600" /> Create New
                  </h2>

                  <div className="space-y-4">
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Volume Number</label>
                        <input
                           type="number" required
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                           value={formData.volume_number}
                           onChange={(e) => setFormData({ ...formData, volume_number: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Issue Number</label>
                        <input
                           type="number" required
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                           value={formData.issue_number}
                           onChange={(e) => setFormData({ ...formData, issue_number: e.target.value })}
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Year</label>
                        <input
                           type="number" required
                           name="year"
                           placeholder="YYYY"
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                           value={formData.year}
                           onChange={(e) => {const val = e.target.value;
                              setFormData(prev => ({ ...prev, year: val }));
                           }}                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Theme/Title (Optional)</label>
                        <input
                           type="text"
                           placeholder="e.g. Special Issue on Calculus"
                           className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                           value={formData.title}
                           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                     </div>
                     <button className="w-full py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 transition shadow-lg">
                        Save Edition
                     </button>
                  </div>
               </form>
            </div>

            {/* LIST COLUMN */}
            <div className="md:col-span-2">
               <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                           <th className="p-4 text-xs font-bold uppercase text-slate-500">Edition</th>
                           <th className="p-4 text-xs font-bold uppercase text-slate-500">Year</th>
                           <th className="p-4 text-xs font-bold uppercase text-slate-500">Title</th>
                           <th className="p-4 text-xs font-bold uppercase text-slate-500 text-right">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {editions.length === 0 ? (
                           <tr>
                              <td colSpan="4" className="p-12 text-center text-slate-400">
                                 <AlertCircle className="mx-auto mb-2 opacity-20" size={48} />
                                 No editions created yet.
                              </td>
                           </tr>
                        ) : (
                           editions.map(ed => (
                              <tr key={ed.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                 <td className="p-4">
                                    <div className="font-bold text-slate-800 text-sm">Vol {ed.volume_number}, Issue {ed.issue_number}</div>
                                 </td>
                                 <td className="p-4 text-sm text-slate-600">{ed.year}</td>
                                 <td className="p-4 text-sm text-slate-600 italic">{ed.title || 'Standard Issue'}</td>
                                 <td className="p-4 text-right">
                                    <button
                                       onClick={() => handleDelete(ed.id)} // <--- Add the onClick here
                                       className="text-red-400 hover:text-red-600 p-2 transition-colors hover:bg-red-50 rounded-lg"
                                       title="Delete Edition"
                                    >
                                       <Trash2 size={16} />
                                    </button>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
   );
};

export default ManageEditionsPage;