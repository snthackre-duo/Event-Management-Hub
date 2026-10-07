import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Building2,
  Users,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  CheckSquare,
  Palette,
  UserCheck,
  Plus,
  Trash2,
  Copy,
  Info
} from 'lucide-react';
import { EventType, CreativeTypeKey, Guest, CreativeItem, SchoolKey } from '../types';
import { CREATIVE_SPECS, LOGISTICS_TEMPLATES, SCHOOL_CONFIGS, getSchoolConfig } from '../data/mockData';

export const CreateEventModal: React.FC = () => {
  const {
    isCreateModalOpen,
    setIsCreateModalOpen,
    currentUser,
    venues,
    createEvent,
    checkEventClashes,
    events,
    cloneEvent
  } = useApp();

  if (!isCreateModalOpen) return null;

  // Active form tab
  const [formStep, setFormStep] = useState<'basics' | 'guests' | 'creatives' | 'logistics'>('basics');

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('conferences');
  const [school, setSchool] = useState<SchoolKey>(currentUser.school || 'SET-CS');
  const [objective, setObjective] = useState('');
  const [department, setDepartment] = useState(currentUser.department);
  
  // Default to 10 days in future to show standard flow, with easy date picking
  const defaultFutureDate = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(defaultFutureDate);
  const [endDate, setEndDate] = useState(defaultFutureDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');
  const [venueId, setVenueId] = useState(venues[0]?.id || '');
  const [audienceSize, setAudienceSize] = useState<number>(200);
  const [expectedAudienceDesc, setExpectedAudienceDesc] = useState('University students, external delegates, research scholars, and faculty');

  // Guests list
  const [guests, setGuests] = useState<Omit<Guest, 'id' | 'eventId'>[]>([]);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestDesignation, setNewGuestDesignation] = useState('');
  const [newGuestOrg, setNewGuestOrg] = useState('');
  const [newGuestBio, setNewGuestBio] = useState('');
  const [newGuestSocial, setNewGuestSocial] = useState('');
  const [newGuestConsent, setNewGuestConsent] = useState(true);
  const [isInternalOnly, setIsInternalOnly] = useState(false);

  // Creative requests selection (14 types)
  const [selectedCreatives, setSelectedCreatives] = useState<{
    typeKey: CreativeTypeKey;
    label: string;
    specs: string;
    quantity: number;
    neededByDate: string;
  }[]>([
    {
      typeKey: 'poster',
      label: 'Event Poster',
      specs: 'A3 & A2 Vertical, 300 DPI CMYK High-Res',
      quantity: 30,
      neededByDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]
    },
    {
      typeKey: 'invitation',
      label: 'Invitation (Digital & Print)',
      specs: '1080x1920px Digital + A5 300DPI Print with QR',
      quantity: 1,
      neededByDate: new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0]
    }
  ]);

  // Clone from existing
  const [selectedCloneId, setSelectedCloneId] = useState('');

  // 7-day lead-time rule check (EV-2)
  const now = new Date();
  const selectedEventDate = new Date(startDate);
  const daysDiff = Math.ceil((selectedEventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isLate = daysDiff < 7;

  // Real-time Clash Check (CA-3)
  const { clashingEvents, academicOverlay } = checkEventClashes({
    startDate,
    startTime,
    endTime,
    venueId
  });

  const handleAddGuest = () => {
    if (!newGuestName.trim()) return;
    setGuests(prev => [
      ...prev,
      {
        name: newGuestName,
        designation: newGuestDesignation,
        organisation: newGuestOrg,
        shortBio: newGuestBio,
        socialHandle: newGuestSocial,
        consentObtained: newGuestConsent,
        consentBy: currentUser.name,
        consentDate: new Date().toISOString(),
        photos: [],
        ownerApprovedPhotoAndBio: false
      }
    ]);
    // Reset guest inputs
    setNewGuestName('');
    setNewGuestDesignation('');
    setNewGuestOrg('');
    setNewGuestBio('');
    setNewGuestSocial('');
  };

  const handleRemoveGuest = (index: number) => {
    setGuests(prev => prev.filter((_, i) => i !== index));
  };

  const toggleCreative = (spec: typeof CREATIVE_SPECS[0]) => {
    const exists = selectedCreatives.find(c => c.typeKey === spec.key);
    if (exists) {
      setSelectedCreatives(prev => prev.filter(c => c.typeKey !== spec.key));
    } else {
      setSelectedCreatives(prev => [
        ...prev,
        {
          typeKey: spec.key,
          label: spec.label,
          specs: spec.defaultSpecs,
          quantity: spec.key === 'poster' ? 25 : spec.key === 'id_badge' ? audienceSize : 1,
          neededByDate: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0]
        }
      ]);
    }
  };

  const updateCreativeQuantity = (key: CreativeTypeKey, qty: number) => {
    setSelectedCreatives(prev =>
      prev.map(c => (c.typeKey === key ? { ...c, quantity: Math.max(1, qty) } : c))
    );
  };

  const updateCreativeNeededDate = (key: CreativeTypeKey, date: string) => {
    setSelectedCreatives(prev =>
      prev.map(c => (c.typeKey === key ? { ...c, neededByDate: date } : c))
    );
  };

  const handleCloneSelect = (eventId: string) => {
    const source = events.find(e => e.id === eventId);
    if (!source) return;
    setTitle(`${source.title} (Clone)`);
    setType(source.type);
    setSchool(source.school || 'NUV');
    setObjective(source.objective);
    setDepartment(source.department);
    setAudienceSize(source.audienceSize);
    setExpectedAudienceDesc(source.expectedAudienceDesc);
    setVenueId(source.venueId);
    setSelectedCloneId(eventId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    // Build creatives list
    const creativesToCreate = selectedCreatives.map(c => ({
      typeKey: c.typeKey,
      label: c.label,
      specs: c.specs,
      quantity: c.quantity,
      neededByDate: c.neededByDate
    })) as Partial<CreativeItem>[];

    // Submit via AppContext (EV-3: Directly live on calendar, admin notified)
    createEvent({
      title,
      type,
      school,
      objective,
      department,
      startDate,
      endDate: endDate || startDate,
      startTime,
      endTime,
      venueId,
      audienceSize: Number(audienceSize),
      expectedAudienceDesc,
      isInternalOnly,
      guestDetailsSkipped: isInternalOnly,
      guests: isInternalOnly ? [] : (guests as any),
      creatives: creativesToCreate as any
    });

    setIsCreateModalOpen(false);
  };

  const selectedVenue = venues.find(v => v.id === venueId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Schedule University Event
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  EV-3 Direct Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct entry with automated clash detection & creative workflow routing
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead-time Notice & Clash Warnings Bar */}
        <div className="px-6 pt-4 space-y-2">
          {/* EV-2: 7-day rule banner */}
          {isLate ? (
            <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-300">
                  ⚠️ 7-Day Lead-Time Notice (Late Submission):{' '}
                </span>
                Event date is in {daysDiff} days. The event will be saved and marked{' '}
                <strong className="underline">Late</strong>. Creative requests will arrive as{' '}
                <em>"Awaiting Acceptance"</em> for the Creative Lead to accept or decline based on live workload (CR-9).
              </div>
            </div>
          ) : (
            <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Standard lead-time met ({daysDiff} days advance notice). Creatives will route directly into the design queue.
              </span>
            </div>
          )}

          {/* CA-3: Real-time Venue Clash Banner */}
          {clashingEvents.length > 0 && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-rose-300">
                  🚨 Venue Clash Warning (CA-3):{' '}
                </span>
                Overlaps with <strong>"{clashingEvents[0].title}"</strong> on {selectedVenue?.name} ({startTime} - {endTime}).
                You may still submit: both owners & admin will be notified to coordinate and resolve the clash.
              </div>
            </div>
          )}

          {/* CA-4: Academic Calendar Overlay Warning (Priority Coded: High, Medium, Low) */}
          {academicOverlay && (
            <div className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 ${
              academicOverlay.priority === 'High'
                ? 'bg-rose-950/50 border-rose-500/50 text-rose-200'
                : academicOverlay.priority === 'Medium'
                ? 'bg-amber-950/50 border-amber-500/50 text-amber-200'
                : 'bg-blue-950/50 border-blue-500/50 text-blue-200'
            }`}>
              <Info className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <span>
                  Academic Calendar Advisory: Date falls during{' '}
                  <strong>{academicOverlay.title}</strong> •{' '}
                  <span className={`px-1.5 py-0.2 rounded text-[10px] font-extrabold uppercase border ${
                    academicOverlay.priority === 'High'
                      ? 'bg-rose-500/30 text-rose-200 border-rose-500/50'
                      : academicOverlay.priority === 'Medium'
                      ? 'bg-amber-500/30 text-amber-200 border-amber-500/50'
                      : 'bg-blue-500/30 text-blue-200 border-blue-500/50'
                  }`}>
                    Priority: {academicOverlay.priority || 'High'}
                  </span>
                  . {academicOverlay.description}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Steps Tab Navigation */}
        <div className="flex border-b border-slate-800 px-6 mt-3">
          {[
            { id: 'basics', label: '1. Event Details', icon: Calendar },
            { id: 'guests', label: `2. Guest Profiles (${guests.length})`, icon: UserCheck },
            { id: 'creatives', label: `3. Creatives Needed (${selectedCreatives.length})`, icon: Palette },
            { id: 'logistics', label: '4. Logistics Checklist', icon: CheckSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFormStep(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-semibold transition-colors cursor-pointer ${
                formStep === tab.id
                  ? 'border-indigo-500 text-white bg-slate-800/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* STEP 1: BASICS */}
          {formStep === 'basics' && (
            <div className="space-y-4">
              {/* Clone Past Event Option (EV-4) */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    Clone from an existing event template?
                  </span>
                </div>
                <select
                  value={selectedCloneId}
                  onChange={e => handleCloneSelect(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                >
                  <option value="">-- Choose Template to Copy --</option>
                  {events.map(ev => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. National Symposium on Sustainable Robotics"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Type (Q1) *
                  </label>
                  <select
                    value={type}
                    onChange={e => setType(e.target.value as EventType)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    <option value="academic">Academic & Departmental</option>
                    <option value="admissions">Admissions & Outreach</option>
                    <option value="cultural">Cultural & Student Club</option>
                    <option value="conferences">Conferences & Seminars</option>
                    <option value="guest_lecture">Guest Lectures</option>
                    <option value="convocation">Convocation & Ceremonies</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Organizing Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Venue *
                  </label>
                  <select
                    value={venueId}
                    onChange={e => setVenueId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  >
                    {venues.map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} (Cap: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* School Assignment with Live Colour-Coded Preview */}
              <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Host School / Faculty Affiliation *
                  </label>
                  {(() => {
                    const cfg = getSchoolConfig(school);
                    return (
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${cfg.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                        <span>{cfg.name} • {cfg.fullName}</span>
                      </span>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-1.5">
                  {(Object.keys(SCHOOL_CONFIGS) as SchoolKey[]).map(sKey => {
                    const cfg = SCHOOL_CONFIGS[sKey];
                    const isSelected = school === sKey;
                    return (
                      <button
                        type="button"
                        key={sKey}
                        onClick={() => {
                          setSchool(sKey);
                          if (cfg.fullName && sKey !== 'NUV') {
                            setDepartment(cfg.fullName);
                          }
                        }}
                        title={cfg.fullName}
                        className={`flex items-center justify-center gap-1.5 p-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          isSelected
                            ? `${cfg.badgeClass} ring-2 ring-white/60 shadow-md scale-102`
                            : `${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} opacity-75 hover:opacity-100`
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
                        <span>{cfg.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Date & Time with Clash Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-850 border border-slate-800">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={e => {
                      setStartDate(e.target.value);
                      if (!endDate || endDate < e.target.value) setEndDate(e.target.value);
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Audience Size (Expected)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={audienceSize}
                    onChange={e => setAudienceSize(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Expected Target Audience Description
                  </label>
                  <input
                    type="text"
                    value={expectedAudienceDesc}
                    onChange={e => setExpectedAudienceDesc(e.target.value)}
                    placeholder="e.g. 2nd & 3rd year engineering students and industry mentors"
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Event Objectives & Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={objective}
                  onChange={e => setObjective(e.target.value)}
                  placeholder="Outline key academic/university objectives for this event..."
                  className="w-full px-3.5 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Internal Faculty Managed Skip Checkbox */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 cursor-pointer hover:bg-slate-800 transition-colors">
                <input
                  type="checkbox"
                  checked={isInternalOnly}
                  onChange={e => setIsInternalOnly(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-500 focus:ring-emerald-400 cursor-pointer"
                />
                <div className="text-xs">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span>No external VIP guests invited (Internal Faculty Managed)</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Skip Guest Requirements
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    If this event is conducted internally by faculty with no visiting keynote speakers, you can skip guest profiles and go directly to creative requests.
                  </p>
                </div>
              </label>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setFormStep(isInternalOnly ? 'creatives' : 'guests')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  {isInternalOnly ? 'Skip Guests & Continue to Creatives →' : 'Continue to Guests & Speakers →'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: GUEST PROFILES (GP-1 to GP-6) */}
          {formStep === 'guests' && (
            <div className="space-y-4">
              {/* Skip Option for Internal Faculty Events */}
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span>No external VIP guests?</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                      Internal Faculty Managed
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    If this event is coordinated internally with no outside speakers or dignitaries, you can skip guest profiles and proceed straight to creative needs.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsInternalOnly(true);
                    setGuests([]);
                    setFormStep('creatives');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-sm"
                >
                  Skip Guest Details &amp; Continue →
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300">
                <p className="font-semibold text-white">
                  Guest Profiles &amp; Consent Requirements (GP-1, GP-6)
                </p>
                <p className="text-slate-400 mt-0.5">
                  Faculty enter all guest details on the guest's behalf (no guest login). Photo and bio must be confirmed with consent. Event owner must approve them before creatives use them.
                </p>
              </div>

              {/* Add New Guest Box */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  + Add Distinguished Guest / Speaker
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newGuestName}
                      onChange={e => setNewGuestName(e.target.value)}
                      placeholder="e.g. Dr. Priya Ramachandran"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={newGuestDesignation}
                      onChange={e => setNewGuestDesignation(e.target.value)}
                      placeholder="e.g. Senior Director of Research"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Organization
                    </label>
                    <input
                      type="text"
                      value={newGuestOrg}
                      onChange={e => setNewGuestOrg(e.target.value)}
                      placeholder="e.g. ISRO Satellite Center"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Short Bio (for Posters & Introductions)
                    </label>
                    <textarea
                      rows={2}
                      value={newGuestBio}
                      onChange={e => setNewGuestBio(e.target.value)}
                      placeholder="Concise 2-3 line biographical note..."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-300 font-medium mb-1">
                      Social Handle / Website
                    </label>
                    <input
                      type="text"
                      value={newGuestSocial}
                      onChange={e => setNewGuestSocial(e.target.value)}
                      placeholder="e.g. @priya_isro or linkedin.com/in/priya"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs mb-2"
                    />

                    {/* GP-6: Faculty consent obtained checkbox */}
                    <label className="flex items-start gap-2 p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newGuestConsent}
                        onChange={e => setNewGuestConsent(e.target.checked)}
                        className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-[11px] text-slate-300 leading-tight">
                        <strong>Guest consent obtained (GP-6)</strong>: Stored with {currentUser.name} and current timestamp.
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddGuest}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 ml-auto"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guest to Event</span>
                </button>
              </div>

              {/* Added Guests Roster */}
              {guests.length > 0 ? (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-300">
                    Guests on this Event ({guests.length}):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {guests.map((g, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-start justify-between gap-2"
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{g.name}</div>
                          <div className="text-[11px] text-slate-400">
                            {g.designation} • {g.organisation}
                          </div>
                          <div className="text-[10px] text-emerald-400 mt-1">
                            ✓ Consent confirmed by {g.consentBy}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveGuest(idx)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-slate-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-400 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                  No guests added yet. You can also add guests later from the Event Hub.
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormStep('basics')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  ← Back to Details
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsInternalOnly(true);
                      setGuests([]);
                      setFormStep('creatives');
                    }}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 border border-slate-700 text-xs font-semibold"
                  >
                    Skip (Internal Event)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormStep('creatives')}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                  >
                    Continue to Creative Checklist →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CREATIVES CHECKLIST (CR-1, CR-2) */}
          {formStep === 'creatives' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white">
                    14 Preset Creative Material Types (CR-1)
                  </span>
                  <p className="text-slate-400 mt-0.5">
                    Specs are university standard. Tick needed items, specify quantity and needed-by dates.
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300">
                  {selectedCreatives.length} selected
                </span>
              </div>

              {/* 14 Creative Types Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto p-1">
                {CREATIVE_SPECS.map(spec => {
                  const selected = selectedCreatives.find(c => c.typeKey === spec.key);
                  return (
                    <div
                      key={spec.key}
                      className={`p-3 rounded-xl border transition-all ${
                        selected
                          ? 'bg-indigo-950/40 border-indigo-500/60 ring-1 ring-indigo-500/30'
                          : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <label className="flex items-start gap-2.5 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={() => toggleCreative(spec)}
                            className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <span className="text-xs font-bold text-white block">
                              {spec.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">
                              {spec.defaultSpecs}
                            </span>
                          </div>
                        </label>
                        <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                          {spec.category}
                        </span>
                      </div>

                      {/* Quantity & Needed Date if selected */}
                      {selected && (
                        <div className="mt-2.5 pt-2.5 border-t border-slate-700/50 flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-400">Qty:</span>
                            <input
                              type="number"
                              min="1"
                              value={selected.quantity}
                              onChange={e => updateCreativeQuantity(spec.key, Number(e.target.value))}
                              className="w-16 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-xs text-center"
                            />
                          </div>

                          <div className="flex items-center gap-1.5 ml-auto">
                            <span className="text-[11px] text-slate-400">Needed by:</span>
                            <input
                              type="date"
                              value={selected.neededByDate}
                              onChange={e => updateCreativeNeededDate(spec.key, e.target.value)}
                              className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setFormStep('guests')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  ← Back to Guests
                </button>
                <button
                  type="button"
                  onClick={() => setFormStep('logistics')}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                >
                  Continue to Logistics Checklist →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: LOGISTICS TASKS TEMPLATE (LG-2, LG-3) */}
          {formStep === 'logistics' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-white">
                  Logistics Sub-team Checklist Template (LG-3)
                </span>
                <p className="text-slate-400 mt-0.5">
                  Standard university operations tasks for <strong>{type.toUpperCase()}</strong> will be automatically assigned across Venue, Catering, Transport, Guest Hospitality, and Security teams.
                </p>
              </div>

              {/* Template Items Preview */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700 max-h-60 overflow-y-auto divide-y divide-slate-700/50">
                {(LOGISTICS_TEMPLATES[type] || LOGISTICS_TEMPLATES['academic']).map((task, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                        {task.subTeam.replace('_', ' ')}
                      </span>
                      <span className="text-slate-200">{task.title}</span>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      task.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>

              {/* Submit Final */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setFormStep('creatives')}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  ← Back to Creatives
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Publish Event to University Calendar (EV-3)</span>
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
