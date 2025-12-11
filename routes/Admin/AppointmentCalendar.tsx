
import React from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Video } from 'lucide-react';

const AppointmentCalendar: React.FC = () => {
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const appointments = [
    { id: 1, time: '09:15', patient: 'Alex Thompson', type: 'Consultation', status: 'confirmed' },
    { id: 2, time: '11:00', patient: 'Sarah Miller', type: 'Follow-up', status: 'checked-in' },
    { id: 3, time: '14:00', patient: 'James Wilson', type: 'Telehealth', status: 'pending' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-4">
                <h3 className="font-bold text-lg text-slate-800">Schedule</h3>
                <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                    <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronLeft className="w-4 h-4 text-slate-600" /></button>
                    <span className="text-sm font-bold text-slate-700 px-2">Today, Dec 10</span>
                    <button className="p-1 hover:bg-white rounded shadow-sm transition-all"><ChevronRight className="w-4 h-4 text-slate-600" /></button>
                </div>
            </div>
            <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded hover:bg-slate-200">Day</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50">Week</button>
                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded hover:bg-slate-50">Month</button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            <div className="flex">
                {/* Time Column */}
                <div className="w-20 flex-shrink-0 border-r border-slate-100 bg-slate-50">
                    {timeSlots.map(time => (
                        <div key={time} className="h-24 border-b border-slate-100 flex items-start justify-center pt-2">
                            <span className="text-xs font-bold text-slate-400">{time}</span>
                        </div>
                    ))}
                </div>
                
                {/* Events Column */}
                <div className="flex-1 relative">
                    {/* Grid Lines */}
                    {timeSlots.map(time => (
                        <div key={time} className="h-24 border-b border-slate-100"></div>
                    ))}
                    
                    {/* Appointment Cards (Absolute Positioned for Demo) */}
                    <div className="absolute top-[15px] left-4 right-4 h-20 bg-blue-50 border-l-4 border-primary rounded-r-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Alex Thompson</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> 09:15 - 09:45</p>
                            </div>
                            <span className="px-2 py-0.5 bg-white text-primary text-[10px] font-bold rounded border border-blue-100">Confirmed</span>
                        </div>
                    </div>

                    <div className="absolute top-[192px] left-4 right-4 h-20 bg-green-50 border-l-4 border-green-500 rounded-r-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Sarah Miller</p>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> 11:00 - 11:30</p>
                            </div>
                            <span className="px-2 py-0.5 bg-white text-green-600 text-[10px] font-bold rounded border border-green-100">Checked In</span>
                        </div>
                    </div>

                    <div className="absolute top-[480px] left-4 right-4 h-20 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg p-3 cursor-pointer hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-800 text-sm">James Wilson</p>
                                    <Video className="w-3 h-3 text-purple-500" />
                                </div>
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> 14:00 - 14:20</p>
                            </div>
                            <span className="px-2 py-0.5 bg-white text-slate-500 text-[10px] font-bold rounded border border-purple-100">Pending</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
  );
};

export default AppointmentCalendar;
