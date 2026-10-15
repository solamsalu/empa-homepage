// import React, { useState, useMemo } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { API_BASE_URL } from '../../utils/constants';
// import PrimaryButton from '../common/PrimaryButton';
// import { User, Briefcase, Lock, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

// const PasswordRequirement = ({ met, text }) => (
//     <li className={`flex items-center transition-colors duration-300 ${met ? 'text-green-600' : 'text-gray-500'}`}>
//         {met ? <CheckCircle2 size={14} className="mr-2 flex-shrink-0" /> : <XCircle size={14} className="mr-2 flex-shrink-0" />}
//         <span className="text-xs">{text}</span>
//     </li>
// );

// const RegisterPage = () => {
//     const [step, setStep] = useState(1);
//     const [formData, setFormData] = useState({
//         fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '',
//         address: '', institution: '', academicRank: 'Mr.', membershipType: 'Professional'
//     });
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const passwordCriteria = useMemo(() => {
//         const pw = formData.password;
//         return {
//             length: pw.length >= 8,
//             lowercase: /[a-z]/.test(pw),
//             uppercase: /[A-Z]/.test(pw),
//             number: /[0-9]/.test(pw),
//             specialChar: /[!@#$%^&*()]/.test(pw)
//         };
//     }, [formData.password]);
    
//     const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

//     const handleChange = (e) => {
//         setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//     };

//     const nextStep = () => {
//         setError(''); // Clear error on step change
//         setStep(prev => Math.min(prev + 1, 3));
//     };
//     const prevStep = () => {
//         setError('');
//         setStep(prev => Math.max(prev - 1, 1));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError('');
//         if (!isPasswordValid) {
//             setError('Password does not meet all strength requirements.');
//             return;
//         }
//         if (formData.password !== formData.confirmPassword) {
//             setError('Passwords do not match.');
//             return;
//         }
        
//         setIsLoading(true);
//         try {
//             await axios.post(`${API_BASE_URL}/members/register`, {
//                 full_name: formData.fullName,
//                 email: formData.email,
//                 password: formData.password,
//                 phone_number: formData.phoneNumber,
//                 address: formData.address,
//                 institution: formData.institution,
//                 academic_rank: formData.academicRank,
//                 membership_type: formData.membershipType,
//             });
//             setSuccess('Registration successful! Your application is pending approval. You will be redirected to the login page.');
//             setTimeout(() => navigate('/login'), 4000);
//         } catch (err) {
//             setError(err.response?.data?.message || 'An error occurred during registration.');
//         } finally {
//             setIsLoading(false);
//         }
//     };
    
//     const steps = [
//         { id: 1, name: 'Personal', icon: <User size={24}/> },
//         { id: 2, name: 'Professional', icon: <Briefcase size={24}/> },
//         { id: 3, name: 'Security', icon: <Lock size={24}/> },
//     ];
    
//     const isStepValid = () => {
//         if (step === 1) return formData.fullName && formData.email;
//         if (step === 2) return formData.academicRank && formData.institution;
//         return true;
//     };

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
//             <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg">
//                 <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-2">Join the Association</h2>
//                 <p className="text-center text-gray-600 mb-8">Complete the steps below to apply for membership.</p>

//                 {/* Progress Bar */}
//                 <div className="flex items-start justify-between mb-8">
//                     {steps.map((s, index) => (
//                         <React.Fragment key={s.id}>
//                             <div className="flex flex-col items-center text-center w-1/3">
//                                 <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-300 border-2 ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
//                                     {s.icon}
//                                 </div>
//                                 <p className={`mt-2 text-sm font-semibold ${step >= s.id ? 'text-blue-600' : 'text-gray-500'}`}>{s.name}</p>
//                             </div>
//                             {index < steps.length - 1 && <div className={`flex-grow h-1 mt-6 transition-colors duration-300 ${step > s.id ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
//                         </React.Fragment>
//                     ))}
//                 </div>

//                 {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">{error}</div>}
//                 {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center">{success}</div>}

//                 {/* The form tag now wraps the inputs AND the buttons */}
//                 <form onSubmit={handleSubmit}>
//                     <div className="space-y-5">
//                         {step === 1 && (
//                             <div className="space-y-5">
//                                 <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
//                                 <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
//                                 <div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" /></div>
//                             </div>
//                         )}
//                         {step === 2 && (
//                             <div className="space-y-5">
//                                 <div><label htmlFor="academicRank" className="block text-sm font-medium text-gray-700 mb-1">Title / Rank *</label><select id="academicRank" name="academicRank" value={formData.academicRank} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option><option>Prof.</option></select></div>
//                                 <div><label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">Institution / Organization *</label><input id="institution" name="institution" value={formData.institution} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
//                                 <div><label htmlFor="membershipType" className="block text-sm font-medium text-gray-700 mb-1">Membership Type *</label><select id="membershipType" name="membershipType" value={formData.membershipType} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option>Professional</option><option>Student</option><option>Lifetime</option></select></div>
//                                 <div><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label><input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="(Optional)" className="w-full p-3 border border-gray-300 rounded-lg" /></div>
//                             </div>
//                         )}
//                         {step === 3 && (
//                             <div className="space-y-5">
//                                 <div><label htmlFor="password">Password *</label><input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mt-1" /></div>
//                                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 p-3 rounded-md bg-gray-50 border">{Object.entries(passwordCriteria).map(([key, met]) => <PasswordRequirement key={key} met={met} text={{length: '8+ Characters', lowercase: '1 Lowercase', uppercase: '1 Uppercase', number: '1 Number', specialChar: '1 Special (!@#..)'}[key]} />)}</ul>
//                                 <div><label htmlFor="confirmPassword">Confirm Password *</label><input id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg mt-1" /></div>
//                             </div>
//                         )}
//                     </div>

//                     {/* --- THE FIX: The buttons are now INSIDE the form --- */}
//                     <div className="pt-6 mt-8 border-t border-gray-200 flex justify-between items-center">
//                         <button type="button" onClick={prevStep} disabled={step === 1 || isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg disabled:opacity-50 transition-all hover:bg-gray-300">
//                             <ArrowLeft size={18} /> Back
//                         </button>
                        
//                         {step < 3 ? (
//                             <PrimaryButton type="button" onClick={nextStep} disabled={!isStepValid() || isLoading}>
//                                 Next <ArrowRight size={18} />
//                             </PrimaryButton>
//                         ) : (
//                             <PrimaryButton type="submit" disabled={isLoading || !isPasswordValid || formData.password !== formData.confirmPassword}>
//                                 {isLoading ? 'Submitting...' : 'Complete Registration'}
//                             </PrimaryButton>
//                         )}
//                     </div>
//                 </form>
                
//                 <p className="text-center text-sm mt-8">Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link></p>
//             </div>
//         </div>
//     );
// };

// export default RegisterPage;







import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';
import PrimaryButton from '../common/PrimaryButton';
// 1. Imported Eye and EyeOff from lucide-react
import { User, Briefcase, Lock, ArrowRight, ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react';

const PasswordRequirement = ({ met, text }) => (
    <li className={`flex items-center transition-colors duration-300 ${met ? 'text-green-600' : 'text-gray-500'}`}>
        {met ? <CheckCircle2 size={14} className="mr-2 flex-shrink-0" /> : <XCircle size={14} className="mr-2 flex-shrink-0" />}
        <span className="text-xs">{text}</span>
    </li>
);

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        fullName: '', email: '', password: '', confirmPassword: '', phoneNumber: '',
        address: '', institution: '', academicRank: 'Mr.', membershipType: 'Professional'
    });

    // 2. Separate visibility toggles for Password and Confirm Password
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const passwordCriteria = useMemo(() => {
        const pw = formData.password;
        return {
            length: pw.length >= 8,
            lowercase: /[a-z]/.test(pw),
            uppercase: /[A-Z]/.test(pw),
            number: /[0-9]/.test(pw),
            specialChar: /[!@#$%^&*()]/.test(pw)
        };
    }, [formData.password]);
    
    const isPasswordValid = Object.values(passwordCriteria).every(Boolean);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const nextStep = () => {
        setError('');
        setStep(prev => Math.min(prev + 1, 3));
    };
    const prevStep = () => {
        setError('');
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!isPasswordValid) {
            setError('Password does not meet all strength requirements.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        
        setIsLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/members/register`, {
                full_name: formData.fullName,
                email: formData.email,
                password: formData.password,
                phone_number: formData.phoneNumber,
                address: formData.address,
                institution: formData.institution,
                academic_rank: formData.academicRank,
                membership_type: formData.membershipType,
            });
            setSuccess('Registration successful! Your application is pending approval. You will be redirected to the login page.');
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const steps = [
        { id: 1, name: 'Personal', icon: <User size={24}/> },
        { id: 2, name: 'Professional', icon: <Briefcase size={24}/> },
        { id: 3, name: 'Security', icon: <Lock size={24}/> },
    ];
    
    const isStepValid = () => {
        if (step === 1) return formData.fullName && formData.email;
        if (step === 2) return formData.academicRank && formData.institution;
        return true;
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-lg">
                <h2 className="text-3xl font-extrabold text-center text-blue-900 mb-2">Join the Association</h2>
                <p className="text-center text-gray-600 mb-8">Complete the steps below to apply for membership.</p>

                {/* Progress Bar */}
                <div className="flex items-start justify-between mb-8">
                    {steps.map((s, index) => (
                        <React.Fragment key={s.id}>
                            <div className="flex flex-col items-center text-center w-1/3">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-colors duration-300 border-2 ${step >= s.id ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}`}>
                                    {s.icon}
                                </div>
                                <p className={`mt-2 text-sm font-semibold ${step >= s.id ? 'text-blue-600' : 'text-gray-500'}`}>{s.name}</p>
                            </div>
                            {index < steps.length - 1 && <div className={`flex-grow h-1 mt-6 transition-colors duration-300 ${step > s.id ? 'bg-blue-600' : 'bg-gray-200'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-6 text-center">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-6 text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        {step === 1 && (
                            <div className="space-y-5">
                                <div><label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label><input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
                                <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
                                <div><label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label><input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" /></div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="space-y-5">
                                <div><label htmlFor="academicRank" className="block text-sm font-medium text-gray-700 mb-1">Title / Rank *</label><select id="academicRank" name="academicRank" value={formData.academicRank} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option>Mr.</option><option>Ms.</option><option>Mrs.</option><option>Dr.</option><option>Prof.</option></select></div>
                                <div><label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">Institution / Organization *</label><input id="institution" name="institution" value={formData.institution} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg" /></div>
                                <div><label htmlFor="membershipType" className="block text-sm font-medium text-gray-700 mb-1">Membership Type *</label><select id="membershipType" name="membershipType" value={formData.membershipType} onChange={handleChange} required className="w-full p-3 border border-gray-300 rounded-lg bg-white"><option>Professional</option><option>Student</option><option>Lifetime</option></select></div>
                                <div><label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label><input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="(Optional)" className="w-full p-3 border border-gray-300 rounded-lg" /></div>
                            </div>
                        )}
                        
                        {/* --- 3. STEP 3: SECURITY (WITH TOGGLES) --- */}
                        {step === 3 && (
                            <div className="space-y-5">
                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                    <div className="relative">
                                        <input 
                                            id="password" 
                                            name="password" 
                                            type={showPassword ? "text" : "password"} 
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(prev => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600 focus:outline-none"
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {/* Password Requirements Checklist */}
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 p-3 rounded-md bg-gray-50 border">
                                    {Object.entries(passwordCriteria).map(([key, met]) => (
                                        <PasswordRequirement 
                                            key={key} 
                                            met={met} 
                                            text={{
                                                length: '8+ Characters', 
                                                lowercase: '1 Lowercase', 
                                                uppercase: '1 Uppercase', 
                                                number: '1 Number', 
                                                specialChar: '1 Special (!@#..)'
                                            }[key]} 
                                        />
                                    ))}
                                </ul>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                                    <div className="relative">
                                        <input 
                                            id="confirmPassword" 
                                            name="confirmPassword" 
                                            type={showConfirmPassword ? "text" : "password"} 
                                            value={formData.confirmPassword} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(prev => !prev)}
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-600 focus:outline-none"
                                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="pt-6 mt-8 border-t border-gray-200 flex justify-between items-center">
                        <button type="button" onClick={prevStep} disabled={step === 1 || isLoading} className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-800 font-semibold rounded-lg disabled:opacity-50 transition-all hover:bg-gray-300">
                            <ArrowLeft size={18} /> Back
                        </button>
                        
                        {step < 3 ? (
                            <PrimaryButton type="button" onClick={nextStep} disabled={!isStepValid() || isLoading}>
                                Next <ArrowRight size={18} />
                            </PrimaryButton>
                        ) : (
                            <PrimaryButton type="submit" disabled={isLoading || !isPasswordValid || formData.password !== formData.confirmPassword}>
                                {isLoading ? 'Submitting...' : 'Complete Registration'}
                            </PrimaryButton>
                        )}
                    </div>
                </form>
                
                <p className="text-center text-sm mt-8">Already have an account? <Link to="/login" className="text-blue-600 hover:underline font-medium">Login here</Link></p>
            </div>
        </div>
    );
};

export default RegisterPage;