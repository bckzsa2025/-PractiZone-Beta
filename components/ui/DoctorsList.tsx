
import React from 'react';
import { DOCTORS } from '../../services/geminiService';
import { Award, Star, Stethoscope } from 'lucide-react';

const DoctorsList: React.FC = () => {
  return (
    <section id="doctors" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 animate-in slide-in-from-bottom-8 duration-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                    <Stethoscope className="w-4 h-4" /> Meet The Team
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Expert Care Professionals</h2>
                <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
                <p className="mt-4 text-slate-500 max-w-2xl mx-auto">
                    Led by Dr. Beate Setzer, our team combines decades of medical experience with a passion for family wellness.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {DOCTORS.map((doc, idx) => (
                    <div 
                        key={doc.id} 
                        className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group hover:-translate-y-2 transition-transform duration-300"
                    >
                        <div className="h-64 overflow-hidden relative">
                            <img 
                                src={doc.image} 
                                alt={doc.name} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                                <div>
                                    <h3 className="text-white font-bold text-xl">{doc.name}</h3>
                                    <p className="text-primary-300 text-sm font-medium">{doc.specialty}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="flex gap-2 mb-4">
                                <span className="bg-blue-50 text-primary text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Award className="w-3 h-3" /> 15+ Yrs Exp
                                </span>
                                <span className="bg-amber-50 text-amber-600 text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                                    <Star className="w-3 h-3" /> Top Rated
                                </span>
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                Dedicated to providing comprehensive care with a focus on preventative health and chronic disease management.
                            </p>
                            <button className="w-full py-3 border border-slate-200 rounded-lg text-slate-600 font-bold text-sm hover:bg-slate-50 hover:text-primary transition-colors">
                                View Profile
                            </button>
                        </div>
                    </div>
                ))}
                
                {/* Recruitment Card */}
                <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                        <Stethoscope className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Join Our Team</h3>
                    <p className="text-slate-500 text-sm max-w-xs mb-6">
                        We are always looking for passionate healthcare professionals to join our growing practice.
                    </p>
                    <button className="text-primary font-bold text-sm hover:underline">
                        View Careers &rarr;
                    </button>
                </div>
            </div>
        </div>
    </section>
  );
};

export default DoctorsList;
