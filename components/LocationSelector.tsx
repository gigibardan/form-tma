import { useLocationData } from '@/hooks/useLocationData';
import { ChevronDownIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Interfețe aliniate cu datele reale
interface Localitate {
  nume: string;
  simplu?: string;
  comuna?: string;
}

interface Judet {
  auto: string;
  nume: string;
  localitati: Localitate[];
}

interface LocationSelectorProps {
  onJudetChange: (judet: string) => void;
  onLocalitateChange: (localitate: string) => void;
  selectedJudet?: string;
  selectedLocalitate?: string;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  onJudetChange,
  onLocalitateChange,
  selectedJudet = '',
  selectedLocalitate = ''
}) => {
  const { organizedJudete } = useLocationData();
  const containerRef = useRef<HTMLDivElement>(null);

  const [judetInput, setJudetInput] = useState(selectedJudet);
  const [localitateInput, setLocalitateInput] = useState(selectedLocalitate);
  const [isJudetOpen, setIsJudetOpen] = useState(false);
  const [isLocalitateOpen, setIsLocalitateOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsJudetOpen(false);
        setIsLocalitateOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filtrare județe cu type guard actualizat
  const filteredJudete = organizedJudete.filter((judet): judet is NonNullable<typeof judet> => {
    return judet !== undefined && judet.nume.toLowerCase().includes(judetInput.toLowerCase());
  });

  // Obține localitățile pentru județul selectat
  const getCurrentLocalitati = (): Localitate[] => {
    if (!selectedJudet) return [];
    const judet = organizedJudete.find(j => j && j.nume === selectedJudet);
    return judet?.localitati || [];
  };

  // Filtrare localități
  const filteredLocalitati = getCurrentLocalitati().filter(localitate =>
    localitate.nume.toLowerCase().includes(localitateInput.toLowerCase())
  );

  // Handlers
  const handleJudetSelect = (judetNume: string) => {

    console.log('Județ selectat:', judetNume);

    setJudetInput(judetNume);
    onJudetChange(judetNume);
    setIsJudetOpen(false);
    setLocalitateInput('');
    onLocalitateChange('');
    console.log('Selected Județ după actualizare:', selectedJudet);

  };

  const handleLocalitateSelect = (localitateNume: string) => {
    setLocalitateInput(localitateNume);
    onLocalitateChange(localitateNume);
    setIsLocalitateOpen(false);
  };

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dropdown Județ */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {selectedJudet === "București" ? "Oraș" : "Județ"}
        </label>
        <div className="relative">
        <input
  type="text"
  value={judetInput}
  onChange={(e) => {
    setJudetInput(e.target.value);
    setIsJudetOpen(true);
  }}
  onFocus={() => setIsJudetOpen(true)}
  placeholder="Selectează județul"
  className="w-full p-3 pr-10 border border-purple-200 rounded-lg 
    focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
    transition-all hover:border-purple-300"
/>
          <ChevronDownIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        {isJudetOpen && filteredJudete.length === 0 && (
  <div className="absolute z-10 w-full mt-1 bg-white border border-purple-200 
    rounded-lg shadow-lg p-3 text-gray-500 text-center">
    Nu s-au găsit rezultate
  </div>
)}
        {isJudetOpen && filteredJudete.length > 0 && (
  <div className="absolute z-[100] w-full mt-1 bg-white border border-purple-200 
    rounded-lg shadow-lg max-h-60 overflow-y-auto divide-y divide-purple-100">
   {filteredJudete.map((judet, index) => (
  <div
    key={`${judet.auto}-${index}`}
    onClick={() => handleJudetSelect(judet.nume)}
    className={`p-3 hover:bg-purple-50 cursor-pointer transition-all
      ${(judet.nume === "București" || judet.nume === "Bucureşti" || judet.nume === "Ilfov")
        ? 'bg-purple-50 font-medium' 
        : ''}`}
  >
    {(judet.nume === "București" || judet.nume === "Bucureşti") && "🏛️ "}
    {judet.nume === "Ilfov" && "🏘️ "}
    {judet.nume}
  </div>
))}
  </div>
)}

      </div>

      {/* Dropdown Localitate/Sector */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {selectedJudet === "București" ? "Sector" : "Localitate"}
        </label>
        <div className="relative">
          <input
            type="text"
            value={localitateInput}
            onChange={(e) => {
              setLocalitateInput(e.target.value);
              setIsLocalitateOpen(true);
            }}
            onFocus={() => setIsLocalitateOpen(true)}
            placeholder={selectedJudet === "București"
              ? "Selectează sectorul"
              : "Selectează localitatea"}
            disabled={!selectedJudet}
            className="w-full p-3 pr-10 border border-purple-200 rounded-lg 
              focus:ring-2 focus:ring-purple-500 focus:border-purple-500 
              transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <ChevronDownIcon
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>
        {isLocalitateOpen && filteredLocalitati.length > 0 && (
  <div className="absolute z-10 w-full mt-1 bg-white border border-purple-200 
    rounded-lg shadow-lg max-h-60 overflow-y-auto">
    {filteredLocalitati.map((localitate, index) => (
      <div
        key={`${selectedJudet}-${localitate.nume}-${index}`}
        onClick={() => handleLocalitateSelect(localitate.nume)}
        className="p-3 hover:bg-purple-50 cursor-pointer transition-all
          flex items-center space-x-2"
      >
        <span>
          {selectedJudet === "București" && "🏢"}
          {selectedJudet !== "București" && "📍"}
        </span>
        <span>{localitate.nume}</span>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
};

export default LocationSelector;