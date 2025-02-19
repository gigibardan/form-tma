import { useMemo } from 'react';
import { locationData } from '@/lib/data/locations';

interface Localitate {
  nume: string;
  simplu?: string;
}

interface Judet {
  auto?: string;
  nume: string;
  localitati: Localitate[];
}

export const useLocationData = () => {
  // Memo-izăm lista de județe organizată
  const organizedJudete = useMemo(() => {
    // Mai întâi găsim București și Ilfov
    const bucuresti = locationData.judete.find(j => j.nume === "Bucureşti" || j.nume === "București");
    const ilfov = locationData.judete.find(j => j.nume === "Ilfov");
    
    // Restul județelor, filtrate și sortate alfabetic
    const restJudete = locationData.judete
      .filter(j => j.nume !== "Bucureşti" && j.nume !== "București" && j.nume !== "Ilfov")
      .sort((a, b) => a.nume.localeCompare(b.nume));

    // Combinăm în ordinea dorită
    // București primul, apoi Ilfov, apoi restul
    const organized = [
      bucuresti,
      ilfov,
      ...restJudete
    ].filter(Boolean); // Eliminăm valorile undefined

    return organized;
  }, []);

  // Funcție helper pentru normalizarea textului (eliminare diacritice)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '');
  };

  // Funcție pentru căutare cu sau fără diacritice
  const searchLocation = (text: string, locations: Localitate[]) => {
    const searchText = normalizeText(text);
    return locations.filter(loc => 
      normalizeText(loc.nume).includes(searchText) ||
      (loc.simplu && normalizeText(loc.simplu).includes(searchText))
    );
  };

  return {
    organizedJudete,
    searchLocation,
    normalizeText
  };
};

export default useLocationData;