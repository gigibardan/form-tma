import { NextRequest, NextResponse } from 'next/server';
import { appendToSheet } from '@/lib/googleSheets';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // Formatăm datele pentru Google Sheets
    const values = [[
      data.numeParinte,
      data.prenumeParinte,
      data.email,
      '',
      data.telefon,
      '',
      '',
      data.adresa,
      '',
      data.localitate,
      data.judet,
      '',
      'Romania',
      'Active',
      `CNP: ${data.cnpParinte}`,
      data.notificariEvenimente ? 'Yes' : 'No',
      '',
      data.notificariEmail ? 'Yes' : 'No',
      data.notificariSMS ? 'Yes' : 'No',
      data.numeCopil,
      data.prenumeCopil,
      '',
      '',
      '',
      data.dataNasterii,
      new Date().toISOString(),
      data.scoala,
      '',
      data.cursuri.join(', '),
      data.observatiiCopil,
      'Active',
      'Standard',
      '',
      '',
      '',
      data.notificariEvenimente ? 'Yes' : 'No',
      '',
      data.notificariEmail ? 'Yes' : 'No',
      data.notificariSMS ? 'Yes' : 'No',
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