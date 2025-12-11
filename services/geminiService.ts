
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { Service, Doctor, Appointment, User } from "../types";

// Mock Data - Now Categorized
export const SERVICES: Service[] = [
  { id: 's1', name: 'General Consultation', category: 'General Care', duration: 30, price: 450, description: 'Standard check-up and diagnosis for common ailments.' },
  { id: 's2', name: 'First Consultation', category: 'General Care', duration: 45, price: 550, description: 'Initial comprehensive assessment for new patients.' },
  { id: 's3', name: 'Chronic Illness Management', category: 'Chronic Care', duration: 30, price: 400, description: 'Follow-up for diabetes, hypertension, and other chronic conditions.' },
  { id: 's4', name: 'Pediatric Check-up', category: 'Pediatrics', duration: 30, price: 450, description: 'Child health, milestones, and vaccinations.' },
  { id: 's7', name: 'Vaccinations (Baby)', category: 'Pediatrics', duration: 15, price: 350, description: 'Scheduled immunizations for infants.' },
  { id: 's5', name: 'Minor Procedures', category: 'Procedures', duration: 60, price: 850, description: 'Stitching, mole removal, and wound care.' },
  { id: 's8', name: 'ECG / EKG', category: 'Procedures', duration: 20, price: 300, description: 'Heart rhythm monitoring and analysis.' },
  { id: 's6', name: 'Telehealth Session', category: 'Telehealth', duration: 20, price: 350, description: 'Video consultation via secure portal.' },
];

export const DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Beate Setzer', specialty: 'General Practitioner (MBBCh)', image: 'https://images.unsplash.com/photo-1666214280557-f1b5022eb634?auto=format&fit=crop&q=80&w=300&h=300' }, 
  { id: 'd2', name: 'Nurse Sarah Jenkins', specialty: 'Family Nurse Practitioner', image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=300&h=300' }, 
];

const STORAGE_KEY_APPTS = 'dr_setzer_appointments';

// Mock API Functions
export const getAvailableSlots = (date: Date, doctorId: string): string[] => {
  const slots = [
    '09:15', '09:45', '10:15', '11:00', '12:30', '14:00', '15:15', '16:00'
  ];
  return slots.filter(() => Math.random() > 0.3);
};

export const saveAppointment = async (appt: Omit<Appointment, 'id'>): Promise<Appointment> => {
  const newAppt: Appointment = {
    ...appt,
    id: Math.random().toString(36).substr(2, 9),
  };
  const existing = getAppointments();
  const updated = [...existing, newAppt];
  localStorage.setItem(STORAGE_KEY_APPTS, JSON.stringify(updated));
  await new Promise(resolve => setTimeout(resolve, 800));
  return newAppt;
};

export const sendConfirmationEmail = async (email: string, details: any): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  console.group("📧 [EMAIL SERVICE] Sending Confirmation");
  console.log(`To: ${email}`);
  console.log("Subject: Appointment Confirmation - Dr. Beate Setzer");
  console.log(JSON.stringify(details, null, 2));
  console.groupEnd();
};

export const getAppointments = (): Appointment[] => {
  const stored = localStorage.getItem(STORAGE_KEY_APPTS);
  return stored ? JSON.parse(stored) : [];
};

export const getAppointmentsForPatient = (patientId: string): Appointment[] => {
  return getAppointments().filter(a => a.patientId === patientId);
};

export const loginUser = async (email: string): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'p_12345',
    name: 'Alex Thompson',
    email: email,
    role: 'patient',
    phone: '+27 72 555 1234',
    medicalSummary: {
      allergies: ['Penicillin', 'Peanuts'],
      conditions: ['Mild Asthma']
    }
  };
};
