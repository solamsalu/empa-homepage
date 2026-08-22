import React from 'react';
import { Outlet } from 'react-router-dom';
import EMPANavbar from '../common/EMPANavbar';
import Footer from '../common/Footer';


const Layout = () => {
  return (
    <div className="bg-white font-sans flex flex-col min-h-screen">
      <EMPANavbar />

      {/* 
        This is the main content wrapper.
        THE RESPONSIVE PADDING FIX IS HERE:
        - `pt-16`: (padding-top: 4rem) for MOBILE.
        - `md:pt-20`: (padding-top: 5rem) for DESKTOP (at md breakpoint and up).
        Adjust these values to match your navbar's actual height in Tailwind units.
      */}
      
      <main className="flex-grow pt-16 md:pt-24">

        <Outlet /> {/* This is where your page components will be rendered */}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;