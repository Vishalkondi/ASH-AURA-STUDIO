"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 0.61, 0.36, 1] as const;

export default function Reveal({
  children,
  delay = 0,
  y = 30,
  style,
  id,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
  id?: string;
}) {
  return (
    <motion.div
      id={id}
      style={style}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -7% 0px" }}
      transition={{ duration: 1.05, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
