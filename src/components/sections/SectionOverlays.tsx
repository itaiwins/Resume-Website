'use client';

import { motion, AnimatePresence } from 'framer-motion';
import SkillsSection from './SkillsSection';
import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import ExperienceSection from './ExperienceSection';
import ContactSection from './ContactSection';

interface SectionOverlaysProps {
  activeSection: string | null;
  progress: number;
  onReturnToMain?: () => void;
}

export default function SectionOverlays({ activeSection, progress, onReturnToMain }: SectionOverlaysProps) {
  return (
    <AnimatePresence mode="wait">
      {activeSection && (
        <motion.div
          key={activeSection}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-40"
        >
          {activeSection === 'skills' && <SkillsSection progress={progress} />}
          {activeSection === 'about' && <AboutSection progress={progress} />}
          {activeSection === 'projects' && <ProjectsSection progress={progress} />}
          {activeSection === 'experience' && <ExperienceSection progress={progress} />}
          {activeSection === 'contact' && <ContactSection progress={progress} onReturnToMain={onReturnToMain} />}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
