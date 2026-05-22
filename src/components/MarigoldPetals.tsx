'use client';

import React, { useEffect, useState } from 'react';

interface Petal {
  id: number;
  left: string;
  delay: string;
  duration: string;
  size: string;
}

export default function MarigoldPetals() {
  const [petals, setPetals] = useState<Petal[]>([]);

  useEffect(() => {
    // Generate petals only on client-side
    const initialPetals = Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${10 + Math.random() * 8}s`,
      size: `${6 + Math.random() * 12}px`,
    }));
    setPetals(initialPetals);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="marigold-petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            width: petal.size,
            height: petal.size,
          }}
        />
      ))}
    </div>
  );
}
