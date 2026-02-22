"use client"

import { motion } from "framer-motion"
import { Clock, Percent, Truck, type LucideIcon } from "lucide-react"

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(" ")
}

interface Benefit {
  icon: LucideIcon
  title: string
  description: string
  highlight: boolean
}

const benefits: Benefit[] = [
  {
    icon: Clock,
    title: "Accès prioritaire",
    description: "24h avant le grand public",
    highlight: false,
  },
  {
    icon: Percent,
    title: "-15% Early Bird",
    description: "Sur votre 1ère commande",
    highlight: true,
  },
  {
    icon: Truck,
    title: "Livraison offerte",
    description: "Dès votre 1er achat",
    highlight: false,
  },
]

export function TrustBadges(): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl"
    >
      {benefits.map((benefit, index) => (
        <div
          key={index}
          className={cn(
            "relative flex flex-col items-center text-center p-5 rounded-xl",
            "bg-white/5 backdrop-blur-sm border",
            benefit.highlight
              ? "border-amber-500/30 bg-amber-500/10"
              : "border-white/10"
          )}
        >
          {/* Badge highlight */}
          {benefit.highlight && (
            <span className="absolute -top-2 right-3 px-2 py-0.5 text-xs font-medium bg-amber-500 text-white rounded-full">
              Top
            </span>
          )}

          {/* Icon */}
          <div
            className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
              benefit.highlight
                ? "bg-amber-500/20"
                : "bg-[#9BA78F]/20"
            )}
          >
            <benefit.icon
              className={cn(
                "w-6 h-6",
                benefit.highlight
                  ? "text-amber-400"
                  : "text-[#9BA78F]"
              )}
            />
          </div>

          {/* Title */}
          <h3
            className={cn(
              "font-semibold mb-1",
              benefit.highlight
                ? "text-amber-300"
                : "text-white"
            )}
          >
            {benefit.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-white/60">
            {benefit.description}
          </p>
        </div>
      ))}
    </motion.div>
  )
}
