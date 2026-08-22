import React from 'react';

/**
 * PrivacyPolicyPage Component
 * Displays the privacy policy for the Ethiopian Mathematics Professionals Association (EMPA).
 * This content is a placeholder and should be replaced with your actual, legally reviewed privacy policy.
 */
const PrivacyPolicyPage = () => {
    return (
        <div className="bg-gray-100 min-h-screen py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-xl border border-gray-200">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-900 mb-6 text-center leading-tight">
                    Privacy Policy
                </h1>
                <p className="text-center text-lg text-gray-700 mb-8">
                    Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                </p>

                <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed space-y-6">
                    <p>
                        The Ethiopian Mathematics Professionals Association (EMPA) is committed to protecting the privacy of its members, visitors, and users. This Privacy Policy outlines the types of information we collect, how it is used, and the steps we take to safeguard it.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li><strong>Personal Identifiable Information (PII):</strong> This includes your name, email address, phone number, and professional affiliation, primarily collected when you register for membership, subscribe to our newsletter, or register for events.</li>
                        <li><strong>Usage Data:</strong> Information on how the website is accessed and used (e.g., pages visited, time spent on pages, referral sources). This data is collected using analytics tools to improve user experience.</li>
                        <li><strong>Communication Data:</strong> Records of your correspondence with us, such as emails or inquiries through our contact forms.</li>
                    </ul>

                    <h2>2. How We Use Your Information</h2>
                    <p>The information we collect is used for various purposes:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>To provide and maintain our services and website.</li>
                        <li>To manage your membership, including processing applications and renewals.</li>
                        <li>To notify you about changes to our services or relevant events, news, and resources.</li>
                        <li>To allow you to participate in interactive features of our services when you choose to do so.</li>
                        <li>To provide customer support.</li>
                        <li>To monitor the usage of our service for analytical and improvement purposes.</li>
                        <li>To detect, prevent, and address technical issues.</li>
                    </ul>

                    <h2>3. Data Security</h2>
                    <p>
                        The security of your data is paramount to us. We implement a variety of security measures, including encryption and access controls, to maintain the safety of your personal information when you enter, submit, or access your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>

                    <h2>4. Sharing Your Information</h2>
                    <p>
                        EMPA does not sell, trade, or otherwise transfer your Personally Identifiable Information to outside parties without your consent, except for the purpose of delivering the requested service, performing research, or as required by law. This does not include trusted third parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential.
                    </p>

                    <h2>5. Your Data Protection Rights</h2>
                    <p>Depending on your location, you may have the following data protection rights:</p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>The right to access, update or to delete the information we have on you.</li>
                        <li>The right to rectify your information if that information is inaccurate or incomplete.</li>
                        <li>The right to object to our processing of your Personal Data.</li>
                        <li>The right to request that we restrict the processing of your personal information.</li>
                        <li>The right to data portability.</li>
                        <li>The right to withdraw consent at any time where EMPA relied on your consent to process your personal information.</li>
                    </ul>

                    <h2>6. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                    </p>

                    <h2>7. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us:
                    </p>
                    <ul className="list-disc list-inside space-y-2">
                        <li>By email: <a href="mailto:info@eth-math.org" className="text-blue-600 hover:text-blue-800 underline">info@eth-math.org</a></li>
                        <li>By visiting this page on our website: [Your Contact Page Link]</li>
                    </ul>
                    <p className="text-sm italic text-gray-600 mt-8">Last updated: June 11, 2025</p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
