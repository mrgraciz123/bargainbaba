import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar } from 'lucide-react';

export default function WeddingTimeline({ timeline }: { timeline: any[] }) {
  if (!timeline || timeline.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="space-y-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-wedding-gold" />
        <span className="text-xs font-bold uppercase tracking-widest text-wedding-gold">AI Wedding Timeline</span>
      </div>

      <div className="glass-card rounded-3xl border border-wedding-gold/20 p-6 md:p-8">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-wedding-gold/30 before:to-transparent">
          {timeline.map((item: any, i: number) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-wedding-gold/50 bg-[#110204] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.2)] z-10">
                <Calendar className="w-4 h-4 text-wedding-gold" />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-white/3 border border-white/5 hover:border-wedding-gold/30 transition-colors ml-4 md:ml-0">
                <span className="font-cinzel font-bold text-wedding-gold text-lg block mb-3">{item.milestone}</span>
                <ul className="space-y-2">
                  {item.tasks?.map((task: string, tIdx: number) => (
                    <li key={tIdx} className="text-xs text-gray-300 flex items-start gap-2">
                      <span className="text-wedding-gold mt-0.5">•</span> {task}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
