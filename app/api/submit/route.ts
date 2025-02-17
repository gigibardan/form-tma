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
      '',                             // Notes
      'Yes',                          // Event Reminders
      '',                             // Event Notes
      'Yes',                          // Emails
      'Yes',                          // SMS Reminders
      data.numeCopil,                 // Student First Name
      data.prenumeCopil,              // Student Last Name
      '',                             // Student Email
      '',                             // Student Mobile Phone
      '',                             // Student Home Phone
      data.dataNasterii,             // Birth Date
      new Date().toISOString(),       // Start Date
      '',                             // School
      '',                             // Grade
      data.cursuri.join(', '),       // Subjects
      '',                             // Student Notes
      'Active',                       // Student Status
      'Standard',                     // Billing Method
      '',                             // Student Hourly Cost
      '',                             // Cost Premium Name
      '',                             // Discount Rate
      'Yes',                          // Student Event Reminders
      '',                             // Student Event Notes
      'Yes',                          // Student Emails
      'Yes',                          // Student SMS Reminders
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