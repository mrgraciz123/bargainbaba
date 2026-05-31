import React from 'react';
import { Building2, Camera, UtensilsCrossed, Palette, HeartHandshake } from 'lucide-react';

export const categoryIcons: Record<string, React.ReactNode> = {
  Venue: React.createElement(Building2, { className: "w-5 h-5" }),
  Photography: React.createElement(Camera, { className: "w-5 h-5" }),
  Catering: React.createElement(UtensilsCrossed, { className: "w-5 h-5" }),
  Decoration: React.createElement(Palette, { className: "w-5 h-5" }),
  'Makeup Artist': React.createElement(HeartHandshake, { className: "w-5 h-5" }),
};

export const categoryColors: Record<string, string> = {
  Venue: '#D4AF37',
  Photography: '#10B981',
  Catering: '#FF8A00',
  Decoration: '#8B5CF6',
  'Makeup Artist': '#EC4899',
};
