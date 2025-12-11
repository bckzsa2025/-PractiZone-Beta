/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { SERVICES, DOCTORS, getAvailableSlots, saveAppointment, sendConfirmationEmail } from '../services/geminiService';
import { Calendar, Clock, CheckCircle, ChevronLeft, ChevronRight, User, Info, CreditCard } from 'lucide-react';
import { Appointment } from '../types';

interface BookingWizardProps {
  onCancel: () => void;
  onComplete: () => void;
}

const BookingWizard: React.FC<BookingWizardProps> = ({ onCancel, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [patientDetails, setPatientDetails] = useState({ name: '', email: '', phone: '', notes: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableSlots = selectedDate && selectedDoctor ? getAvailableSlots(new Date(selectedDate), selectedDoctor) : [];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const getService = (id: string) => SERVICES.find(s => s.id === id);
  const getDoctor = (id: string) => DOCTORS.find(d => d.id === id);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await saveAppointment({
        patientId: 'guest', // In a real app this would be actual ID
        doctorId: selectedDoctor,
        serviceId: selectedService,
        date: `${selectedDate}T${selectedSlot}`,
        status: 'confirmed',
        notes: patientDetails.notes,
        type: selectedService === 's6' ? 'telehealth' : 'in-person'
      });

      // Send Confirmation Email
      await sendConfirmationEmail(patientDetails.email, {
        patientName: patientDetails.name,
        doctorName: getDoctor(selectedDoctor)?.name,
        serviceName: getService(selectedService)?.name,
        date: selectedDate,
        time: selectedSlot,
        practiceAddress: "6 Epping Street, Milnerton, Cape Town",
        instructions: "Please arrive 10 minutes early for check-in. Bring your ID and Medical Aid card if applicable."
      });

      setStep(5); // Success step
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-primary p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold font-display">Book Appointment</h2>
            <p className="text-xs opacity-80">Step {step} of 4</p>
          </div>
          <button onClick={onCancel} className="text-white/80 hover:text-white font-bold text-sm">Close</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Select a Service</h3>
              <div className="grid gap-3">
                {SERVICES.map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 rounded-xl border text-left transition-all flex justify-between items-center ${selectedService === service.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
                  >
                    <div>
                      <p className="font-bold text-slate-800">{service.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{service.description}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-primary">R {service.price}</p>
                       <p className="text-xs text-slate-400">{service.duration} mins</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <h3 className="text-lg font-bold text-slate-800">Select Provider & Time</h3>
              
              <div className="space-y-3">
                 <label className="text-sm font-bold text-slate-600">Preferred Practitioner</label>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   {DOCTORS.map(doc => (
                     <button 
                       key={doc.id}
                       onClick={() => setSelectedDoctor(doc.id)}
                       className={`p-3 rounded-lg border flex items-center gap-3 ${selectedDoctor === doc.id ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-slate-200'}`}
                     >
                       <img src={doc.image} className="w-10 h-10 rounded-full object-cover" />
                       <div className="text-left">
                         <p className="font-bold text-sm text-slate-800">{doc.name}</p>
                         <p className="text-[10px] text-slate-500 truncate">{doc.specialty}</p>
                       </div>
                     </button>
                   ))}
                 </div>
              </div>

              {selectedDoctor && (
                <div className="space-y-3 animate-in fade-in">
                  <label className="text-sm font-bold text-slate-600">Date & Time</label>
                  <input 
                    type="date" 
                    value={selectedDate}
                    onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(''); }}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {availableSlots.length > 0 ? availableSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-1 rounded text-sm font-medium transition-colors ${selectedSlot === slot ? 'bg-primary text-white shadow-lg' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
                      >
                        {slot}
                      </button>
                    )) : (
                      <div className="col-span-4 text-center py-4 text-slate-400 italic bg-slate-50 rounded-lg">
                        No slots available for this date.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
               <h3 className="text-lg font-bold text-slate-800">Your Details</h3>
               <div className="grid gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none"
                      placeholder="e.g. John Doe"
                      value={patientDetails.name}
                      onChange={e => setPatientDetails({...patientDetails, name: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
                        <input 
                        type="email" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none"
                        placeholder="john@example.com"
                        value={patientDetails.email}
                        onChange={e => setPatientDetails({...patientDetails, email: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone</label>
                        <input 
                        type="tel" 
                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none"
                        placeholder="+27..."
                        value={patientDetails.phone}
                        onChange={e => setPatientDetails({...patientDetails, phone: e.target.value})}
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medical Notes (Optional)</label>
                    <textarea 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-primary outline-none h-24 resize-none"
                      placeholder="Briefly describe your symptoms or reason for visit..."
                      value={patientDetails.notes}
                      onChange={e => setPatientDetails({...patientDetails, notes: e.target.value})}
                    ></textarea>
                  </div>
                  <div className="flex items-start gap-2 bg-blue-50 p-3 rounded-lg text-blue-800 text-xs">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>By proceeding, you consent to our privacy policy regarding the handling of your medical information (POPIA compliant).</p>
                  </div>
               </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
               <h3 className="text-lg font-bold text-slate-800">Review & Confirm</h3>
               
               <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                     <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Service</p>
                        <p className="font-bold text-slate-800">{getService(selectedService)?.name}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Price</p>
                        <p className="font-bold text-primary">R {getService(selectedService)?.price}</p>
                     </div>
                  </div>
                  <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                     <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Practitioner</p>
                        <p className="font-bold text-slate-800">{getDoctor(selectedDoctor)?.name}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Date & Time</p>
                        <p className="font-bold text-slate-800">{selectedDate} @ {selectedSlot}</p>
                     </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Patient</p>
                    <p className="font-bold text-slate-800">{patientDetails.name}</p>
                    <p className="text-sm text-slate-600">{patientDetails.email} | {patientDetails.phone}</p>
                  </div>
               </div>

               <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <div className="text-xs text-orange-800">
                    <span className="font-bold">Payment Policy:</span> Fees are settled after the consultation. We accept Card and Medical Aid.
                  </div>
               </div>
            </div>
          )}

          {step === 5 && (
            <div className="text-center py-12 animate-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Booking Confirmed!</h2>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                    We have sent a confirmation email to <strong>{patientDetails.email}</strong>. 
                    Please arrive 10 minutes early.
                </p>
                <div className="flex justify-center gap-3">
                    <button onClick={onComplete} className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-teal-600">
                        Return Home
                    </button>
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold hover:bg-slate-50">
                        Add to Calendar
                    </button>
                </div>
            </div>
          )}

        </div>

        {/* Footer Controls */}
        {step < 5 && (
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-between">
                <button 
                    onClick={handleBack} 
                    disabled={step === 1}
                    className="px-6 py-3 text-slate-600 font-bold disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    <ChevronLeft className="w-4 h-4" /> Back
                </button>
                
                {step < 4 ? (
                     <button 
                        onClick={handleNext}
                        disabled={
                            (step === 1 && !selectedService) || 
                            (step === 2 && (!selectedDoctor || !selectedSlot)) ||
                            (step === 3 && (!patientDetails.name || !patientDetails.email))
                        }
                        className="px-8 py-3 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
                    >
                        Next Step <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button 
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-3 bg-slate-800 text-white rounded-lg font-bold shadow-lg disabled:opacity-70 flex items-center gap-2"
                    >
                        {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
                    </button>
                )}
            </div>
        )}

      </div>
    </div>
  );
};

export default BookingWizard;