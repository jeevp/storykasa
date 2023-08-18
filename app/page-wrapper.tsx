'use client'

import { AnimatePresence, motion } from 'framer-motion'

export default function PageWrapper({
  children,
  path,
}: {
  children: React.ReactNode
  path: string
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 10, opacity: 0 }}
        key={path}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
