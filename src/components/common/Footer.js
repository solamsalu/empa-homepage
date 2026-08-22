
import React from 'react';
import { Link } from 'react-router-dom';
import { SocialIcon } from 'react-social-icons';

// --- Reusable Sub-component for Link Columns ---
const FooterLinkColumn = ({ title, links }) => (
  <div>
    <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase">{title}</h3>
    <ul className="mt-4 space-y-3">
      {links.map((link) => (
        <li key={link.name}>
          <Link to={link.href} className="text-base text-gray-400 hover:text-white transition-colors duration-200">
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);


const DeveloperCredits = () => {
  const developers = [
    {
      name: 'Solomon Amsalu',
      role: 'Full-Stack Developer',
      portfolioUrl: 'https://www.linkedin.com/in/solomon-amsalu',
      email: 'solamsalu@gmail.com',
      phone: '+251912215231'
    },
    {
      name: 'Akalu Abraham',
      role: 'Full-Stack Developer',
      portfolioUrl: 'https://www.linkedin.com/in/akaluabraham',
      email: 'ake.abrish@gmail.com',
      phone: '+251913072511'
    }
  ];

  return (
    <div>
      {/* Section Heading */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-300 flex items-center justify-center uppercase tracking-wider border-b border-gray-700 pb-2">
          Website Developed By
        </h3>
      </div>

      {/* Developer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {developers.map((dev) => (
          <div
            key={dev.name}
            className="bg-gray-800 border border-gray-700 rounded-lg p-5 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            {/* Developer Name */}
            <div className="mb-2">
              <a
                href={dev.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-white uppercase tracking-wide border-b border-gray-600 pb-1 hover:text-amber-400 transition-colors"
              >
                {dev.name}
              </a>
            </div>

            {/* Role */}
            <p className="text-sm text-gray-400">{dev.role}</p>

            {/* Contact Info */}
            <div className="mt-3 text-sm text-gray-400 space-y-1">
              <div className="flex items-center gap-x-2">
                <span className="font-medium text-gray-300">Email:</span>
                <a href={`mailto:${dev.email}`} className="hover:text-white transition-colors">
                  {dev.email}
                </a>
              </div>
              <div className="flex items-center gap-x-2">
                <span className="font-medium text-gray-300">Phone:</span>
                <a href={`tel:${dev.phone}`} className="hover:text-white transition-colors">
                  {dev.phone}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};



// ✅ Social Icons Component (moved outside Footer)
const SocialIcons = () => {
  const socialLinks = [
    { name: 'Facebook', href: 'https://www.facebook.com/ethmathproass' },
    { name: 'Telegram', href: 'https://t.me/ethmathproass' },
    { name: 'Instagram', href: 'https://www.instagram.com/empa' },
    { name: 'LinkedIn', href: 'https://linkedin.com/empa' },
    { name: 'X', href: 'https://x.com/empa' },
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((link) => (
        <SocialIcon
          key={link.name}
          url={link.href}
          style={{ height: 30, width: 30 }} 
          className="hover:scale-110 transition-transform"
          target="_blank"
          rel="noopener noreferrer"
          title={link.name}
        />
      ))}
    </div>
  );
};

// --- Main Footer Component ---
const Footer = () => {
  const aboutLinks = [
    { name: 'About EMPA', href: '/about' },
    { name: 'News', href: '/news' },
    { name: 'Membership', href: '/membership' },
  ];
  const programsLinks = [
    { name: 'Conferences', href: '/events' },
    { name: 'Olympiad', href: '/olympiad' },
    { name: 'Journals', href: '/journals' },
  ];
  const supportLinks = [
    { name: 'Resources', href: '/resources' },
    { name: 'Contact Us', href: '/contact' },
  ];
  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy-policy' },
    { name: 'Terms of Service', href: '/terms-of-service' },
  ];

  return (
    <footer className="bg-[#111827] text-gray-300" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        {/* --- TOP SECTION --- */}
        <div className="pb-8 xl:grid xl:grid-cols-5 xl:gap-8">
          <div className="space-y-8 xl:col-span-2">
            <div className="flex items-center space-x-3">
              <img className="h-12" src="/images/header_logo.jpg" alt="EMPA Logo" />
              <span className="text-xl font-bold text-white">EMPA</span>
            </div>
            <p className="text-base text-gray-400">
              Advancing mathematical sciences in Ethiopia through collaboration, research, and educational excellence.
            </p>
            <DeveloperCredits />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <FooterLinkColumn title="About" links={aboutLinks} />
              <FooterLinkColumn title="Programs" links={programsLinks} />
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <FooterLinkColumn title="Support" links={supportLinks} />
              <FooterLinkColumn title="Legal" links={legalLinks} />
            </div>
          </div>
        </div>

        {/* --- BOTTOM SECTION --- */}
        <div className="mt-8 border-t border-white/10 pt-8 flex flex-col sm:flex-row-reverse items-center justify-between gap-y-4">
          <SocialIcons />
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Ethiopian Mathematics Professionals Association. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
