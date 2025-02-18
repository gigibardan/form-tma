'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRef } from "react";

export default function FormularInscriere() {

  const [showGDPR, setShowGDPR] = useState(false);
  const gdprRef = useRef<HTMLDivElement | null>(null);
 

  //toggle buton gdpr
  const toggleGDPR = () => {
    setShowGDPR(!showGDPR);
    if (!showGDPR) {
      setTimeout(() => {
        gdprRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300); // Așteaptă să înceapă tranziția înainte de scroll
    }
  };

  interface FormData {
    // Date copil
    numeCopil: string;
    prenumeCopil: string;
    dataNasterii: string;
    varstaCopil: string;
    scoala: string;
    observatiiCopil: string;
    
    // Date părinte
    numeParinte: string;
    prenumeParinte: string;
    telefon: string;
    email: string;
    adresa: string;
    localitate: string;
    judet: string;
    cnpParinte: string;
    
    // Cursuri și experiență
    cursuri: string[];
    experienta: string;
    
    // Notificări
    notificariEvenimente: boolean;
    notificariEmail: boolean;
    notificariSMS: boolean;
  }
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Date copil
    numeCopil: '',
    prenumeCopil: '',
    dataNasterii: '',
    varstaCopil: '',
    scoala: '',
    observatiiCopil: '',
    
    // Date părinte
    numeParinte: '',
    prenumeParinte: '',
    telefon: '',
    email: '',
    adresa: '',
    localitate: '',
    judet: '',
    cnpParinte: '',
    
    // Cursuri și experiență
    cursuri: [],
    experienta: '',
    
    // Notificări
    notificariEvenimente: true,
    notificariEmail: true,
    notificariSMS: true
  });

  const cursuri = [
    { 
      id: 'robotica', 
      nume: 'Robotică', 
      subtitlu: 'Construiește & Programează',
      emoji: '🤖', 
      culoare: 'from-blue-500 to-blue-700',
      tehnologii: 'Lego SPIKE Essentials & Prime, Microbit, Arduino'
    },
    { 
      id: 'programare', 
      nume: 'Programare', 
      subtitlu: 'Game Development',
      emoji: '🎮', 
      culoare: 'from-purple-500 to-purple-700',
      tehnologii: 'Scratch, GDevelop, Minecraft, Roblox, Python etc.'
    },
    { 
      id: 'webdev', 
      nume: 'Web Development', 
      subtitlu: 'Frontend Development',
      emoji: '💻', 
      culoare: 'from-green-500 to-green-700',
      tehnologii: 'HTML, CSS, JavaScript'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) throw new Error('Failed to submit');
  
      setIsSubmitted(true);
      setFormData({
        numeCopil: '',
        prenumeCopil: '',
        dataNasterii: '',
        varstaCopil: '',
        scoala: '',
        observatiiCopil: '',
        
        numeParinte: '',
        prenumeParinte: '',
        telefon: '',
        email: '',
        adresa: '',
        localitate: '',
        judet: '',
        cnpParinte: '',
     
        
        cursuri: [],
        experienta: '',
        
        notificariEvenimente: true,
        notificariEmail: true,
        notificariSMS: true
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('A apărut o eroare. Vă rugăm încercați din nou.');
    }
  };

  const toggleCurs = (cursId: string) => {
    setFormData(prev => ({
      ...prev,
      cursuri: prev.cursuri.includes(cursId) 
        ? prev.cursuri.filter(id => id !== cursId)
        : [...prev.cursuri, cursId]
    }));
  };

  // Pagina de succes
  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-2xl mx-auto">
          <div className="mb-6 text-7xl">🎉</div>
          <h1 className="text-3xl font-bold mb-4 text-blue-600">
            Înregistrare finalizată cu succes!
          </h1>
          <p className="text-xl mb-6 text-gray-600">
            Vă mulțumim pentru înscriere la cursurile TechMinds Academy!
          </p>
          <div className="space-y-4 mb-8 text-left bg-blue-50 p-6 rounded-xl">
            <h2 className="text-xl font-semibold text-blue-700">Următorii pași:</h2>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center">
                <span className="mr-2">📧</span>
                Veți primi un email de confirmare în câteva minute
              </li>
              <li className="flex items-center">
                <span className="mr-2">📄</span>
                Contractul va fi generat și trimis pe email în maxim 24 de ore
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                Un reprezentant TechMinds vă va contacta în curând pentru detalii
              </li>
            </ul>
          </div>
          <button
            onClick={() => setIsSubmitted(false)}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl
                       hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Înapoi la formular
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header cu logo și titlu - Versiune optimizată pentru tableta/mobil */}
      <div className="text-center mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 
                      text-white p-4 md:p-8 rounded-2xl shadow-2xl transform hover:scale-[1.02] 
                      transition-transform animate-gradient bg-[length:200%_200%] relative">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="TechMinds Academy"
              width={128}
              height={128}
              className="object-contain"
            />
          </div>
          
          {/* Text content */}
          <div className="flex-1 text-center md:text-right">
            {/* Formular text cu font diferit și dimensiune mai mică */}
            <h1 className="text-sm md:text-lg font-normal mb-2 opacity-90 font-mono">
              Formular înscriere TechMinds Academy
            </h1>
            
            {/* Titlu principal centrat */}
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Vino în lumea STEM! 🚀
            </h2>
            
            {/* Subtitlu */}
            <p className="text-base md:text-xl opacity-90">
              Descoperă universul fascinant al roboticii și programării
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
    
        {/* Secțiunea Date Copil */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg
                        transform hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2">
            <span>👶 Date Copil</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume Copil</label>
              <input
                type="text"
                value={formData.numeCopil}
                onChange={(e) => setFormData({...formData, numeCopil: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all"
                placeholder="Numele copilului"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prenume Copil</label>
              <input
                type="text"
                value={formData.prenumeCopil}
                onChange={(e) => setFormData({...formData, prenumeCopil: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all"
                placeholder="Prenumele copilului"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Nașterii</label>
              <input
                type="date"
                value={formData.dataNasterii}
                onChange={(e) => setFormData({...formData, dataNasterii: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vârsta</label>
              <select
                value={formData.varstaCopil}
                onChange={(e) => setFormData({...formData, varstaCopil: e.target.value})}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all"
              >
                <option value="">Selectează vârsta</option>
                {[...Array(7)].map((_, i) => (
                  <option key={i + 8} value={i + 8}>{i + 8} ani</option>
                ))}
              </select>
            </div>
          </div>

          <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Școala</label>
  <input
    type="text"
    value={formData.scoala}
    onChange={(e) => setFormData({...formData, scoala: e.target.value})}
    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 transition-all"
    placeholder="Numele școlii"
  />
</div>

<div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
  <textarea
    value={formData.observatiiCopil}
    onChange={(e) => setFormData({...formData, observatiiCopil: e.target.value})}
    className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
              focus:border-blue-500 transition-all"
    placeholder="Observații despre copil (opțional)"
    rows={3}
  />
</div>
        </div>

       {/* Secțiunea Date Părinte */}
       <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg
                        transform hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold mb-4 text-purple-800 flex items-center gap-2">
            <span>👨‍👩‍👧‍👦 Date Părinte/Tutore Legal</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
              <input
                type="text"
                value={formData.numeParinte}
                onChange={(e) => setFormData({...formData, numeParinte: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="Numele părintelui"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
              <input
                type="text"
                value={formData.prenumeParinte}
                onChange={(e) => setFormData({...formData, prenumeParinte: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="Prenumele părintelui"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNP</label>
              <input
                type="text"
                value={formData.cnpParinte}
                onChange={(e) => setFormData({...formData, cnpParinte: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="CNP părinte"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
              <input
                type="text"
                value={formData.adresa}
                onChange={(e) => setFormData({...formData, adresa: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="Strada, număr, bloc, scara, apartament"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Localitate</label>
              <input
                type="text"
                value={formData.localitate}
                onChange={(e) => setFormData({...formData, localitate: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="Localitatea"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector sau Județ</label>
              <input
                type="text"
                value={formData.judet}
                onChange={(e) => setFormData({...formData, judet: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="Sectorul sau Județul"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                type="tel"
                value={formData.telefon}
                onChange={(e) => setFormData({...formData, telefon: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="07xx xxx xxx"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 
                          focus:border-purple-500 transition-all"
                placeholder="email@exemplu.com"
              />
            </div>
          </div>
        </div>

        {/* Secțiunea Cursuri */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg
                        transform hover:shadow-xl transition-all">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 flex items-center gap-2">
            <span>📚 Cursuri Disponibile</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cursuri.map(curs => (
  <button
    key={curs.id}
    type="button"
    onClick={() => toggleCurs(curs.id)}
    className={`p-6 rounded-xl shadow-md flex flex-col items-center justify-center gap-2
                transform transition-all hover:-translate-y-1 hover:shadow-lg
                ${formData.cursuri.includes(curs.id) 
                  ? `bg-gradient-to-r ${curs.culoare} text-white` 
                  : 'bg-white hover:bg-gray-50'}`}
  >
    <span className="text-4xl mb-2">{curs.emoji}</span>
    <span className="text-xl font-bold">{curs.nume}</span>
    <span className="text-sm opacity-80">{curs.subtitlu}</span>
    <span className="text-xs mt-2 opacity-70">{curs.tehnologii}</span>
  </button>
))}
          </div>
        </div>

      {/* Secțiunea Experiență */}
<div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-lg
                transform hover:shadow-xl transition-all">
  <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
    <span>🎯 Nivel Experiență</span>
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[
      { nivel: 'Începător', perioada: '0-1 ani' },
      { nivel: 'Intermediar', perioada: '1-3 ani' },
      { nivel: 'Avansat', perioada: '3+ ani' }
    ].map((exp) => (
      <button
        key={exp.nivel}
        type="button"
        onClick={() => setFormData({...formData, experienta: exp.nivel})}
        className={`p-4 rounded-xl shadow-md text-center font-semibold
                   transform transition-all hover:-translate-y-1 hover:shadow-lg
                   ${formData.experienta === exp.nivel
                     ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                     : 'bg-white hover:bg-gray-50'}`}
      >
        <div className="text-lg">{exp.nivel}</div>
        <div className={`text-sm mt-1 ${formData.experienta === exp.nivel ? 'text-green-100' : 'text-gray-500'}`}>
          {exp.perioada}
        </div>
      </button>
    ))}
  </div>
</div>


{/* Secțiunea Notificări */}
<div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg
                transform hover:shadow-xl transition-all mb-6">
  <h2 className="text-2xl font-bold mb-4 text-yellow-800 flex items-center gap-2">
    <span>🔔 Notificări și Acorduri</span>
  </h2>
  <div className="space-y-4">
    <label className="flex items-center space-x-3 hover:bg-yellow-100 p-2 rounded-lg transition-all">
      <input
        type="checkbox"
        checked={formData.notificariEvenimente}
        onChange={(e) => setFormData({...formData, notificariEvenimente: e.target.checked})}
        className="form-checkbox h-5 w-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
      />
      <span className="text-gray-700">Doresc să primesc notificări despre începerea cursurilor și orar</span>
    </label>
    
    <label className="flex items-center space-x-3 hover:bg-yellow-100 p-2 rounded-lg transition-all">
      <input
        type="checkbox"
        checked={formData.notificariEmail}
        onChange={(e) => setFormData({...formData, notificariEmail: e.target.checked})}
        className="form-checkbox h-5 w-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
      />
      <span className="text-gray-700">Doresc să primesc pe email feedback si rapoartele de progres ale copilului</span>
    </label>
    
    <label className="flex items-center space-x-3 hover:bg-yellow-100 p-2 rounded-lg transition-all">
      <input
        type="checkbox"
        checked={formData.notificariSMS}
        onChange={(e) => setFormData({...formData, notificariSMS: e.target.checked})}
        className="form-checkbox h-5 w-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
      />
      <span className="text-gray-700">Doresc să primesc notificări SMS pentru informații importante și urgente</span>
    </label>
  </div>
</div>

        
        {/* Buton Submit */}
        <button
          type="submit"
          className="w-full p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 
                     text-white text-xl font-bold rounded-xl shadow-lg
                     transform hover:scale-[1.02] transition-all
                     animate-gradient bg-[length:200%_200%]"
        >
          Înscrie-te Acum! 🚀
        </button>

   {/* GDPR Info */}
<div className="text-center mt-4 text-sm text-gray-500">
  <button
    type="button"
    className="underline hover:text-gray-700 transition"
    onClick={toggleGDPR}
  >
    Cum vor fi folosite datele mele?
  </button>

  <div
    ref={gdprRef}
    className={`transition-all duration-500 ease-in-out overflow-hidden ${
      showGDPR ? "h-auto opacity-100 py-4" : "h-0 opacity-0 py-0"
    }`}
  >
    <div className="bg-gray-100 p-4 rounded-lg text-left text-gray-700 shadow">
      <p>
        Datele furnizate în acest formular vor fi utilizate exclusiv pentru procesul de înscriere
        la TechMinds Academy. Acestea nu vor fi distribuite către terți și sunt protejate conform
        reglementărilor GDPR. Pentru orice întrebări, ne puteți contacta la{' '}
        <a href="mailto:office@techminds-academy.ro" className="text-blue-600 underline">
          office@techminds-academy.ro
        </a>.
      </p>
    </div>
  </div>
</div>

        
      </form>
    </div>
  )
}