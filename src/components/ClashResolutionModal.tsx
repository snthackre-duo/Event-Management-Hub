import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  MessageSquare
} from 'lucide-react';
import { EventItem } from '../types';

export const ClashResolutionModal: React.FC = () => {
  const {
    isClashModalOpen,
    setIsClashModalOpen,
    activeClashPair,
    venues,
    resolveClash,
    currentUser
  } = useApp();

  if (!isClashModalOpen || !activeClashPair) return null;

  const { event1, event2 } = activeClashPair;

  const [selectedEventToChange, setSelectedEventToChange] = useState<string>(event2.id);
  const [resolutionAction, setResolutionAction] = useState<'move_venue' | 'shift_time'>('move_venue');
  const [newVenueId, setNewVenueId] = useState<string>(venues.find(v => v.id !== event1.venueId)?.id || '');
  const [newStartTime, setNewStartTime] = useState<string>('09:00');
  const [newEndTime, setNewEndTime] = useState<string>('13:00');
  const [newStartDate, setNewStartDate] = useState<string>(event2.startDate);
  const [discussionNotes, setDiscussionNotes] = useState<string>(
    `Discussed between ${event1.ownerName} and ${event2.ownerName} with Admin ${currentUser.name}. Agreed to relocate "${event2.title}" to prevent staging overlap.`
  );

  const handleResolve = (e: React.FormEvent) => {
    e.preventDefault();

    if (resolutionAction === 'move_venue') {
      resolveClash(event1.id, event2.id, discussionNotes, {
        eventIdToChange: selectedEventToChange,
        venueId: newVenueId
      });
    } else {
      resolveClash(event1.id, event2.id, discussionNotes, {
        eventIdToChange: selectedEventToChange,
        startDate: newStartDate,
        startTime: newStartTime,
        endTime: newEndTime
      });
    }

    setIsClashModalOpen(false);
  };

  const currentVenue = venues.find(v => v.id === event1.venueId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Venue Clash Resolution Desk
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                  CA-3 Protocol
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Both events are directly scheduled. Owners & Admin coordinate to relocate or reschedule one event.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsClashModalOpen(false)}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleResolve} className="p-6 space-y-6">
          {/* Conflicting Events Side-by-Side Comparison */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Overlapping Bookings on {currentVenue?.name || 'Selected Venue'}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Event 1 Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  selectedEventToChange === event1.id
                    ? 'bg-amber-950/20 border-amber-500/50 ring-2 ring-amber-500/30'
                    : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                    {event1.type}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="eventToMove"
                      checked={selectedEventToChange === event1.id}
                      onChange={() => setSelectedEventToChange(event1.id)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-amber-300">Select to Move</span>
                  </label>
                </div>

                <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                  {event1.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {event1.objective}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event1.startTime} – {event1.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event1.audienceSize} expected attendees</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-medium text-slate-300">Owner:</span> {event1.ownerName} ({event1.department})
                  </div>
                </div>
              </div>

              {/* Event 2 Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  selectedEventToChange === event2.id
                    ? 'bg-amber-950/20 border-amber-500/50 ring-2 ring-amber-500/30'
                    : 'bg-slate-800/60 border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                    {event2.type}
                  </span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      name="eventToMove"
                      checked={selectedEventToChange === event2.id}
                      onChange={() => setSelectedEventToChange(event2.id)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                    <span className="font-semibold text-amber-300">Select to Move</span>
                  </label>
                </div>

                <h3 className="text-sm font-bold text-white mt-2 leading-snug">
                  {event2.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {event2.objective}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event2.startTime} – {event2.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{event2.audienceSize} expected attendees</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span className="font-medium text-slate-300">Owner:</span> {event2.ownerName} ({event2.department})
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-700/60 pb-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Resolution Plan for:{' '}
                <span className="text-amber-400">
                  {selectedEventToChange === event1.id ? event1.title : event2.title}
                </span>
              </span>
              <div className="flex items-center gap-3 ml-auto text-xs">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="resAction"
                    checked={resolutionAction === 'move_venue'}
                    onChange={() => setResolutionAction('move_venue')}
                  />
                  <span>Relocate Venue</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="resAction"
                    checked={resolutionAction === 'shift_time'}
                    onChange={() => setResolutionAction('shift_time')}
                  />
                  <span>Reschedule Time/Date</span>
                </label>
              </div>
            </div>

            {resolutionAction === 'move_venue' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Select Alternative Venue (with Capacity Matching)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {venues.map(v => {
                    const isCurrent = v.id === event1.venueId;
                    const targetAudience = selectedEventToChange === event1.id ? event1.audienceSize : event2.audienceSize;
                    const fits = v.capacity >= targetAudience;

                    return (
                      <div
                        key={v.id}
                        onClick={() => !isCurrent && setNewVenueId(v.id)}
                        className={`p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                          newVenueId === v.id
                            ? 'bg-indigo-600/20 border-indigo-500 text-white'
                            : isCurrent
                            ? 'bg-slate-900/40 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span>{v.name}</span>
                          <span className={fits ? 'text-emerald-400' : 'text-amber-400'}>
                            Cap: {v.capacity}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                          <span>{v.location}</span>
                          {fits ? (
                            <span className="text-[10px] text-emerald-400 font-medium">✓ Fits audience</span>
                          ) : (
                            <span className="text-[10px] text-amber-400 font-medium">⚠️ Tight capacity</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    New Date
                  </label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={e => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={e => setNewStartTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={e => setNewEndTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Discussion & Coordination Note (Recorded to Event Audit Log)</span>
              </label>
              <textarea
                rows={2}
                value={discussionNotes}
                onChange={e => setDiscussionNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
                placeholder="Details of mutual agreement between owners and administration..."
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsClashModalOpen(false)}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Resolution & Update Schedules</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
