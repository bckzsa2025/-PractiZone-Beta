
import React from 'react';
import Header from '../components/ui/Header';
import Hero from '../components/ui/Hero';
import FeatureTiles from '../components/ui/FeatureTiles';
import AboutUs from '../components/ui/AboutUs';
import ServicesList from '../components/ui/ServicesList';
import DoctorsList from '../components/ui/DoctorsList';
import ContactSection from '../components/ui/ContactSection';
import AppointmentModal from '../components/ui/AppointmentModal';

interface HomeProps {
    onLoginClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onLoginClick }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Header 
        onLoginClick={onLoginClick} 
        onHomeClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} 
      />
      
      <main>
        <Hero onBookClick={() => setIsModalOpen(true)} />
        <FeatureTiles />
        <div id="about"><AboutUs /></div>
        <div id="services"><ServicesList /></div>
        <div id="doctors"><DoctorsList /></div>
        <div id="contact"><ContactSection /></div>
      </main>

      <AppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
      
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Dr. B Setzer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
