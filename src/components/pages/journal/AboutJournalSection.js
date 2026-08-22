import React from 'react';
import { BookOpen, Users, CheckCircle2 } from 'lucide-react';
import PrimaryButton from '../../common/PrimaryButton';
import { JOURNAL_DISCIPLINES } from '../../../utils/disciplines';

const AboutJournalSection = ({ onTabChange }) => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-16">
                <h2 className="text-4xl font-extrabold text-blue-900 mb-4">About the JEMPA Journal</h2>
                <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
                    The Journal of the Ethiopian Mathematics Professionals Association (JEMPA) is a premier,
                    peer-reviewed academic journal dedicated to the advancement of mathematical sciences
                    within Ethiopia and the global community.
                </p>
            </div>

            <div className="space-y-16">

                {/* 1. Scope & Focus Section (Dynamic) */}
                <section>
                    <div className="flex items-center gap-3 mb-8 border-b-2 border-green-100 pb-4">
                        <BookOpen className="w-10 h-10 text-green-600" />
                        <h3 className="text-3xl font-bold text-green-800">Aims, Scope & Focus</h3>
                    </div>

                    <p className="text-lg text-gray-700 mb-8">
                        JEMPA publishes biannually (<strong className="font-bold text-blue-900">June & December</strong>).
                        We welcome original research, review articles, and short communications in the following specialized streams:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {JOURNAL_DISCIPLINES.map((discipline) => (
                            <div
                                key={discipline.name}
                                className="p-6 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-900 mb-2">
                                            {discipline.name}
                                        </h4>
                                        <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                            {discipline.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {discipline.subcategories.slice(0, 4).map((sub) => (
                                                <span key={sub} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium uppercase tracking-wider">
                                                    {sub}
                                                </span>
                                            ))}
                                            <span className="text-[10px] text-slate-400 italic">...and more</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 2. Editorial Board Section */}
                <section className="p-8 bg-purple-50 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-8">
                        <Users className="w-10 h-10 text-purple-600" />
                        <h3 className="text-3xl font-bold text-purple-900">Editorial Board</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Leadership */}
                        <div className="bg-white p-6 rounded-xl shadow-sm">
                            <h4 className="font-bold text-xl mb-4 text-purple-950 flex items-center border-b pb-2">
                                Leadership
                            </h4>
                            <ul className="space-y-4">
                                <li>
                                    <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">Editor-in-Chief</p>
                                    <p className="font-bold text-slate-800">Assoc. Prof. Surafel Leulseged</p>
                                    <p className="text-sm text-slate-500">Addis Ababa Science & Technology University (AASTU)</p>
                                </li>
                                <li>
                                    <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">Managing Editor</p>
                                    <p className="font-bold text-slate-800">Assoc. Prof. Wondwosen Zemene</p>
                                    <p className="text-sm text-slate-500">University of Gondar (UoG)</p>
                                </li>
                                <li>
                                    <p className="text-xs text-purple-600 font-bold uppercase tracking-widest">Associate Editors</p>
                                    <p className="font-bold text-slate-800">Prof. Wubshet Ibrahim <span className="text-slate-400 font-normal ml-2">(Ambo University)</span></p>
                                    <p className="font-bold text-slate-800 mt-1">Assoc. Prof. Tsegaye Gedif <span className="text-slate-400 font-normal ml-2">(Addis Ababa University)</span></p>
                                </li>
                            </ul>
                        </div>

                        {/* Advisory Board */}
                        <div className="bg-white/50 p-6 rounded-xl border border-purple-200">
                            <h4 className="font-bold text-xl mb-4 text-purple-950 border-b pb-2">
                                Advisory Board
                            </h4>
                            <ul className="grid grid-cols-1 gap-3">
                                {[
                                    { name: "Prof. Semu Mitiku", uni: "Botswana International University of Science and Technology" },
                                    { name: "Dr. Mengistu Goa", uni: "University of Botswana" },
                                    { name: "Prof. Gemechis File", uni: "Jimma University" },
                                    { name: "Prof. Berhanu Assaye", uni: "Bahir Dar University" },
                                    { name: "Prof. Mulugeta Atnafu", uni: "Addis Ababa University" },
                                    { name: "Prof. Chernet Tuge", uni: "Jimma University" },
                                    { name: "Dr. Ayele Taye", uni: "Kotebe University of Education" }


                                ].map((member) => (
                                    <li key={member.name} className="flex justify-between items-center text-sm">
                                        <span className="font-semibold text-slate-700">{member.name}</span>
                                        <span className="text-slate-400 text-xs italic">{member.uni}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>

                {/* 3. Call for Papers / Action Section */}
                <section className="p-10 rounded-2xl shadow-xl text-center bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                    <h3 className="text-3xl font-black text-amber-900 mb-4">Call for Papers</h3>
                    <p className="text-lg text-amber-800 max-w-2xl mx-auto mb-8">
                        Join our community of researchers. We are currently accepting original manuscripts
                        for our upcoming issue. Submit your work to a journal that values academic rigor
                        and mathematical excellence.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <PrimaryButton
                            onClick={() => onTabChange('portal')}
                            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 shadow-lg shadow-amber-200"
                        >
                            Submit Your Manuscript
                        </PrimaryButton>

                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutJournalSection;