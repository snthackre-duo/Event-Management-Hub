import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Building2,
  Users,
  Save,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Edit3
} from 'lucide-react';
import { EventType, EventStatus, SchoolKey } from '../types';
import { SCHOOL_CONFIGS, getSchoolConfig } from '../data/mockData';

export const EditEventModal: React.FC = () => {
  const {
    isEditModalOpen,
    setIsEditModalOpen,
    eventToEdit,
    setEventToEdit,
    venues,
    updateEvent,
    deleteEvent,
    checkEventClashes,
    currentUser
  } = useApp();

  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('academic');
  const [school, setSchool] = useState<SchoolKey>('NUV');
  const [objective, setObjective] = useState('');
  const [department, setDepartment] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('16:00');
  const [venueId, setVenueId] = useState('');
  const [audienceSize, setAudienceSize] = useState<number>(100);
  const [expectedAudienceDesc, setExpectedAudienceDesc] = useState('');
  const [status, setStatus] = useState<EventStatus>('in_preparation');
  const [isInternalOnly, setIsInternalOnly] = useState<boolean>(false);

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setType(eventToEdit.type);
      setSchool(eventToEdit.school || 'NUV');
      setObjective(eventToEdit.objective);
      setDepartment(eventToEdit.department);
      setStartDate(eventToEdit.startDate);
      setEndDate(eventToEdit.endDate || eventToEdit.startDate);
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setVenueId(eventToEdit.venueId);
      setAudienceSize(eventToEdit.audienceSize);
      setExpectedAudienceDesc(eventToEdit.expectedAudienceDesc || '');
      setStatus(eventToEdit.status);
      setIsInternalOnly(!!eventToEdit.isInternalOnly);
    }
  }, [eventToEdit]);

  if (!isEditModalOpen || !eventToEdit) return null;

  // Real-time Clash Check (excluding this event)
  const { clashingEvents } = checkEventClashes(
    { startDate, startTime, endTime, venueId },
    eventToEdit.id
  );

  const selectedVenue = venues.find(v => v.id === venueId);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateEvent(eventToEdit.id, {
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
      venueName: selectedVenue?.name || eventToEdit.venueName,
      audienceSize: Number(audienceSize),
      expectedAudienceDesc,
      status,
      isInternalOnly,
      guestDetailsSkipped: isInternalOnly
    });

    setIsEditModalOpen(false);
    setEventToEdit(null);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to permanently delete event "${eventToEdit.title}"? This will cancel all associated logistics tasks and creative items.`)) {
      deleteEvent(eventToEdit.id);
      setIsEditModalOpen(false);
      setEventToEdit(null);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-850">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Edit Event Schedule & Parameters
              </h2>
              <p className="text-xs text-slate-400">
                Update date, venue, expected audience, or lifecycle status. Changes reflect live on the university calendar.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsEditModalOpen(false);
              setEventToEdit(null);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real-time Clash Notice */}
        {clashingEvents.length > 0 && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-300">
                ⚠️ Overlap Warning with "{clashingEvents[0].title}":{' '}
              </span>
              Both events overlap on {selectedVenue?.name} ({startTime} - {endTime}). You may still save; admin & owners will be alerted.
            </div>
          </div>
        )}

        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Event Type *</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EventType)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Department</label>
              <input
                type="text"
                required
                value={department}
                onChange={e => setDepartment(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Venue Assignment</label>
              <select
                value={venueId}
                onChange={e => setVenueId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              >
                {venues.map(v => (
                  <option key={v.id} value={v.id}>{v.name} (Cap: {v.capacity})</option>
                ))}
              </select>
            </div>
          </div>

          {/* School Selector (Colour Coded) */}
          <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                School Affiliation (Color Coded) *
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

          {/* Dates & Times */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-850 border border-slate-800">
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 font-medium mb-1">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Audience Size</label>
              <input
                type="number"
                min="1"
                value={audienceSize}
                onChange={e => setAudienceSize(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Lifecycle Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
              >
                <option value="created">Created (Live on Calendar)</option>
                <option value="in_preparation">In Preparation</option>
                <option value="ready">Ready for Event Day</option>
                <option value="completed">Completed</option>
                <option value="postponed">Postponed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Event Objective & Description</label>
            <textarea
              rows={2}
              value={objective}
              onChange={e => setObjective(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          {/* Internal Event Flag */}
          <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/80 border border-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={isInternalOnly}
              onChange={e => setIsInternalOnly(e.target.checked)}
              className="rounded text-indigo-600"
            />
            <span className="text-slate-200">
              <strong>Internal Faculty Managed Event:</strong> No external VIP guests invited (skips guest bio & photo sign-offs).
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleDelete}
              className="px-3.5 py-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Event</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEventToEdit(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
