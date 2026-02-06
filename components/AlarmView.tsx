import React, { useState, useEffect } from 'react';

interface Alarm {
  id: number;
  time: string; // "HH:MM" 24h format
  label: string;
  isActive: boolean;
}

const AlarmView: React.FC = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { id: 1, time: "07:00", label: "Morning Rise", isActive: true },
    { id: 2, time: "20:30", label: "Evening Read", isActive: false },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Custom Time Picker State
  const [inputHour, setInputHour] = useState("12");
  const [inputMinute, setInputMinute] = useState("00");
  const [inputPeriod, setInputPeriod] = useState<"AM" | "PM">("AM");
  
  const [newLabel, setNewLabel] = useState("");
  const [now, setNow] = useState(new Date());

  // Update current time for clock display
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleAlarm = (id: number) => {
    setAlarms(alarms.map(alarm => 
      alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
    ));
  };

  const deleteAlarm = (id: number) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  const addAlarm = () => {
    // Convert 12h input to 24h storage
    let h = parseInt(inputHour, 10);
    const m = parseInt(inputMinute, 10);
    
    // Safety check
    if (isNaN(h)) h = 12;
    if (isNaN(m)) {
        // Handle invalid minute input
    }
    const minutes = isNaN(m) ? 0 : m;

    if (inputPeriod === "PM" && h !== 12) h += 12;
    if (inputPeriod === "AM" && h === 12) h = 0;

    const timeString = `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const newAlarm: Alarm = {
      id: Date.now(),
      time: timeString,
      label: newLabel || "Alarm",
      isActive: true
    };
    setAlarms([...alarms, newAlarm]);
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setInputHour("12");
    setInputMinute("00");
    setInputPeriod("AM");
    setNewLabel("");
  };

  // Helper to format 24h string to 12h object
  const formatTo12h = (time24: string) => {
    const [hStr, mStr] = time24.split(':');
    let h = parseInt(hStr, 10);
    const m = mStr;
    const p = h >= 12 ? 'PM' : 'AM';
    
    if (h > 12) h -= 12;
    if (h === 0) h = 12;

    return { time: `${h}:${m}`, period: p };
  };

  // Validation helpers for inputs
  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    setInputHour(val);
  };

  const handleHourBlur = () => {
    let val = parseInt(inputHour);
    if (isNaN(val) || val < 1) val = 12;
    if (val > 12) val = 12;
    setInputHour(val.toString().padStart(2, '0'));
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    setInputMinute(val);
  };

   const handleMinuteBlur = () => {
    let val = parseInt(inputMinute);
    if (isNaN(val) || val < 0) val = 0;
    if (val > 59) val = 59;
    setInputMinute(val.toString().padStart(2, '0'));
  };

  return (
    <div className="flex-1 w-full max-w-md flex flex-col items-center justify-start pt-4 pb-20 px-4 animate-slide-in-up relative">
      
      {/* Header Clock */}
      <div className="mb-8 text-center flex flex-col items-center">
        <div className="flex items-baseline gap-2 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            <h2 className="text-6xl font-light tracking-tighter">
            {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).replace(/\s[AP]M/, '')}
            </h2>
            <span className="text-xl font-normal text-indigo-200/80">
                {now.toLocaleTimeString([], { hour12: true }).slice(-2)}
            </span>
        </div>
        <p className="text-indigo-200/60 uppercase tracking-[0.3em] text-xs mt-2">Current Time</p>
      </div>

      {/* Alarm List */}
      <div className="w-full flex flex-col gap-4 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {alarms.map((alarm) => {
          const { time, period } = formatTo12h(alarm.time);
          
          return (
            <div 
                key={alarm.id} 
                className={`group relative flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 ${
                alarm.isActive 
                    ? 'bg-white/10 border-white/20 shadow-lg shadow-indigo-500/10' 
                    : 'bg-white/5 border-white/5 opacity-70 hover:opacity-100'
                }`}
            >
                {/* Alarm Details */}
                <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                    <span className={`text-3xl font-light tracking-tight ${alarm.isActive ? 'text-white' : 'text-white/50'}`}>
                        {time}
                    </span>
                    <span className={`text-sm font-medium ${alarm.isActive ? 'text-indigo-200' : 'text-white/30'}`}>
                        {period}
                    </span>
                </div>
                <span className="text-xs text-indigo-200/50 uppercase tracking-wider font-medium mt-1">
                    {alarm.label}
                </span>
                </div>

                {/* Toggle Switch */}
                <button 
                onClick={() => toggleAlarm(alarm.id)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center p-1 ${
                    alarm.isActive ? 'bg-gradient-to-r from-pink-500 to-indigo-500' : 'bg-slate-700/50'
                }`}
                >
                <div 
                    className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    alarm.isActive ? 'translate-x-6' : 'translate-x-0'
                    }`}
                />
                </button>
                
                {/* Delete Button (Hover) */}
                <button 
                    onClick={(e) => { e.stopPropagation(); deleteAlarm(alarm.id); }}
                    className="absolute -right-2 -top-2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                </button>
            </div>
          );
        })}
        
        {/* Empty State */}
        {alarms.length === 0 && (
            <div className="text-center py-10 opacity-30">
                <p>No alarms set</p>
            </div>
        )}
      </div>

      {/* Add Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="mt-6 w-full py-4 rounded-2xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/50 hover:bg-white/5 transition-all flex items-center justify-center gap-2 group"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </div>
        <span className="uppercase tracking-widest text-xs font-semibold">Add Alarm</span>
      </button>

      {/* Add Alarm Modal */}
      {showAddModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative w-full max-w-sm bg-[#1e1b4b] border border-white/10 rounded-3xl p-6 shadow-2xl animate-slide-in-up">
            <h3 className="text-xl font-semibold text-white mb-6">New Alarm</h3>
            
            <div className="space-y-6">
              
              {/* Custom Time Picker */}
              <div>
                 <label className="text-xs uppercase text-indigo-200/50 tracking-wider mb-2 block">Set Time</label>
                 <div className="flex items-center gap-2 justify-center bg-white/5 rounded-xl p-4 border border-white/10">
                    {/* Hour */}
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={inputHour}
                        onChange={handleHourChange}
                        onBlur={handleHourBlur}
                        className="w-16 bg-transparent text-center text-4xl font-light text-white focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors placeholder-white/20"
                        placeholder="12"
                    />
                    <span className="text-4xl font-light text-white/40 -mt-1">:</span>
                    {/* Minute */}
                    <input 
                        type="text" 
                        inputMode="numeric"
                        value={inputMinute}
                        onChange={handleMinuteChange}
                        onBlur={handleMinuteBlur}
                        className="w-16 bg-transparent text-center text-4xl font-light text-white focus:outline-none border-b border-transparent focus:border-indigo-500 transition-colors placeholder-white/20"
                        placeholder="00"
                    />
                    
                    {/* AM/PM Toggle */}
                    <div className="flex flex-col ml-4 gap-1 bg-black/20 p-1 rounded-lg">
                        <button 
                            onClick={() => setInputPeriod("AM")}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${inputPeriod === "AM" ? 'bg-indigo-500 text-white shadow' : 'text-white/30 hover:text-white/60'}`}
                        >
                            AM
                        </button>
                        <button 
                            onClick={() => setInputPeriod("PM")}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${inputPeriod === "PM" ? 'bg-indigo-500 text-white shadow' : 'text-white/30 hover:text-white/60'}`}
                        >
                            PM
                        </button>
                    </div>
                 </div>
              </div>
              
              {/* Label Input */}
              <div>
                <label className="text-xs uppercase text-indigo-200/50 tracking-wider mb-2 block">Label</label>
                <input 
                  type="text" 
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Wake Up"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder-white/20"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={addAlarm}
                className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AlarmView;