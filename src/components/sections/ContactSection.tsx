'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface ContactSectionProps {
  progress: number;
  onReturnToMain?: () => void;
}

// Contact links with SVG icons
const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'itairotem23@gmail.com',
    href: 'mailto:itairotem23@gmail.com',
    description: 'Best for inquiries',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'github.com/itaiwins',
    href: 'https://github.com/itaiwins',
    description: 'Check out my code',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'in/itai-rotem23',
    href: 'https://www.linkedin.com/in/itai-rotem23/',
    description: 'Professional network',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Twitter/X',
    value: '@itaiwins',
    href: 'https://twitter.com/itaiwins',
    description: 'Thoughts & updates',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

// FAQ items
const FAQ_ITEMS = [
  {
    q: 'What kind of projects do you work on?',
    a: 'I specialize in crypto trading systems, Web3 development, and AI-powered automation. I love building tools that give traders an edge.',
  },
  {
    q: 'Are you available for freelance work?',
    a: 'Yes! I\'m open to freelance and consulting opportunities, especially in the crypto/Web3 space. Let\'s discuss your project.',
  },
  {
    q: 'What\'s your typical response time?',
    a: 'I usually respond within 24-48 hours. For urgent matters, mention it in your message or DM me on Twitter.',
  },
];

// Contact card component
function ContactCard({ contact, index }: { contact: typeof CONTACT_LINKS[0]; index: number }) {
  return (
    <motion.a
      href={contact.href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.08, duration: 0.4 }}
      className="group flex items-center gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-[#d4af37]/30 transition-all duration-300"
    >
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/50 group-hover:text-[#d4af37] group-hover:border-[#d4af37]/30 transition-all">
        {contact.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-white/30 uppercase tracking-wider mb-1">{contact.label}</div>
        <div className="text-white font-medium truncate group-hover:text-[#d4af37] transition-colors">
          {contact.value}
        </div>
      </div>
      <svg className="w-4 h-4 text-white/20 group-hover:text-[#d4af37] transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </motion.a>
  );
}

// FAQ Accordion item
function FAQItem({ item, index }: { item: typeof FAQ_ITEMS[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
      className="border-b border-white/5 last:border-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left group"
      >
        <span className="font-medium text-white/80 group-hover:text-white transition-colors pr-4">{item.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          className="w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0"
        >
          <span className="text-white/40 text-sm leading-none">+</span>
        </motion.div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-white/50 leading-relaxed text-sm">{item.a}</p>
      </motion.div>
    </motion.div>
  );
}

export default function ContactSection({ progress, onReturnToMain }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const isVisible = progress > 0.1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Create mailto link with form data
    const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`);
    const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
    window.location.href = `mailto:itairotem23@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="w-full h-full bg-[#0a0b0f] text-white overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto flex flex-col">
        {/* Header Section */}
        <div className="px-10 pt-12 pb-10 border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Available for opportunities</span>
            </motion.div>

            <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              Let&apos;s
              <span className="text-[#d4af37]"> Connect</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl">
              Have a project in mind? Want to collaborate? I&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-10">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left Column - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <div className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-8">
                  <h2 className="text-xl font-semibold mb-6">Send a Message</h2>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your name"
                        required
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your@email.com"
                        required
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2">Message</label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Tell me about your project..."
                        rows={4}
                        required
                        className="w-full px-4 py-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-white/25 focus:outline-none focus:border-[#d4af37]/50 focus:bg-white/[0.05] transition-all resize-none"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8973a] text-black font-semibold hover:from-[#e5c349] hover:to-[#d4af37] transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
                    >
                      Send Message
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </motion.button>
                  </form>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Links & FAQ */}
            <div className="space-y-6">
              {/* Contact Links */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4">Connect With Me</h3>
                <div className="space-y-3">
                  {CONTACT_LINKS.map((contact, i) => (
                    <ContactCard key={contact.label} contact={contact} index={i} />
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="bg-white/[0.02] rounded-2xl border border-white/5 overflow-hidden"
              >
                <div className="p-8">
                  <h3 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4">Frequently Asked</h3>
                  <div>
                    {FAQ_ITEMS.map((item, i) => (
                      <FAQItem key={i} item={item} index={i} />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-10 pb-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-center pt-10 border-t border-white/5"
          >
            <p className="text-white/25 text-sm mb-3">
              Built with Next.js, Three.js & TypeScript
            </p>
            <p className="text-white/15 text-xs">
              © {new Date().getFullYear()} Itai Rotem. All rights reserved.
            </p>

            {/* Spacer */}
            <div className="h-8" />

            {/* Back to Main Page Button */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 15 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              onClick={() => {
                if (onReturnToMain) {
                  onReturnToMain();
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
            >
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Back to Main Page
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
