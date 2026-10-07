import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings,
  Building2,
  GraduationCap,
  Sliders,
  Users,
  Shield,
  Plus,
  Trash2,
  Edit2,
  Edit3,
  Check,
  AlertTriangle,
  Clock,
  Save,
  Info,
  Tag,
  Palette,
  Search,
  Filter,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { Venue, AcademicOverlayEvent, OverlayPriority, OverlayTypeConfig } from '../types';
import { getOverlayTypeConfig } from '../data/mockData';

const COLOR_PRESETS = [
  { name: 'Red / Crimson', hex: '#ef4444', badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40', dotClass: 'bg-red-400' },
  { name: 'Amber / Orange', hex: '#f59e0b', badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40', dotClass: 'bg-amber-400' },
  { name: 'Purple / Violet', hex: '#8b5cf6', badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40', dotClass: 'bg-purple-400' },
  { name: 'Blue / Azure', hex: '#3b82f6', badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40', dotClass: 'bg-blue-400' },
  { name: 'Emerald / Green', hex: '#10b981', badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', dotClass: 'bg-emerald-400' },
  { name: 'Pink / Magenta', hex: '#ec4899', badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40', dotClass: 'bg-pink-400' },
  { name: 'Indigo / Navy', hex: '#6366f1', badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', dotClass: 'bg-indigo-400' },
  { name: 'Teal / Cyan', hex: '#14b8a6', badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40', dotClass: 'bg-teal-400' },
  { name: 'Rose / Coral', hex: '#f43f5e', badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40', dotClass: 'bg-rose-400' }
];

export const AdminSettingsView: React.FC = () => {
  const {
    currentUser,
    venues,
    addVenue,
    updateVenue,
    deleteVenue,
    academicOverlays,
    addAcademicOverlay,
    editAcademicOverlay,
    deleteAcademicOverlay,
    overlayTypes,
    addOverlayType,
    editOverlayType,
    deleteOverlayType,
    systemSettings,
    updateSystemSettings,
    users
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rules' | 'venues' | 'overlays' | 'users'>('rules');

  // Form states for Venue addition
  const [isAddVenueOpen, setIsAddVenueOpen] = useState(false);
  const [venueName, setVenueName] = useState('');
  const [venueCapacity, setVenueCapacity] = useState(150);
  const [venueLocation, setVenueLocation] = useState('Central Campus');
  const [venueFacilities, setVenueFacilities] = useState('Projector, Sound System, A/C');

  // Academic Overlay Management Sub-tab
  const [overlaySubTab, setOverlaySubTab] = useState<'overlays' | 'types'>('overlays');

  // Form states for Academic Overlay (Add / Edit)
  const [isOverlayModalOpen, setIsOverlayModalOpen] = useState(false);
  const [editingOverlayId, setEditingOverlayId] = useState<string | null>(null);
  const [overlayTitle, setOverlayTitle] = useState('');
  const [overlayStart, setOverlayStart] = useState('2026-11-10');
  const [overlayEnd, setOverlayEnd] = useState('2026-11-15');
  const [overlayType, setOverlayType] = useState('exam');
  const [overlayPriority, setOverlayPriority] = useState<OverlayPriority>('High');
  const [overlayDesc, setOverlayDesc] = useState('');

  // Overlay Filters & Search
  const [overlayPriorityFilter, setOverlayPriorityFilter] = useState<'all' | 'High' | 'Medium' | 'Low'>('all');
  const [overlayTypeFilter, setOverlayTypeFilter] = useState('all');
  const [overlaySearchQuery, setOverlaySearchQuery] = useState('');

  // Form states for Overlay Type (Add / Edit)
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [typeName, setTypeName] = useState('');
  const [typeIdCustom, setTypeIdCustom] = useState('');
  const [typeDesc, setTypeDesc] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);

  // Local settings state
  const [localLeadTime, setLocalLeadTime] = useState(systemSettings.leadTimeDays);
  const [localMaxRevisions, setLocalMaxRevisions] = useState(systemSettings.maxRevisionRounds);
  const [localRiskDays, setLocalRiskDays] = useState(systemSettings.riskWindowDays);
  const [localEmailEnabled, setLocalEmailEnabled] = useState(systemSettings.emailNotificationsEnabled);
  const [localMarketingEmail, setLocalMarketingEmail] = useState(systemSettings.marketingContactEmail);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    updateSystemSettings({
      leadTimeDays: localLeadTime,
      maxRevisionRounds: localMaxRevisions,
      riskWindowDays: localRiskDays,
      emailNotificationsEnabled: localEmailEnabled,
      marketingContactEmail: localMarketingEmail
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddVenueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!venueName.trim()) return;
    addVenue({
      name: venueName,
      capacity: Number(venueCapacity),
      location: venueLocation,
      facilities: venueFacilities.split(',').map(f => f.trim())
    });
    setVenueName('');
    setIsAddVenueOpen(false);
  };

  // Academic Overlay Handlers
  const handleOpenAddOverlay = () => {
    setEditingOverlayId(null);
    setOverlayTitle('');
    setOverlayStart('2026-11-10');
    setOverlayEnd('2026-11-15');
    setOverlayType(overlayTypes[0]?.id || 'exam');
    setOverlayPriority('High');
    setOverlayDesc('');
    setIsOverlayModalOpen(true);
  };

  const handleOpenEditOverlay = (item: AcademicOverlayEvent) => {
    setEditingOverlayId(item.id);
    setOverlayTitle(item.title);
    setOverlayStart(item.startDate);
    setOverlayEnd(item.endDate);
    setOverlayType(item.type);
    setOverlayPriority(item.priority || 'High');
    setOverlayDesc(item.description);
    setIsOverlayModalOpen(true);
  };

  const handleSaveOverlaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overlayTitle.trim()) return;

    if (editingOverlayId) {
      editAcademicOverlay(editingOverlayId, {
        title: overlayTitle.trim(),
        startDate: overlayStart,
        endDate: overlayEnd,
        type: overlayType,
        priority: overlayPriority,
        description: overlayDesc.trim() || 'Scheduled institutional overlay on university calendar.'
      });
    } else {
      addAcademicOverlay({
        title: overlayTitle.trim(),
        startDate: overlayStart,
        endDate: overlayEnd,
        type: overlayType,
        priority: overlayPriority,
        description: overlayDesc.trim() || 'Scheduled institutional overlay on university calendar.'
      });
    }

    setIsOverlayModalOpen(false);
    setEditingOverlayId(null);
  };

  const handleDeleteOverlay = (item: AcademicOverlayEvent) => {
    if (confirm(`Are you sure you want to delete the academic overlay "${item.title}"? This will remove scheduling advisories for ${item.startDate} to ${item.endDate}.`)) {
      deleteAcademicOverlay(item.id);
    }
  };

  // Overlay Type Handlers
  const handleOpenAddType = () => {
    setEditingTypeId(null);
    setTypeName('');
    setTypeIdCustom('');
    setTypeDesc('');
    setSelectedPresetIndex(0);
    setIsTypeModalOpen(true);
  };

  const handleOpenEditType = (type: OverlayTypeConfig) => {
    setEditingTypeId(type.id);
    setTypeName(type.name);
    setTypeIdCustom(type.id);
    setTypeDesc(type.description || '');
    const presetIdx = COLOR_PRESETS.findIndex(p => p.hex.toLowerCase() === type.color?.toLowerCase());
    setSelectedPresetIndex(presetIdx >= 0 ? presetIdx : 0);
    setIsTypeModalOpen(true);
  };

  const handleSaveTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typeName.trim()) return;

    const preset = COLOR_PRESETS[selectedPresetIndex] || COLOR_PRESETS[0];
    const generatedId = typeIdCustom.trim() 
      ? typeIdCustom.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_')
      : typeName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');

    if (editingTypeId) {
      editOverlayType(editingTypeId, {
        name: typeName.trim(),
        description: typeDesc.trim() || 'Custom academic calendar overlay category',
        color: preset.hex,
        badgeClass: preset.badgeClass,
        dotClass: preset.dotClass
      });
    } else {
      addOverlayType({
        id: generatedId || `type_${Date.now()}`,
        name: typeName.trim(),
        description: typeDesc.trim() || 'Custom academic calendar overlay category',
        color: preset.hex,
        badgeClass: preset.badgeClass,
        dotClass: preset.dotClass
      });
    }

    setIsTypeModalOpen(false);
    setEditingTypeId(null);
  };

  const handleDeleteType = (type: OverlayTypeConfig) => {
    const usageCount = academicOverlays.filter(o => o.type.toLowerCase() === type.id.toLowerCase()).length;
    if (usageCount > 0) {
      if (!confirm(`Warning: ${usageCount} academic overlay(s) currently use "${type.name}". Deleting this overlay type will revert those events to general styling. Are you sure you want to proceed?`)) {
        return;
      }
    } else {
      if (!confirm(`Delete overlay category "${type.name}"?`)) {
        return;
      }
    }
    deleteOverlayType(type.id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="p-5 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                University Administration & System Settings
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Admin Exclusive
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure institutional calendar rules, campus venue registries, exam blackout overlays, and lead-time constraints.
              </p>
            </div>
          </div>

          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
            Maintained by: <strong className="text-white">Marketing Department</strong>
          </div>
        </div>

        {/* Settings Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-800 pt-3 text-xs overflow-x-auto scrollbar-none">
          {[
            { id: 'rules', label: 'Workflow Rules & SLAs', icon: Sliders },
            { id: 'venues', label: `Campus Venues (${venues.length})`, icon: Building2 },
            { id: 'overlays', label: `Academic Overlays (${academicOverlays.length})`, icon: GraduationCap },
            { id: 'users', label: `Stakeholder Directory (${users.length})`, icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: WORKFLOW RULES & LEAD-TIMES */}
      {activeTab === 'rules' && (
        <form onSubmit={handleSaveRules} className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-6 shadow-xl">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Event Governance & Lead-Time Policy Settings</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              These institutional thresholds govern automated late event flags, creative team workload routing, and risk alerts across the university.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* 7-Day Lead-Time Rule (EV-2) */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="block font-bold text-white">
                Advance Notice Threshold (EV-2)
              </label>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Events scheduled with fewer days than this are marked <strong>Late</strong> and require Creative Lead workload acceptance.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={localLeadTime}
                  onChange={e => setLocalLeadTime(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold"
                />
                <span className="text-slate-300 font-semibold">Days prior to event date</span>
              </div>
            </div>

            {/* Max Revision Rounds (CR-4) */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="block font-bold text-white">
                Maximum Creative Revision Rounds (CR-4)
              </label>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Revisions permitted between faculty and designers. Exceeding this round requires University Event Admin override.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={localMaxRevisions}
                  onChange={e => setLocalMaxRevisions(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold"
                />
                <span className="text-slate-300 font-semibold">Rounds before Admin override</span>
              </div>
            </div>

            {/* 5-Day Risk Alert Horizon (Q22) */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="block font-bold text-white">
                High-Risk Alert Horizon (Q22)
              </label>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Proactively triggers high-risk alerts if any event within this window has unapproved creative materials.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={localRiskDays}
                  onChange={e => setLocalRiskDays(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-center font-bold"
                />
                <span className="text-slate-300 font-semibold">Days countdown trigger</span>
              </div>
            </div>

            {/* Department Contact Email */}
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <label className="block font-bold text-white">
                Marketing Department Operations Contact
              </label>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Central email used for dispatching automated clash alerts and university calendar notifications.
              </p>
              <input
                type="email"
                value={localMarketingEmail}
                onChange={e => setLocalMarketingEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/80 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={localEmailEnabled}
                onChange={e => setLocalEmailEnabled(e.target.checked)}
                className="rounded text-indigo-600"
              />
              <span className="font-semibold text-white">
                Enable Simulated Email Notifications (Q55, Q56) on Event Creation, Clashes & Late Requests
              </span>
            </label>

            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-[1.02]"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Settings Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Configuration</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: VENUES REGISTRY (LG-1) */}
      {activeTab === 'venues' && (
        <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>University Campus Venues Registry (LG-1)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Simple venue registry used for clash detection flags and logistics checklists.
              </p>
            </div>

            <button
              onClick={() => setIsAddVenueOpen(!isAddVenueOpen)}
              className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Venue</span>
            </button>
          </div>

          {/* Add Venue Form Drawer */}
          {isAddVenueOpen && (
            <form onSubmit={handleAddVenueSubmit} className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs animate-in fade-in duration-150">
              <h3 className="font-bold text-indigo-300 uppercase tracking-wider">
                Register New Campus Venue
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1">Venue Name *</label>
                  <input
                    type="text"
                    required
                    value={venueName}
                    onChange={e => setVenueName(e.target.value)}
                    placeholder="e.g. Vikram Sarabhai Innovation Lab"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Seating Capacity *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={venueCapacity}
                    onChange={e => setVenueCapacity(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Campus Location</label>
                  <input
                    type="text"
                    value={venueLocation}
                    onChange={e => setVenueLocation(e.target.value)}
                    placeholder="e.g. Block C, 3rd Floor"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Facilities / Equipment (comma-separated)</label>
                <input
                  type="text"
                  value={venueFacilities}
                  onChange={e => setVenueFacilities(e.target.value)}
                  placeholder="e.g. Dual 4K Projectors, Smart Podium, Wireless Mics, Power Backup"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddVenueOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold"
                >
                  Save Venue
                </button>
              </div>
            </form>
          )}

          {/* Venues Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {venues.map(v => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-white text-sm">
                      {v.name}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 shrink-0">
                      Cap: {v.capacity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    📍 {v.location}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {v.facilities?.map((f, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.2 rounded bg-slate-700 text-slate-300">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                  <span>LG-1 Registered</span>
                  <button
                    onClick={() => {
                      if (confirm(`Remove venue "${v.name}" from active registry?`)) {
                        deleteVenue(v.id);
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-slate-700"
                    title="Delete Venue"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ACADEMIC CALENDAR OVERLAYS (CA-4) */}
      {academicOverlays && activeTab === 'overlays' && (
        <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-5 shadow-xl">
          {/* Header & Sub-Tabs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Academic & Examination Calendar Overlays</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Priority & Type Config
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Maintained by Admin to advise faculty and flag scheduling constraints during exam weeks, convocations, admissions, and recess periods.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-700/80 text-xs">
                <button
                  type="button"
                  onClick={() => setOverlaySubTab('overlays')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    overlaySubTab === 'overlays'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Scheduled Overlays ({academicOverlays.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOverlaySubTab('types')}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                    overlaySubTab === 'types'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Overlay Types ({overlayTypes.length})</span>
                </button>
              </div>

              {overlaySubTab === 'overlays' ? (
                <button
                  type="button"
                  onClick={handleOpenAddOverlay}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Academic Overlay</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenAddType}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Overlay Type</span>
                </button>
              )}
            </div>
          </div>

          {/* SUB-VIEW 1: SCHEDULED ACADEMIC OVERLAYS */}
          {overlaySubTab === 'overlays' && (
            <div className="space-y-4">
              {/* Filter and Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 flex-1 max-w-sm">
                  <div className="relative w-full">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={overlaySearchQuery}
                      onChange={e => setOverlaySearchQuery(e.target.value)}
                      placeholder="Search overlays by title or description..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Priority Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Priority:</span>
                    <select
                      value={overlayPriorityFilter}
                      onChange={e => setOverlayPriorityFilter(e.target.value as any)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="all">All Priorities</option>
                      <option value="High">🔴 High Priority</option>
                      <option value="Medium">🟡 Medium Priority</option>
                      <option value="Low">🔵 Low Priority</option>
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 font-medium">Type:</span>
                    <select
                      value={overlayTypeFilter}
                      onChange={e => setOverlayTypeFilter(e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold"
                    >
                      <option value="all">All Overlay Types</option>
                      {overlayTypes.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Overlays List */}
              <div className="space-y-3">
                {(() => {
                  const filtered = academicOverlays.filter(item => {
                    const matchesPriority = overlayPriorityFilter === 'all' || item.priority === overlayPriorityFilter;
                    const matchesType = overlayTypeFilter === 'all' || item.type.toLowerCase() === overlayTypeFilter.toLowerCase();
                    const matchesSearch = !overlaySearchQuery.trim() || 
                      item.title.toLowerCase().includes(overlaySearchQuery.toLowerCase()) ||
                      item.description.toLowerCase().includes(overlaySearchQuery.toLowerCase());
                    return matchesPriority && matchesType && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div className="p-8 text-center rounded-xl bg-slate-900/40 border border-slate-800 text-slate-400 text-xs">
                        <GraduationCap className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                        <p className="font-semibold text-slate-300">No Academic Overlays Found</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          No overlay matches the selected priority or category filters.
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenAddOverlay}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold hover:bg-indigo-600/50 transition-colors"
                        >
                          + Add Academic Overlay
                        </button>
                      </div>
                    );
                  }

                  return filtered.map(item => {
                    const typeCfg = getOverlayTypeConfig(item.type, overlayTypes);
                    const priorityClass = item.priority === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : item.priority === 'Medium'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/40';

                    const priorityDot = item.priority === 'High'
                      ? 'bg-rose-400'
                      : item.priority === 'Medium'
                      ? 'bg-amber-400'
                      : 'bg-blue-400';

                    // Compute duration in days
                    const startMs = new Date(item.startDate).getTime();
                    const endMs = new Date(item.endDate).getTime();
                    const daysCount = Math.max(1, Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1);

                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">
                              {item.title}
                            </span>

                            {/* Priority Badge: High, Medium, Low */}
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border flex items-center gap-1.5 ${priorityClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${priorityDot}`} />
                              <span>Priority: {item.priority || 'High'}</span>
                            </span>

                            {/* Overlay Type Badge */}
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1 ${typeCfg.badgeClass}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${typeCfg.dotClass}`} />
                              <span>{typeCfg.name}</span>
                            </span>

                            {/* Duration Badge */}
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{daysCount} {daysCount === 1 ? 'Day' : 'Days'}</span>
                            </span>
                          </div>

                          <div className="text-slate-300 flex items-center gap-2 text-xs">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                            <span>
                              Active from <strong className="text-white font-semibold">{item.startDate}</strong> to <strong className="text-white font-semibold">{item.endDate}</strong>
                            </span>
                          </div>

                          <p className="text-slate-400 text-[11px] leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        {/* Action Buttons: Edit and Delete */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => handleOpenEditOverlay(item)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-slate-700/60 transition-colors flex items-center gap-1"
                            title="Edit Overlay Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span className="text-[11px] font-semibold pr-1">Edit</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteOverlay(item)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border border-slate-700/60 transition-colors"
                            title="Delete Overlay"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: MANAGE OVERLAY TYPES (ADD / EDIT / DELETE) */}
          {overlaySubTab === 'types' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>
                    Manage institutional calendar overlay types, color schemes, and descriptive labels used across conflict detection.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddType}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Create New Overlay Type</span>
                </button>
              </div>

              {/* Grid of Overlay Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {overlayTypes.map(t => {
                  const usageCount = academicOverlays.filter(o => o.type.toLowerCase() === t.id.toLowerCase()).length;
                  return (
                    <div
                      key={t.id}
                      className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between gap-3 text-xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${t.badgeClass}`}>
                            <span className={`w-2 h-2 rounded-full ${t.dotClass}`} />
                            <span>{t.name}</span>
                          </span>

                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            {t.id}
                          </span>
                        </div>

                        <p className="text-slate-400 text-[11px] min-h-[32px] line-clamp-2">
                          {t.description || 'Calendar overlay constraint category.'}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-700/50 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          Active Events: <strong className="text-white font-bold">{usageCount}</strong>
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEditType(t)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-600/30 text-indigo-300 hover:text-white border border-slate-700/60 transition-colors"
                            title="Edit Type"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteType(t)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-900/40 text-rose-400 hover:text-rose-300 border border-slate-700/60 transition-colors"
                            title="Delete Type"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MODAL 1: ADD / EDIT ACADEMIC OVERLAY */}
          {isOverlayModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
              <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {editingOverlayId ? 'Edit Academic Overlay' : 'Create New Academic Overlay'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {editingOverlayId ? 'Update overlay parameters, dates or priority level' : 'Add date range restriction with Priority level'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOverlayModalOpen(false);
                      setEditingOverlayId(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveOverlaySubmit} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Overlay Title *</label>
                    <input
                      type="text"
                      required
                      value={overlayTitle}
                      onChange={e => setOverlayTitle(e.target.value)}
                      placeholder="e.g. Mid-Semester Examinations (Winter 2026)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Overlay Type *</label>
                      <select
                        value={overlayType}
                        onChange={e => setOverlayType(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium"
                      >
                        {overlayTypes.map(t => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Priority Level *
                      </label>
                      <div className="grid grid-cols-3 gap-1">
                        {(['High', 'Medium', 'Low'] as OverlayPriority[]).map(p => {
                          const isSelected = overlayPriority === p;
                          const activeStyles = p === 'High'
                            ? 'bg-rose-500/30 text-rose-200 border-rose-500 ring-1 ring-rose-500'
                            : p === 'Medium'
                            ? 'bg-amber-500/30 text-amber-200 border-amber-500 ring-1 ring-amber-500'
                            : 'bg-blue-500/30 text-blue-200 border-blue-500 ring-1 ring-blue-500';

                          return (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setOverlayPriority(p)}
                              className={`py-2 px-1.5 rounded-lg border text-xs font-bold transition-all text-center ${
                                isSelected
                                  ? activeStyles
                                  : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                              }`}
                            >
                              {p}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={overlayStart}
                        onChange={e => setOverlayStart(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">End Date *</label>
                      <input
                        type="date"
                        required
                        value={overlayEnd}
                        onChange={e => setOverlayEnd(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Constraint Description & Advisory Details *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={overlayDesc}
                      onChange={e => setOverlayDesc(e.target.value)}
                      placeholder="e.g. Auditorium and seminar halls reserved for seating batches. Loud sound systems prohibited."
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  {/* Priority Explanatory Alert */}
                  <div className={`p-2.5 rounded-xl border text-[11px] flex items-start gap-2 ${
                    overlayPriority === 'High'
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                      : overlayPriority === 'Medium'
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                      : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
                  }`}>
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">
                        {overlayPriority === 'High'
                          ? 'High Priority (Strict Restriction): '
                          : overlayPriority === 'Medium'
                          ? 'Medium Priority (Scheduling Advisory): '
                          : 'Low Priority (Flexible Information): '}
                      </span>
                      {overlayPriority === 'High'
                        ? 'Flags hard warnings on faculty event creation and marks calendar days with red priority badges.'
                        : overlayPriority === 'Medium'
                        ? 'Displays advisory traffic notifications to event organizers and logistics teams.'
                        : 'Provides informative calendar overlays without blocking venue bookings.'}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsOverlayModalOpen(false);
                        setEditingOverlayId(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      {editingOverlayId ? 'Update Overlay' : 'Create Overlay'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* MODAL 2: ADD / EDIT OVERLAY TYPE */}
          {isTypeModalOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
              <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6">
                <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-850">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">
                        {editingTypeId ? 'Edit Overlay Type' : 'Create New Overlay Type'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {editingTypeId ? 'Modify category label, color palette and description' : 'Define custom institutional overlay category'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTypeModalOpen(false);
                      setEditingTypeId(null);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleSaveTypeSubmit} className="p-5 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Type Display Name *</label>
                    <input
                      type="text"
                      required
                      value={typeName}
                      onChange={e => setTypeName(e.target.value)}
                      placeholder="e.g. Sports & Athletics Week"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Type Identifier / Code</label>
                    <input
                      type="text"
                      disabled={!!editingTypeId}
                      value={editingTypeId ? editingTypeId : typeIdCustom}
                      onChange={e => setTypeIdCustom(e.target.value)}
                      placeholder="Auto-generated if blank (e.g. sports_week)"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-xs disabled:opacity-60"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      Unique programmatic key used for filtering and referencing.
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1.5">Color Palette Theme *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {COLOR_PRESETS.map((preset, idx) => {
                        const isSelected = selectedPresetIndex === idx;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setSelectedPresetIndex(idx)}
                            className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                              isSelected
                                ? 'bg-slate-800 text-white border-indigo-500 ring-2 ring-indigo-500/40'
                                : 'bg-slate-850/80 text-slate-400 border-slate-700 hover:bg-slate-800'
                            }`}
                          >
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: preset.hex }} />
                            <span className="text-[10px] font-semibold truncate">{preset.name.split('/')[0]}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Live Badge Preview</span>
                    <div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${COLOR_PRESETS[selectedPresetIndex]?.badgeClass}`}>
                        <span className={`w-2 h-2 rounded-full ${COLOR_PRESETS[selectedPresetIndex]?.dotClass}`} />
                        <span>{typeName || 'Overlay Type Sample'}</span>
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={typeDesc}
                      onChange={e => setTypeDesc(e.target.value)}
                      placeholder="e.g. Outdoor athletic tracks and basketball arena booked for annual championship"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setIsTypeModalOpen(false);
                        setEditingTypeId(null);
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold"
                    >
                      {editingTypeId ? 'Update Type' : 'Create Type'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: STAKEHOLDER DIRECTORY */}
      {activeTab === 'users' && (
        <div className="p-6 rounded-2xl bg-slate-850 border border-slate-800 space-y-4 shadow-xl">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>University User Directory & Access Roles</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized logins across Faculty, University Administration, Creative Team, Logistics, and Executive Leadership.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {users.map(u => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center gap-3 text-xs"
              >
                <img
                  src={u.avatar}
                  alt={u.name}
                  className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-white truncate">
                    {u.name}
                  </div>
                  <div className="text-slate-400 text-[11px] truncate">
                    {u.email}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                      {u.role}
                    </span>
                    {u.subTeam && (
                      <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-slate-700 text-slate-300">
                        {u.subTeam.replace('_', ' ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
