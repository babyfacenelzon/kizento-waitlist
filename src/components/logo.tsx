"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function Logo(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-2"
    >
      <Image
        src="/kizento-logo-dark-bg-nuanced.svg"
        alt="Kizento"
        width={180}
        height={44}
        priority
      />
    </motion.div>
  )
}
