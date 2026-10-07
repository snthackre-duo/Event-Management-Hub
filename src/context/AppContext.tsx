import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Venue,
  EventItem,
  AcademicOverlayEvent,
  OverlayPriority,
  OverlayTypeConfig,
  UploadRecord,
  DownloadLogEntry,
  MediaShareLink,
  AppNotification,
  CreativeStatus,
  FileVersion,
  LogisticsTask,
  Guest,
  GuestPhoto,
  LogisticsSubTeam,
  SystemSettings
} from '../types';
import {
  MOCK_USERS,
  MOCK_VENUES,
  INITIAL_EVENTS,
  ACADEMIC_OVERLAYS,
  INITIAL_OVERLAY_TYPES,
  INITIAL_UPLOADS,
  INITIAL_DOWNLOAD_LOGS,
  INITIAL_MEDIA_LINKS,
  INITIAL_NOTIFICATIONS,
  LOGISTICS_TEMPLATES,
  CREATIVE_SPECS
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  users: User[];
  venues: Venue[];
  events: EventItem[];
  academicOverlays: AcademicOverlayEvent[];
  overlayTypes: OverlayTypeConfig[];
  uploads: UploadRecord[];
  downloadLogs: DownloadLogEntry[];
  mediaLinks: MediaShareLink[];
  notifications: AppNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedEvent: EventItem | null;
  setSelectedEvent: (evt: EventItem | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isClashModalOpen: boolean;
  setIsClashModalOpen: (open: boolean) => void;
  activeClashPair: { event1: EventItem; event2: EventItem } | null;
  setActiveClashPair: (pair: { event1: EventItem; event2: EventItem } | null) => void;

  // Actions
  createEvent: (eventData: Partial<EventItem>) => EventItem;
  updateEvent: (eventId: string, patch: Partial<EventItem>) => void;
  deleteEvent: (eventId: string) => void;
  cloneEvent: (eventId: string) => EventItem;
  resolveClash: (event1Id: string, event2Id: string, resolutionNote: string, newVenueOrDate?: { eventIdToChange: string; venueId?: string; startDate?: string; startTime?: string; endTime?: string }) => void;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (open: boolean) => void;
  eventToEdit: EventItem | null;
  setEventToEdit: (event: EventItem | null) => void;
  
  // Creatives workflow
  acceptLateCreative: (eventId: string, creativeId: string, designerId?: string, designerName?: string) => void;
  declineLateCreative: (eventId: string, creativeId: string, reason: string, suggestedDate?: string) => void;
  updateCreativeStatus: (eventId: string, creativeId: string, status: CreativeStatus, designerId?: string, designerName?: string) => void;
  requestCreativeRevision: (eventId: string, creativeId: string, note: string) => { success: boolean; requiresAdminOverride: boolean };
  overrideAdminRevision: (eventId: string, creativeId: string, adminNote: string) => void;
  approveCreativeOwner: (eventId: string, creativeId: string) => void;
  uploadCreativeVersion: (eventId: string, creativeId: string, fileData: { fileName: string; fileType: string; fileSize: string; fileUrl: string; isFinal: boolean }) => void;
  updatePrintVendor: (eventId: string, creativeId: string, vendorData: { vendor: string; quantity: number; deliveryDate: string; contact?: string; cost?: string }) => void;

  // Guest workflow
  addGuestToEvent: (eventId: string, guest: Omit<Guest, 'id' | 'eventId'>) => void;
  approveGuestPhotoBio: (eventId: string, guestId: string) => void;
  uploadGuestPhoto: (eventId: string, guestId: string, photo: Omit<GuestPhoto, 'id' | 'uploadedAt' | 'uploadedBy'>) => { success: boolean; error?: string };

  // Logistics & Tasks
  updateTaskStatus: (eventId: string, taskId: string, status: 'pending' | 'in_progress' | 'completed') => void;
  addTaskToEvent: (eventId: string, task: Omit<LogisticsTask, 'id' | 'eventId'>) => void;
  deleteTask: (eventId: string, taskId: string) => void;
  updateTask: (eventId: string, taskId: string, patch: Partial<LogisticsTask>) => void;

  // Uploads
  addUploadRecord: (record: Omit<UploadRecord, 'id' | 'uploadedAt'>) => void;
  removeUploadRecord: (uploadId: string) => void;

  // Downloads & Media
  logAssetDownload: (eventId: string, fileName: string, format: string) => void;
  createMediaShareLink: (eventId: string, recipient: string, expiryHours: number) => MediaShareLink;
  revokeMediaShareLink: (linkId: string) => void;

  // Notifications
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Helpers
  checkEventClashes: (eventToCheck: Partial<EventItem>, excludeEventId?: string) => { clashingEvents: EventItem[]; academicOverlay?: AcademicOverlayEvent };

  // Admin Settings & Resource Controls
  systemSettings: SystemSettings;
  updateSystemSettings: (patch: Partial<SystemSettings>) => void;
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (id: string, patch: Partial<Venue>) => void;
  deleteVenue: (id: string) => void;
  addAcademicOverlay: (overlay: Omit<AcademicOverlayEvent, 'id'>) => void;
  editAcademicOverlay: (id: string, patch: Partial<Omit<AcademicOverlayEvent, 'id'>>) => void;
  deleteAcademicOverlay: (id: string) => void;
  addOverlayType: (typeData: Omit<OverlayTypeConfig, 'id'> & { id?: string }) => void;
  editOverlayType: (id: string, patch: Partial<Omit<OverlayTypeConfig, 'id'>>) => void;
  deleteOverlayType: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current logged in user (defaults to Admin or school PoC, safe from stale localStorage)
  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem('nuv_current_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = MOCK_USERS.find(u => u.id === parsed.id || u.email === parsed.email);
        if (match) return match;
      }
    } catch (e) {}
    return MOCK_USERS[0];
  });

  const [users] = useState<User[]>(MOCK_USERS);
  const [venues, setVenues] = useState<Venue[]>(() => {
    const saved = localStorage.getItem('nuv_venues');
    return saved ? JSON.parse(saved) : MOCK_VENUES;
  });
  const [academicOverlays, setAcademicOverlays] = useState<AcademicOverlayEvent[]>(() => {
    try {
      const saved = localStorage.getItem('nuv_academic_overlays');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: any) => ({
            ...item,
            priority: (item.priority as OverlayPriority) || (item.severity === 'advisory' ? 'Medium' : 'High')
          }));
        }
      }
    } catch (e) {}
    return ACADEMIC_OVERLAYS;
  });
  const [overlayTypes, setOverlayTypes] = useState<OverlayTypeConfig[]>(() => {
    try {
      const saved = localStorage.getItem('nuv_overlay_types');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return INITIAL_OVERLAY_TYPES;
  });
  const [systemSettings, setSystemSettings] = useState<SystemSettings>(() => {
    const saved = localStorage.getItem('nuv_system_settings');
    return saved ? JSON.parse(saved) : {
      leadTimeDays: 7,
      maxRevisionRounds: 2,
      emailNotificationsEnabled: true,
      marketingContactEmail: 'marketing@nuv.ac.in',
      departmentName: 'Marketing Department',
      riskWindowDays: 5,
      autoClashDetection: true
    };
  });

  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem('nuv_events');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 5 && parsed.every(e => e.school)) {
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_EVENTS;
  });

  const [uploads, setUploads] = useState<UploadRecord[]>(() => {
    const saved = localStorage.getItem('nuv_uploads');
    return saved ? JSON.parse(saved) : INITIAL_UPLOADS;
  });

  const [downloadLogs, setDownloadLogs] = useState<DownloadLogEntry[]>(() => {
    const saved = localStorage.getItem('nuv_download_logs');
    return saved ? JSON.parse(saved) : INITIAL_DOWNLOAD_LOGS;
  });

  const [mediaLinks, setMediaLinks] = useState<MediaShareLink[]>(() => {
    const saved = localStorage.getItem('nuv_media_links');
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_LINKS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('nuv_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isClashModalOpen, setIsClashModalOpen] = useState<boolean>(false);
  const [activeClashPair, setActiveClashPair] = useState<{ event1: EventItem; event2: EventItem } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [eventToEdit, setEventToEdit] = useState<EventItem | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('nuv_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nuv_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('nuv_uploads', JSON.stringify(uploads));
  }, [uploads]);

  useEffect(() => {
    localStorage.setItem('nuv_download_logs', JSON.stringify(downloadLogs));
  }, [downloadLogs]);

  useEffect(() => {
    localStorage.setItem('nuv_media_links', JSON.stringify(mediaLinks));
  }, [mediaLinks]);

  useEffect(() => {
    localStorage.setItem('nuv_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('nuv_venues', JSON.stringify(venues));
  }, [venues]);

  useEffect(() => {
    localStorage.setItem('nuv_academic_overlays', JSON.stringify(academicOverlays));
  }, [academicOverlays]);

  useEffect(() => {
    localStorage.setItem('nuv_overlay_types', JSON.stringify(overlayTypes));
  }, [overlayTypes]);

  useEffect(() => {
    localStorage.setItem('nuv_system_settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Admin Resource & Settings Handlers
  const updateSystemSettings = (patch: Partial<SystemSettings>) => {
    setSystemSettings(prev => ({ ...prev, ...patch }));
  };

  const addVenue = (venueData: Omit<Venue, 'id'>) => {
    const newVenue: Venue = {
      ...venueData,
      id: `venue-${Date.now()}`
    };
    setVenues(prev => [...prev, newVenue]);
  };

  const updateVenue = (id: string, patch: Partial<Venue>) => {
    setVenues(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));
  };

  const deleteVenue = (id: string) => {
    setVenues(prev => prev.filter(v => v.id !== id));
  };

  const addAcademicOverlay = (overlayData: Omit<AcademicOverlayEvent, 'id'>) => {
    const newOverlay: AcademicOverlayEvent = {
      ...overlayData,
      id: `overlay-${Date.now()}`
    };
    setAcademicOverlays(prev => [...prev, newOverlay]);
  };

  const editAcademicOverlay = (id: string, patch: Partial<Omit<AcademicOverlayEvent, 'id'>>) => {
    setAcademicOverlays(prev => prev.map(o => o.id === id ? { ...o, ...patch } : o));
  };

  const deleteAcademicOverlay = (id: string) => {
    setAcademicOverlays(prev => prev.filter(o => o.id !== id));
  };

  const addOverlayType = (typeData: Omit<OverlayTypeConfig, 'id'> & { id?: string }) => {
    const slug = typeData.id || typeData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
    const id = slug || `type_${Date.now()}`;
    const newType: OverlayTypeConfig = {
      ...typeData,
      id,
      badgeClass: typeData.badgeClass || 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
      dotClass: typeData.dotClass || 'bg-indigo-400'
    };
    setOverlayTypes(prev => [...prev.filter(t => t.id !== id), newType]);
  };

  const editOverlayType = (id: string, patch: Partial<Omit<OverlayTypeConfig, 'id'>>) => {
    setOverlayTypes(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  };

  const deleteOverlayType = (id: string) => {
    setOverlayTypes(prev => prev.filter(t => t.id !== id));
  };

  // Keep selectedEvent in sync with events state
  useEffect(() => {
    if (selectedEvent) {
      const updated = events.find(e => e.id === selectedEvent.id);
      if (updated) setSelectedEvent(updated);
    }
  }, [events]);

  // Clash Detection Engine (CA-3, EV-2)
  const checkEventClashes = (eventToCheck: Partial<EventItem>, excludeEventId?: string) => {
    const clashingEvents: EventItem[] = [];
    if (!eventToCheck.startDate || !eventToCheck.venueId) return { clashingEvents };

    for (const other of events) {
      if (other.id === excludeEventId) continue;
      if (other.status === 'cancelled') continue;

      // Check same venue on overlapping date
      if (other.venueId === eventToCheck.venueId && other.startDate === eventToCheck.startDate) {
        // Time overlap check: start1 < end2 && end1 > start2
        const s1 = eventToCheck.startTime || '00:00';
        const e1 = eventToCheck.endTime || '23:59';
        const s2 = other.startTime || '00:00';
        const e2 = other.endTime || '23:59';

        if (s1 < e2 && e1 > s2) {
          clashingEvents.push(other);
        }
      }
    }

    // Check academic overlay (CA-4)
    const overlay = academicOverlays.find(o => {
      const eventDate = eventToCheck.startDate || '';
      return eventDate >= o.startDate && eventDate <= o.endDate;
    });

    return { clashingEvents, academicOverlay: overlay };
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Create Event (EV-1, EV-2, EV-3: No approval step, live on creation, admin notified, 7-day rule)
  const createEvent = (eventData: Partial<EventItem>): EventItem => {
    const now = new Date();
    const eventDate = new Date(eventData.startDate || '');
    const diffTime = eventDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // EV-2: Entered < 7 days before event is marked Late
    const isLate = diffDays < 7;

    const eventId = `evt-${Date.now()}`;
    const venue = venues.find(v => v.id === eventData.venueId);

    // Initial clashing check
    const { clashingEvents } = checkEventClashes(eventData);

    const clashesList = clashingEvents.map(other => ({
      clashingEventId: other.id,
      clashingEventTitle: other.title,
      type: 'venue' as const,
      message: `Venue clash on ${venue?.name || 'Venue'} with "${other.title}" on ${eventData.startDate} (${eventData.startTime} - ${eventData.endTime}).`,
      resolved: false
    }));

    // Process creatives: if event is late, mark requested creatives as 'awaiting_acceptance' (CR-9)
    const processedCreatives = (eventData.creatives || []).map(cr => {
      const crNeededDate = new Date(cr.neededByDate || eventData.startDate || '');
      const crDiffDays = Math.ceil((crNeededDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      const isLateRequest = isLate || crDiffDays < 7;

      return {
        ...cr,
        id: cr.id || `cr-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        eventId,
        status: isLateRequest ? ('awaiting_acceptance' as CreativeStatus) : ('not_started' as CreativeStatus),
        isLateRequest,
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      };
    });

    // Populate logistics tasks from template if empty (LG-2, LG-3)
    let processedTasks = eventData.logisticsTasks || [];
    if (processedTasks.length === 0 && eventData.type && LOGISTICS_TEMPLATES[eventData.type]) {
      processedTasks = LOGISTICS_TEMPLATES[eventData.type].map((tpl, idx) => ({
        id: `task-${Date.now()}-${idx}`,
        eventId,
        subTeam: tpl.subTeam as LogisticsSubTeam,
        title: tpl.title,
        assignedToName: 'Unassigned Team Member',
        dueDate: eventData.startDate || '',
        status: 'pending' as const,
        priority: tpl.priority
      }));
    }

    const newEvent: EventItem = {
      id: eventId,
      title: eventData.title || 'Untitled Event',
      type: eventData.type || 'academic',
      school: (eventData.school || currentUser.school || 'NUV') as any,
      objective: eventData.objective || '',
      department: eventData.department || currentUser.department,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      ownerEmail: currentUser.email,
      startDate: eventData.startDate || '',
      endDate: eventData.endDate || eventData.startDate || '',
      startTime: eventData.startTime || '09:00',
      endTime: eventData.endTime || '17:00',
      venueId: eventData.venueId || '',
      venueName: venue?.name || 'TBD Venue',
      audienceSize: Number(eventData.audienceSize) || 100,
      expectedAudienceDesc: eventData.expectedAudienceDesc || '',
      status: 'created', // EV-3: Live on calendar immediately!
      createdAt: now.toISOString(),
      isLate,
      clashes: clashesList,
      creatives: processedCreatives,
      guests: eventData.guests || [],
      logisticsTasks: processedTasks,
      activityLog: [
        {
          id: `act-${Date.now()}`,
          eventId,
          timestamp: now.toISOString(),
          userId: currentUser.id,
          userName: currentUser.name,
          action: isLate ? 'Created Late Event' : 'Created Event',
          details: `Directly published to university calendar. ${isLate ? 'Marked Late (< 7 days lead-time). Creative team acceptance needed.' : ''}`,
          category: 'event'
        }
      ]
    };

    // Update state
    setEvents(prev => [newEvent, ...prev]);

    // EV-3: Admin notification
    addNotification({
      title: isLate ? '⚠️ Late Event Created' : '📅 New Event Published',
      message: `${currentUser.name} (${newEvent.department}) scheduled "${newEvent.title}" on ${newEvent.startDate} at ${newEvent.venueName}.`,
      type: isLate ? 'late_request' : 'approval_needed',
      eventId
    });

    // CA-3: If clash flagged, notify both owners and admin
    if (clashesList.length > 0) {
      addNotification({
        title: '⚠️ Venue Clash Detected',
        message: `Clash flagged on ${venue?.name}: "${newEvent.title}" overlaps with ${clashingEvents.map(e => `"${e.title}"`).join(', ')}. Discuss and reschedule.`,
        type: 'clash',
        eventId
      });

      // Update clashing other events with reciprocal clash notice
      setEvents(prev => prev.map(ev => {
        if (clashingEvents.some(c => c.id === ev.id)) {
          const reciprocalNotice = {
            clashingEventId: newEvent.id,
            clashingEventTitle: newEvent.title,
            type: 'venue' as const,
            message: `Venue clash on ${venue?.name} with "${newEvent.title}" on ${newEvent.startDate} (${newEvent.startTime} - ${newEvent.endTime}).`,
            resolved: false
          };
          return {
            ...ev,
            clashes: [...ev.clashes, reciprocalNotice],
            activityLog: [
              ...ev.activityLog,
              {
                id: `act-${Date.now()}-${ev.id}`,
                eventId: ev.id,
                timestamp: now.toISOString(),
                userId: 'system',
                userName: 'System Alert',
                action: 'Clash Flagged',
                details: `Overlap detected with newly created event "${newEvent.title}".`,
                category: 'clash'
              }
            ]
          };
        }
        return ev;
      }));
    }

    return newEvent;
  };

  const updateEvent = (eventId: string, patch: Partial<EventItem>) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        ...patch,
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Updated Event Details',
            details: `Updated fields: ${Object.keys(patch).join(', ')}`,
            category: 'event'
          }
        ]
      };
    }));
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(ev => ev.id !== eventId));
    if (selectedEvent?.id === eventId) setSelectedEvent(null);
    if (eventToEdit?.id === eventId) setEventToEdit(null);
    addNotification({
      title: '🗑️ Event Removed',
      message: `Event has been removed from university schedule and logistics roster.`,
      type: 'approval_needed'
    });
  };

  // EV-4: Clone past event as template
  const cloneEvent = (eventId: string): EventItem => {
    const source = events.find(e => e.id === eventId);
    if (!source) throw new Error('Event not found');

    const cloned = createEvent({
      ...source,
      title: `${source.title} (Clone)`,
      startDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      creatives: source.creatives.map(c => ({
        ...c,
        id: '',
        status: 'not_started',
        versions: [],
        revisionCount: 0,
        revisionNotes: []
      })),
      guests: source.guests.map(g => ({
        ...g,
        id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        ownerApprovedPhotoAndBio: false
      }))
    });

    return cloned;
  };

  // Clash resolution (CA-3)
  const resolveClash = (
    event1Id: string,
    event2Id: string,
    resolutionNote: string,
    newVenueOrDate?: { eventIdToChange: string; venueId?: string; startDate?: string; startTime?: string; endTime?: string }
  ) => {
    const now = new Date().toISOString();

    setEvents(prev => prev.map(ev => {
      if (ev.id === event1Id || ev.id === event2Id) {
        const isTargetToChange = newVenueOrDate && ev.id === newVenueOrDate.eventIdToChange;
        const newVenue = newVenueOrDate?.venueId ? venues.find(v => v.id === newVenueOrDate.venueId) : null;

        const updatedEv: EventItem = {
          ...ev,
          venueId: isTargetToChange && newVenueOrDate?.venueId ? newVenueOrDate.venueId : ev.venueId,
          venueName: isTargetToChange && newVenue ? newVenue.name : ev.venueName,
          startDate: isTargetToChange && newVenueOrDate?.startDate ? newVenueOrDate.startDate : ev.startDate,
          startTime: isTargetToChange && newVenueOrDate?.startTime ? newVenueOrDate.startTime : ev.startTime,
          endTime: isTargetToChange && newVenueOrDate?.endTime ? newVenueOrDate.endTime : ev.endTime,
          clashes: ev.clashes.map(c => {
            if (c.clashingEventId === (ev.id === event1Id ? event2Id : event1Id)) {
              return { ...c, resolved: true, resolutionNote };
            }
            return c;
          }),
          activityLog: [
            ...ev.activityLog,
            {
              id: `act-${Date.now()}-${ev.id}`,
              eventId: ev.id,
              timestamp: now,
              userId: currentUser.id,
              userName: currentUser.name,
              action: 'Resolved Clash',
              details: `Clash resolved: ${resolutionNote}. ${isTargetToChange ? `Relocated/rescheduled to ${newVenue?.name || ev.venueName}.` : ''}`,
              category: 'clash'
            }
          ]
        };
        return updatedEv;
      }
      return ev;
    }));

    addNotification({
      title: '✅ Venue Clash Resolved',
      message: `Clash between events resolved by ${currentUser.name}: ${resolutionNote}`,
      type: 'clash',
      eventId: event1Id
    });
  };

  // CR-9: Accept late creative item based on workload
  const acceptLateCreative = (eventId: string, creativeId: string, designerId?: string, designerName?: string) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            status: 'not_started' as CreativeStatus,
            assignedDesignerId: designerId || currentUser.id,
            assignedDesignerName: designerName || currentUser.name,
            lateDecidedBy: currentUser.name,
            lateDecidedAt: now
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Accepted Late Creative',
            details: `Accepted creative item into production workload. Assigned to ${designerName || currentUser.name}.`,
            category: 'creative'
          }
        ]
      };
    }));

    addNotification({
      title: '🎨 Creative Request Accepted',
      message: `Creative Lead ${currentUser.name} accepted your late creative item for production.`,
      type: 'creative_update',
      eventId
    });
  };

  // CR-9: Decline late creative item with mandatory reason and suggested date
  const declineLateCreative = (eventId: string, creativeId: string, reason: string, suggestedDate?: string) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            status: 'changes_requested' as CreativeStatus, // Marked declined with reason
            lateDecisionReason: reason,
            lateSuggestedDate: suggestedDate,
            lateDecidedBy: currentUser.name,
            lateDecidedAt: now
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Declined Late Creative',
            details: `Declined due to team workload: "${reason}". Suggested turnaround date: ${suggestedDate || 'N/A'}.`,
            category: 'creative'
          }
        ]
      };
    }));

    addNotification({
      title: '⚠️ Late Creative Request Declined',
      message: `Creative team declined item due to capacity: "${reason}". Suggested date: ${suggestedDate || 'N/A'}.`,
      type: 'creative_update',
      eventId
    });
  };

  // CR-3: Update creative status
  const updateCreativeStatus = (eventId: string, creativeId: string, status: CreativeStatus, designerId?: string, designerName?: string) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            status,
            assignedDesignerId: designerId || cr.assignedDesignerId,
            assignedDesignerName: designerName || cr.assignedDesignerName
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Updated Creative Status',
            details: `Creative item moved to "${status.replace('_', ' ').toUpperCase()}".`,
            category: 'creative'
          }
        ]
      };
    }));
  };

  // CR-4: Revision rounds (Max 2 rounds; 3rd requires Admin override)
  const requestCreativeRevision = (eventId: string, creativeId: string, note: string): { success: boolean; requiresAdminOverride: boolean } => {
    const event = events.find(e => e.id === eventId);
    const creative = event?.creatives.find(c => c.id === creativeId);
    if (!creative) return { success: false, requiresAdminOverride: false };

    if (creative.revisionCount >= 2 && currentUser.role !== 'admin') {
      return { success: false, requiresAdminOverride: true };
    }

    const now = new Date().toISOString();
    const newCount = creative.revisionCount + 1;

    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            status: 'changes_requested' as CreativeStatus,
            revisionCount: newCount,
            revisionNotes: [
              ...cr.revisionNotes,
              {
                round: newCount,
                note,
                requestedBy: currentUser.name,
                requestedAt: now
              }
            ]
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: `Revision Requested (Round ${newCount})`,
            details: `Note: "${note}"`,
            category: 'creative'
          }
        ]
      };
    }));

    addNotification({
      title: `📝 Creative Changes Requested (Round ${newCount})`,
      message: `${currentUser.name} requested changes on ${creative.label}: "${note}".`,
      type: 'creative_update',
      eventId
    });

    return { success: true, requiresAdminOverride: false };
  };

  // Admin override for 3rd revision round
  const overrideAdminRevision = (eventId: string, creativeId: string, adminNote: string) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          const newCount = cr.revisionCount + 1;
          return {
            ...cr,
            status: 'changes_requested' as CreativeStatus,
            revisionCount: newCount,
            revisionNotes: [
              ...cr.revisionNotes,
              {
                round: newCount,
                note: `[Admin Override Authorized by ${currentUser.name}]: ${adminNote}`,
                requestedBy: currentUser.name,
                requestedAt: now
              }
            ]
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Authorized Extra Revision (Admin Override)',
            details: `Admin authorized 3rd round revision: "${adminNote}".`,
            category: 'creative'
          }
        ]
      };
    }));

    addNotification({
      title: '🛡️ Admin Authorized 3rd Revision Round',
      message: `Admin ${currentUser.name} granted exceptional revision on creative item.`,
      type: 'creative_update',
      eventId
    });
  };

  // CR-5: Final sign-off by event owner
  const approveCreativeOwner = (eventId: string, creativeId: string) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            status: 'approved' as CreativeStatus,
            approvedByOwner: true,
            approvedAt: now,
            turnaroundHours: cr.turnaroundHours || 36
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Final Sign-off on Creative',
            details: `Event owner ${currentUser.name} signed off on final creative files for production/release.`,
            category: 'creative'
          }
        ]
      };
    }));

    addNotification({
      title: '🎉 Creative Approved by Owner',
      message: `${currentUser.name} gave final sign-off. Asset is ready for download and print dispatch.`,
      type: 'creative_update',
      eventId
    });
  };

  // Upload creative version (CR-6, UP-1, UP-4: show latest 3, keep all)
  const uploadCreativeVersion = (
    eventId: string,
    creativeId: string,
    fileData: { fileName: string; fileType: string; fileSize: string; fileUrl: string; isFinal: boolean }
  ) => {
    const now = new Date().toISOString();
    const event = events.find(e => e.id === eventId);
    const creative = event?.creatives.find(c => c.id === creativeId);
    if (!creative) return;

    const nextVer = (creative.versions?.length || 0) + 1;
    const newVersion: FileVersion = {
      id: `ver-${Date.now()}`,
      version: nextVer,
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSize: fileData.fileSize,
      fileUrl: fileData.fileUrl,
      uploaderId: currentUser.id,
      uploaderName: currentUser.name,
      uploadedAt: now,
      isFinal: fileData.isFinal
    };

    // Update creative item
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            status: fileData.isFinal ? 'in_review' : 'in_design',
            versions: [newVersion, ...cr.versions]
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: `Uploaded Creative Version v${nextVer}`,
            details: `File: ${fileData.fileName} (${fileData.fileSize}) [${fileData.isFinal ? 'Marked Final Candidate' : 'Work-in-progress Draft'}]`,
            category: 'creative'
          }
        ]
      };
    }));

    // Save to permanent uploads repository (UP-1, UP-2)
    addUploadRecord({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      eventId,
      eventTitle: event?.title || 'University Event',
      category: fileData.isFinal ? 'creative_final' : 'creative_draft',
      fileName: fileData.fileName,
      fileType: fileData.fileType,
      fileSize: fileData.fileSize,
      fileSizeRaw: parseInt(fileData.fileSize) * 1024 * 1024 || 5000000,
      url: fileData.fileUrl,
      isFinal: fileData.isFinal,
      version: nextVer,
      creativeId
    });
  };

  // CR-7: Print vendor and quantity logging
  const updatePrintVendor = (
    eventId: string,
    creativeId: string,
    vendorData: { vendor: string; quantity: number; deliveryDate: string; contact?: string; cost?: string }
  ) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        creatives: ev.creatives.map(cr => {
          if (cr.id !== creativeId) return cr;
          return {
            ...cr,
            printVendor: vendorData.vendor,
            printQuantity: vendorData.quantity,
            printTargetDelivery: vendorData.deliveryDate,
            printVendorContact: vendorData.contact,
            printCostEstimate: vendorData.cost
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Logged Print Vendor',
            details: `Vendor: ${vendorData.vendor}, Quantity: ${vendorData.quantity}, Target Delivery: ${vendorData.deliveryDate}`,
            category: 'creative'
          }
        ]
      };
    }));
  };

  // GP-1 to GP-6: Guest Profile & Photo upload & approval
  const addGuestToEvent = (eventId: string, guest: Omit<Guest, 'id' | 'eventId'>) => {
    const now = new Date().toISOString();
    const newGuest: Guest = {
      ...guest,
      id: `guest-${Date.now()}`,
      eventId
    };

    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        guests: [...ev.guests, newGuest],
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Added Guest Profile',
            details: `Added ${guest.name} (${guest.designation}, ${guest.organisation}). Consent: ${guest.consentObtained ? 'Obtained' : 'Pending'}.`,
            category: 'guest'
          }
        ]
      };
    }));
  };

  // GP-5: Event owner approves guest photo and bio before creatives use them
  const approveGuestPhotoBio = (eventId: string, guestId: string) => {
    const now = new Date().toISOString();
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        guests: ev.guests.map(g => {
          if (g.id !== guestId) return g;
          return { ...g, ownerApprovedPhotoAndBio: true };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Approved Guest Photo & Bio',
            details: `Owner sign-off granted for guest profile use in creative designs.`,
            category: 'guest'
          }
        ]
      };
    }));
  };

  // GP-3, GP-4: Upload guest photo with resolution check simulation
  const uploadGuestPhoto = (
    eventId: string,
    guestId: string,
    photoData: Omit<GuestPhoto, 'id' | 'uploadedAt' | 'uploadedBy'>
  ): { success: boolean; error?: string } => {
    // GP-3: Reject low resolution images with clear message
    if (photoData.sizeBytes < 500000) {
      return {
        success: false,
        error: 'Upload rejected: Image resolution too low for print creatives. Minimum 1200 x 1200 px (300 DPI, min 500 KB) required.'
      };
    }

    const now = new Date().toISOString();
    const newPhoto: GuestPhoto = {
      ...photoData,
      id: `photo-${Date.now()}`,
      uploadedAt: now,
      uploadedBy: currentUser.name
    };

    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        guests: ev.guests.map(g => {
          if (g.id !== guestId) return g;
          // Mark this as approved if first photo
          const isFirst = g.photos.length === 0;
          return {
            ...g,
            photos: [...g.photos.map(p => ({ ...p, isApproved: false })), { ...newPhoto, isApproved: isFirst }]
          };
        }),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: now,
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Uploaded Guest Photograph',
            details: `File: ${photoData.filename} (${photoData.resolution})`,
            category: 'guest'
          }
        ]
      };
    }));

    // Record upload in "My Uploads" repository
    const event = events.find(e => e.id === eventId);
    addUploadRecord({
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      eventId,
      eventTitle: event?.title || 'University Event',
      category: 'guest_photo',
      fileName: photoData.filename,
      fileType: 'image/jpeg',
      fileSize: `${(photoData.sizeBytes / (1024 * 1024)).toFixed(1)} MB`,
      fileSizeRaw: photoData.sizeBytes,
      url: photoData.url,
      isFinal: true,
      version: 1,
      guestId
    });

    return { success: true };
  };

  // Logistics Tasks
  const updateTaskStatus = (eventId: string, taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        logisticsTasks: ev.logisticsTasks.map(t => t.id === taskId ? { ...t, status } : t)
      };
    }));
  };

  const addTaskToEvent = (eventId: string, task: Omit<LogisticsTask, 'id' | 'eventId'>) => {
    const newTask: LogisticsTask = {
      ...task,
      id: `task-${Date.now()}`,
      eventId
    };
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        logisticsTasks: [...ev.logisticsTasks, newTask]
      };
    }));
  };

  const deleteTask = (eventId: string, taskId: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        logisticsTasks: ev.logisticsTasks.filter(t => t.id !== taskId),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Deleted Logistics Task',
            details: `Removed task from event checklist.`,
            category: 'logistics'
          }
        ]
      };
    }));
  };

  const updateTask = (eventId: string, taskId: string, patch: Partial<LogisticsTask>) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id !== eventId) return ev;
      return {
        ...ev,
        logisticsTasks: ev.logisticsTasks.map(t => t.id === taskId ? { ...t, ...patch } : t),
        activityLog: [
          ...ev.activityLog,
          {
            id: `act-${Date.now()}`,
            eventId,
            timestamp: new Date().toISOString(),
            userId: currentUser.id,
            userName: currentUser.name,
            action: 'Updated Logistics Task',
            details: `Updated task details: ${Object.keys(patch).join(', ')}`,
            category: 'logistics'
          }
        ]
      };
    }));
  };

  // Uploads management (UP-1 to UP-7)
  const addUploadRecord = (record: Omit<UploadRecord, 'id' | 'uploadedAt'>) => {
    const newUpload: UploadRecord = {
      ...record,
      id: `up-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      uploadedAt: new Date().toISOString()
    };
    setUploads(prev => [newUpload, ...prev]);
  };

  const removeUploadRecord = (uploadId: string) => {
    setUploads(prev => prev.filter(u => u.id !== uploadId));
  };

  // Downloads & Share links (DL-1 to DL-6)
  const logAssetDownload = (eventId: string, fileName: string, format: string) => {
    const event = events.find(e => e.id === eventId);
    const newEntry: DownloadLogEntry = {
      id: `dl-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role.toUpperCase(),
      eventId,
      eventTitle: event?.title || 'Event Asset',
      fileName,
      format,
      downloadedAt: new Date().toISOString()
    };
    setDownloadLogs(prev => [newEntry, ...prev]);
  };

  const createMediaShareLink = (eventId: string, recipient: string, expiryHours: number): MediaShareLink => {
    const event = events.find(e => e.id === eventId);
    const token = `nuv-media-${Math.random().toString(36).substr(2, 8)}`;
    const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

    const newLink: MediaShareLink = {
      id: `link-${Date.now()}`,
      token,
      eventId,
      eventTitle: event?.title || 'Event Media Pack',
      createdBy: `${currentUser.name} (${currentUser.role})`,
      createdAt: new Date().toISOString(),
      expiresAt,
      accessibleFilesCount: event?.creatives.filter(c => c.status === 'approved' || c.status === 'delivered').length || 0,
      downloadsCount: 0,
      recipientLabel: recipient,
      isRevoked: false
    };

    setMediaLinks(prev => [newLink, ...prev]);
    return newLink;
  };

  const revokeMediaShareLink = (linkId: string) => {
    setMediaLinks(prev => prev.map(l => l.id === linkId ? { ...l, isRevoked: true } : l));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        venues,
        events,
        academicOverlays,
        overlayTypes,
        uploads,
        downloadLogs,
        mediaLinks,
        notifications,
        activeTab,
        setActiveTab,
        selectedEvent,
        setSelectedEvent,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isClashModalOpen,
        setIsClashModalOpen,
        activeClashPair,
        setActiveClashPair,
        createEvent,
        updateEvent,
        deleteEvent,
        cloneEvent,
        resolveClash,
        isEditModalOpen,
        setIsEditModalOpen,
        eventToEdit,
        setEventToEdit,
        acceptLateCreative,
        declineLateCreative,
        updateCreativeStatus,
        requestCreativeRevision,
        overrideAdminRevision,
        approveCreativeOwner,
        uploadCreativeVersion,
        updatePrintVendor,
        addGuestToEvent,
        approveGuestPhotoBio,
        uploadGuestPhoto,
        updateTaskStatus,
        addTaskToEvent,
        deleteTask,
        updateTask,
        addUploadRecord,
        removeUploadRecord,
        logAssetDownload,
        createMediaShareLink,
        revokeMediaShareLink,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        addNotification,
        checkEventClashes,
        systemSettings,
        updateSystemSettings,
        addVenue,
        updateVenue,
        deleteVenue,
        addAcademicOverlay,
        editAcademicOverlay,
        deleteAcademicOverlay,
        addOverlayType,
        editOverlayType,
        deleteOverlayType
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
