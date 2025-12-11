import React from 'react';
import { Heart, Clock, Award } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
               <Heart className="w-4 h-4" /> Our Story
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
              A Legacy of Caring for <span className="text-primary">Milnerton Families</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Established in 2008, Dr. Beate Setzer's practice has grown from a small consulting room to a comprehensive family health center. Our mission is simple: to provide accessible, compassionate, and high-quality healthcare that treats the whole person, not just the symptoms.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We believe in building long-term relationships with our patients. From newborn check-ups to geriatric care, our team is dedicated to supporting your health journey through every stage of life.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
               <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-primary">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">15+ Years</h4>
                    <p className="text-sm text-slate-500">Of medical excellence</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-primary">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">Certified</h4>
                    <p className="text-sm text-slate-500">BHF & HPASA Registered</p>
                  </div>
               </div>
            </div>
          </div>

          {/* Team Photos - Actual Practice Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-4 translate-y-8">
                  {/* Family Wellness - Generic Unsplash */}
                  <div className="bg-slate-200 rounded-2xl h-64 w-full flex items-center justify-center text-slate-400 font-bold overflow-hidden relative group shadow-lg">
                      <img src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=400&h=500" className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" alt="Family Wellness" />
                      <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">Family Wellness</span>
                  </div>
                  
                  {/* Top Rated - Replaced with Reception Image */}
                  <div className="bg-slate-200 rounded-2xl h-48 w-full flex items-center justify-center text-slate-400 font-bold overflow-hidden relative group shadow-lg border border-slate-100">
                      <img src="/IMG_20250130_165033.jpg" className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" alt="Reception Desk" />
                      <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">Top Rated</span>
                  </div>
               </div>
               <div className="space-y-4">
                  {/* Caring Staff - Replaced with Kids Corner Image */}
                  <div className="bg-slate-200 rounded-2xl h-48 w-full flex items-center justify-center text-slate-400 font-bold overflow-hidden relative group shadow-lg border border-slate-100">
                      <img src="/IMG_20250130_165022.jpg" className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" alt="Kids Corner" />
                      <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">Caring Staff</span>
                  </div>

                  {/* Quality Care - Replaced with Desk Detail */}
                  <div className="bg-slate-200 rounded-2xl h-64 w-full flex items-center justify-center text-slate-400 font-bold overflow-hidden relative group shadow-lg">
                      <img src="/IMG_20250130_165039.jpg" className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" alt="Consulting Room" />
                      <span className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-bold text-slate-800 shadow-sm">Quality Care</span>
                  </div>
               </div>
            </div>
            {/* Decor element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-transparent rounded-full opacity-50 blur-3xl"></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutUs;