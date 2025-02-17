import { NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Formatăm datele pentru Google Sheets
    const values = [[
      data.numeParinte,               // Parent First Names
      data.prenumeParinte,            // Parent Last Name
      data.email,                     // Parent Email
      '',                             // Additional Email
      data.telefon,                   // Mobile Phone
      '',                             // Home Phone
      '',                             // Work Phone
      data.adresa,                    // Address
      '',                             // Address 2
      data.localitate,                // City
      data.judet,                     // State
      '',                             // Zip Code
      'Romania',                      // Country
      'Active',                       // Parent Status
      `CNP: ${data.cnpParinte}`,     // Notes - Salvăm CNP-ul aici
      data.notificariEvenimente ? 'Yes' : 'No', // Event Reminders
      '',                             // Event Notes
      data.notificariEmail ? 'Yes' : 'No',      // Emails
      data.notificariSMS ? 'Yes' : 'No',        // SMS Reminders
      data.numeCopil,                 // Student First Name
      data.prenumeCopil,              // Student Last Name
      '',                             // Student Email
      '',                             // Student Mobile Phone
      '',                             // Student Home Phone
      data.dataNasterii,             // Birth Date
      new Date().toISOString(),       // Start Date
      data.scoala,                    // School
      '',                             // Grade
      data.cursuri.join(', '),       // Subjects
      data.observatiiCopil,          // Student Notes
      'Active',                       // Student Status
      'Standard',                     // Billing Method
      '',                             // Student Hourly Cost
      '',                             // Cost Premium Name
      '',                             // Discount Rate
      data.notificariEvenimente ? 'Yes' : 'No', // Student Event Reminders
      '',                             // Student Event Notes
      data.notificariEmail ? 'Yes' : 'No',      // Student Emails
      data.notificariSMS ? 'Yes' : 'No',        // Student SMS Reminders
    ]];
    
    await appendToSheet(values);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in submit route:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}