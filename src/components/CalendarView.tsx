import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  AlertTriangle,
  Clock,
  Building2,
  Tag,
  Layers,
  GraduationCap,
  Eye,
  CheckCircle2,
  Edit3,
  Trash2,
  Info,
  X
} from 'lucide-react';
import { EventItem, EventType, SchoolKey, AcademicOverlayEvent } from '../types';
import { getSchoolConfig, SCHOOL_CONFIGS, getOverlayTypeConfig } from '../data/mockData';

export const CalendarView: React.FC = () => {
  const {
    currentUser,
    events,
    venues,
    academicOverlays,
    overlayTypes,
    setSelectedEvent,
    setIsClashModalOpen,
    setActiveClashPair,
    deleteEvent,
    setIsEditModalOpen,
    setEventToEdit,
    setActiveTab
  } = useApp();

  // Calendar View Mode: month | week | agenda | venue_grid
  const [viewMode, setViewMode] = useState<'month' | 'agenda' | 'venue_grid'>('month');

  // Event Scope: 'all' (All University Events) | 'my' (My Events only)
  const [scopeFilter, setScopeFilter] = useState<'all' | 'my'>('all');

  // Academic Calendar Overlay Toggle (CA-4)
  const [showAcademicOverlay, setShowAcademicOverlay] = useState(true);

  // Overlay Details Modal
  const [selectedOverlayDetails, setSelectedOverlayDetails] = useState<AcademicOverlayEvent | null>(null);

  // Creative Deadlines Overlay Toggle (CA-2)
  const [showCreativeDeadlines, setShowCreativeDeadlines] = useState(true);

  // Filters (CA-5)
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedVenue, setSelectedVenue] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Month reference: October 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(9); // 0-indexed: 9 = October

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const myEventsCount = events.filter(e => e.ownerId === currentUser.id).length;

  // Filter events
  const filteredEvents = events.filter(ev => {
    if (scopeFilter === 'my' && ev.ownerId !== currentUser.id) return false;
    if (selectedSchool !== 'all' && ev.school !== selectedSchool) return false;
    if (selectedType !== 'all' && ev.type !== selectedType) return false;
    if (selectedVenue !== 'all' && ev.venueId !== selectedVenue) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        ev.title.toLowerCase().includes(q) ||
        ev.department.toLowerCase().includes(q) ||
        ev.ownerName.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Event type colors (CA-2)
  const getTypeColor = (type: EventType) => {
    switch (type) {
      case 'conferences':
        return 'bg-indigo-600/30 text-indigo-300 border-indigo-500/40 hover:bg-indigo-600/50';
      case 'cultural':
        return 'bg-purple-600/30 text-purple-300 border-purple-500/40 hover:bg-purple-600/50';
      case 'academic':
        return 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/50';
      case 'admissions':
        return 'bg-sky-600/30 text-sky-300 border-sky-500/40 hover:bg-sky-600/50';
      case 'guest_lecture':
        return 'bg-amber-600/30 text-amber-300 border-amber-500/40 hover:bg-amber-600/50';
      case 'convocation':
        return 'bg-rose-600/30 text-rose-300 border-rose-500/40 hover:bg-rose-600/50';
    }
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Institutional Accessibility Note */}
      <div className="p-3 rounded-xl bg-slate-850/90 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            <strong className="text-white">University Master Calendar</strong> • Accessible to all faculty, academic departments, administration, and campus teams.
          </span>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto text-[11px] font-semibold text-slate-400">
          <span>Logged in as: <strong className="text-white">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})</span>
        </div>
      </div>

      {/* Control Bar: Views, Scope (All vs My Events), Academic Overlay Switch, Search & Filter */}
      <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
        {/* Left: Month Navigator & Views */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-white px-2 tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scope Selector: All University Events vs My Events */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <button
              onClick={() => setScopeFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                scopeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All University Events ({events.length})
            </button>
            <button
              onClick={() => setScopeFilter('my')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                scopeFilter === 'my'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              My Events ({myEventsCount})
            </button>
          </div>

          {/* View mode switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Month View
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                viewMode === 'agenda' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agenda List
            </button>
            <button
              onClick={() => setViewMode('venue_grid')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                viewMode === 'venue_grid' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Venue Grid (LG-1)
            </button>
          </div>
        </div>

        {/* Right: Academic overlay & Filters */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          {/* CA-4 Overlay toggle */}
          <label className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-slate-800 border border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={showAcademicOverlay}
              onChange={e => setShowAcademicOverlay(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-300 font-medium">Academic & Exam Overlay</span>
          </label>

          {/* School Filter (Colour coded) */}
          <select
            value={selectedSchool}
            onChange={e => setSelectedSchool(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
          >
            <option value="all">All Schools (Color Coded)</option>
            <option value="SBL">SBL (School of Business & Law)</option>
            <option value="SOS">SOS (School of Science)</option>
            <option value="SET-CS">SET-CS (Engineering - CS)</option>
            <option value="SET-Core">SET-Core (Engineering - Core)</option>
            <option value="SLSE">SLSE (Liberal Studies & Education)</option>
            <option value="SEDA">SEDA (Architecture & Design)</option>
            <option value="NUV">NUV (University Central)</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="all">All Types</option>
            <option value="conferences">Conferences</option>
            <option value="guest_lecture">Guest Lectures</option>
            <option value="cultural">Cultural</option>
            <option value="admissions">Admissions</option>
            <option value="academic">Academic</option>
          </select>

          {/* Venue Filter */}
          <select
            value={selectedVenue}
            onChange={e => setSelectedVenue(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="all">All Venues</option>
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="px-2.5 py-1.5 pl-7 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs w-36 sm:w-44"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
          </div>
        </div>
      </div>

      {/* School Colour Code Legend & Quick-Filter Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">
              School Colour Code:
            </span>
            <span className="text-[11px] text-slate-400">
              (Events coloured by organizing school)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setSelectedSchool('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedSchool === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Schools
            </button>
            {(Object.keys(SCHOOL_CONFIGS) as SchoolKey[]).map(sKey => {
              const cfg = SCHOOL_CONFIGS[sKey];
              const isSelected = selectedSchool === sKey;
              return (
                <button
                  key={sKey}
                  onClick={() => setSelectedSchool(selectedSchool === sKey ? 'all' : sKey)}
                  title={`${cfg.name}: ${cfg.fullName}`}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    isSelected
                      ? `${cfg.badgeClass} ring-2 ring-white/60 shadow-md scale-105`
                      : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} hover:opacity-100`
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                  <span>{cfg.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Academic Overlays Banner (Priority Coded: High, Medium, Low) */}
      {showAcademicOverlay && academicOverlays.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="font-bold text-white text-xs">
              Academic Calendar Overlays:
            </span>
            <span className="text-[11px] text-slate-400">
              (Priority: <span className="text-rose-300 font-semibold">🔴 High</span> • <span className="text-amber-300 font-semibold">🟡 Medium</span> • <span className="text-blue-300 font-semibold">🔵 Low</span>)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {academicOverlays.map(item => {
              const isHigh = item.priority === 'High';
              const isMedium = item.priority === 'Medium';
              const badgeStyle = isHigh
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30'
                : isMedium
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30';

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedOverlayDetails(item)}
                  className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${badgeStyle}`}
                  title={`[Priority: ${item.priority}] ${item.title} (${item.startDate} to ${item.endDate}) - Click to view constraint advisory`}
                >
                  <span className="text-[9px] uppercase font-bold px-1 rounded bg-black/40">
                    {item.priority}
                  </span>
                  <span className="truncate max-w-[150px] sm:max-w-xs">{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 1. MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="rounded-2xl bg-slate-850 border border-slate-800 p-4 shadow-xl overflow-x-auto">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-2 min-w-[700px] mb-2 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {/* Blank cells for offset */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-28 rounded-xl bg-slate-900/30 border border-slate-800/40 p-1.5 opacity-30" />
            ))}

            {/* Days of current month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              // Events on this day
              const dayEvents = filteredEvents.filter(e => e.startDate === dateStr);

              // Academic overlays on this day
              const activeOverlay = showAcademicOverlay
                ? academicOverlays.find(o => dateStr >= o.startDate && dateStr <= o.endDate)
                : null;

              // Check if day has clashing events
              const hasClash = dayEvents.some(e => e.clashes.some(c => !c.resolved));

              return (
                <div
                  key={day}
                  className={`min-h-[115px] rounded-xl border p-1.5 flex flex-col justify-between transition-all ${
                    hasClash
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : activeOverlay
                      ? 'bg-indigo-950/25 border-indigo-500/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-300">{day}</span>
                    {hasClash && (
                      <span className="text-[10px] text-rose-400 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  {/* Academic overlay indicator tag (Priority coded: High, Medium, Low) */}
                  {activeOverlay && (() => {
                    const typeCfg = getOverlayTypeConfig(activeOverlay.type, overlayTypes);
                    const isHigh = activeOverlay.priority === 'High';
                    const isMedium = activeOverlay.priority === 'Medium';
                    const priorityStyle = isHigh
                      ? 'bg-rose-500/25 text-rose-200 border-rose-500/40 hover:bg-rose-500/35'
                      : isMedium
                      ? 'bg-amber-500/25 text-amber-200 border-amber-500/40 hover:bg-amber-500/35'
                      : 'bg-blue-500/25 text-blue-200 border-blue-500/40 hover:bg-blue-500/35';

                    return (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOverlayDetails(activeOverlay);
                        }}
                        className={`my-1 px-1.5 py-0.5 rounded text-[9px] font-semibold border truncate flex items-center justify-between gap-1 cursor-pointer transition-transform hover:scale-[1.02] ${priorityStyle}`}
                        title={`[Priority: ${activeOverlay.priority}] ${activeOverlay.title} (${typeCfg.name}) - Click for details`}
                      >
                        <span className="truncate flex items-center gap-1">
                          <span>🎓</span>
                          <span>{activeOverlay.title}</span>
                        </span>
                        <span className="text-[7.5px] uppercase font-black px-1 rounded bg-black/40 shrink-0">
                          {activeOverlay.priority}
                        </span>
                      </div>
                    );
                  })()}

                  {/* Events list */}
                  <div className="space-y-1 overflow-y-auto max-h-20 scrollbar-none">
                    {dayEvents.map(ev => {
                      const evClash = ev.clashes.some(c => !c.resolved);
                      const isMyEvent = ev.ownerId === currentUser.id;
                      const schoolCfg = getSchoolConfig(ev.school);

                      return (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`p-1 rounded-md text-[10px] font-semibold border truncate cursor-pointer transition-transform hover:scale-[1.02] ${
                            evClash
                              ? 'bg-rose-500/30 text-rose-200 border-rose-500/50'
                              : isMyEvent
                              ? `ring-1 ring-white/70 ${schoolCfg.bgClass} ${schoolCfg.textClass} ${schoolCfg.borderClass}`
                              : `${schoolCfg.bgClass} ${schoolCfg.textClass} ${schoolCfg.borderClass}`
                          }`}
                          title={`[${schoolCfg.name} • ${ev.type.toUpperCase()}] ${isMyEvent ? '[My Event] ' : ''}${ev.title} (${ev.startTime} - ${ev.endTime} @ ${ev.venueName})`}
                        >
                          <span className={`px-1 py-0.2 rounded text-[8px] font-extrabold mr-1 border ${schoolCfg.badgeClass}`}>
                            {ev.school || 'NUV'}
                          </span>
                          <span className="font-bold mr-1">{ev.startTime}</span>
                          <span>{ev.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. AGENDA LIST VIEW */}
      {viewMode === 'agenda' && (
        <div className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Chronological University Event Agenda
          </h3>

          <div className="divide-y divide-slate-800">
            {filteredEvents.map(ev => {
              const hasClash = ev.clashes.some(c => !c.resolved);
              const schoolCfg = getSchoolConfig(ev.school);

              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 px-3 rounded-xl transition-colors cursor-pointer border-l-4 ${schoolCfg.borderClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-center shrink-0 w-16">
                      <div className="text-[10px] font-bold uppercase text-indigo-400">
                        {new Date(ev.startDate).toLocaleDateString([], { month: 'short' })}
                      </div>
                      <div className="text-lg font-black text-white">
                        {new Date(ev.startDate).getDate()}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* School Badge (Color Coded) */}
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1 ${schoolCfg.badgeClass}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${schoolCfg.dotClass}`} />
                          <span>{schoolCfg.name}</span>
                        </span>
                        {ev.ownerId === currentUser.id && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            📌 My Event
                          </span>
                        )}
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          {ev.type}
                        </span>
                        <span className="text-xs font-bold text-white">
                          {ev.title}
                        </span>
                        {hasClash && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Venue Clash</span>
                          </span>
                        )}
                        {ev.isLate && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            Late (&lt; 7d)
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{ev.startTime} – {ev.endTime}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{ev.venueName}</span>
                        </span>
                        <span>Owner: {ev.ownerName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEventToEdit(ev);
                        setIsEditModalOpen(true);
                      }}
                      title="Edit Event Parameters"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Permanently delete event "${ev.title}"?`)) {
                          deleteEvent(ev.id);
                        }
                      }}
                      title="Delete Event"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setSelectedEvent(ev)}
                      className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 ml-1 cursor-pointer"
                    >
                      Event Hub →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. VENUE-WISE GRID (LG-1) */}
      {viewMode === 'venue_grid' && (
        <div className="rounded-2xl bg-slate-850 border border-slate-800 p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">
              Campus Venue Utilization & Clash Matrix (LG-1)
            </h3>
            <p className="text-xs text-slate-400">
              Visualizes occupancy across university auditoriums, seminar halls, and open pavilions.
            </p>
          </div>

          <div className="space-y-4">
            {venues.map(v => {
              const venueEvents = filteredEvents.filter(e => e.venueId === v.id);

              return (
                <div
                  key={v.id}
                  className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      <span className="text-sm font-bold text-white">{v.name}</span>
                      <span className="text-xs text-slate-400">(Capacity: {v.capacity})</span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                      {venueEvents.length} Booking{venueEvents.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {venueEvents.length === 0 ? (
                    <div className="text-xs text-slate-500 py-1">
                      No active events scheduled in this facility.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {venueEvents.map(ev => {
                        const hasClash = ev.clashes.some(c => !c.resolved);
                        const schoolCfg = getSchoolConfig(ev.school);

                        return (
                          <div
                            key={ev.id}
                            onClick={() => setSelectedEvent(ev)}
                            className={`p-3 rounded-lg border text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                              hasClash
                                ? 'bg-rose-950/30 border-rose-500/50 text-rose-200'
                                : `${schoolCfg.bgClass} ${schoolCfg.borderClass} ${schoolCfg.textClass}`
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span className="truncate">{ev.title}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                <span className={`text-[9px] px-1.5 py-0.2 rounded border ${schoolCfg.badgeClass}`}>
                                  {schoolCfg.name}
                                </span>
                                {hasClash && <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-300 mt-1">
                              {ev.startDate} • {ev.startTime} - {ev.endTime}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {ev.audienceSize} pax • {ev.ownerName}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Academic Overlay Details Modal */}
      {selectedOverlayDetails && (() => {
        const typeCfg = getOverlayTypeConfig(selectedOverlayDetails.type, overlayTypes);
        const isHigh = selectedOverlayDetails.priority === 'High';
        const isMedium = selectedOverlayDetails.priority === 'Medium';
        const priorityBadgeClass = isHigh
          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
          : isMedium
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
          : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

        const priorityDot = isHigh
          ? 'bg-rose-400'
          : isMedium
          ? 'bg-amber-400'
          : 'bg-blue-400';

        const startMs = new Date(selectedOverlayDetails.startDate).getTime();
        const endMs = new Date(selectedOverlayDetails.endDate).getTime();
        const daysCount = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

        return (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      Academic Calendar Overlay Advisory
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Institutional scheduling constraint & advisory
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOverlayDetails(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs">
                <div>
                  <h2 className="text-base font-bold text-white mb-2">
                    {selectedOverlayDetails.title}
                  </h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Priority badge: High, Medium, Low */}
                    <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${priorityBadgeClass}`}>
                      <span className={`w-2 h-2 rounded-full ${priorityDot}`} />
                      <span>Priority: {selectedOverlayDetails.priority || 'High'}</span>
                    </span>

                    {/* Type badge */}
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${typeCfg.badgeClass}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${typeCfg.dotClass}`} />
                      <span>{typeCfg.name}</span>
                    </span>

                    {/* Duration badge */}
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1 border border-slate-700">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{daysCount} {daysCount === 1 ? 'Day' : 'Days'}</span>
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CalendarIcon className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      Effective Dates: <strong className="text-white">{selectedOverlayDetails.startDate}</strong> to <strong className="text-white">{selectedOverlayDetails.endDate}</strong>
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] leading-relaxed pt-1 border-t border-slate-800">
                    <strong className="text-slate-300 block mb-0.5">Constraint Advisory:</strong>
                    {selectedOverlayDetails.description}
                  </div>
                </div>

                {/* Priority Guidance Note */}
                <div className={`p-3 rounded-xl border text-[11px] flex items-start gap-2.5 ${
                  isHigh
                    ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                    : isMedium
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                }`}>
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">
                      {isHigh ? 'High Priority Constraint: ' : isMedium ? 'Medium Priority Advisory: ' : 'Low Priority Information: '}
                    </span>
                    {isHigh
                      ? 'Academic activities take precedence. Faculty scheduling during this window will trigger clash warnings.'
                      : isMedium
                      ? 'Advisory traffic notice. Plan logistics and sound tests carefully around existing schedules.'
                      : 'Informational overlay for campus awareness.'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  {currentUser.role === 'admin' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOverlayDetails(null);
                        setActiveTab('admin');
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Manage Overlays in Admin Settings</span>
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-500">
                      Managed by University Administration
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedOverlayDetails(null)}
                    className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
