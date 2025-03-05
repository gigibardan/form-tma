'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import LocationSelector from '@/components/LocationSelector';

export default function FormularInscriere() {
  // State pentru tracking-ul submiterii
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGDPR, setShowGDPR] = useState(false);
  const gdprRef = useRef<HTMLDivElement | null>(null);

  // Referințe pentru scroll la erori
  const formRef = useRef<HTMLFormElement | null>(null);
  const firstErrorRef = useRef<HTMLDivElement | null>(null);

  // State pentru erori de validare
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const [showErrorBanner, setShowErrorBanner] = useState(false);


  // Toggle buton GDPR
  const toggleGDPR = () => {
    setShowGDPR(!showGDPR);
    if (!showGDPR) {
      setTimeout(() => {
        gdprRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
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

  // Funcția de validare pentru câmpuri individuale
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'numeCopil':
      case 'prenumeCopil':
      case 'numeParinte':
      case 'prenumeParinte':
        return value.length < 3 ? 'Trebuie să conțină cel puțin 3 caractere' : '';

      case 'telefon':
        return value.length < 7 ? 'Numărul de telefon trebuie să conțină cel puțin 7 caractere' : '';

      case 'cnpParinte':
        return value.length < 7 ? 'CNP-ul trebuie să conțină cel puțin 7 caractere' : '';

      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Adresa de email nu este validă' : '';

      default:
        return '';
    }
  };

  // Funcție pentru a valida toate câmpurile necesare
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Câmpuri obligatorii pentru părinte
    const requiredParentFields = [
      { key: 'numeParinte', label: 'Nume părinte' },
      { key: 'prenumeParinte', label: 'Prenume părinte' },
      { key: 'telefon', label: 'Telefon' },
      { key: 'email', label: 'Email' },
      { key: 'cnpParinte', label: 'CNP părinte' }
    ];

    // Câmpuri obligatorii pentru copil
    const requiredChildFields = [
      { key: 'numeCopil', label: 'Nume copil' },
      { key: 'prenumeCopil', label: 'Prenume copil' },
      { key: 'dataNasterii', label: 'Data nașterii' },
      { key: 'varstaCopil', label: 'Vârsta' }
    ];

    // Validează câmpurile pentru părinte
    requiredParentFields.forEach(field => {
      const value = formData[field.key as keyof FormData] as string;
      if (!value) {
        newErrors[field.key] = `${field.label} este obligatoriu`;
        isValid = false;
      } else {
        const error = validateField(field.key, value);
        if (error) {
          newErrors[field.key] = error;
          isValid = false;
        }
      }
    });

    // Validează câmpurile pentru copil
    requiredChildFields.forEach(field => {
      const value = formData[field.key as keyof FormData] as string;
      if (!value) {
        newErrors[field.key] = `${field.label} este obligatoriu`;
        isValid = false;
      } else if (field.key !== 'dataNasterii' && field.key !== 'varstaCopil') {
        const error = validateField(field.key, value);
        if (error) {
          newErrors[field.key] = error;
          isValid = false;
        }
      }
    });

    // Validează selecția cursurilor
    if (formData.cursuri.length === 0) {
      newErrors.cursuri = 'Selectează cel puțin un curs';
      isValid = false;
    }

    // Validează selecția experienței
    if (!formData.experienta) {
      newErrors.experienta = 'Selectează nivelul de experiență';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Efect pentru a face scroll la prima eroare
  useEffect(() => {
    if (showErrorBanner && Object.keys(errors).length > 0 && firstErrorRef.current) {
      firstErrorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [showErrorBanner]);

  // Funcție pentru convertirea formatului datei din YYYY-MM-DD în DD/MM/YYYY
  const formatDateForSubmission = (dateString: string): string => {
    if (!dateString) return '';

    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  // Handler pentru submit formular
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Previne submiteri multiple
    setShowErrorBanner(true);

    // Validează formularul
    if (!validateForm()) {
      // Găsim primul câmp cu eroare pentru a face scroll
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorElement = document.getElementById(firstErrorKey);

      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      return;
    }

    setIsSubmitting(true); // Începe procesul

    try {
      // Pregătim datele pentru trimitere
      const submissionData = {
        ...formData,
        // Convertim data în formatul DD/MM/YYYY
        dataNasterii: formatDateForSubmission(formData.dataNasterii),
        // Ne asigurăm că CNP-ul nu conține prefixul "CNP:"
        cnpParinte: formData.cnpParinte.replace('CNP:', '').trim()
      };

      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
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
    } finally {
      setIsSubmitting(false); // Reset state indiferent de rezultat
    }
  };

  // Handler pentru schimbarea câmpurilor
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validează câmpul la schimbare
    // const error = validateField(name, value);
    // setErrors(prev => ({
    //  ...prev,
    //  [name]: error
    // }));
  };

  // Adaugă un nou handler pentru evenimentul blur (când utilizatorul iese din câmp)
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Marchează câmpul ca fiind vizitat
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));

    // Validează doar câmpurile care au fost vizitate
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  // Handler pentru checkbox-uri
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const toggleCurs = (cursId: string) => {
    setFormData(prev => {
      const newCursuri = prev.cursuri.includes(cursId)
        ? prev.cursuri.filter(id => id !== cursId)
        : [...prev.cursuri, cursId];

      // Actualizăm erorile dacă este necesar
      let newErrors = { ...errors };
      if (newCursuri.length > 0) {
        delete newErrors.cursuri;
      } else {
        newErrors.cursuri = 'Selectează cel puțin un curs';
      }

      setErrors(newErrors);

      return {
        ...prev,
        cursuri: newCursuri
      };
    });
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
      {/* Header cu logo și titlu */}
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
            <h1 className="text-sm md:text-lg font-normal mb-2 opacity-90 font-mono">
              Formular înscriere TechMinds Academy
            </h1>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Vino în lumea STEM! 🚀
            </h2>
            <p className="text-base md:text-xl opacity-90">
              Descoperă universul fascinant al roboticii și programării
            </p>
          </div>
        </div>
      </div>

      {/* Banner de erori, afișat doar dacă există erori după submit */}
      {showErrorBanner && Object.keys(errors).length > 0 && (
        <div
          ref={firstErrorRef}
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
        >
          <p className="font-bold">Te rugăm să corectezi următoarele erori:</p>
          <ul className="list-disc pl-5 mt-2">
            {Object.entries(errors)
              .filter(([_, message]) => message && message.trim() !== '') // Filtram mesajele goale
              .map(([key, message]) => (
                <li key={key}>{message}</li>
              ))}
          </ul>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
        {/* Secțiunea Date Părinte */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg
                      transform hover:shadow-xl transition-all relative z-[1]">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 flex items-center gap-2">
            <span>👨‍👩‍👧‍👦 Date Părinte/Tutore Legal</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nume</label>
              <input
                id="numeParinte"
                type="text"
                name="numeParinte"
                value={formData.numeParinte}
                onChange={handleInputChange}
                onBlur={handleBlur}

                className={`w-full p-3 border ${errors.numeParinte ? 'border-red-500 bg-red-50' : 'border-purple-200'} rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-purple-500 transition-all`}
                placeholder="Numele părintelui"
              />
              {touchedFields.numeParinte && errors.numeParinte && (
                <p className="text-red-500 text-sm mt-1">{errors.numeParinte}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prenume</label>
              <input
                id="prenumeParinte"
                type="text"
                name="prenumeParinte"
                value={formData.prenumeParinte}
                onChange={handleInputChange}
                onBlur={handleBlur}  // Adăugat
                className={`w-full p-3 border ${touchedFields.prenumeParinte && errors.prenumeParinte ? 'border-red-500 bg-red-50' : 'border-purple-200'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all`}
                placeholder="Prenumele părintelui"
              />
              {touchedFields.prenumeParinte && errors.prenumeParinte && (
                <p className="text-red-500 text-sm mt-1">{errors.prenumeParinte}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CNP</label>
              <input
                id="cnpParinte"
                type="text"
                name="cnpParinte"
                value={formData.cnpParinte}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full p-3 border ${errors.cnpParinte ? 'border-red-500 bg-red-50' : 'border-purple-200'} rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-purple-500 transition-all`}
                placeholder="CNP părinte"
              />
              {touchedFields.cnpParinte && errors.cnpParinte && (
                <p className="text-red-500 text-sm mt-1">{errors.cnpParinte}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresa</label>
              <input
                id="adresa"
                type="text"
                name="adresa"
                value={formData.adresa}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full p-3 border ${errors.adresa ? 'border-red-500 bg-red-50' : 'border-purple-200'} rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-purple-500 transition-all`}
                placeholder="Strada, număr, bloc, scara, apartament"
              />
              {touchedFields.adresa && errors.adresa && (
                <p className="text-red-500 text-sm mt-1">{errors.adresa}</p>
              )}
            </div>

            <LocationSelector
              onJudetChange={(judet) => {
                console.log('Actualizare județ în formular:', judet);
                setFormData(prev => ({ ...prev, judet }));

                // Resetăm eroarea pentru județ dacă există
                if (errors.judet) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.judet;
                    return newErrors;
                  });
                }
              }}
              onLocalitateChange={(localitate) => {
                setFormData(prev => ({ ...prev, localitate }));

                // Resetăm eroarea pentru localitate dacă există
                if (errors.localitate) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.localitate;
                    return newErrors;
                  });
                }
              }}
              selectedJudet={formData.judet}
              selectedLocalitate={formData.localitate}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
              <input
                id="telefon"
                type="tel"
                name="telefon"
                value={formData.telefon}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full p-3 border ${errors.telefon ? 'border-red-500 bg-red-50' : 'border-purple-200'} rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-purple-500 transition-all`}
                placeholder="07xx xxx xxx"
              />
              {touchedFields.telefon && errors.telefon && (
                <p className="text-red-500 text-sm mt-1">{errors.telefon}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full p-3 border ${errors.email ? 'border-red-500 bg-red-50' : 'border-purple-200'} rounded-lg focus:ring-2 focus:ring-purple-500 
                        focus:border-purple-500 transition-all`}
                placeholder="email@exemplu.com"
              />
              {touchedFields.email && errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Secțiunea Date Copil */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg
                      transform hover:shadow-xl transition-all relative z-0">
          <h2 className="text-2xl font-bold mb-4 text-purple-800 flex items-center gap-2">
            <span>👶 Date Copil</span>
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {/* Sub-grid pentru Nume și Prenume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nume Copil</label>
                <input
                  id="numeCopil"
                  type="text"
                  name="numeCopil"
                  value={formData.numeCopil}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border ${errors.numeCopil ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all`}
                  placeholder="Numele copilului"
                />
                {touchedFields.numeCopil && errors.numeCopil && (
                  <p className="text-red-500 text-sm mt-1">{errors.numeCopil}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prenume Copil</label>
                <input
                  id="prenumeCopil"
                  type="text"
                  name="prenumeCopil"
                  value={formData.prenumeCopil}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border ${errors.prenumeCopil ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all`}
                  placeholder="Prenumele copilului"
                />
                {touchedFields.prenumeCopil && errors.prenumeCopil && (
                  <p className="text-red-500 text-sm mt-1">{errors.prenumeCopil}</p>
                )}
              </div>
            </div>

            {/* Sub-grid pentru Data Nașterii și Vârstă */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Nașterii</label>
                <input
                  id="dataNasterii"
                  type="date"
                  name="dataNasterii"
                  value={formData.dataNasterii}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border ${errors.dataNasterii ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all`}
                />
                {touchedFields.dataNasterii && errors.dataNasterii && (
                  <p className="text-red-500 text-sm mt-1">{errors.dataNasterii}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vârsta</label>
                <select
                  id="varstaCopil"
                  name="varstaCopil"
                  value={formData.varstaCopil}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  className={`w-full p-3 border ${errors.varstaCopil ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 
                          focus:border-blue-500 transition-all`}
                >
                  <option value="">Selectează vârsta</option>
                  {[...Array(7)].map((_, i) => (
                    <option key={i + 7} value={i + 7}>{i + 7} ani</option>
                  ))}
                </select>
                {touchedFields.varstaCopil && errors.varstaCopil && (
                  <p className="text-red-500 text-sm mt-1">{errors.varstaCopil}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Școala</label>
              <input
                id="scoala"
                type="text"
                name="scoala"
                value={formData.scoala}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full p-3 border ${errors.scoala ? 'border-red-500 bg-red-50' : 'border-blue-200'} rounded-lg focus:ring-2 focus:ring-blue-500 
                        focus:border-blue-500 transition-all`}
                placeholder="Numele școlii"
              />
              {touchedFields.scoala && errors.scoala && (
                <p className="text-red-500 text-sm mt-1">{errors.scoala}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Observații</label>
              <textarea
                id="observatiiCopil"
                name="observatiiCopil"
                value={formData.observatiiCopil}
                onChange={handleInputChange}
                className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 
                      focus:border-blue-500 transition-all"
                placeholder="Observații despre copil (opțional)"
                rows={3}
              />
            </div>
          </div>
        </div>

        {/* Secțiunea Cursuri */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg
                        transform hover:shadow-xl transition-all relative z-0">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 flex items-center gap-2">
            <span>📚 Cursuri Disponibile</span>
          </h2>
          <div id="cursuri" className={`${errors.cursuri ? 'p-4 border border-red-300 rounded-xl bg-red-50' : ''}`}>
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
            {errors.cursuri && (
              <p className="text-red-500 text-sm mt-2">{errors.cursuri}</p>
            )}
          </div>
        </div>

        {/* Secțiunea Experiență */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-lg
                transform hover:shadow-xl transition-all relative z-0">
          <h2 className="text-2xl font-bold mb-4 text-green-800 flex items-center gap-2">
            <span>🎯 Nivel Experiență</span>
          </h2>
          <div id="experienta" className={`${errors.experienta ? 'p-4 border border-red-300 rounded-xl bg-red-50' : ''}`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { nivel: 'Începător', perioada: '0-1 ani' },
                { nivel: 'Intermediar', perioada: '1-3 ani' },
                { nivel: 'Avansat', perioada: '3+ ani' }
              ].map((exp) => (
                <button
                  key={exp.nivel}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, experienta: exp.nivel });

                    // Resetăm eroarea pentru experiență
                    if (errors.experienta) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.experienta;
                        return newErrors;
                      });
                    }
                  }}
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
            {errors.experienta && (
              <p className="text-red-500 text-sm mt-2">{errors.experienta}</p>
            )}
          </div>
        </div>

        {/* Secțiunea Notificări */}
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg
                transform hover:shadow-xl transition-all mb-6 relative z-0">
          <h2 className="text-2xl font-bold mb-4 text-yellow-800 flex items-center gap-2">
            <span>🔔 Notificări și Acorduri</span>
          </h2>
          <div className="space-y-4">
            <label className="flex items-center space-x-3 hover:bg-yellow-100 p-2 rounded-lg transition-all">
              <input
                type="checkbox"
                name="notificariEvenimente"
                checked={formData.notificariEvenimente}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
              />
              <span className="text-gray-700">Doresc să primesc notificări despre începerea cursurilor și orar</span>
            </label>

            <label className="flex items-center space-x-3 hover:bg-yellow-100 p-2 rounded-lg transition-all">
              <input
                type="checkbox"
                name="notificariEmail"
                checked={formData.notificariEmail}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
              />
              <span className="text-gray-700">Doresc să primesc pe email feedback si rapoartele de progres ale copilului</span>
            </label>

            <label className="flex items-center space-x-3 hover:bg-yellow-100 p-2 rounded-lg transition-all">
              <input
                type="checkbox"
                name="notificariSMS"
                checked={formData.notificariSMS}
                onChange={handleCheckboxChange}
                className="form-checkbox h-5 w-5 text-yellow-600 rounded border-yellow-300 focus:ring-yellow-500"
              />
              <span className="text-gray-700">Doresc să primesc notificări SMS pentru informații importante și urgente</span>
            </label>
          </div>
        </div>
        {/* Buton Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 
              text-white text-xl font-bold rounded-xl shadow-lg
              transform transition-all
              animate-gradient bg-[length:200%_200%]
              ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:scale-[1.02]'}`}
        >
          {isSubmitting ? 'Se trimite formularul...' : 'Înscrie-te Acum! 🚀'}
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
            className={`transition-all duration-500 ease-in-out overflow-hidden ${showGDPR ? "h-auto opacity-100 py-4" : "h-0 opacity-0 py-0"
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