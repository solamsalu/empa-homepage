import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import PrimaryButton from '../../common/PrimaryButton';
import { CheckCircleIcon } from '../../common/icons/CheckCircleIcon';
import { ArrowRightIcon } from '../../common/icons/ArrowRightIcon';

// --- Icon Components for Benefits ---
const JournalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>;
const NetworkIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const GrowthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;

/**
 * A modern, professional, and comprehensive Membership Page.
 * It's designed as a sales funnel to clearly communicate value and drive registrations.
 */
const MembershipPage = () => {
    const { isLoggedIn, userRole } = useContext(AuthContext);
    const navigate = useNavigate();

    const benefits = [
        { icon: <JournalIcon />, title: "Exclusive Journal Access", description: "Read and publish in our prestigious, peer-reviewed mathematics journals." },
        { icon: <NetworkIcon />, title: "Professional Networking", description: "Connect with hundreds of mathematicians, educators, and researchers nationwide." },
        { icon: <GrowthIcon />, title: "Career Development", description: "Access workshops, training, and conference discounts to advance your career." },
    ];

    const membershipTiers = [
        {
            name: "Student",
            price: "Contact for Info",
            description: "For individuals actively pursuing studies in mathematics at recognized institutions.",
            features: ["Digital Journal Access", "Event Discounts", "Olympiad Participation"],
            buttonText: "Register as Student",
        },
        {
            name: "Professional",
            price: "Contact for Info",
            description: "For working professionals, educators, and researchers in mathematics and related fields.",
            features: ["Full Journal Access", "Publication Opportunities", "Voting Rights", "Networking Events"],
            isFeatured: true,
        },
        {
            name: "Institutional",
            price: "Contact for Info",
            description: "For universities, research centers, and organizations looking to support the mathematical community.",
            features: ["Group Access for Staff/Students", "Partnership Opportunities", "Event Co-hosting"],
            buttonText: "Contact Us",
        },
    ];

    return (
        <div className="bg-gray-100 font-sans">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-800 py-20 px-4 text-white text-center">
                <div className="max-w-4xl mx-auto z-10 relative">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold">Become an EMPA Member</h1>
                    <p className="mt-4 text-lg sm:text-xl text-blue-200">
                        Join a vibrant community dedicated to the advancement of mathematical sciences in Ethiopia.
                    </p>
                </div>
            </section>

            {/* Why Join? (Benefits Section) */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-blue-900">Why Join Our Community?</h2>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                            Membership with EMPA provides you with the resources, connections, and platform to grow professionally and contribute to a field you are passionate about.
                        </p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit) => (
                            <div key={benefit.title} className="text-center p-8 bg-blue-50 rounded-xl shadow-lg border border-blue-100">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600 mx-auto">
                                    {benefit.icon}
                                </div>
                                <h3 className="mt-6 text-xl font-bold text-blue-800">{benefit.title}</h3>
                                <p className="mt-2 text-base text-gray-700">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Membership Tiers / Pricing Table */}
            <section className="py-16 sm:py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-blue-900">Choose Your Membership</h2>
                        <p className="mt-4 text-lg text-gray-600">We offer a range of options to suit your journey in mathematics.</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {membershipTiers.map((tier) => (
                            <div key={tier.name} className={`rounded-2xl p-8 text-center shadow-2xl flex flex-col ${tier.isFeatured ? 'bg-blue-800 text-white transform scale-105' : 'bg-white text-gray-900'}`}>
                                <h3 className={`text-2xl font-bold ${tier.isFeatured ? 'text-white' : 'text-blue-900'}`}>{tier.name}</h3>
                                <p className={`mt-4 text-sm ${tier.isFeatured ? 'text-blue-200' : 'text-gray-600'}`}>{tier.description}</p>
                                <p className="mt-6 text-4xl font-extrabold">{tier.price}</p>
                                <ul className={`mt-8 space-y-3 text-sm flex-grow ${tier.isFeatured ? 'text-blue-200' : 'text-gray-600'}`}>
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-center justify-center gap-2">
                                            <CheckCircleIcon className={`w-5 h-5 ${tier.isFeatured ? 'text-amber-400' : 'text-blue-500'}`} />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8">
                                    <PrimaryButton onClick={() => navigate(tier.name === 'Institutional' ? '/contact' : '/register')}
                                        className={tier.isFeatured ? 'bg-amber-500 hover:bg-amber-400 text-blue-900' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                                    >
                                        {tier.buttonText || 'Get Started'} <ArrowRightIcon className="ml-2 w-5 h-5" />
                                    </PrimaryButton>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Smart Call-to-Action / Dashboard Link Section */}
            <section className="bg-white">
                <div className="max-w-4xl mx-auto text-center py-16 sm:py-20 px-4">
                    {isLoggedIn ? (
                        <>
                            <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl">Welcome Back!</h2>
                            <p className="mt-4 text-lg leading-6 text-gray-600">Access your member portal to manage your profile, view resources, and connect with the community.</p>
                            <div className="mt-8">
                                <PrimaryButton onClick={() => navigate(userRole === 'admin' ? '/admin-dashboard' : '/members-dashboard')}>
                                    Go to Your Dashboard <ArrowRightIcon className="w-5 h-5 ml-2" />
                                </PrimaryButton>
                            </div>
                        </>
                    ) : (
                        <>
                            <h2 className="text-3xl font-extrabold text-blue-900 sm:text-4xl">Ready to Join?</h2>
                            <p className="mt-4 text-lg leading-6 text-gray-600">Create an account to start your journey with EMPA or log in to access your existing membership.</p>
                            <div className="mt-8 flex justify-center gap-4">
                                <PrimaryButton onClick={() => navigate('/register')}>Register Now</PrimaryButton>
                                {/* <PrimaryButton onClick={() => navigate('/login')} className="bg-gray-200 text-gray-800 hover:bg-gray-300">Member Login</PrimaryButton> */}
                                <PrimaryButton
                                    onClick={() => navigate('/login', {
                                        state: {
                                            // Tell the login page where to redirect back to
                                            from: { pathname: '/membership' }
                                        }
                                    })}
                                    className="bg-gray-200 text-gray-800 hover:bg-gray-300"
                                >
                                    Member Login
                                </PrimaryButton>
                            </div>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MembershipPage;