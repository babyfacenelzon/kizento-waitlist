"use client"

import { motion } from "framer-motion"

export function HeroTitle(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="text-center"
    >
      <h1 className="font-serif text-5xl md:text-7xl text-white leading-tight">
        L&apos;art du bento,
        <br />
        <span className="italic">réinventé.</span>
      </h1>
      <p className="mt-6 text-lg text-white/70 max-w-md mx-auto">
        Bentos isothermes premium, design japonais. Soyez les premiers informés
        du lancement.
      </p>
    </motion.div>
  )
}
