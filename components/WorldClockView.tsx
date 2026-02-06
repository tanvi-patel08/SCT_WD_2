import React, { useState, useEffect, useMemo } from 'react';

interface CityTime {
  id: string;
  city: string;
  region: string;
  timeZone: string;
}

const ALL_CITIES: CityTime[] = [
  { id: 'nyc', city: 'New York', region: 'USA', timeZone: 'America/New_York' },
  { id: 'lon', city: 'London', region: 'UK', timeZone: 'Europe/London' },
  { id: 'par', city: 'Paris', region: 'France', timeZone: 'Europe/Paris' },
  { id: 'tok', city: 'Tokyo', region: 'Japan', timeZone: 'Asia/Tokyo' },
  { id: 'syd', city: 'Sydney', region: 'Australia', timeZone: 'Australia/Sydney' },
  { id: 'la', city: 'Los Angeles', region: 'USA', timeZone: 'America/Los_Angeles' },
  { id: 'chi', city: 'Chicago', region: 'USA', timeZone: 'America/Chicago' },
  { id: 'tor', city: 'Toronto', region: 'Canada', timeZone: 'America/Toronto' },
  { id: 'van', city: 'Vancouver', region: 'Canada', timeZone: 'America/Vancouver' },
  { id: 'rio', city: 'Rio de Janeiro', region: 'Brazil', timeZone: 'America/Sao_Paulo' },
  { id: 'ber', city: 'Berlin', region: 'Germany', timeZone: 'Europe/Berlin' },
  { id: 'rom', city: 'Rome', region: 'Italy', timeZone: 'Europe/Rome' },
  { id: 'mad', city: 'Madrid', region: 'Spain', timeZone: 'Europe/Madrid' },
  { id: 'mos', city: 'Moscow', region: 'Russia', timeZone: 'Europe/Moscow' },
  { id: 'dub', city: 'Dubai', region: 'UAE', timeZone: 'Asia/Dubai' },
  { id: 'mum', city: 'Mumbai', region: 'India', timeZone: 'Asia/Kolkata' },
  { id: 'ban', city: 'Bangkok', region: 'Thailand', timeZone: 'Asia/Bangkok' },
  { id: 'sg', city: 'Singapore', region: 'Singapore', timeZone: 'Asia/Singapore' },
  { id: 'hk', city: 'Hong Kong', region: 'China', timeZone: 'Asia/Hong_Kong' },
  { id: 'sel', city: 'Seoul', region: 'South Korea', timeZone: 'Asia/Seoul' },
  { id: 'auc', city: 'Auckland', region: 'New Zealand', timeZone: 'Pacific/Auckland' },
];

const INITIAL_CITIES = ['nyc', 'lon', 'par', 'tok', 'syd'];

const WorldClockView: React.FC = () => {
  const [cities, setCities] = useState<CityTime[]>(() => 
    ALL_CITIES.filter(c => INITIAL_CITIES.includes(c.id))
  );
  const [now, setNow] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addCity = (cityId: string) => {
    const cityToAdd = ALL_CITIES.find(c => c.id === cityId);
    if (cityToAdd && !cities.find(c => c.id === cityId)) {
        setCities([...cities, cityToAdd]);
    }
    setShowAddModal(false);
    setSearchQuery("");
  };
  
  const removeCity = (cityId: string) => {
      setCities(cities.filter(c => c.id !== cityId));
  }

  // Filter cities for the modal (exclude already added ones)
  const availableCities = useMemo(() => {
      return ALL_CITIES.filter(
          c => !cities.find(existing => existing.id === c.id) && 
          (c.city.toLowerCase().includes(searchQuery.toLowerCase()) || c.region.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [cities, searchQuery]);

  // Helper to format time for a specific timezone
  const getTime = (timeZone: string) => {
    try {
      return now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone,
      });
    } catch (e) {
      return "--:--";
    }
  };

  // Helper to get date info
  const getDateInfo = (timeZone: string) => {
     try {
       const cityDate = now.toLocaleDateString('en-US', { 
         timeZone, 
         weekday: 'short', 
         day: 'numeric', 
         month: 'short' 
       });
       return cityDate;
     } catch (e) {
       return "";
     }
  };

  return (
    <div className="flex-1 w-full max-w-4xl flex flex-col items-center pt-8 pb-24 px-4 animate-slide-in-up relative">
       <h2 className="text-sm font-medium text-indigo-200/50 uppercase tracking-[0.3em] mb-8">World Clock</h2>
       
       <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto custom-scrollbar pb-4 max-h-[60vh]">
          {cities.map((item) => {
             const timeString = getTime(item.timeZone);
             const [time, period] = timeString.split(' ');

             return (
               <div key={item.id} className="group relative flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-indigo-200/60 font-bold tracking-widest uppercase mb-1">{item.region}</span>
                     <span className="text-2xl font-light text-white tracking-tight">{item.city}</span>
                     <span className="text-xs text-white/30 mt-1 font-medium">{getDateInfo(item.timeZone)}</span>
                  </div>
                  
                  <div className="flex flex-col items-end">
                     <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-light text-white tracking-tighter">
                           {time}
                        </span>
                        <span className="text-sm font-medium text-indigo-300/80">
                           {period}
                        </span>
                     </div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/0 group-hover:ring-white/10 transition-all duration-500"></div>
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500 -z-10"></div>
                  
                  {/* Delete Button */}
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeCity(item.id); }}
                    className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 hover:scale-110 transition-all shadow-lg"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
               </div>
             );
          })}
          
          {/* Add City Button */}
          <button 
             onClick={() => setShowAddModal(true)}
             className="group flex items-center justify-center p-6 rounded-3xl border border-dashed border-white/10 text-white/20 hover:text-white/60 hover:border-white/30 hover:bg-white/5 transition-all min-h-[120px]"
          >
             <div className="flex flex-col items-center gap-3 transition-transform group-hover:scale-105">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold">Add City</span>
             </div>
          </button>
       </div>

       {/* Add City Modal */}
       {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-white/10 rounded-3xl p-6 shadow-2xl animate-slide-in-up flex flex-col max-h-[70vh]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-white">Select City</h3>
                <button onClick={() => setShowAddModal(false)} className="text-white/50 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-4">
                <input 
                    type="text" 
                    placeholder="Search city..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    autoFocus
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            {/* City List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mr-2 pr-2">
                {availableCities.length > 0 ? (
                    <div className="flex flex-col gap-2">
                        {availableCities.map(city => (
                            <button 
                                key={city.id}
                                onClick={() => addCity(city.id)}
                                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:pl-5 transition-all group text-left"
                            >
                                <div>
                                    <div className="text-white font-medium">{city.city}</div>
                                    <div className="text-xs text-white/40">{city.region}</div>
                                </div>
                                <div className="text-xs text-indigo-300 opacity-0 group-hover:opacity-100 transition-opacity">Add</div>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-white/30">
                        <p>No cities found</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorldClockView;