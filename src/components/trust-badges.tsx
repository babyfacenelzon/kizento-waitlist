"use client"

import { motion } from "framer-motion"

const badges = [
  "-15% offre early bird",
  "Accès prioritaire",
  "Livraison offerte 1ère commande",
]

export function TrustBadges(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60"
    >
      {badges.map((badge, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#7B8B6F]" />
          {badge}
        </span>
      ))}
    </motion.div>
  )
}
