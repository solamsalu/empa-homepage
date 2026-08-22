import React from 'react';

/**
 * TermsOfServicePage Component
 * Displays the terms of service for the Ethiopian Mathematics Professionals Association (EMPA).
 * This content is a placeholder and should be replaced with your actual, legally reviewed terms.
 */
const TermsOfServicePage = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 text-center leading-tight">
                    Terms of Service
                </h1>
                <p className="text-center text-lg text-gray-700 mb-8">
                    Welcome to the Ethiopian Mathematics Professionals Association (EMPA) website. By accessing or using our website, you agree to comply with and be bound by these Terms of Service.
                </p>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
                    <p>
                        These Terms of Service ("Terms") govern your access to and use of the Ethiopian Mathematics Professionals Association's ("EMPA", "we", "us", or "our") website and services. By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h2>1. Use of the Service</h2>
                    <p>
                        The EMPA website and its content are provided for informational and membership purposes related to the association's activities. You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service. Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within the Service.
                    </p>

                    <h2>2. Intellectual Property</h2>
                    <p>
                        All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of EMPA or its content suppliers and protected by copyright laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store or transmit any of the material on our Service, except as generally permitted by the Service.
                    </p>

                    <h2>3. User Accounts</h2>
                    <p>
                        If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account and any other actions taken in connection with the account. You must notify us immediately of any unauthorized uses of your account or any other breaches of security. EMPA will not be liable for any acts or omissions by you, including any damages of any kind incurred as a result of such acts or omissions.
                    </p>

                    <h2>4. Links to Other Websites</h2>
                    <p>
                        Our Service may contain links to third-party websites or services that are not owned or controlled by EMPA. EMPA has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that EMPA shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such web sites or services.
                    </p>

                    <h2>5. Disclaimer of Warranties</h2>
                    <p>
                        Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
                    </p>

                    <h2>6. Limitation of Liability</h2>
                    <p>
                        In no event shall EMPA, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
                    </p>

                    <h2>7. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Service.
                    </p>

                    <h2>8. Contact Information</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>Email: <a href="mailto:info@eth-math.org" className="text-blue-600 hover:text-blue-800 underline">info@eth-math.org</a></li>
                        <li>Website: [Your Contact Page Link]</li>
                    </ul>
                    <p className="text-sm italic text-gray-600 mt-8">Last updated: June 11, 2025</p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
