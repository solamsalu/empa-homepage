
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import PrimaryButton from '../common/PrimaryButton';
import { Phone, Mail, MapPin, Send, Building } from 'lucide-react';

// --- Reusable Sub-component for a single contact detail item ---
const ContactInfoItem = ({ icon, title, children }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-100 rounded-lg">{icon}</div>
        <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <div className="mt-1 text-base text-gray-600 not-italic">{children}</div>
        </div>
    </div>
);

/**
 * A final, modern, professional, and comprehensive Contact Page.
 */
const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formState, setFormState] = useState({ submitting: false, error: null, success: null });

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormState({ submitting: true, error: null, success: null });
        try {
            await axios.post(`${API_BASE_URL}/contact`, formData);
            setFormState({ submitting: false, error: null, success: 'Message sent successfully! We will get back to you shortly.' });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setFormState({ submitting: false, error: err.response?.data?.message || 'Failed to send message.', success: null });
        }
    };
    
    const departmentalContacts = [
        { title: "President", email: "empa.president@eth-math.org" },
        { title: "Vice President", email: "empa.vice@eth-math.org" },
        { title: "Secretary", email: "empa.secretary@eth-math.org" },
        { title: "Social Media", email: "social.media@eth-math.org" },
        { title: "Resource & Partnership", email: "resource.partnership@eth-math.org" },
        { title: "Research & Publication", email: "research.publication@eth-math.org" },
        { title: "Olympiad & Conference", email: "olympiad.conference@eth-math.org" },
        { title: "Training & Fellowship", email: "training.fellowship@eth-math.org" },
        { title: "Diasporas' Engagement", email: "diaspora.members@eth-math.org" },
    ];

    return (
        <div className="bg-gray-50 font-sans">
            <header className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold">Get in Touch</h1>
                <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto">We're here to help and answer any question. We look forward to hearing from you.</p>
            </header>

            <div className="max-w-7xl mx-auto py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
                {/* --- Primary Contact Section: Form and Main Details --- */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                    {/* Left Column: Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
                        <h2 className="text-3xl font-bold text-blue-900 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Form fields... */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" /></div>
                                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" /></div>
                            </div>
                            <div><label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label><input type="text" name="subject" id="subject" value={formData.subject} onChange={handleInputChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm" /></div>
                            <div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea name="message" id="message" rows="5" value={formData.message} onChange={handleInputChange} required className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm"></textarea></div>
                            <div><PrimaryButton type="submit" disabled={formState.submitting} className="w-full flex justify-center items-center gap-2">{formState.submitting ? 'Sending...' : <><Send size={18} /> Send Message</>}</PrimaryButton></div>
                            {formState.error && <p className="text-red-600 text-center">{formState.error}</p>}
                            {formState.success && <p className="text-green-600 text-center">{formState.success}</p>}
                        </form>
                    </div>

                    {/* Right Column: Main Contact Details & Map */}
                    <div className="space-y-8">
                        <ContactInfoItem icon={<MapPin size={24} className="text-blue-600" />} title="Our Headquarters"><p>Department of Mathematics, CNCS, AAU<br/>4killo King George VI St, Addis Ababa</p></ContactInfoItem>
                        <ContactInfoItem icon={<Mail size={24} className="text-blue-600" />} title="General Inquiries"><a href="mailto:info@eth-math.org" className="hover:text-blue-700 hover:underline">info@eth-math.org</a></ContactInfoItem>
                        <ContactInfoItem icon={<Phone size={24} className="text-blue-600" />} title="Phone Number"><a href="tel:+25111239461" className="hover:text-blue-700 hover:underline">+251-111 239 461</a></ContactInfoItem>
                        <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200"><iframe title="EMPA Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.381387680197!2d38.7587163!3d9.0305949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b8f5f1b13445b%3A0x7d0e8f0aaeb10b0d!2sAddis%20Ababa%20University%2C%20Natural%20Science%20Campus!5e0!3m2!1sen!2set!4v1633540743154!5m2!1sen!2set" width="100%" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe></div>
                    </div>
                </section>

                {/* --- Departmental Directory Section --- */}
                <section className="mt-16 sm:mt-24 pt-16 sm:pt-24 border-t border-gray-200">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-blue-900">Departmental Directory</h2>
                        <p className="mt-4 text-lg text-gray-600">For specific inquiries, please contact the relevant department directly.</p>
                    </div>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {departmentalContacts.map((contact) => (
                            <div key={contact.email} className="bg-white p-6 rounded-lg shadow-md border border-gray-100 flex items-center space-x-4">
                                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-50 rounded-lg"><Building size={20} className="text-blue-600" /></div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">{contact.title}</h3>
                                    <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:underline break-all">{contact.email}</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;