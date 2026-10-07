import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Calendar,
  Clock,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  Palette,
  CheckSquare,
  FileText,
  UserCheck,
  Upload,
  Download,
  ShieldCheck,
  ChevronRight,
  Printer,
  History,
  Copy,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  Image as ImageIcon,
  Check,
  Lock,
  Edit2,
  Edit3,
  Wifi,
  Volume2,
  Save
} from 'lucide-react';
import {
  EventItem,
  CreativeItem,
  CreativeStatus,
  Guest,
  GuestPhoto,
  LogisticsSubTeam,
  LogisticsTask
} from '../types';
import { getSchoolConfig } from '../data/mockData';

export const EventDetailModal: React.FC = () => {
  const {
    selectedEvent,
    setSelectedEvent,
    currentUser,
    cloneEvent,
    updateEvent,
    deleteEvent,
    setIsEditModalOpen,
    setEventToEdit,
    deleteTask,
    updateTask,
    setIsClashModalOpen,
    setActiveClashPair,
    events,
    venues,
    acceptLateCreative,
    declineLateCreative,
    updateCreativeStatus,
    requestCreativeRevision,
    overrideAdminRevision,
    approveCreativeOwner,
    uploadCreativeVersion,
    updatePrintVendor,
    approveGuestPhotoBio,
    uploadGuestPhoto,
    addGuestToEvent,
    updateTaskStatus,
    addTaskToEvent,
    logAssetDownload
  } = useApp();

  if (!selectedEvent) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'guests' | 'creatives' | 'logistics' | 'history'>('overview');

  // Creative sub-modals
  const [activeCreativeId, setActiveCreativeId] = useState<string | null>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [isPrintVendorModalOpen, setIsPrintVendorModalOpen] = useState(false);
  const [vendorName, setVendorName] = useState('');
  const [vendorQty, setVendorQty] = useState(50);
  const [vendorDelivery, setVendorDelivery] = useState('');
  const [vendorContact, setVendorContact] = useState('');
  const [vendorCost, setVendorCost] = useState('');

  // Late decline modal
  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('Heavy team workload with 4 upcoming symposiums. Cannot guarantee high-res turnaround in 48 hours.');
  const [suggestedDate, setSuggestedDate] = useState(new Date(Date.now() + 8 * 86400000).toISOString().split('T')[0]);

  // Upload file simulation modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadIsFinal, setUploadIsFinal] = useState(false);

  // Guest photo upload state
  const [activeGuestId, setActiveGuestId] = useState<string | null>(null);
  const [isGuestPhotoModalOpen, setIsGuestPhotoModalOpen] = useState(false);
  const [photoResolution, setPhotoResolution] = useState<'high' | 'low'>('high');

  // New task form state
  const [newTaskSubTeam, setNewTaskSubTeam] = useState<LogisticsSubTeam>('it_infra');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState(currentUser.name);
  const [newTaskDueDate, setNewTaskDueDate] = useState(selectedEvent.startDate);
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Editing existing task state
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');
  const [editTaskSubTeam, setEditTaskSubTeam] = useState<LogisticsSubTeam>('venue_housekeeping');
  const [editTaskAssignee, setEditTaskAssignee] = useState('');
  const [editTaskDueDate, setEditTaskDueDate] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [editTaskStatus, setEditTaskStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending');

  // Active creative selected
  const activeCreative = selectedEvent.creatives.find(c => c.id === activeCreativeId);

  // Can the current user sign off on creatives? (Faculty / Event Owner)
  const isEventOwner = currentUser.id === selectedEvent.ownerId;
  const isCreativeTeam = currentUser.role === 'creative';
  const isAdmin = currentUser.role === 'admin';

  // Handle clone
  const handleClone = () => {
    const cloned = cloneEvent(selectedEvent.id);
    setSelectedEvent(cloned);
  };

  // Handle Revision Request (CR-4)
  const handleRequestRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCreativeId || !revisionNote.trim()) return;

    const res = requestCreativeRevision(selectedEvent.id, activeCreativeId, revisionNote);
    if (res.requiresAdminOverride) {
      alert('⚠️ Maximum 2 revision rounds reached (CR-4). A 3rd round requires University Event Admin approval.');
    } else {
      setIsRevisionModalOpen(false);
      setRevisionNote('');
    }
  };

  // Handle Admin 3rd round override
  const handleAdminOverride = () => {
    if (!activeCreativeId) return;
    const note = prompt('Enter justification for authorizing 3rd revision round:');
    if (note) {
      overrideAdminRevision(selectedEvent.id, activeCreativeId, note);
    }
  };

  // Handle Print Vendor Save (CR-7)
  const handleSavePrintVendor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCreativeId) return;
    updatePrintVendor(selectedEvent.id, activeCreativeId, {
      vendor: vendorName,
      quantity: vendorQty,
      deliveryDate: vendorDelivery,
      contact: vendorContact,
      cost: vendorCost
    });
    setIsPrintVendorModalOpen(false);
  };

  // Handle upload version
  const handleUploadVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCreativeId || !uploadFileName.trim()) return;

    const mockUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    uploadCreativeVersion(selectedEvent.id, activeCreativeId, {
      fileName: uploadFileName,
      fileType: uploadFileName.endsWith('.pdf') ? 'application/pdf' : 'image/png',
      fileSize: `${(Math.random() * 8 + 2).toFixed(1)} MB`,
      fileUrl: mockUrl,
      isFinal: uploadIsFinal
    });

    setIsUploadModalOpen(false);
    setUploadFileName('');
  };

  // Handle Guest Photo upload (GP-3)
  const handleUploadGuestPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGuestId) return;

    const sizeBytes = photoResolution === 'high' ? 3800000 : 250000; // < 500kb triggers low-res rejection!
    const res = uploadGuestPhoto(selectedEvent.id, activeGuestId, {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
      filename: `guest_portrait_${Date.now()}.${photoResolution === 'high' ? 'jpg' : 'png'}`,
      resolution: photoResolution === 'high' ? '2400 x 3000 px (300 DPI)' : '400 x 500 px (72 DPI - Low Res)',
      sizeBytes,
      isApproved: true
    });

    if (!res.success) {
      alert(res.error);
    } else {
      setIsGuestPhotoModalOpen(false);
    }
  };

  // Add custom task
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTaskToEvent(selectedEvent.id, {
      subTeam: newTaskSubTeam,
      title: newTaskTitle.trim(),
      assignedToName: newTaskAssignee.trim() || currentUser.name,
      dueDate: newTaskDueDate || selectedEvent.startDate,
      status: 'pending',
      priority: newTaskPriority
    });
    setNewTaskTitle('');
  };

  const handleStartEditTask = (task: LogisticsTask) => {
    setEditingTaskId(task.id);
    setEditTaskTitle(task.title);
    setEditTaskSubTeam(task.subTeam);
    setEditTaskAssignee(task.assignedToName);
    setEditTaskDueDate(task.dueDate);
    setEditTaskPriority(task.priority);
    setEditTaskStatus(task.status);
  };

  const handleSaveEditTask = (taskId: string) => {
    if (!editTaskTitle.trim()) return;
    updateTask(selectedEvent.id, taskId, {
      title: editTaskTitle.trim(),
      subTeam: editTaskSubTeam,
      assignedToName: editTaskAssignee.trim() || currentUser.name,
      dueDate: editTaskDueDate,
      priority: editTaskPriority,
      status: editTaskStatus
    });
    setEditingTaskId(null);
  };

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    if (confirm(`Are you sure you want to delete task "${taskTitle}"?`)) {
      deleteTask(selectedEvent.id, taskId);
    }
  };

  const handleEditCurrentEvent = () => {
    setEventToEdit(selectedEvent);
    setIsEditModalOpen(true);
  };

  const handleDeleteCurrentEvent = () => {
    if (confirm(`Are you sure you want to permanently delete event "${selectedEvent.title}"? This cannot be undone.`)) {
      deleteEvent(selectedEvent.id);
      setSelectedEvent(null);
    }
  };

  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'in_preparation':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'ready':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'completed':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      case 'postponed':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'cancelled':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  // Logistics tasks count
  const completedTasks = selectedEvent.logisticsTasks.filter(t => t.status === 'completed').length;
  const totalTasks = selectedEvent.logisticsTasks.length;
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-850 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* School Badge (Color Coded) */}
                {(() => {
                  const schoolCfg = getSchoolConfig(selectedEvent.school);
                  return (
                    <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${schoolCfg.badgeClass}`}>
                      <span className={`w-2 h-2 rounded-full ${schoolCfg.dotClass}`} />
                      <span>{schoolCfg.name} • {schoolCfg.fullName}</span>
                    </span>
                  );
                })()}
                <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getStatusBadge(selectedEvent.status)}`}>
                  {selectedEvent.status.replace('_', ' ')}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                  {selectedEvent.type.toUpperCase()}
                </span>
                {selectedEvent.isLate && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    ⚠️ Late Submission (&lt; 7 Days)
                  </span>
                )}
                {selectedEvent.clashes.some(c => !c.resolved) && (
                  <button
                    onClick={() => {
                      const clash = selectedEvent.clashes.find(c => !c.resolved);
                      const other = events.find(e => e.id === clash?.clashingEventId);
                      if (other) {
                        setActiveClashPair({ event1: selectedEvent, event2: other });
                        setIsClashModalOpen(true);
                      }
                    }}
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 hover:bg-rose-500/30 transition-colors"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Venue Clash Active (Click to Resolve)</span>
                  </button>
                )}
              </div>

              <h1 className="text-lg sm:text-xl font-bold text-white mt-1.5 leading-snug truncate">
                {selectedEvent.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedEvent.department} • Organized by <strong>{selectedEvent.ownerName}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleEditCurrentEvent}
                title="Edit Event Parameters (Dates, Venue, Objective, Status)"
                className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-white transition-colors border border-indigo-500/30 flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Edit Event</span>
              </button>

              <button
                onClick={handleClone}
                title="Clone as Template (EV-4)"
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
              </button>

              <button
                onClick={handleDeleteCurrentEvent}
                title="Delete Event"
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => setSelectedEvent(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Tab bar */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 overflow-x-auto scrollbar-none">
            {[
              { id: 'overview', label: 'Event Overview', icon: FileText },
              { id: 'guests', label: `Guests & Photos (${selectedEvent.guests.length})`, icon: UserCheck },
              { id: 'creatives', label: `Creatives (${selectedEvent.creatives.length})`, icon: Palette },
              { id: 'logistics', label: `Logistics Checklist (${completedTasks}/${totalTasks})`, icon: CheckSquare },
              { id: 'history', label: 'Activity Log & Versions', icon: History }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Event schedule details card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Date & Timings</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {selectedEvent.startDate}
                    {selectedEvent.endDate !== selectedEvent.startDate && ` to ${selectedEvent.endDate}`}
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{selectedEvent.startTime} – {selectedEvent.endTime}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Building2 className="w-4 h-4" />
                    <span>Venue Location</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {selectedEvent.venueName}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Assigned for logistical arrangements
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <Users className="w-4 h-4" />
                    <span>Expected Audience</span>
                  </div>
                  <div className="text-sm font-bold text-white mt-1">
                    {selectedEvent.audienceSize} attendees
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 truncate">
                    {selectedEvent.expectedAudienceDesc || 'University community'}
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Event Objectives & Summary
                </h3>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {selectedEvent.objective}
                </p>
              </div>

              {/* Lifecycle Stage Controls */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Event Lifecycle Management
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Current Status: <span className="text-white font-semibold">{selectedEvent.status.toUpperCase()}</span>. Faculty directly advance when logistics & rehearsals conclude.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {selectedEvent.status === 'created' && (
                    <button
                      onClick={() => updateEvent(selectedEvent.id, { status: 'in_preparation' })}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold"
                    >
                      Move to In Preparation
                    </button>
                  )}
                  {selectedEvent.status === 'in_preparation' && (
                    <button
                      onClick={() => updateEvent(selectedEvent.id, { status: 'ready' })}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    >
                      Mark Ready for Event Day
                    </button>
                  )}
                  {selectedEvent.status === 'ready' && (
                    <button
                      onClick={() => updateEvent(selectedEvent.id, { status: 'completed' })}
                      className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
                    >
                      Mark Event Completed
                    </button>
                  )}
                  <button
                    onClick={() => updateEvent(selectedEvent.id, { status: 'postponed' })}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs"
                  >
                    Postpone
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GUEST PROFILES & PHOTOGRAPHS (GP-1 to GP-6) */}
          {activeTab === 'guests' && (
            <div className="space-y-4">
              {/* Skip Option / Internal Faculty Event Notice */}
              <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2 flex-wrap">
                    <span>Faculty & Dignitary Management</span>
                    {selectedEvent.isInternalOnly || selectedEvent.guestDetailsSkipped ? (
                      <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>Guest Details Skipped (Internal Event)</span>
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-semibold">
                        External Guests Enabled
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    {selectedEvent.isInternalOnly || selectedEvent.guestDetailsSkipped
                      ? 'This event is coordinated internally with university faculty. No external guests or keynote speakers are invited. Guest profile, biography and photo sign-off requirements are waived.'
                      : 'If no external guests are invited and internal faculty is managing the event, you can skip guest details.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {selectedEvent.isInternalOnly || selectedEvent.guestDetailsSkipped ? (
                    <button
                      onClick={() => updateEvent(selectedEvent.id, { isInternalOnly: false, guestDetailsSkipped: false })}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Enable External Guests
                    </button>
                  ) : (
                    <button
                      onClick={() => updateEvent(selectedEvent.id, { isInternalOnly: true, guestDetailsSkipped: true })}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                    >
                      Skip Guest Details (Internal Event)
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Guest Speakers & VIP Dignitaries
                  </h3>
                  <p className="text-xs text-slate-400">
                    GP-5 Rule: Event owner sign-off on photo and bio is required before creative designs can proceed.
                  </p>
                </div>

                <button
                  onClick={() => {
                    const name = prompt('Guest Full Name:');
                    if (name) {
                      const desig = prompt('Designation:') || '';
                      const org = prompt('Organization:') || '';
                      addGuestToEvent(selectedEvent.id, {
                        name,
                        designation: desig,
                        organisation: org,
                        shortBio: 'Visiting guest for event session.',
                        consentObtained: true,
                        consentBy: currentUser.name,
                        consentDate: new Date().toISOString(),
                        photos: [],
                        ownerApprovedPhotoAndBio: false
                      });
                      if (selectedEvent.guestDetailsSkipped || selectedEvent.isInternalOnly) {
                        updateEvent(selectedEvent.id, { isInternalOnly: false, guestDetailsSkipped: false });
                      }
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Guest</span>
                </button>
              </div>

              {selectedEvent.isInternalOnly || selectedEvent.guestDetailsSkipped ? (
                <div className="p-8 text-center text-xs bg-slate-850/60 rounded-xl border border-dashed border-emerald-500/30 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">Internal Faculty Managed Event</h4>
                  <p className="text-slate-400 max-w-md mx-auto">
                    Guest profile details are skipped for this internal event. No outside keynote speakers or VIP photos are required.
                  </p>
                  <button
                    onClick={() => {
                      const name = prompt('Guest Full Name:');
                      if (name) {
                        addGuestToEvent(selectedEvent.id, {
                          name,
                          designation: prompt('Designation:') || '',
                          organisation: prompt('Organization:') || '',
                          shortBio: 'Visiting speaker',
                          consentObtained: true,
                          consentBy: currentUser.name,
                          consentDate: new Date().toISOString(),
                          photos: [],
                          ownerApprovedPhotoAndBio: false
                        });
                        updateEvent(selectedEvent.id, { isInternalOnly: false, guestDetailsSkipped: false });
                      }
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold mt-2 border border-slate-700 cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite / Add Guest Speaker Anyway</span>
                  </button>
                </div>
              ) : selectedEvent.guests.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-dashed border-slate-700">
                  No guests added yet for this event.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedEvent.guests.map(guest => {
                    const approvedPhoto = guest.photos.find(p => p.isApproved) || guest.photos[0];

                    return (
                      <div
                        key={guest.id}
                        className="p-4 rounded-xl bg-slate-800/70 border border-slate-700 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          {approvedPhoto ? (
                            <img
                              src={approvedPhoto.url}
                              alt={guest.name}
                              className="w-16 h-16 rounded-lg object-cover ring-1 ring-white/10 shrink-0"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-slate-400 shrink-0">
                              <ImageIcon className="w-6 h-6" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white truncate">
                              {guest.name}
                            </h4>
                            <div className="text-xs text-slate-300 truncate">
                              {guest.designation}
                            </div>
                            <div className="text-xs text-indigo-400 truncate">
                              {guest.organisation}
                            </div>
                            {guest.socialHandle && (
                              <div className="text-[11px] text-slate-400 mt-0.5">
                                {guest.socialHandle}
                              </div>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg">
                          {guest.shortBio}
                        </p>

                        {/* Consent & Owner Approval Status (GP-5, GP-6) */}
                        <div className="pt-2 border-t border-slate-700/60 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-400">Consent (GP-6):</span>
                            <span className="text-emerald-400 font-medium">
                              ✓ Obtained by {guest.consentBy}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-[11px]">Owner Sign-off (GP-5):</span>
                            {guest.ownerApprovedPhotoAndBio ? (
                              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approved for Creatives</span>
                              </span>
                            ) : (
                              <button
                                onClick={() => approveGuestPhotoBio(selectedEvent.id, guest.id)}
                                className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold"
                              >
                                Sign-off on Photo & Bio
                              </button>
                            )}
                          </div>

                          {/* Upload photo action */}
                          <div className="pt-2 flex items-center justify-between">
                            <span className="text-[11px] text-slate-400">
                              Photos ({guest.photos.length}):
                            </span>
                            <button
                              onClick={() => {
                                setActiveGuestId(guest.id);
                                setIsGuestPhotoModalOpen(true);
                              }}
                              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                            >
                              <Upload className="w-3 h-3" />
                              <span>Upload High-Res Photo (GP-3)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CREATIVES & PRINT VENDORS (CR-1 to CR-9) */}
          {activeTab === 'creatives' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Creative Materials & Production Pipeline
                  </h3>
                  <p className="text-xs text-slate-400">
                    Max 2 revisions per item (CR-4). Late items subject to creative lead workload acceptance (CR-9).
                  </p>
                </div>
              </div>

              {/* Creatives List */}
              <div className="space-y-3">
                {selectedEvent.creatives.map(cr => {
                  const isAwaitingAcceptance = cr.status === 'awaiting_acceptance';
                  const isLate = cr.isLateRequest || selectedEvent.isLate;

                  return (
                    <div
                      key={cr.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isAwaitingAcceptance
                          ? 'bg-amber-950/25 border-amber-500/40'
                          : cr.status === 'approved'
                          ? 'bg-emerald-950/20 border-emerald-500/40'
                          : 'bg-slate-800/60 border-slate-700'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white">
                              {cr.label}
                            </span>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                              Qty: {cr.quantity}
                            </span>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              isAwaitingAcceptance
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : cr.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : cr.status === 'in_review'
                                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                : 'bg-slate-700 text-slate-300 border-slate-600'
                            }`}>
                              {cr.status.replace('_', ' ')}
                            </span>
                            {cr.revisionCount > 0 && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                                cr.revisionCount >= 2 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-700 text-slate-300'
                              }`}>
                                Rev Round {cr.revisionCount}/2
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 font-mono">
                            {cr.specs}
                          </p>
                        </div>

                        {/* Needed Date & Designer */}
                        <div className="text-right text-xs shrink-0">
                          <div className="text-slate-300">
                            Needed by:{' '}
                            <strong className="text-white">{cr.neededByDate}</strong>
                          </div>
                          <div className="text-slate-400 text-[11px] mt-0.5">
                            Assigned:{' '}
                            <span className="text-indigo-400 font-medium">
                              {cr.assignedDesignerName || 'Unassigned'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Late Request Workload Decision Buttons (CR-9) */}
                      {isAwaitingAcceptance && (
                        <div className="mt-3 p-3 rounded-lg bg-amber-900/30 border border-amber-500/40 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="text-amber-200">
                            <strong>⚠️ Late Request Decision (CR-9):</strong> Submitted with &lt; 7 days notice. Creative Lead decides based on workload.
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => acceptLateCreative(selectedEvent.id, cr.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs"
                            >
                              Accept into Workload
                            </button>
                            <button
                              onClick={() => {
                                setActiveCreativeId(cr.id);
                                setIsDeclineModalOpen(true);
                              }}
                              className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
                            >
                              Decline with Reason
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Versions Display (CR-6: Show latest 3 versions, older stored) */}
                      {cr.versions.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-700/60 space-y-1.5">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                            Files & Version History (Latest 3 Shown • All Kept UP-4):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {cr.versions.slice(0, 3).map(ver => (
                              <div
                                key={ver.id}
                                className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 flex items-center justify-between text-xs"
                              >
                                <div className="truncate pr-2">
                                  <div className="font-semibold text-slate-200 truncate flex items-center gap-1">
                                    <span>v{ver.version}</span>
                                    {ver.isFinal && (
                                      <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                                        FINAL
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 truncate">
                                    {ver.fileName} ({ver.fileSize})
                                  </div>
                                </div>
                                <button
                                  onClick={() => logAssetDownload(selectedEvent.id, ver.fileName, 'PDF')}
                                  title="Download File (DL-5 logged)"
                                  className="p-1 rounded text-indigo-400 hover:text-indigo-300 hover:bg-slate-800"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Print Vendor Details (CR-7) */}
                      {cr.printVendor && (
                        <div className="mt-2.5 p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Printer className="w-3.5 h-3.5 text-indigo-400" />
                            <span>
                              <strong>Print Vendor:</strong> {cr.printVendor} ({cr.printQuantity} copies, delivery by {cr.printTargetDelivery})
                            </span>
                          </div>
                          {cr.printCostEstimate && (
                            <span className="text-emerald-400 font-mono font-semibold">
                              {cr.printCostEstimate}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Bar for this creative */}
                      <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center justify-between flex-wrap gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          {/* Upload version */}
                          <button
                            onClick={() => {
                              setActiveCreativeId(cr.id);
                              setUploadFileName(`${selectedEvent.title.replace(/\s+/g, '_')}_${cr.typeKey}_v${cr.versions.length + 1}.pdf`);
                              setIsUploadModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Upload Version</span>
                          </button>

                          {/* Print Vendor Log (CR-7) */}
                          <button
                            onClick={() => {
                              setActiveCreativeId(cr.id);
                              setVendorName(cr.printVendor || 'Alpha Graphics Printers');
                              setVendorQty(cr.printQuantity || cr.quantity);
                              setVendorDelivery(cr.printTargetDelivery || cr.neededByDate);
                              setIsPrintVendorModalOpen(true);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print Vendor (CR-7)</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2 ml-auto">
                          {/* Request Revision button (CR-4) */}
                          {cr.status !== 'approved' && cr.status !== 'awaiting_acceptance' && (
                            <button
                              onClick={() => {
                                setActiveCreativeId(cr.id);
                                setIsRevisionModalOpen(true);
                              }}
                              className="px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              <span>Request Changes</span>
                            </button>
                          )}

                          {/* Admin Override if hit 2 rounds */}
                          {cr.revisionCount >= 2 && isAdmin && (
                            <button
                              onClick={() => {
                                setActiveCreativeId(cr.id);
                                handleAdminOverride();
                              }}
                              className="px-2.5 py-1 rounded bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold"
                            >
                              Admin Override 3rd Round
                            </button>
                          )}

                          {/* Final Sign-off by Owner (CR-5) */}
                          {cr.status !== 'approved' && cr.status !== 'awaiting_acceptance' && (
                            <button
                              onClick={() => approveCreativeOwner(selectedEvent.id, cr.id)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-emerald-900/30"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Owner Final Sign-off (CR-5)</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: LOGISTICS COLLABORATIVE TRACKER (LG-1 to LG-3) */}
          {activeTab === 'logistics' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Sub-team Logistics Coordination Board</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      7 Sub-teams
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Includes Venue & Housekeeping, Catering, Transport, Guest Hospitality, Security, <strong>IT Infra & Network</strong>, and <strong>Audio / Visual (AV)</strong>.
                  </p>
                </div>
                <div className="text-xs font-bold text-indigo-400 self-start sm:self-auto">
                  {completedTasks} of {totalTasks} Tasks Completed ({taskProgress}%)
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>

              {/* Add Custom Task Form */}
              <form onSubmit={handleAddTask} className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-indigo-400" />
                  <span>+ Add New Logistics Task to Event</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Task Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Stage LAN drop, 100 Mbps uplink, and guest Wi-Fi"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Sub-team *</label>
                    <select
                      value={newTaskSubTeam}
                      onChange={e => setNewTaskSubTeam(e.target.value as LogisticsSubTeam)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    >
                      <option value="it_infra">IT Infra & Network</option>
                      <option value="audio_visual">Audio / Visual (AV)</option>
                      <option value="venue_housekeeping">Venue & Housekeeping</option>
                      <option value="catering">Catering & Dining</option>
                      <option value="transport">Transport & Fleet</option>
                      <option value="guest_hospitality">Guest Hospitality & VIP</option>
                      <option value="security">Security & Parking</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Assignee</label>
                    <input
                      type="text"
                      value={newTaskAssignee}
                      onChange={e => setNewTaskAssignee(e.target.value)}
                      placeholder="Person responsible"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-slate-400 mr-1.5">Due Date:</span>
                      <input
                        type="date"
                        value={newTaskDueDate}
                        onChange={e => setNewTaskDueDate(e.target.value)}
                        className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 mr-1.5">Priority:</span>
                      <select
                        value={newTaskPriority}
                        onChange={e => setNewTaskPriority(e.target.value as any)}
                        className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-xs"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task to List</span>
                  </button>
                </div>
              </form>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {selectedEvent.logisticsTasks.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-400 bg-slate-800/40 rounded-xl border border-dashed border-slate-700">
                    No logistics tasks registered for this event yet. Use the form above to add checklist items.
                  </div>
                ) : (
                  selectedEvent.logisticsTasks.map(task => {
                    const isEditing = editingTaskId === task.id;
                    const isDone = task.status === 'completed';

                    if (isEditing) {
                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl bg-slate-800 border border-indigo-500/50 space-y-3 text-xs"
                        >
                          <div className="flex items-center justify-between font-bold text-indigo-300">
                            <span>Editing Task: {task.title}</span>
                            <span className="text-[11px] font-normal text-slate-400">ID: {task.id}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Title</label>
                              <input
                                type="text"
                                value={editTaskTitle}
                                onChange={e => setEditTaskTitle(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Sub-team</label>
                              <select
                                value={editTaskSubTeam}
                                onChange={e => setEditTaskSubTeam(e.target.value as LogisticsSubTeam)}
                                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                              >
                                <option value="it_infra">IT Infra & Network</option>
                                <option value="audio_visual">Audio / Visual (AV)</option>
                                <option value="venue_housekeeping">Venue & Housekeeping</option>
                                <option value="catering">Catering & Dining</option>
                                <option value="transport">Transport & Fleet</option>
                                <option value="guest_hospitality">Guest Hospitality & VIP</option>
                                <option value="security">Security & Parking</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Assignee</label>
                              <input
                                type="text"
                                value={editTaskAssignee}
                                onChange={e => setEditTaskAssignee(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Due Date</label>
                              <input
                                type="date"
                                value={editTaskDueDate}
                                onChange={e => setEditTaskDueDate(e.target.value)}
                                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] text-slate-400 mb-1">Priority</label>
                              <select
                                value={editTaskPriority}
                                onChange={e => setEditTaskPriority(e.target.value as any)}
                                className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs"
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id, task.title)}
                              className="px-3 py-1 rounded bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/40 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete Task</span>
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditingTaskId(null)}
                                className="px-3 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-[11px] cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditTask(task.id)}
                                className="px-3.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                              >
                                <Save className="w-3 h-3" />
                                <span>Save Changes</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                          isDone
                            ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                            : 'bg-slate-800/60 border-slate-700 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <button
                            onClick={() =>
                              updateTaskStatus(
                                selectedEvent.id,
                                task.id,
                                isDone ? 'pending' : 'completed'
                              )
                            }
                            title={isDone ? 'Mark Pending' : 'Mark Completed'}
                            className={`w-5 h-5 rounded-md flex items-center justify-center border mt-0.5 shrink-0 transition-colors cursor-pointer ${
                              isDone
                                ? 'bg-emerald-600 border-emerald-500 text-white'
                                : 'border-slate-600 hover:border-slate-400 bg-slate-900'
                            }`}
                          >
                            {isDone && <Check className="w-3.5 h-3.5" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                                {task.title}
                              </span>

                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 border border-slate-600/50">
                                {task.subTeam === 'it_infra'
                                  ? 'IT Infra & Network'
                                  : task.subTeam === 'audio_visual'
                                  ? 'Audio / Visual'
                                  : task.subTeam.replace('_', ' ')}
                              </span>

                              <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                                task.priority === 'high'
                                  ? 'bg-rose-500/20 text-rose-300'
                                  : task.priority === 'medium'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-slate-700 text-slate-400'
                              }`}>
                                {task.priority}
                              </span>
                            </div>

                            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-3 flex-wrap">
                              <span>Assigned: <strong>{task.assignedToName}</strong></span>
                              <span>Target: <strong>{task.dueDate}</strong></span>
                              <span className="capitalize text-slate-400">
                                Status: <strong className={isDone ? 'text-emerald-400' : 'text-amber-400'}>{task.status.replace('_', ' ')}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons: Edit Task and Delete Task */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleStartEditTask(task)}
                            title="Edit Task"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteTask(task.id, task.title)}
                            title="Delete Task"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/70 text-slate-400 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ACTIVITY LOG & AUDIT (Decision 4, UP-5) */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-white">Event Audit & Version History</span>
                <p className="text-slate-400 mt-0.5">
                  Permanent log of event creation, clash flagging, versions uploaded, and sign-offs.
                </p>
              </div>

              <div className="space-y-2">
                {selectedEvent.activityLog.map(act => (
                  <div
                    key={act.id}
                    className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-xs"
                  >
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="font-semibold text-white">{act.action}</span>
                      <span className="text-[11px]">
                        {new Date(act.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-300 mt-1">{act.details}</p>
                    <div className="text-[11px] text-indigo-400 mt-1">
                      Logged by {act.userName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-850 flex items-center justify-end shrink-0">
          <button
            onClick={() => setSelectedEvent(null)}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            Close Event Hub
          </button>
        </div>
      </div>

      {/* Sub-Modal: Request Revision (CR-4) */}
      {isRevisionModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Request Creative Changes (CR-4 Round {(activeCreative?.revisionCount || 0) + 1}/2)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Provide clear feedback for the design team. Maximum 2 rounds allowed without Admin authorization.
            </p>
            <textarea
              rows={3}
              required
              value={revisionNote}
              onChange={e => setRevisionNote(e.target.value)}
              placeholder="e.g. Please update Chief Guest name spelling and add DST sponsor emblem at top-right..."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRevisionModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestRevision}
                className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Print Vendor Logger (CR-7) */}
      {isPrintVendorModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleSavePrintVendor} className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Log Print Vendor & Quantity (CR-7)</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Print Vendor Name *</label>
                <input
                  type="text"
                  required
                  value={vendorName}
                  onChange={e => setVendorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 mb-1">Print Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={vendorQty}
                    onChange={e => setVendorQty(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1">Target Delivery Date</label>
                  <input
                    type="date"
                    value={vendorDelivery}
                    onChange={e => setVendorDelivery(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Cost Estimate / Purchase Order Note</label>
                <input
                  type="text"
                  placeholder="e.g. ₹ 6,200 (Under SET outreach budget)"
                  value={vendorCost}
                  onChange={e => setVendorCost(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsPrintVendorModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
              >
                Save Print Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-Modal: Decline Late Request (CR-9) */}
      {isDeclineModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white text-rose-400">
              Decline Late Creative Request (CR-9)
            </h3>
            <p className="text-xs text-slate-400">
              A decline requires an explicit reason based on workload and may suggest a revised delivery date.
            </p>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">Reason for Decline *</label>
                <textarea
                  rows={2}
                  value={declineReason}
                  onChange={e => setDeclineReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Suggested Feasible Turnaround Date</label>
                <input
                  type="date"
                  value={suggestedDate}
                  onChange={e => setSuggestedDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (activeCreativeId) {
                    declineLateCreative(selectedEvent.id, activeCreativeId, declineReason, suggestedDate);
                    setIsDeclineModalOpen(false);
                  }
                }}
                className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs"
              >
                Confirm Decline & Notify Faculty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Modal: Upload New Creative Version */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleUploadVersion} className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              <span>Upload Creative Asset Version</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1">File Name</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={e => setUploadFileName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-white"
                />
              </div>
              <label className="flex items-center gap-2 text-slate-300 cursor-pointer p-2.5 rounded-lg bg-slate-800/80 border border-slate-700">
                <input
                  type="checkbox"
                  checked={uploadIsFinal}
                  onChange={e => setUploadIsFinal(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <span className="font-semibold text-white">
                  Mark as Final Approved Candidate (Moves to In Review)
                </span>
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
              >
                Upload Version
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Sub-Modal: Guest Photo Upload with Resolution Check (GP-3) */}
      {isGuestPhotoModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <form onSubmit={handleUploadGuestPhotoSubmit} className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-700 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white">
              Upload Guest Photograph (GP-3 Check)
            </h3>
            <p className="text-xs text-slate-400">
              Low-resolution photos are rejected to ensure print poster quality.
            </p>
            <div className="space-y-2 text-xs">
              <label className="block text-slate-300">Select Resolution Simulator:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPhotoResolution('high')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    photoResolution === 'high'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-bold">High-Res (300 DPI)</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">2400 x 3000 px • 3.8 MB</div>
                </button>
                <button
                  type="button"
                  onClick={() => setPhotoResolution('low')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    photoResolution === 'low'
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="font-bold">Low-Res (Web Thumb)</div>
                  <div className="text-[10px] text-rose-400 mt-0.5">400 x 500 px • 250 KB (Fails GP-3)</div>
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsGuestPhotoModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs"
              >
                Test Upload
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
