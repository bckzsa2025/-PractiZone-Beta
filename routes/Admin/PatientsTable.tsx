
import React from 'react';
import { Search, MoreVertical, FileText, User } from 'lucide-react';

const PatientsTable: React.FC = () => {
  const patients = [
    { id: 'P-101', name: 'Alex Thompson', email: 'alex@example.com', phone: '+27 72 555 1234', lastVisit: '2 days ago', status: 'Active' },
    { id: 'P-102', name: 'Sarah Miller', email: 'sarah.m@example.com', phone: '+27 82 444 9876', lastVisit: '1 month ago', status: 'Active' },
    { id: 'P-103', name: 'James Wilson', email: 'j.wilson@example.com', phone: '+27 61 222 3333', lastVisit: '6 months ago', status: 'Inactive' },
    { id: 'P-104', name: 'Emily Chen', email: 'emily.c@example.com', phone: '+27 71 888 7777', lastVisit: '1 week ago', status: 'Active' },
    { id: 'P-105', name: 'Michael Brown', email: 'mike.b@example.com', phone: '+27 83 111 2222', lastVisit: '3 weeks ago', status: 'Active' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
            <div>
                <h3 className="font-bold text-lg text-slate-800">Patient Directory</h3>
                <p className="text-sm text-slate-500">Total Patients: 1,248</p>
            </div>
            <div className="flex gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search patients..." className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary" />
                </div>
                <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-blue-700">
                    + Add Patient
                </button>
            </div>
        </div>
        <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                    <th className="p-4">Patient Name</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Last Visit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {patients.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-primary font-bold">
                                    {p.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{p.name}</p>
                                    <p className="text-xs text-slate-500 font-mono">{p.id}</p>
                                </div>
                            </div>
                        </td>
                        <td className="p-4 text-slate-600">
                            <p>{p.email}</p>
                            <p className="text-xs text-slate-400">{p.phone}</p>
                        </td>
                        <td className="p-4 text-slate-600">{p.lastVisit}</td>
                        <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${p.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                {p.status}
                            </span>
                        </td>
                        <td className="p-4 text-right">
                            <div className="flex justify-end gap-2">
                                <button className="p-2 text-slate-400 hover:text-primary rounded hover:bg-blue-50" title="View Profile">
                                    <User className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-primary rounded hover:bg-blue-50" title="Medical Records">
                                    <FileText className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-100">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        <div className="p-4 border-t border-slate-200 bg-slate-50 text-center text-xs text-slate-500">
            Showing 5 of 1,248 records
        </div>
    </div>
  );
};

export default PatientsTable;
