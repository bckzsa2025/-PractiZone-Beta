
import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-display font-bold text-xl mb-4">Dr. B Setzer</h3>
            <p className="max-w-sm mb-6">Providing quality, accessible healthcare to the Milnerton community. Your health journey starts here.</p>
            <div className="flex flex-col gap-2">
                <a href="tel:+27215101441" className="flex items-center gap-2 hover:text-white transition-colors">
                    <Phone className="w-4 h-4" /> 021 510 1441
                </a>
                <div className="flex flex-col gap-1">
                  <a href="mailto:info@drsetzer.com" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Mail className="w-4 h-4" /> info@drsetzer.com
                  </a>
                  <a href="mailto:info@drsetzer.net" className="flex items-center gap-2 hover:text-white transition-colors">
                      <Mail className="w-4 h-4 opacity-0" /> info@drsetzer.net
                  </a>
                </div>
                <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> 6 Epping St, Milnerton
                </span>
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><button className="hover:text-primary transition-colors">Book Appointment</button></li>
              <li><button className="hover:text-primary transition-colors">Patient Portal</button></li>
              <li><button className="hover:text-primary transition-colors">Our Services</button></li>
              <li><button className="hover:text-primary transition-colors">Contact Us</button></li>
            </ul>
          </div>
          <div>
             <h4 className="text-white font-bold mb-4">Legal & Emergency</h4>
             <ul className="space-y-2 mb-6">
                <li><a href="#" className="hover:text-primary">Privacy Policy (POPIA)</a></li>
                <li><a href="#" className="hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary">PAIA Manual</a></li>
             </ul>
             <p className="text-xs mb-1">Medical Emergency?</p>
             <p className="text-2xl font-bold text-red-500">Dial 10177</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} Dr. Beate Setzer Practice. All rights reserved.
        </div>
    </footer>
  );
};

export default Footer;