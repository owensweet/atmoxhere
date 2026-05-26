"use client";

import { useState, useEffect } from "react";
import { GlobeAltIcon, XMarkIcon } from '@heroicons/react/24/solid';
import '@/styles/globals.css'

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "IN", name: "India", flag: "🇮🇳" },
];


export default function CountrySelectButton({ onCountrySelect }) {
  const [selected, setSelected] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("shipping_country");
      if(saved) {
        setSelected(saved);
        onCountrySelect(saved);
      }
    }
  }, [onCountrySelect]);

  const handleSelect = (code) => {
    setSelected(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem("shipping_country", code);
    }
    console.log("selected country: ", code)
    onCountrySelect(code);
    setOpen(false);
  };

  const selectedCountry = COUNTRIES.find((c) => c.code === selected);

return (
    <>
      {/* Globe/flag button */}
      <div className="absolute top-6 right-4 z-1">
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-full text-white border-2 text-2xl flex items-center justify-center shadow-md z-[2]"
        >
          {selectedCountry ? selectedCountry.flag : <GlobeAltIcon className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Fullscreen modal */}
      {open && (
          <div className="fixed inset-0 z-2000 bg-black bg-opacity-95 backdrop-blur-sm overflow-y-auto">
            <div className="min-h-screen relative flex flex-col items-center py-10 px-4">
              {/* X button */}
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-white hover:text-gray-400"
                aria-label="Close"
              >
                <XMarkIcon className="h-8 w-8" />
              </button>

              <h2 className="text-white text-xl mb-6 mt-8">Select your country</h2>

              <div className="grid grid-cols-3 gap-4 max-w-sm w-full">
                {COUNTRIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className="border-2 text-white bg-black w-full py-1 rounded-lg flex flex-col items-center justify-center gap-0 text-lg hover:bg-gray-500 transition"
                  >
                    <span className="text-2xl text-white">{c.flag}</span>
                    <span className="text-sm text-gray-400 font-extrabold">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

    </>
  );
}
