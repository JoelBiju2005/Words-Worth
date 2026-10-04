/* ═══════════════════════════════════════════════════════════════════════════
 *  PAGES DATA & TYPES DEFINITION
 *  Modular data feed for the book's scrapbook visual system.
 * ═══════════════════════════════════════════════════════════════════════════ */

export type PaperStyle = 'floral' | 'grid' | 'kraft' | 'parchment';

export type DoodlePack = 'literary' | 'events' | 'achievements' | 'people' | 'contact';

export type MountStyle = 'tape' | 'pin' | 'corner';

export interface ImageSlot {
  id: string; // E.g., 'clubGroupPhoto', 'deBattle1_actionShot'
  caption: string;
  mountStyle?: MountStyle;
  rotation?: number; // Optional explicit rotation (-6 to +6 deg), or randomized
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'wide';
}

export type ContentCardType = 'bullet' | 'stat' | 'paragraph';

export interface ContentCard {
  type: ContentCardType;
  title?: string;
  badge?: string;
  text: string | string[]; // Single paragraph/stat or array of bullet strings
  accentColor?: string; // Optional accent border/badge tint
}

export interface ScrapbookPageSpread {
  id: string;
  spreadIndex: number;
  // Left page (Scrapbook / visual)
  leftPage: {
    title: string;
    subtitle?: string;
    paperStyle: PaperStyle;
    doodlePack: DoodlePack;
    imageSlots: ImageSlot[];
    extraNotes?: string[];
  };
  // Right page (Content / text)
  rightPage: {
    title?: string;
    paperStyle: PaperStyle;
    doodlePack: DoodlePack;
    cards: ContentCard[];
    quote?: {
      text: string;
      attribution?: string;
    };
  };
}

/**
 * Full page content definition feeding the scrapbook layout engine.
 * 9 Spreads total (0 to 8).
 */
export const BOOK_PAGES_DATA: ScrapbookPageSpread[] = [
  // ── Spread 0: Index + About Us ──
  {
    id: 'spread-0-home',
    spreadIndex: 0,
    leftPage: {
      title: 'Table of Contents',
      subtitle: 'Navigate the Anthology',
      paperStyle: 'kraft',
      doodlePack: 'literary',
      imageSlots: [],
      extraNotes: [],
    },
    rightPage: {
      title: 'About Us',
      paperStyle: 'parchment',
      doodlePack: 'literary',
      quote: {
        text: 'Driven by a passion for words, we nurture confidence, curiosity, leadership, and self-expression.',
        attribution: '— Established 2021 —',
      },
      cards: [
        {
          type: 'paragraph',
          title: 'About Us',
          text: 'Word’s Worth is the English Literary Club of KLE Technological University, dedicated to celebrating language, literature, and creative expression. Our purpose is to give everyone the chance to grow as a speaker, writer, storyteller, and thinker, while discovering the joy of sharing thoughts. Driven by a passion for words, the club nurtures confidence, curiosity, leadership, and self-expression. Together, we strive to uncover the voices within us and let them echo-boldly, beautifully, and with impact.',
        },
      ],
    },
  },

  // ── Spread 1: About — Who We Are ──
  {
    id: 'spread-1-about',
    spreadIndex: 1,
    leftPage: {
      title: 'Who We Are',
      subtitle: 'Celebrating Language & Mind',
      paperStyle: 'kraft',
      doodlePack: 'literary',
      imageSlots: [
        {
          id: 'clubGroupPhoto',
          caption: 'Add: Club group photo — members & core team',
          mountStyle: 'corner',
          aspectRatio: 'landscape',
          rotation: 3.2,
        },
        {
          id: 'clubLogoArtwork',
          caption: 'Add: Handcrafted logo banner or stage backdrop',
          mountStyle: 'tape',
          aspectRatio: 'square',
          rotation: -4.0,
        },
      ],
    },
    rightPage: {
      title: 'About Word\'s Worth',
      paperStyle: 'kraft',
      doodlePack: 'literary',
      cards: [
        {
          type: 'paragraph',
          title: 'Our Essence',
          text: 'Word\'s Worth is the English Literary Club of KLE Technological University. Our purpose is to give everyone the chance to grow as a speaker, writer, storyteller, and thinker, while discovering the boundless joy of sharing thoughts.',
        },
        {
          type: 'paragraph',
          title: 'The Literary Crucible',
          text: 'Through debates, open discussions, poetry, storytelling, and literary quizzes, the club sharpens communication skills and encourages critical thinking. With platforms for performances and collaborative experiments, it fosters leadership and fearless expression.',
        },
        {
          type: 'bullet',
          title: 'Vision & Mission',
          badge: 'Core Ideals',
          text: [
            'Mission: Create a conducive English-speaking environment inspiring confidence, critical thinking, and collaborative learning.',
            'Vision: Establish Word\'s Worth as a centre of excellence for communication, fearless articulation, and leadership.',
          ],
        },
      ],
    },
  },

  // ── Spread 2: Objectives & Clusters ──
  {
    id: 'spread-2-clusters',
    spreadIndex: 2,
    leftPage: {
      title: 'The Blueprint',
      subtitle: 'Four Pillars of Execution',
      paperStyle: 'grid',
      doodlePack: 'literary',
      imageSlots: [
        {
          id: 'clusterBrainstorming',
          caption: 'Add: Clusters at work — ideation whiteboard & planning',
          mountStyle: 'pin',
          aspectRatio: 'wide',
          rotation: -2.8,
        },
        {
          id: 'designProduction',
          caption: 'Add: Design cluster crafting posters & digital art',
          mountStyle: 'tape',
          aspectRatio: 'square',
          rotation: 4.5,
        },
      ],
    },
    rightPage: {
      title: 'Objectives & Clusters',
      paperStyle: 'grid',
      doodlePack: 'literary',
      cards: [
        {
          type: 'bullet',
          title: 'Core Objectives',
          badge: 'Charter',
          text: [
            'Promote and uphold peer collaborative learning through dynamic activities.',
            'Provide students a welcoming, non-judgmental platform for honing English skills.',
            'Inspire fearless articulation and critical inquiry across diverse topics.',
            'Foster a thriving English-speaking community culture on campus.',
          ],
        },
        {
          type: 'stat',
          title: 'The Four Functional Clusters',
          text: [
            'Creative Planning: Ideates themes, formats, timelines, and logistical frameworks.',
            'PR & Media: Manages campus announcements, social presence, and public outreach.',
            'Design & Visuals: Crafts posters, brochures, digital media, photography, and video.',
            'Research: Gathers background knowledge, topic dossiers, debate motions, and quiz data.',
          ],
        },
      ],
    },
  },

  // ── Spread 3: Events Archive I ──
  {
    id: 'spread-3-events1',
    spreadIndex: 3,
    leftPage: {
      title: 'Past Archives I',
      subtitle: 'Where Voices First Echoed',
      paperStyle: 'floral',
      doodlePack: 'events',
      imageSlots: [
        {
          id: 'openMic1_actionShot',
          caption: 'Add: Open Mic 1.0 — acoustic & spoken word on stage',
          mountStyle: 'tape',
          aspectRatio: 'landscape',
          rotation: -3.5,
        },
        {
          id: 'deBattle1_stage',
          caption: 'Add: De-Battle 1.0 — debate round clash',
          mountStyle: 'pin',
          aspectRatio: 'square',
          rotation: 3.8,
        },
      ],
    },
    rightPage: {
      title: 'Foundational Showcases',
      paperStyle: 'floral',
      doodlePack: 'events',
      cards: [
        {
          type: 'paragraph',
          title: 'Open Mic 1.0',
          badge: '2 March 2022',
          text: 'When words found their stage and voices found their power. A dedicated space for students to freely share poetry, personal anecdotes, and music — breaking stage fear and discovering expressive confidence.',
        },
        {
          type: 'stat',
          title: 'De-Battle 1.0',
          badge: '12–13 Aug 2022',
          text: [
            '37 Teams (74 Participants) in fierce intellectual combat',
            'Structured parliamentary debate rounds evaluating logic and counter-rebuttal',
            'Cultivated critical thinking, poise, and impromptu rhetoric',
          ],
        },
        {
          type: 'paragraph',
          title: 'WordWhizzle 1.0',
          badge: '16–17 Dec 2022',
          text: 'A two-day literary fest spanning crosswords, Taboo, creative storytelling (Inkitt), and high-speed inquisition. 108 participants in 54 teams tested wit and vocabulary.',
        },
      ],
    },
  },

  // ── Spread 4: Events II & Workshops ──
  {
    id: 'spread-4-events2',
    spreadIndex: 4,
    leftPage: {
      title: 'Craft & Masterclass',
      subtitle: 'Sharpening the Quill',
      paperStyle: 'kraft',
      doodlePack: 'events',
      imageSlots: [
        {
          id: 'penelope_action',
          caption: 'Add: Penelope 2023 — team puzzle round action shot',
          mountStyle: 'corner',
          aspectRatio: 'landscape',
          rotation: 2.5,
        },
        {
          id: 'workshop_session',
          caption: 'Add: Public Speaking Bootcamp & Workshop session',
          mountStyle: 'tape',
          aspectRatio: 'square',
          rotation: -4.2,
        },
      ],
    },
    rightPage: {
      title: 'Agility & Masterclasses',
      paperStyle: 'kraft',
      doodlePack: 'events',
      cards: [
        {
          type: 'paragraph',
          title: 'Penelope: Mental Agility',
          badge: '12 May 2023',
          text: 'A tri-round challenge featuring Holy Claps, Listen Mania, and Twistato. Tested rapid auditory comprehension, spontaneous storytelling, and quick-witted adaptability under clock pressure.',
        },
        {
          type: 'paragraph',
          title: 'Open Mic 2.0',
          badge: '27 Nov 2023',
          text: 'Building upon the foundational spirit, 20 diverse performers held an audience of over 100 students spellbound with soul-stirring poetry, storytelling, and acoustic musical collabs.',
        },
        {
          type: 'bullet',
          title: 'Workshops & Bootcamps',
          badge: 'Skill Development',
          text: [
            'Parliamentary Debate Fundamentals: Argument construction & rebuttal strategy',
            'Creative Prose & Spoken Word: Metaphor, rhythm, pacing, and presence',
            'JAM Mastery: Eliminating hesitation, repetition, and deviation in 60 seconds',
          ],
        },
      ],
    },
  },

  // ── Spread 5: Events Archive III ──
  {
    id: 'spread-5-events3',
    spreadIndex: 5,
    leftPage: {
      title: 'Dynamic Duels',
      subtitle: 'Poetry Meets Melody',
      paperStyle: 'grid',
      doodlePack: 'events',
      imageSlots: [
        {
          id: 'wordWhizzle2_teams',
          caption: 'Add: WordWhizzle 2.0 — puzzle table gameplay',
          mountStyle: 'tape',
          aspectRatio: 'landscape',
          rotation: -3.0,
        },
        {
          id: 'deBattle2_poetryMusic',
          caption: 'Add: De-Battle 2.0 — Poetry × Music live accompaniment',
          mountStyle: 'pin',
          aspectRatio: 'square',
          rotation: 4.0,
        },
      ],
    },
    rightPage: {
      title: 'The Evolving Arena',
      paperStyle: 'grid',
      doodlePack: 'events',
      cards: [
        {
          type: 'paragraph',
          title: 'WordWhizzle 2.0',
          badge: '7–8 June 2024',
          text: 'Scaled up into an expansive multi-round celebration of linguistics, linguistic logic, and cooperative teamwork, highlighting problem-solving under creative constraints.',
        },
        {
          type: 'stat',
          title: 'De-Battle 2.0',
          badge: '14–15 Nov 2024',
          text: [
            'Motion: "Engage in thought, compete with wit"',
            'Rigorous preliminary heats culminating in a high-voltage grand finale',
            'Special Feature: Live Poetry × Music Fusion performed with the KLE Tech Music Club',
          ],
        },
        {
          type: 'paragraph',
          title: 'Poetry × Music Fusion',
          badge: 'Collaboration',
          text: 'A landmark collaborative showcase blending raw verse with live acoustic scoring, proving that literature and rhythm belong to the exact same breath.',
        },
      ],
    },
  },

  // ── Spread 6: Pleiades Literary Conclave ──
  {
    id: 'spread-6-pleiades',
    spreadIndex: 6,
    leftPage: {
      title: 'Pleiades 2025',
      subtitle: 'The Annual Literary Conclave',
      paperStyle: 'floral',
      doodlePack: 'events',
      imageSlots: [
        {
          id: 'pleiades_mainStage',
          caption: 'Add: Pleiades Conclave main stage & banner',
          mountStyle: 'corner',
          aspectRatio: 'landscape',
          rotation: 2.0,
        },
        {
          id: 'witCraft_auction',
          caption: 'Add: Wit Craft — Bid & Build story round',
          mountStyle: 'tape',
          aspectRatio: 'square',
          rotation: -3.5,
        },
      ],
    },
    rightPage: {
      title: 'Conclave Competitions',
      paperStyle: 'floral',
      doodlePack: 'events',
      cards: [
        {
          type: 'paragraph',
          title: 'De-Battle: Conclave Cup',
          badge: 'May 9–10',
          text: 'Articulate expression meets logical reasoning. Participants wrestled high-stake geopolitical and philosophical motions before distinguished faculty adjudicators.',
        },
        {
          type: 'bullet',
          title: 'Wit Craft: Three-Phase Gauntlet',
          badge: 'May 10–11',
          text: [
            'Round 1 — Bid & Build: Auctioning bizarre story elements to stitch a cohesive plot.',
            'Round 2 — Caught Off Guard: High-pressure improvisational scenario roleplay.',
            'Round 3 — Myth Battle: Defending controversial mythological & historical figures.',
          ],
        },
        {
          type: 'paragraph',
          title: 'Just A Minute (JAM)',
          badge: 'May 11',
          text: 'The gold standard of spontaneous wit. 60 seconds of unhesitating, razor-sharp eloquence under constant challenge from competitors.',
        },
      ],
    },
  },

  // ── Spread 7: Achievements & Laurels ──
  {
    id: 'spread-7-achievements',
    spreadIndex: 7,
    leftPage: {
      title: 'Our Laurels',
      subtitle: 'State & National Triumphs',
      paperStyle: 'kraft',
      doodlePack: 'achievements',
      imageSlots: [
        {
          id: 'moodIndigo_podium',
          caption: 'Add: IIT Bombay Mood Indigo 2025 winners on podium',
          mountStyle: 'tape',
          aspectRatio: 'landscape',
          rotation: -2.5,
        },
        {
          id: 'mitRevels_trophy',
          caption: 'Add: MIT Revels Manipal trophy presentation',
          mountStyle: 'corner',
          aspectRatio: 'square',
          rotation: 3.5,
        },
      ],
    },
    rightPage: {
      title: 'Championship Roll',
      paperStyle: 'kraft',
      doodlePack: 'achievements',
      cards: [
        {
          type: 'stat',
          title: 'Mood Indigo — IIT Bombay (2023 & 2025)',
          badge: 'National Winners',
          text: [
            'Wordemort: Winners — Sanjana Lengade & Joel Biju (2025)',
            'Speak Up: 1st Runner-Up — Nimisha M (2025)',
            'Spell Bound: 1st Runner-Up — Sanjana Chinnannavar (2025)',
            'Podcast Competition: 2nd Place — Ashlesha K (2023)',
            'Turncoat Debate: 3rd Place — Sayyam H (2023)',
          ],
        },
        {
          type: 'stat',
          title: 'MIT Revels — Manipal',
          badge: 'Podium Finishes',
          text: [
            'JAM: 1st Place — Huda Mariyam',
            'Hindi Debate: 1st Place — Apramey Doddamani',
            'Off-the-Cuff Speaking: 2nd Place — Purvi Patil',
          ],
        },
        {
          type: 'stat',
          title: 'GIT AURA 2026 — Belagavi',
          badge: '9 Distinct Prizes',
          text: [
            'Swept podium finishes across Parliamentary Debate, Creative Writing & Extempore',
            'Awardees: Nimisha M, Megha Malagi, Joel Biju, Surabhi Mukre, Gaurav Patil',
          ],
        },
      ],
    },
  },

  // ── Spread 8: Team & Contact ──
  {
    id: 'spread-8-team',
    spreadIndex: 8,
    leftPage: {
      title: 'Our Team',
      subtitle: 'The Architects of Expression',
      paperStyle: 'parchment',
      doodlePack: 'people',
      imageSlots: [
        {
          id: 'Nimisha_PresidentWord\'sWorthClub.jpeg',
          caption: 'Add: Nimisha M — President',
          mountStyle: 'pin',
          aspectRatio: 'portrait',
          rotation: -3.0,
        },
        {
          id: 'JoelBiju_VPWord\'sWorthClub.jpeg',
          caption: 'Add: Joel Biju — Vice President',
          mountStyle: 'tape',
          aspectRatio: 'portrait',
          rotation: 2.5,
        },
        {
          id: 'Achyut_SecretaryWord\'sWorthClub.jpeg',
          caption: 'Add: Achyut Bidkar — Secretary',
          mountStyle: 'corner',
          aspectRatio: 'portrait',
          rotation: -2.0,
        },
        {
          id: 'Apeksha_DeputySecWord\'sWorthClub.jpeg',
          caption: 'Add: Apeksha Dambal — Deputy Secretary',
          mountStyle: 'tape',
          aspectRatio: 'portrait',
          rotation: 3.0,
        },
      ],
    },
    rightPage: {
      title: 'Leadership & Connect',
      paperStyle: 'parchment',
      doodlePack: 'contact',
      cards: [
        {
          type: 'stat',
          title: 'Executive Council (2025–2026)',
          badge: 'Core Officers',
          text: [
            'Nimisha M — President',
            'Joel Biju — Vice President',
            'Achyut Bidkar — Secretary',
            'Apeksha Dambal — Deputy Secretary',
          ],
        },
        {
          type: 'bullet',
          title: 'Ex-Presidents & Founding Roll',
          badge: 'Honor Roll',
          text: [
            'Honouring the founding pioneers and former presidents who established Word\'s Worth.',
            'Preserving traditions of fearless mentorship, camaraderie, and literary distinction.',
          ],
        },
        {
          type: 'paragraph',
          title: 'Get Involved',
          badge: 'Join Us',
          text: 'Join us and discover the voice within you — boldly, beautifully, and with lasting impact. Follow our official channels for audition notices, writing prompts, and upcoming conclaves.',
        },
      ],
    },
  },
];
