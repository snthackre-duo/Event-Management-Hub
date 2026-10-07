import {
  User,
  Venue,
  CreativeTypeSpec,
  EventItem,
  AcademicOverlayEvent,
  OverlayPriority,
  OverlayTypeConfig,
  UploadRecord,
  DownloadLogEntry,
  MediaShareLink,
  AppNotification,
  SchoolKey,
  SchoolConfig
} from '../types';

export const SCHOOL_CONFIGS: Record<SchoolKey, SchoolConfig> = {
  'SBL': {
    key: 'SBL',
    name: 'SBL',
    fullName: 'School of Business and Law',
    bgClass: 'bg-amber-500/15 hover:bg-amber-500/25',
    textClass: 'text-amber-300',
    borderClass: 'border-amber-500/40',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    hex: '#f59e0b'
  },
  'SOS': {
    key: 'SOS',
    name: 'SOS',
    fullName: 'School of Science',
    bgClass: 'bg-emerald-500/15 hover:bg-emerald-500/25',
    textClass: 'text-emerald-300',
    borderClass: 'border-emerald-500/40',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotClass: 'bg-emerald-400',
    hex: '#10b981'
  },
  'SET-CS': {
    key: 'SET-CS',
    name: 'SET-CS',
    fullName: 'School of Engineering & Technology (CS)',
    bgClass: 'bg-cyan-500/15 hover:bg-cyan-500/25',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-500/40',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    dotClass: 'bg-cyan-400',
    hex: '#06b6d4'
  },
  'SET-Core': {
    key: 'SET-Core',
    name: 'SET-Core',
    fullName: 'School of Engineering & Technology (Core)',
    bgClass: 'bg-blue-500/15 hover:bg-blue-500/25',
    textClass: 'text-blue-300',
    borderClass: 'border-blue-500/40',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dotClass: 'bg-blue-400',
    hex: '#3b82f6'
  },
  'SLSE': {
    key: 'SLSE',
    name: 'SLSE',
    fullName: 'School of Liberal Studies & Education',
    bgClass: 'bg-purple-500/15 hover:bg-purple-500/25',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500/40',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dotClass: 'bg-purple-400',
    hex: '#a855f7'
  },
  'SEDA': {
    key: 'SEDA',
    name: 'SEDA',
    fullName: 'School of Environmental Design & Architecture',
    bgClass: 'bg-rose-500/15 hover:bg-rose-500/25',
    textClass: 'text-rose-300',
    borderClass: 'border-rose-500/40',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    dotClass: 'bg-rose-400',
    hex: '#f43f5e'
  },
  'NUV': {
    key: 'NUV',
    name: 'NUV',
    fullName: 'Navrachana University Central',
    bgClass: 'bg-teal-500/15 hover:bg-teal-500/25',
    textClass: 'text-teal-300',
    borderClass: 'border-teal-500/40',
    badgeClass: 'bg-teal-500/20 text-teal-300 border-teal-500/40',
    dotClass: 'bg-teal-400',
    hex: '#14b8a6'
  }
};

export const getSchoolConfig = (schoolKey?: string): SchoolConfig => {
  if (schoolKey && SCHOOL_CONFIGS[schoolKey as SchoolKey]) {
    return SCHOOL_CONFIGS[schoolKey as SchoolKey];
  }
  return SCHOOL_CONFIGS['NUV'];
};

export const MOCK_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Admin',
    email: 'admin@nuv.ac.in',
    role: 'admin',
    department: 'Central University Administration',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-sbl',
    name: 'SBL PoC',
    email: 'sbl.poc@nuv.ac.in',
    role: 'faculty',
    school: 'SBL',
    department: 'School of Business and Law',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-set-cs',
    name: 'SET-CS PoC',
    email: 'set-cs.poc@nuv.ac.in',
    role: 'faculty',
    school: 'SET-CS',
    department: 'School of Engineering & Technology (CS)',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-set-core',
    name: 'SET-Core PoC',
    email: 'set-core.poc@nuv.ac.in',
    role: 'faculty',
    school: 'SET-Core',
    department: 'School of Engineering & Technology (Core)',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-sos',
    name: 'SOS PoC',
    email: 'sos.poc@nuv.ac.in',
    role: 'faculty',
    school: 'SOS',
    department: 'School of Science',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-slse',
    name: 'SLSE PoC',
    email: 'slse.poc@nuv.ac.in',
    role: 'faculty',
    school: 'SLSE',
    department: 'School of Liberal Studies & Education',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-seda',
    name: 'SEDA PoC',
    email: 'seda.poc@nuv.ac.in',
    role: 'faculty',
    school: 'SEDA',
    department: 'School of Environmental Design and Architecture',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-poc-nuv',
    name: 'NUV PoC',
    email: 'nuv.poc@nuv.ac.in',
    role: 'faculty',
    school: 'NUV',
    department: 'Navrachana University Central',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-creative-team',
    name: 'Creative Team',
    email: 'creative@nuv.ac.in',
    role: 'creative',
    department: 'Creative & Media Team',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-it-team',
    name: 'IT Team',
    email: 'it@nuv.ac.in',
    role: 'logistics',
    subTeam: 'it_infra',
    department: 'Campus IT & Network Infrastructure',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'user-logistics',
    name: 'Logistics',
    email: 'logistics@nuv.ac.in',
    role: 'logistics',
    subTeam: 'venue_housekeeping',
    department: 'Central Logistics & Facilities',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  }
];

export const MOCK_VENUES: Venue[] = [
  {
    id: 'venue-auditorium',
    name: 'University Main Auditorium',
    capacity: 850,
    location: 'Block A, Central Campus',
    facilities: ['Stage LED Wall', 'Bose Sound System', 'Green Rooms (2)', 'Tiered Seating', 'Live Stream Rig']
  },
  {
    id: 'venue-amphi',
    name: 'Nalanda Open Amphitheatre',
    capacity: 550,
    location: 'South Academic Courtyard',
    facilities: ['Open-air Acoustic Canopy', 'Stage Lights', 'Power Backup', 'Step Seating']
  },
  {
    id: 'venue-ramanujan',
    name: 'Ramanujan Seminar Hall',
    capacity: 220,
    location: 'Block B, 2nd Floor',
    facilities: ['Dual Laser Projectors', 'Podium Mic', 'Video Conference PTZ', 'A/C']
  },
  {
    id: 'venue-tagore',
    name: 'Tagore Conference Room A',
    capacity: 75,
    location: 'Administrative Wing, 1st Floor',
    facilities: ['Smart Interactive Display', 'Round Table Setup', 'Lapel Mics']
  },
  {
    id: 'venue-aryabhata',
    name: 'Aryabhata Executive Boardroom',
    capacity: 40,
    location: 'Vice Chancellor Complex',
    facilities: ['Cisco Webex Room Bar', 'Executive Leather Seats', 'Pantry Access']
  },
  {
    id: 'venue-lawn',
    name: 'Central Lawn & Festival Pavilion',
    capacity: 1200,
    location: 'North Quadrant',
    facilities: ['Outdoor Truss Space', 'High Voltage Genset Points', 'Lawn Turf']
  },
  {
    id: 'venue-sports',
    name: 'Multi-Purpose Sports Arena',
    capacity: 650,
    location: 'Sports & Wellness Center',
    facilities: ['Maple Wood Floor', 'Scoreboards', 'Bleachers', 'PA System']
  }
];

export const CREATIVE_SPECS: CreativeTypeSpec[] = [
  { key: 'invitation', label: 'Invitation (Digital & Print)', defaultSpecs: '1080x1920px Digital + A5 300DPI Print with QR', category: 'Print', icon: 'Mail' },
  { key: 'poster', label: 'Event Poster', defaultSpecs: 'A3 & A2 Vertical, 300 DPI CMYK High-Res', category: 'Print', icon: 'Image' },
  { key: 'social_post', label: 'Social Media Posts Pack', defaultSpecs: '1080x1080 Square + 1080x1350 Carousel (Set of 3)', category: 'Digital', icon: 'Share2' },
  { key: 'reel_video', label: 'Promo Reel / Teaser Video', defaultSpecs: '1080x1920 MP4 60fps 30-45s with university lower-thirds', category: 'Video', icon: 'Film' },
  { key: 'standee', label: 'Roll-up Standee', defaultSpecs: '6ft x 3ft or 6ft x 2.5ft Retractable Flex/Fabric banner', category: 'Print', icon: 'Maximize2' },
  { key: 'backdrop', label: 'Stage LED / Flex Backdrop', defaultSpecs: '16:9 3840x2160 LED Graphics & 20ft x 10ft Stage Flex', category: 'Stage', icon: 'Monitor' },
  { key: 'banner', label: 'Campus Arch / Outdoor Banner', defaultSpecs: '24ft x 4ft Main Gate Flex with grommets', category: 'Print', icon: 'Flag' },
  { key: 'certificate', label: 'Certificate of Merit / Participation', defaultSpecs: 'A4 Landscape CMYK with signature blanks & watermark', category: 'Print', icon: 'Award' },
  { key: 'id_badge', label: 'Delegate / VIP ID Badge', defaultSpecs: '3.5 x 5 inch double-sided lanyard card with bar-code', category: 'Print', icon: 'CreditCard' },
  { key: 'stage_presentation', label: 'Keynote Presentation Deck', defaultSpecs: '16:9 Widescreen Master PPTX & Keynote deck with intro loop', category: 'Stage', icon: 'Tv' },
  { key: 'brochure', label: 'Event Brochure / Schedule booklet', defaultSpecs: 'Trifold A4 6-panel or 8-page saddle stitched booklet', category: 'Print', icon: 'BookOpen' },
  { key: 'press_note', label: 'Press Note & Media Release Kit', defaultSpecs: 'Curated 2-page PR release with high-res photo links', category: 'Digital', icon: 'FileText' },
  { key: 'email_banner', label: 'Email Newsletter Banner', defaultSpecs: '600x240px responsive HTML mail header', category: 'Digital', icon: 'Inbox' },
  { key: 'signage', label: 'Directional Campus Signage', defaultSpecs: 'Set of 6 A3 arrows & entrance directional foam boards', category: 'Print', icon: 'Compass' }
];

export const INITIAL_OVERLAY_TYPES: OverlayTypeConfig[] = [
  {
    id: 'exam',
    name: 'Examinations & Assessments',
    description: 'Classrooms, halls and quiet zones restricted for exams',
    color: '#ef4444',
    badgeClass: 'bg-red-500/20 text-red-300 border-red-500/40',
    dotClass: 'bg-red-400',
    isSystem: true
  },
  {
    id: 'holiday',
    name: 'University Holiday & Recess',
    description: 'Campus closed or skeleton staff operations',
    color: '#f59e0b',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    dotClass: 'bg-amber-400',
    isSystem: true
  },
  {
    id: 'convocation',
    name: 'Convocation & Institutional Ceremonies',
    description: 'University-wide ceremonies with full auditorium reservations',
    color: '#8b5cf6',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    dotClass: 'bg-purple-400',
    isSystem: true
  },
  {
    id: 'admissions_rush',
    name: 'Admissions Open House & Discovery',
    description: 'High visitor volume and guided campus tour routes',
    color: '#3b82f6',
    badgeClass: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
    dotClass: 'bg-blue-400',
    isSystem: true
  },
  {
    id: 'sports_cultural',
    name: 'Inter-University Sports & Cultural Week',
    description: 'Heavy outdoor grounds & amphitheatre usage',
    color: '#10b981',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    dotClass: 'bg-emerald-400'
  },
  {
    id: 'inspection_audit',
    name: 'Accreditation & NAAC/NIRF Inspection',
    description: 'Academic audit panels reviewing physical spaces',
    color: '#ec4899',
    badgeClass: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
    dotClass: 'bg-pink-400'
  }
];

export const getOverlayTypeConfig = (typeId?: string, customTypes?: OverlayTypeConfig[]): OverlayTypeConfig => {
  const pool = customTypes && customTypes.length > 0 ? customTypes : INITIAL_OVERLAY_TYPES;
  const found = pool.find(t => t.id.toLowerCase() === (typeId || '').toLowerCase());
  if (found) return found;
  return {
    id: typeId || 'general',
    name: (typeId || 'General Overlay').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    description: 'Scheduled overlay constraint',
    color: '#6366f1',
    badgeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    dotClass: 'bg-indigo-400'
  };
};

export const ACADEMIC_OVERLAYS: AcademicOverlayEvent[] = [
  {
    id: 'overlay-1',
    title: 'Mid-Semester Examinations (All Schools)',
    startDate: '2026-10-18',
    endDate: '2026-10-25',
    type: 'exam',
    priority: 'High',
    description: 'Central auditorium and classrooms restricted during morning and afternoon exam slots.'
  },
  {
    id: 'overlay-2',
    title: 'Diwali & Mid-Term University Recess',
    startDate: '2026-11-01',
    endDate: '2026-11-06',
    type: 'holiday',
    priority: 'High',
    description: 'Campus services and student availability at skeleton levels.'
  },
  {
    id: 'overlay-3',
    title: 'Admissions Open House 2026-27 (Phase 1)',
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    type: 'admissions_rush',
    priority: 'Medium',
    description: 'High visitor traffic around Central Courtyard and Admissions block.'
  },
  {
    id: 'overlay-4',
    title: 'Annual Convocation Rehearsals & Setup',
    startDate: '2026-11-20',
    endDate: '2026-11-21',
    type: 'convocation',
    priority: 'High',
    description: 'Full stage hold in University Main Auditorium.'
  }
];

export const LOGISTICS_TEMPLATES: Record<string, { title: string; subTeam: any; priority: 'low' | 'medium' | 'high' }[]> = {
  conferences: [
    { title: 'Main stage audio test & lapel microphones check', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Setup 200 attendee chairs in theater configuration', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'High tea & VIP networking luncheon arrangements', subTeam: 'catering', priority: 'high' },
    { title: 'Water stations and herbal tea setup at reception', subTeam: 'catering', priority: 'medium' },
    { title: 'Airport pickup & luxury cab dispatch for keynote speakers', subTeam: 'transport', priority: 'high' },
    { title: 'Hotel transit shuttle coordination', subTeam: 'transport', priority: 'medium' },
    { title: 'VIP guest welcome kit & floral bouquets', subTeam: 'guest_hospitality', priority: 'high' },
    { title: 'Guest escort student volunteers briefing', subTeam: 'guest_hospitality', priority: 'medium' },
    { title: 'Gate passes & parking zone reservation for VIP cars', subTeam: 'security', priority: 'high' },
    { title: 'Crowd management and registration desk perimeter', subTeam: 'security', priority: 'medium' },
    { title: 'High-density guest Wi-Fi SSID & firewall whitelist configuration', subTeam: 'it_infra', priority: 'high' },
    { title: 'Stage LAN drop and live streaming network line (100 Mbps uplink)', subTeam: 'it_infra', priority: 'high' },
    { title: 'Stage LED screen calibration & 4K HDMI presentation switcher test', subTeam: 'audio_visual', priority: 'high' },
    { title: 'Wireless handheld & lapel mics frequency scan and sound check', subTeam: 'audio_visual', priority: 'high' }
  ],
  guest_lecture: [
    { title: 'Test HDMI/Type-C projection and laser pointer', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Podium arrangement and digital clock timer', subTeam: 'venue_housekeeping', priority: 'medium' },
    { title: 'High tea with Dean and faculty members post lecture', subTeam: 'catering', priority: 'medium' },
    { title: 'Speaker local pickup from guest house', subTeam: 'transport', priority: 'high' },
    { title: 'Guest welcome garland & university memento box', subTeam: 'guest_hospitality', priority: 'high' },
    { title: 'Reserved front-row seating tags for dignitaries', subTeam: 'guest_hospitality', priority: 'low' },
    { title: 'Auditorium door security and student ID verification', subTeam: 'security', priority: 'medium' },
    { title: 'Guest speaker laptop AV sync & wireless clicker test', subTeam: 'audio_visual', priority: 'high' },
    { title: 'Seminar hall Wi-Fi voucher for visiting speaker', subTeam: 'it_infra', priority: 'medium' }
  ],
  cultural: [
    { title: 'Stage lighting truss and sound console setup', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Green rooms setup with full mirrors and power strips', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Food stalls coordination and student snack coupons', subTeam: 'catering', priority: 'medium' },
    { title: 'Evening dinner pack for participant clubs (150 pax)', subTeam: 'catering', priority: 'medium' },
    { title: 'Equipment transport van from music academy', subTeam: 'transport', priority: 'low' },
    { title: 'Judges hospitality and score tabulation room', subTeam: 'guest_hospitality', priority: 'high' },
    { title: 'Perimeter barricades, metal detectors and bouncers', subTeam: 'security', priority: 'high' },
    { title: 'Emergency medical post and ambulance on standby', subTeam: 'security', priority: 'high' },
    { title: 'Stage lighting DMX controller sync & line-array concert sound test', subTeam: 'audio_visual', priority: 'high' },
    { title: 'Campus outdoor Wi-Fi mesh uplink & live stream broadcast link', subTeam: 'it_infra', priority: 'high' }
  ],
  admissions: [
    { title: 'Setup 12 counseling booths with power points', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Information kiosk and welcome marquee at main gate', subTeam: 'venue_housekeeping', priority: 'medium' },
    { title: 'Refreshment counter for visiting parents and students', subTeam: 'catering', priority: 'medium' },
    { title: 'Golf cart shuttle from parking to counseling hall', subTeam: 'transport', priority: 'medium' },
    { title: 'Parent reception lounge host team', subTeam: 'guest_hospitality', priority: 'medium' },
    { title: 'Traffic marshals at campus entry and parking lot C', subTeam: 'security', priority: 'high' },
    { title: 'Counselor registration desk LAN switches & parent Wi-Fi access', subTeam: 'it_infra', priority: 'high' },
    { title: 'Campus presentation screen & acoustic podium mic setup', subTeam: 'audio_visual', priority: 'medium' }
  ],
  academic: [
    { title: 'Arrangement of seminar chairs and presenter dais', subTeam: 'venue_housekeeping', priority: 'medium' },
    { title: 'Coffee and biscuits for morning and afternoon breaks', subTeam: 'catering', priority: 'medium' },
    { title: 'Inter-department attendee registration guidance', subTeam: 'guest_hospitality', priority: 'low' },
    { title: 'Auditorium access control during working hours', subTeam: 'security', priority: 'low' },
    { title: 'Projector HDMI handshake test & lapel wireless mic check', subTeam: 'audio_visual', priority: 'high' },
    { title: 'Guest research faculty Wi-Fi credentials & presentation remote clicker', subTeam: 'it_infra', priority: 'medium' }
  ],
  convocation: [
    { title: 'Robing room setup for academic council and chancellor', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Grand stage backdrop, brass lamp and royal dais', subTeam: 'venue_housekeeping', priority: 'high' },
    { title: 'Official Chancellor Banquet (300 VIPs)', subTeam: 'catering', priority: 'high' },
    { title: 'Packaged refreshment boxes for 1,200 graduates', subTeam: 'catering', priority: 'high' },
    { title: 'Motorcade escort for Chief Guest from Governor House', subTeam: 'transport', priority: 'high' },
    { title: 'VIP holding lounge protocol and protocol officer', subTeam: 'guest_hospitality', priority: 'high' },
    { title: 'City police liaison, bomb squad sweep and passes', subTeam: 'security', priority: 'high' },
    { title: 'Convocation live 4K stream broadcast rig & multi-camera switcher', subTeam: 'audio_visual', priority: 'high' },
    { title: 'High-speed media press room LAN uplink & chancellor stage telemetry', subTeam: 'it_infra', priority: 'high' }
  ]
};

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'evt-ai-conclave',
    title: 'National AI & Robotics Conclave 2026',
    type: 'conferences',
    school: 'SET-CS',
    objective: 'Bridge academia-industry gap with top AI leaders and showcase student research breakthroughs.',
    department: 'School of Engineering & Technology (CS)',
    ownerId: 'user-poc-set-cs',
    ownerName: 'SET-CS PoC',
    ownerEmail: 'set-cs.poc@nuv.ac.in',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    startTime: '09:30',
    endTime: '17:30',
    venueId: 'venue-auditorium',
    venueName: 'University Main Auditorium',
    audienceSize: 450,
    expectedAudienceDesc: 'B.Tech/M.Tech students, research scholars, tech founders, faculty members',
    status: 'in_preparation',
    createdAt: '2026-09-24T10:00:00Z',
    isLate: false,
    clashes: [
      {
        clashingEventId: 'evt-pitch-fest',
        clashingEventTitle: 'NUV Startup Pitch Fest & Angel Summit',
        type: 'venue',
        message: 'Venue overlap: Both events scheduled at University Main Auditorium on 2026-10-15 between 14:00 - 17:30.',
        resolved: false
      }
    ],
    guests: [
      {
        id: 'guest-1',
        eventId: 'evt-ai-conclave',
        name: 'Dr. Aarav Deshmukh',
        designation: 'VP of AI Research',
        organisation: 'Google DeepMind India',
        shortBio: 'Pioneered multilingual models for Indic languages with over 20 top-tier IEEE publications and 15 patents.',
        socialHandle: '@aarav_ai',
        consentObtained: true,
        consentBy: 'Dr. Shilpa Thackre',
        consentDate: '2026-09-25T11:20:00Z',
        ownerApprovedPhotoAndBio: true,
        photos: [
          {
            id: 'photo-1',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            filename: 'dr_aarav_deshmukh_hq_300dpi.jpg',
            resolution: '2400 x 3000 px (300 DPI)',
            isApproved: true,
            uploadedBy: 'Dr. Shilpa Thackre',
            uploadedAt: '2026-09-25T11:15:00Z',
            sizeBytes: 4200000
          }
        ]
      },
      {
        id: 'guest-2',
        eventId: 'evt-ai-conclave',
        name: 'Meera Nambiar',
        designation: 'Chief Technology Officer',
        organisation: 'Robotics Innovations Corp',
        shortBio: 'Leading autonomous drone surveillance systems. Forbes 40 under 40 Tech Innovator.',
        socialHandle: '@meera_robotics',
        consentObtained: true,
        consentBy: 'Dr. Shilpa Thackre',
        consentDate: '2026-09-26T14:10:00Z',
        ownerApprovedPhotoAndBio: true,
        photos: [
          {
            id: 'photo-2',
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
            filename: 'meera_nambiar_portrait.png',
            resolution: '1920 x 2400 px (High-Res)',
            isApproved: true,
            uploadedBy: 'Dr. Shilpa Thackre',
            uploadedAt: '2026-09-26T14:05:00Z',
            sizeBytes: 3100000
          }
        ]
      }
    ],
    creatives: [
      {
        id: 'cr-ai-1',
        eventId: 'evt-ai-conclave',
        typeKey: 'poster',
        label: 'Event Poster',
        specs: 'A3 & A2 Vertical, 300 DPI CMYK High-Res',
        quantity: 50,
        neededByDate: '2026-10-09',
        status: 'approved',
        assignedDesignerId: 'user-designer-1',
        assignedDesignerName: 'Rohan Mehta',
        revisionCount: 1,
        revisionNotes: [
          { round: 1, note: 'Please make sponsor logos larger at bottom bar', requestedBy: 'Dr. Shilpa Thackre', requestedAt: '2026-10-01T14:00:00Z' }
        ],
        versions: [
          {
            id: 'ver-101',
            version: 1,
            fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            fileName: 'NUV_AI_Conclave_Poster_v1.pdf',
            fileType: 'application/pdf',
            fileSize: '8.4 MB',
            uploaderId: 'user-designer-1',
            uploaderName: 'Rohan Mehta',
            uploadedAt: '2026-09-30T17:30:00Z',
            isFinal: false
          },
          {
            id: 'ver-102',
            version: 2,
            fileUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
            fileName: 'NUV_AI_Conclave_Poster_FINAL.pdf',
            fileType: 'application/pdf',
            fileSize: '9.1 MB',
            uploaderId: 'user-designer-1',
            uploaderName: 'Rohan Mehta',
            uploadedAt: '2026-10-02T11:15:00Z',
            isFinal: true
          }
        ],
        printVendor: 'Alpha Graphics & Offset Printers',
        printQuantity: 50,
        printTargetDelivery: '2026-10-11',
        printVendorContact: '+91 98250 12345 (Mr. Harish)',
        printCostEstimate: '₹ 4,500',
        approvedByOwner: true,
        approvedAt: '2026-10-02T16:00:00Z',
        turnaroundHours: 46
      },
      {
        id: 'cr-ai-2',
        eventId: 'evt-ai-conclave',
        typeKey: 'backdrop',
        label: 'Stage LED / Flex Backdrop',
        specs: '16:9 3840x2160 LED Graphics & 20ft x 10ft Stage Flex',
        quantity: 1,
        neededByDate: '2026-10-10',
        status: 'in_review',
        assignedDesignerId: 'user-designer-1',
        assignedDesignerName: 'Rohan Mehta',
        revisionCount: 2,
        revisionNotes: [
          { round: 1, note: 'Adjust font contrast against dark blue grid background', requestedBy: 'Dr. Shilpa Thackre', requestedAt: '2026-10-03T10:00:00Z' },
          { round: 2, note: 'Align Chief Guest photo to left third for camera line of sight', requestedBy: 'Dr. Shilpa Thackre', requestedAt: '2026-10-04T12:00:00Z' }
        ],
        versions: [
          {
            id: 'ver-103',
            version: 1,
            fileUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
            fileName: 'NUV_Stage_Backdrop_v1.png',
            fileType: 'image/png',
            fileSize: '14.2 MB',
            uploaderId: 'user-designer-1',
            uploaderName: 'Rohan Mehta',
            uploadedAt: '2026-10-02T18:00:00Z',
            isFinal: false
          },
          {
            id: 'ver-104',
            version: 2,
            fileUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
            fileName: 'NUV_Stage_Backdrop_v2_CameraOptimized.png',
            fileType: 'image/png',
            fileSize: '15.0 MB',
            uploaderId: 'user-designer-1',
            uploaderName: 'Rohan Mehta',
            uploadedAt: '2026-10-04T16:20:00Z',
            isFinal: false
          }
        ],
        printVendor: 'Om Digital Flex Solutions',
        printQuantity: 1,
        printTargetDelivery: '2026-10-12',
        printVendorContact: '+91 94260 88771',
        approvedByOwner: false
      },
      {
        id: 'cr-ai-3',
        eventId: 'evt-ai-conclave',
        typeKey: 'id_badge',
        label: 'Delegate / VIP ID Badge',
        specs: '3.5 x 5 inch double-sided lanyard card with bar-code',
        quantity: 450,
        neededByDate: '2026-10-11',
        status: 'in_design',
        assignedDesignerId: 'user-creative-lead',
        assignedDesignerName: 'Ananya Sharma',
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      }
    ],
    logisticsTasks: [
      {
        id: 'task-1',
        eventId: 'evt-ai-conclave',
        subTeam: 'venue_housekeeping',
        title: 'Stage LED screen calibration and HDMI splitter run',
        assignedToName: 'Rajesh Patel',
        dueDate: '2026-10-14',
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: 'task-2',
        eventId: 'evt-ai-conclave',
        subTeam: 'catering',
        title: 'VIP speaker lunch buffet for 35 delegates',
        assignedToName: 'Sunita Rao',
        dueDate: '2026-10-14',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-3',
        eventId: 'evt-ai-conclave',
        subTeam: 'transport',
        title: 'Airport pickup for Dr. Aarav Deshmukh (Flight 6E 441)',
        assignedToName: 'Manoj Parmar',
        dueDate: '2026-10-15',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-4',
        eventId: 'evt-ai-conclave',
        subTeam: 'security',
        title: 'Reserve 15 front parking bays for speakers & guests',
        assignedToName: 'Surendra Singh',
        dueDate: '2026-10-14',
        status: 'completed',
        priority: 'medium'
      },
      {
        id: 'task-ai-it-1',
        eventId: 'evt-ai-conclave',
        subTeam: 'it_infra',
        title: 'High-density Wi-Fi SSID & firewall whitelist configuration for 450 attendees',
        assignedToName: 'Amit Joshi',
        dueDate: '2026-10-14',
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: 'task-ai-av-1',
        eventId: 'evt-ai-conclave',
        subTeam: 'audio_visual',
        title: 'Stage LED wall calibration & 4K HDMI presentation switcher test',
        assignedToName: 'Sameer Shah',
        dueDate: '2026-10-14',
        status: 'completed',
        priority: 'high'
      }
    ],
    activityLog: [
      {
        id: 'act-1',
        eventId: 'evt-ai-conclave',
        timestamp: '2026-09-24T10:00:00Z',
        userId: 'user-faculty-1',
        userName: 'Dr. Shilpa Thackre',
        action: 'Created Event',
        details: 'Event directly scheduled on University Main Auditorium.',
        category: 'event'
      },
      {
        id: 'act-2',
        eventId: 'evt-ai-conclave',
        timestamp: '2026-09-24T10:01:00Z',
        userId: 'system',
        userName: 'NUV System Alert',
        action: 'Clash Flagged',
        details: 'Flagged overlap with "NUV Startup Pitch Fest" on Auditorium.',
        category: 'clash'
      },
      {
        id: 'act-3',
        eventId: 'evt-ai-conclave',
        timestamp: '2026-10-02T16:00:00Z',
        userId: 'user-faculty-1',
        userName: 'Dr. Shilpa Thackre',
        action: 'Approved Creative',
        details: 'Gave final sign-off on Event Poster v2 for print release.',
        category: 'creative'
      }
    ]
  },
  {
    id: 'evt-pitch-fest',
    title: 'NUV Startup Pitch Fest & Angel Summit',
    type: 'cultural',
    school: 'SBL',
    objective: 'Provide a launchpad for 15 student ventures pitching to Gujarat Venture Finance & angel syndicate.',
    department: 'School of Business and Law',
    ownerId: 'user-poc-sbl',
    ownerName: 'SBL PoC',
    ownerEmail: 'sbl.poc@nuv.ac.in',
    startDate: '2026-10-15',
    endDate: '2026-10-15',
    startTime: '13:30',
    endTime: '18:00',
    venueId: 'venue-auditorium',
    venueName: 'University Main Auditorium',
    audienceSize: 300,
    expectedAudienceDesc: 'Founders, angel investors, MBA students, alumni entrepreneurs',
    status: 'in_preparation',
    createdAt: '2026-09-27T11:30:00Z',
    isLate: false,
    clashes: [
      {
        clashingEventId: 'evt-ai-conclave',
        clashingEventTitle: 'National AI & Robotics Conclave 2026',
        type: 'venue',
        message: 'Direct overlap with AI Conclave running 09:30 - 17:30 in University Main Auditorium.',
        resolved: false
      }
    ],
    guests: [
      {
        id: 'guest-pitch-1',
        eventId: 'evt-pitch-fest',
        name: 'Vikramaditya Shah',
        designation: 'Managing Partner',
        organisation: 'Gujarat Angels Syndicate',
        shortBio: 'Investor in 40+ early-stage startups with 6 unicorn exits.',
        socialHandle: '@vshah_vc',
        consentObtained: true,
        consentBy: 'Prof. Arvind Trivedi',
        consentDate: '2026-09-28T10:00:00Z',
        ownerApprovedPhotoAndBio: true,
        photos: [
          {
            id: 'photo-pitch-1',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
            filename: 'vikramaditya_shah_headshot.jpg',
            resolution: '2000 x 2000 px',
            isApproved: true,
            uploadedBy: 'Prof. Arvind Trivedi',
            uploadedAt: '2026-09-28T09:55:00Z',
            sizeBytes: 2800000
          }
        ]
      }
    ],
    creatives: [
      {
        id: 'cr-pf-1',
        eventId: 'evt-pitch-fest',
        typeKey: 'standee',
        label: 'Roll-up Standee',
        specs: '6ft x 3ft Retractable Flex banner with QR code to pitch book',
        quantity: 4,
        neededByDate: '2026-10-11',
        status: 'in_design',
        assignedDesignerId: 'user-designer-1',
        assignedDesignerName: 'Rohan Mehta',
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      }
    ],
    logisticsTasks: [
      {
        id: 'task-pf-1',
        eventId: 'evt-pitch-fest',
        subTeam: 'catering',
        title: 'Investor high tea & mini-appetizers setup at auditorium foyer',
        assignedToName: 'Sunita Rao',
        dueDate: '2026-10-15',
        status: 'pending',
        priority: 'high'
      }
    ],
    activityLog: [
      {
        id: 'act-pf-1',
        eventId: 'evt-pitch-fest',
        timestamp: '2026-09-27T11:30:00Z',
        userId: 'user-faculty-2',
        userName: 'Prof. Arvind Trivedi',
        action: 'Created Event',
        details: 'Event created directly on calendar.',
        category: 'event'
      }
    ]
  },
  {
    id: 'evt-late-cyber',
    title: 'Urgent Industry Masterclass: Zero-Day Exploit Defense',
    type: 'guest_lecture',
    school: 'SET-Core',
    objective: 'Sudden opportunity to host visiting Palo Alto Networks Principal Threat Researcher.',
    department: 'School of Engineering & Technology (Core)',
    ownerId: 'user-poc-set-core',
    ownerName: 'SET-Core PoC',
    ownerEmail: 'set-core.poc@nuv.ac.in',
    startDate: '2026-10-10', // 4 days from Oct 6 (LATE!)
    endDate: '2026-10-10',
    startTime: '11:00',
    endTime: '13:00',
    venueId: 'venue-ramanujan',
    venueName: 'Ramanujan Seminar Hall',
    audienceSize: 120,
    expectedAudienceDesc: 'Cyber Security specialization students and IT faculty',
    status: 'in_preparation',
    createdAt: '2026-10-05T16:00:00Z',
    isLate: true, // Entered within 7 days!
    clashes: [],
    guests: [
      {
        id: 'guest-cyber-1',
        eventId: 'evt-late-cyber',
        name: 'Jonathan Varghese',
        designation: 'Principal Threat Hunter',
        organisation: 'Palo Alto Networks',
        shortBio: 'Specializes in kernel-level heuristics and state-sponsored APT tracking.',
        consentObtained: true,
        consentBy: 'Dr. Shilpa Thackre',
        consentDate: '2026-10-05T16:10:00Z',
        ownerApprovedPhotoAndBio: true,
        photos: [
          {
            id: 'photo-cyber-1',
            url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
            filename: 'jonathan_varghese.jpg',
            resolution: '1800 x 2400 px',
            isApproved: true,
            uploadedBy: 'Dr. Shilpa Thackre',
            uploadedAt: '2026-10-05T16:15:00Z',
            sizeBytes: 1950000
          }
        ]
      }
    ],
    creatives: [
      {
        id: 'cr-late-1',
        eventId: 'evt-late-cyber',
        typeKey: 'poster',
        label: 'Event Poster',
        specs: 'A3 Vertical 300 DPI (Emergency release)',
        quantity: 15,
        neededByDate: '2026-10-08',
        status: 'awaiting_acceptance', // Awaiting creative lead acceptance (CR-9)
        isLateRequest: true,
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      },
      {
        id: 'cr-late-2',
        eventId: 'evt-late-cyber',
        typeKey: 'social_post',
        label: 'Social Media Posts Pack',
        specs: '1080x1080 Square Instagram announcement',
        quantity: 1,
        neededByDate: '2026-10-08',
        status: 'awaiting_acceptance', // Awaiting creative lead acceptance (CR-9)
        isLateRequest: true,
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      }
    ],
    logisticsTasks: [
      {
        id: 'task-cyber-1',
        eventId: 'evt-late-cyber',
        subTeam: 'venue_housekeeping',
        title: 'Check Ramanujan Hall PA and projector for live Linux terminal demo',
        assignedToName: 'Rajesh Patel',
        dueDate: '2026-10-09',
        status: 'pending',
        priority: 'high'
      }
    ],
    activityLog: [
      {
        id: 'act-late-1',
        eventId: 'evt-late-cyber',
        timestamp: '2026-10-05T16:00:00Z',
        userId: 'user-faculty-1',
        userName: 'Dr. Shilpa Thackre',
        action: 'Created Late Event',
        details: 'Submitted with < 7 days notice. Creatives queued for creative lead workload check.',
        category: 'event'
      }
    ]
  },
  {
    id: 'evt-admissions-open',
    title: 'NUV Open House & Campus Discovery Day',
    type: 'admissions',
    school: 'NUV',
    objective: 'Showcase design studios, engineering labs, and moot courts to 600 prospective students and parents.',
    department: 'Navrachana University Central',
    ownerId: 'user-poc-nuv',
    ownerName: 'NUV PoC',
    ownerEmail: 'nuv.poc@nuv.ac.in',
    startDate: '2026-10-12',
    endDate: '2026-10-12',
    startTime: '08:30',
    endTime: '16:00',
    venueId: 'venue-amphi',
    venueName: 'Nalanda Open Amphitheatre',
    audienceSize: 650,
    expectedAudienceDesc: '12th standard students, parents, school principals, career counselors',
    status: 'ready',
    createdAt: '2026-09-10T09:00:00Z',
    isLate: false,
    clashes: [],
    guests: [],
    creatives: [
      {
        id: 'cr-adm-1',
        eventId: 'evt-admissions-open',
        typeKey: 'brochure',
        label: 'Event Brochure / Program booklet',
        specs: 'Trifold A4 6-panel full colour with campus map',
        quantity: 1000,
        neededByDate: '2026-10-05',
        status: 'delivered',
        assignedDesignerId: 'user-creative-lead',
        assignedDesignerName: 'Ananya Sharma',
        revisionCount: 1,
        revisionNotes: [],
        versions: [
          {
            id: 'ver-adm-1',
            version: 1,
            fileUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
            fileName: 'NUV_Discovery_Day_Brochure_Print.pdf',
            fileType: 'application/pdf',
            fileSize: '12.8 MB',
            uploaderId: 'user-creative-lead',
            uploaderName: 'Ananya Sharma',
            uploadedAt: '2026-10-03T14:00:00Z',
            isFinal: true
          }
        ],
        printVendor: 'PrintLine Color Crafts Pvt Ltd',
        printQuantity: 1000,
        printTargetDelivery: '2026-10-05',
        approvedByOwner: true,
        approvedAt: '2026-10-03T18:00:00Z',
        turnaroundHours: 32
      },
      {
        id: 'cr-adm-2',
        eventId: 'evt-admissions-open',
        typeKey: 'banner',
        label: 'Campus Arch / Outdoor Banner',
        specs: '24ft x 4ft Main Gate Flex with eyelets',
        quantity: 2,
        neededByDate: '2026-10-06',
        status: 'approved',
        assignedDesignerId: 'user-designer-1',
        assignedDesignerName: 'Rohan Mehta',
        revisionCount: 0,
        revisionNotes: [],
        versions: [
          {
            id: 'ver-adm-2',
            version: 1,
            fileUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800&auto=format&fit=crop&q=80',
            fileName: 'Main_Gate_Discovery_Banner_24x4ft.pdf',
            fileType: 'application/pdf',
            fileSize: '18.2 MB',
            uploaderId: 'user-designer-1',
            uploaderName: 'Rohan Mehta',
            uploadedAt: '2026-10-04T12:00:00Z',
            isFinal: true
          }
        ],
        printVendor: 'Om Digital Flex Solutions',
        printQuantity: 2,
        printTargetDelivery: '2026-10-08',
        approvedByOwner: true,
        approvedAt: '2026-10-04T15:30:00Z',
        turnaroundHours: 24
      }
    ],
    logisticsTasks: [
      {
        id: 'task-adm-1',
        eventId: 'evt-admissions-open',
        subTeam: 'venue_housekeeping',
        title: 'Erect waterproof marquee canopy at Nalanda courtyard',
        assignedToName: 'Rajesh Patel',
        dueDate: '2026-10-10',
        status: 'completed',
        priority: 'high'
      },
      {
        id: 'task-adm-2',
        eventId: 'evt-admissions-open',
        subTeam: 'transport',
        title: '3 Golf carts stationed for elderly parent campus tour',
        assignedToName: 'Manoj Parmar',
        dueDate: '2026-10-11',
        status: 'in_progress',
        priority: 'medium'
      }
    ],
    activityLog: [
      {
        id: 'act-adm-1',
        eventId: 'evt-admissions-open',
        timestamp: '2026-09-10T09:00:00Z',
        userId: 'user-admin-1',
        userName: 'Vikram Seth',
        action: 'Created Event',
        details: 'Admissions discovery calendar booked.',
        category: 'event'
      }
    ]
  },
  {
    id: 'evt-kalrav-fest',
    title: 'Kalrav 2026: Annual University Cultural Festival',
    type: 'cultural',
    school: 'SLSE',
    objective: '3-day flagship festival spanning music, theater, dance, literature and culinary arts competitions.',
    department: 'School of Liberal Studies & Education',
    ownerId: 'user-poc-slse',
    ownerName: 'SLSE PoC',
    ownerEmail: 'slse.poc@nuv.ac.in',
    startDate: '2026-10-28',
    endDate: '2026-10-30',
    startTime: '10:00',
    endTime: '22:00',
    venueId: 'venue-lawn',
    venueName: 'Central Lawn & Festival Pavilion',
    audienceSize: 2200,
    expectedAudienceDesc: 'All university students, alumni, faculty, registered inter-college participants',
    status: 'in_preparation',
    createdAt: '2026-09-15T12:00:00Z',
    isLate: false,
    clashes: [],
    guests: [
      {
        id: 'guest-fest-1',
        eventId: 'evt-kalrav-fest',
        name: 'Aishwarya Majmudar',
        designation: 'Renowned Playback Singer',
        organisation: 'Bollywood & Indie Music',
        shortBio: 'Award-winning vocalist and stage performer with millions of global listeners.',
        consentObtained: true,
        consentBy: 'Prof. Arvind Trivedi',
        consentDate: '2026-09-20T10:00:00Z',
        ownerApprovedPhotoAndBio: true,
        photos: [
          {
            id: 'photo-fest-1',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
            filename: 'aishwarya_majmudar_press.jpg',
            resolution: '3000 x 3000 px',
            isApproved: true,
            uploadedBy: 'Prof. Arvind Trivedi',
            uploadedAt: '2026-09-20T09:40:00Z',
            sizeBytes: 5200000
          }
        ]
      }
    ],
    creatives: [
      {
        id: 'cr-fest-1',
        eventId: 'evt-kalrav-fest',
        typeKey: 'reel_video',
        label: 'Promo Reel / Teaser Video',
        specs: '1080x1920 MP4 60fps 30-45s with university lower-thirds',
        quantity: 1,
        neededByDate: '2026-10-14',
        status: 'in_design',
        assignedDesignerId: 'user-designer-1',
        assignedDesignerName: 'Rohan Mehta',
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      },
      {
        id: 'cr-fest-2',
        eventId: 'evt-kalrav-fest',
        typeKey: 'poster',
        label: 'Event Poster',
        specs: 'A2 Vertical, 300 DPI CMYK High-Res',
        quantity: 100,
        neededByDate: '2026-10-15',
        status: 'not_started',
        assignedDesignerId: 'user-creative-lead',
        assignedDesignerName: 'Ananya Sharma',
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      }
    ],
    logisticsTasks: [
      {
        id: 'task-fest-1',
        eventId: 'evt-kalrav-fest',
        subTeam: 'security',
        title: 'Coordination with Vadodara City Police for festival perimeter',
        assignedToName: 'Surendra Singh',
        dueDate: '2026-10-20',
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: 'task-fest-it-1',
        eventId: 'evt-kalrav-fest',
        subTeam: 'it_infra',
        title: 'Outdoor mesh Wi-Fi pods & live streaming network uplink setup',
        assignedToName: 'Amit Joshi',
        dueDate: '2026-10-25',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-fest-av-1',
        eventId: 'evt-kalrav-fest',
        subTeam: 'audio_visual',
        title: 'Stage line-array speaker tuning, wireless mics scan & lighting DMX sync',
        assignedToName: 'Sameer Shah',
        dueDate: '2026-10-27',
        status: 'in_progress',
        priority: 'high'
      }
    ],
    activityLog: [
      {
        id: 'act-fest-1',
        eventId: 'evt-kalrav-fest',
        timestamp: '2026-09-15T12:00:00Z',
        userId: 'user-poc-slse',
        userName: 'SLSE PoC',
        action: 'Created Event',
        details: 'Kalrav 2026 scheduled on central lawn pavilion.',
        category: 'event'
      }
    ]
  },
  {
    id: 'evt-bio-symposium',
    title: 'Frontiers in Molecular Biosciences & Green Nanotechnology',
    type: 'conferences',
    school: 'SOS',
    objective: 'Explore breakthroughs in molecular biology, drug discovery, and clean chemical syntheses with leading researchers.',
    department: 'School of Science',
    ownerId: 'user-poc-sos',
    ownerName: 'SOS PoC',
    ownerEmail: 'sos.poc@nuv.ac.in',
    startDate: '2026-10-22',
    endDate: '2026-10-22',
    startTime: '09:00',
    endTime: '17:00',
    venueId: 'venue-ramanujan',
    venueName: 'Ramanujan Seminar Hall',
    audienceSize: 180,
    expectedAudienceDesc: 'B.Sc/M.Sc students, chemistry and biology faculty, doctoral researchers',
    status: 'in_preparation',
    createdAt: '2026-09-28T09:00:00Z',
    isLate: false,
    clashes: [],
    guests: [
      {
        id: 'guest-sos-1',
        eventId: 'evt-bio-symposium',
        name: 'Dr. Sunita Raman',
        designation: 'Senior Scientist & Director',
        organisation: 'CSIR National Chemical Laboratory',
        shortBio: 'Leading researcher in catalytic biopolymers and green chemical technologies.',
        socialHandle: '@sunitabiochem',
        consentObtained: true,
        consentBy: 'SOS PoC',
        consentDate: '2026-09-29T10:00:00Z',
        ownerApprovedPhotoAndBio: true,
        photos: [
          {
            id: 'photo-sos-1',
            url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
            filename: 'dr_sunita_raman_bio.jpg',
            resolution: '2000 x 2000 px',
            isApproved: true,
            uploadedBy: 'SOS PoC',
            uploadedAt: '2026-09-29T11:00:00Z',
            sizeBytes: 2500000
          }
        ]
      }
    ],
    creatives: [
      {
        id: 'cr-sos-1',
        eventId: 'evt-bio-symposium',
        typeKey: 'poster',
        label: 'Symposium Poster',
        specs: 'A2 Vertical High-Res CMYK 300 DPI',
        quantity: 20,
        neededByDate: '2026-10-18',
        status: 'in_design',
        assignedDesignerId: 'user-creative-team',
        assignedDesignerName: 'Creative Team',
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      }
    ],
    logisticsTasks: [
      {
        id: 'task-sos-1',
        eventId: 'evt-bio-symposium',
        subTeam: 'venue_housekeeping',
        title: 'Ramanujan Hall theater seating & podium setup',
        assignedToName: 'Logistics',
        dueDate: '2026-10-21',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-sos-it-1',
        eventId: 'evt-bio-symposium',
        subTeam: 'it_infra',
        title: 'Guest Wi-Fi network whitelist and scientific slide deck projection system test',
        assignedToName: 'IT Team',
        dueDate: '2026-10-21',
        status: 'pending',
        priority: 'high'
      },
      {
        id: 'task-sos-av-1',
        eventId: 'evt-bio-symposium',
        subTeam: 'audio_visual',
        title: 'Dual wireless clip-on mic sound checks and projector HDMI sync',
        assignedToName: 'IT Team',
        dueDate: '2026-10-21',
        status: 'completed',
        priority: 'medium'
      }
    ],
    activityLog: [
      {
        id: 'act-sos-1',
        eventId: 'evt-bio-symposium',
        timestamp: '2026-09-28T09:00:00Z',
        userId: 'user-poc-sos',
        userName: 'SOS PoC',
        action: 'Created Event',
        details: 'Symposium scheduled on Ramanujan Seminar Hall.',
        category: 'event'
      }
    ]
  },
  {
    id: 'evt-arch-exhibit',
    title: 'SEDA Biennale 2026: Sustainable Habitats & Urbanism',
    type: 'cultural',
    school: 'SEDA',
    objective: 'Showcase architectural design models, landscape interventions, and urban planning thesis projects.',
    department: 'School of Environmental Design and Architecture',
    ownerId: 'user-poc-seda',
    ownerName: 'SEDA PoC',
    ownerEmail: 'seda.poc@nuv.ac.in',
    startDate: '2026-10-24',
    endDate: '2026-10-25',
    startTime: '10:00',
    endTime: '19:00',
    venueId: 'venue-amphi',
    venueName: 'Nalanda Open Amphitheatre',
    audienceSize: 500,
    expectedAudienceDesc: 'Architecture students, council delegates, urban planners, public visitors',
    status: 'in_preparation',
    createdAt: '2026-09-30T10:00:00Z',
    isLate: false,
    clashes: [],
    guests: [],
    isInternalOnly: true,
    guestDetailsSkipped: true,
    creatives: [
      {
        id: 'cr-seda-1',
        eventId: 'evt-arch-exhibit',
        typeKey: 'standee',
        label: 'Exhibition Standee',
        specs: '6ft x 3ft fabric banner with exhibition floor plan',
        quantity: 6,
        neededByDate: '2026-10-20',
        status: 'in_review',
        assignedDesignerId: 'user-creative-team',
        assignedDesignerName: 'Creative Team',
        revisionCount: 0,
        revisionNotes: [],
        versions: []
      }
    ],
    logisticsTasks: [
      {
        id: 'task-seda-1',
        eventId: 'evt-arch-exhibit',
        subTeam: 'venue_housekeeping',
        title: 'Model display plinths and spotlight rigging in Courtyard',
        assignedToName: 'Logistics',
        dueDate: '2026-10-23',
        status: 'in_progress',
        priority: 'high'
      },
      {
        id: 'task-seda-it-1',
        eventId: 'evt-arch-exhibit',
        subTeam: 'it_infra',
        title: 'Interactive touchscreen kiosks network cabling and Wi-Fi access',
        assignedToName: 'IT Team',
        dueDate: '2026-10-23',
        status: 'pending',
        priority: 'medium'
      },
      {
        id: 'task-seda-av-1',
        eventId: 'evt-arch-exhibit',
        subTeam: 'audio_visual',
        title: 'Ambient outdoor soundscape audio system and evening display lighting',
        assignedToName: 'Logistics',
        dueDate: '2026-10-23',
        status: 'pending',
        priority: 'high'
      }
    ],
    activityLog: [
      {
        id: 'act-seda-1',
        eventId: 'evt-arch-exhibit',
        timestamp: '2026-09-30T10:00:00Z',
        userId: 'user-poc-seda',
        userName: 'SEDA PoC',
        action: 'Created Event',
        details: 'Exhibition scheduled with guest details skipped.',
        category: 'event'
      }
    ]
  }
];

export const INITIAL_UPLOADS: UploadRecord[] = [
  {
    id: 'up-1',
    userId: 'user-faculty-1',
    userName: 'Dr. Shilpa Thackre',
    userRole: 'faculty',
    eventId: 'evt-ai-conclave',
    eventTitle: 'National AI & Robotics Conclave 2026',
    category: 'guest_photo',
    fileName: 'dr_aarav_deshmukh_hq_300dpi.jpg',
    fileType: 'image/jpeg',
    fileSize: '4.2 MB',
    fileSizeRaw: 4200000,
    uploadedAt: '2026-09-25T11:15:00Z',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    isFinal: true,
    version: 1,
    guestId: 'guest-1'
  },
  {
    id: 'up-2',
    userId: 'user-designer-1',
    userName: 'Rohan Mehta',
    userRole: 'creative',
    eventId: 'evt-ai-conclave',
    eventTitle: 'National AI & Robotics Conclave 2026',
    category: 'creative_final',
    fileName: 'NUV_AI_Conclave_Poster_FINAL.pdf',
    fileType: 'application/pdf',
    fileSize: '9.1 MB',
    fileSizeRaw: 9100000,
    uploadedAt: '2026-10-02T11:15:00Z',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    isFinal: true,
    version: 2,
    creativeId: 'cr-ai-1'
  },
  {
    id: 'up-3',
    userId: 'user-creative-lead',
    userName: 'Ananya Sharma',
    userRole: 'creative',
    eventId: 'evt-admissions-open',
    eventTitle: 'NUV Open House & Campus Discovery Day',
    category: 'creative_final',
    fileName: 'NUV_Discovery_Day_Brochure_Print.pdf',
    fileType: 'application/pdf',
    fileSize: '12.8 MB',
    fileSizeRaw: 12800000,
    uploadedAt: '2026-10-03T14:00:00Z',
    url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    isFinal: true,
    version: 1,
    creativeId: 'cr-adm-1'
  }
];

export const INITIAL_DOWNLOAD_LOGS: DownloadLogEntry[] = [
  {
    id: 'dl-1',
    userId: 'user-faculty-1',
    userName: 'Dr. Shilpa Thackre',
    userRole: 'Faculty',
    eventId: 'evt-ai-conclave',
    eventTitle: 'National AI & Robotics Conclave 2026',
    fileName: 'NUV_AI_Conclave_Poster_FINAL.pdf',
    format: 'PDF',
    downloadedAt: '2026-10-03T09:12:00Z'
  },
  {
    id: 'dl-2',
    userId: 'user-admin-1',
    userName: 'Vikram Seth',
    userRole: 'Admin',
    eventId: 'evt-admissions-open',
    eventTitle: 'NUV Open House & Campus Discovery Day',
    fileName: 'NUV_Discovery_Day_Brochure_Print.pdf',
    format: 'PDF',
    downloadedAt: '2026-10-04T11:45:00Z'
  }
];

export const INITIAL_MEDIA_LINKS: MediaShareLink[] = [
  {
    id: 'link-1',
    token: 'med-nuv-992a',
    eventId: 'evt-ai-conclave',
    eventTitle: 'National AI & Robotics Conclave 2026',
    createdBy: 'Vikram Seth (Admin)',
    createdAt: '2026-10-03T10:00:00Z',
    expiresAt: '2026-10-18T10:00:00Z',
    accessibleFilesCount: 2,
    downloadsCount: 14,
    recipientLabel: 'Times of India & Divya Bhaskar Press Bureau',
    isRevoked: false
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: '⚠️ Venue Clash Detected',
    message: 'National AI Conclave and Startup Pitch Fest clash on University Auditorium (2026-10-15).',
    timestamp: '2026-10-05T09:00:00Z',
    type: 'clash',
    eventId: 'evt-ai-conclave',
    read: false
  },
  {
    id: 'notif-2',
    title: '⏱️ Late Creative Request Awaiting Acceptance',
    message: 'Zero-Day Exploit Defense submitted with < 7 days notice. Workload decision required by Creative Lead.',
    timestamp: '2026-10-05T16:01:00Z',
    type: 'late_request',
    eventId: 'evt-late-cyber',
    read: false
  },
  {
    id: 'notif-3',
    title: '🚨 5-Day Risk Alert: Unapproved Creatives',
    message: 'National AI Conclave is within 9 days with Stage LED Backdrop still in review.',
    timestamp: '2026-10-06T08:00:00Z',
    type: 'risk_5day',
    eventId: 'evt-ai-conclave',
    read: false
  }
];
