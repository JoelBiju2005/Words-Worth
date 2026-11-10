<div align="center">

# 📖 Word's Worth

### An immersive 3D book experience for the English Literary Club of KLE Technological University

*Step into a candle-lit study, open the book, and turn the pages.*

[**🌐 Live Demo**](https://words-worth-psi.vercel.app) · [Report a Bug](https://github.com/JoelBiju2005/Words-Worth/issues) · [Request a Feature](https://github.com/JoelBiju2005/Words-Worth/issues)

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-R3F-000000?logo=threedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Vercel-deployed-000000?logo=vercel&logoColor=white)

</div>

---

## ✨ About

**Word's Worth** is the official English Literary Club of **KLE Technological University, Hubballi**. This website is the club's home on the web: a 3D antique study you can explore, with a hardcover book on a writing desk that opens into a scrapbook-style site covering the club's story, events, achievements, and team.

Rather than a conventional scrolling page, visitors walk into a room, look around, and open the book to explore.

> 📸 *Add a hero screenshot or GIF here:* `docs/hero.gif`

---

## 🎬 The Experience

| Step | What happens |
|---|---|
| **1. Explore** | Orbit the room within a limited arc: a desk lamp, gramophone, bookshelves, an awards wall and a moonlit window. |
| **2. Open the book** | Click the book. The camera glides in and the cover swings open. |
| **3. Read** | A veil transition fades into a full-screen scrapbook spread with an index, content pages and ribbon bookmarks. |
| **4. Navigate** | Use the contents page, the ribbon bookmarks, PREV/NEXT, or the keyboard (`←` `→`, `Esc`). |
| **5. Look outside** | Click the window to open the casement and view a moonlit river, path and mountains in 3D. |

---

## 🧰 Features

- **3D reading room** built with React Three Fiber: antique desk, brass lamp, gramophone, bookshelves, rug, chair and wall-mounted candelabra
- **Animated book** with a cover-opening sequence, camera tweening and ribbon bookmarks
- **Scrapbook page design** with layered paper textures, washi tape, clips, stickers and handwritten type
- **Interactive window view**: an opening casement onto an exterior night landscape (half-moon, lantern-lit path, river, distant mountains)
- **Awards wall** with trophy and medal shelves for the club's national-level achievements, plus a noticeboard
- **Atmospheric lighting** with steady lamp light, flickering candles, moonlight and dust particles
- **Constrained camera** so the user always sees a composed view
- **Keyboard and UI navigation** with a bottom control bar, page counter and exit button

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React + TypeScript |
| Build tool | Vite |
| 3D | Three.js via `@react-three/fiber` and `@react-three/drei` |
| State | Zustand |
| Animation | GSAP |
| Styling | CSS, Google Fonts |
| Linting | Oxlint |
| Hosting | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or newer
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/JoelBiju2005/Words-Worth.git
cd Words-Worth

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server with HMR |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run Oxlint |

---

## 📁 Project Structure

```
Words-Worth/
├── public/                  # Static assets (logo, images)
├── src/
│   ├── components/          # Scene, Room, Book, DeskProps, CameraRig,
│   │                        # WindowView, UIOverlay, spread pages…
│   ├── store/               # Zustand store (camera, book and window state)
│   ├── utils/               # Procedural textures and helpers
│   ├── types/               # Shared TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── vite.config.ts
└── package.json
```

> Adjust folder names to match the repo.

---

## 🖼️ Adding Your Own Photos

Photo slots in the book are placeholders with captions that say what to add and the recommended size. To fill them:

1. Drop images into `public/assets/`.
2. Pass the image path to the matching slot in the page's data config.
3. The image replaces the placeholder inside the same frame, tape and rotation.

---

## 🏆 Club Highlights

Word's Worth has represented KLE Tech at Mood Indigo (IIT Bombay), MIT Revels (Manipal), NITK Model United Nations and GIT AURA (Belagavi), with podium finishes in debate, Just A Minute, word games, poetry and open mic. The full list is on the awards wall in the 3D room and in the Achievements section of the book.

---

## 🌐 Deployment

The site is deployed on **Vercel**, and every push to `main` triggers a new deployment.

```bash
npm run build   # outputs to /dist
```

---

## 💻 Browser Support

Needs a browser with WebGL support (current Chrome, Edge, Firefox or Safari). Unsupported browsers see a styled fallback page. A desktop is recommended for the full 3D experience.

---

## 🤝 Contributing

Club members and contributors are welcome.

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add your feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📬 Connect With the Club

- 📷 **Instagram:** [@wordsworth_kletech](https://www.instagram.com/wordsworth_kletech)
- 💼 **LinkedIn:** [Word's Worth English Club](https://www.linkedin.com/company/wordsworth-englishclub/)
- 🌐 **Website:** [words-worth-psi.vercel.app](https://words-worth-psi.vercel.app)

---

## 👤 Author

**Joel Biju**, Vice President and technical lead, Word's Worth
B.E. Computer Science & Engineering (AI), KLE Technological University
GitHub: [@JoelBiju2005](https://github.com/JoelBiju2005)

---

<div align="center">

*Made with ❤️, and a lot of candlelight, by Word's Worth, KLE Tech.*

</div>
