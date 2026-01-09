"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export function BadgePill(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10"
    >
      <Sparkles className="h-4 w-4 text-[#9BA78F]" />
      <span className="text-sm text-white/90">Rejoignez l&apos;aventure</span>
    </motion.div>
  )
}
