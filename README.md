# Itai Rotem - Portfolio

A modern, immersive 3D portfolio website featuring an interactive neural network visualization, smooth scroll-driven animations, and dynamic section transitions.

**Live Site:** [itairotem.com](https://itairotem.com)

## Tech Stack

- **Framework:** Next.js 16
- **3D Graphics:** React Three Fiber, Three.js, @react-three/drei
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS
- **Deployment:** Google Cloud Run

## Features

- Interactive 3D neural network with orbital controls
- Scroll-driven camera animations through 5 sections
- Immersive "world" transitions for each section
- Responsive design with mobile support
- Terminal-style About section
- Crypto-themed Skills display
- Blueprint-style Projects showcase
- Version history Experience timeline

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Main page with scroll logic
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
└── components/
    ├── 3d/
    │   ├── NetworkScene.tsx       # Canvas wrapper
    │   └── InteractiveNetwork.tsx # 3D network + camera
    └── sections/
        ├── SectionOverlays.tsx    # Section router
        ├── AboutSection.tsx       # Terminal UI
        ├── ProjectsSection.tsx    # Blueprint cards
        ├── SkillsSection.tsx      # Crypto ticker
        ├── ExperienceSection.tsx  # Version timeline
        └── ContactSection.tsx     # Contact form
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Deployment

Deployed on Google Cloud Run with Docker:

```bash
gcloud run deploy itai-portfolio --source . --region us-central1
```

## Author

**Itai Rotem**
- Website: [itairotem.com](https://itairotem.com)
- GitHub: [@itaiwins](https://github.com/itaiwins)
- LinkedIn: [itai-rotem23](https://linkedin.com/in/itai-rotem23)
