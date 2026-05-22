"use client";

import { galleryTransition } from "@/lib/gallery-motion";
import { motion, useReducedMotion } from "@/components/ClientMotion";

export default function ProjectsTemplate({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={galleryTransition(!!reduce, 0.42)}
    >
      {children}
    </motion.div>
  );
}
