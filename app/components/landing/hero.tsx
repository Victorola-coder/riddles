"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Gem, TrendingUp, Lightbulb } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative flex flex-col justify-center items-center overflow-hidden pt-20 pb-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[var(--bg-midnight)]" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto px-6 relative z-10 w-full items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 items-center mt-20"
        >
          {/* Badge */}
          <motion.a
            href="https://github.com/Victorola-coder/riddles"
            target="_blank"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-default)] text-sm text-[var(--text-secondary)] backdrop-blur-sm hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>Open Source on GitHub</span>
          </motion.a>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-center tracking-tight leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">
              Challenge
            </span>{" "}
            <span className="text-[var(--text-primary)]">your mind</span> <br className="hidden md:block" />{" "}
            <span className="text-[var(--text-primary)]">with</span>{" "}
            <span className="relative inline-block">
              <motion.span
                className="bg-[var(--bg-card)] text-[var(--text-primary)] rounded-2xl px-4 py-1 inline-block font-mono relative z-10 border border-[var(--border-default)]"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(139, 92, 246, 0.5)",
                    "0 0 20px rgba(251, 191, 36, 0.5)",
                    "0 0 10px rgba(139, 92, 246, 0.5)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                r
                <motion.span
                  className="text-[var(--accent-primary)] inline-block"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  1
                </motion.span>
                ddl
                <motion.span
                  className="text-[var(--accent-secondary)] inline-block"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, -5, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut",
                  }}
                >
                  3
                </motion.span>
                s
              </motion.span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] rounded-2xl opacity-0 blur-xl"
                animate={{
                  opacity: [0, 0.6, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl md:text-3xl font-semibold text-center text-[var(--text-primary)] max-w-2xl"
          >
            Riddles, not jokes
          </motion.p>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-center text-[var(--text-secondary)] max-w-2xl leading-relaxed"
          >
            Riddle Quest is a gamified platform where you solve riddles,
            earn gems, and progress through difficulty levels. Test your wits
            and unlock new challenges!
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center"
        >
          <Link
            href="/game"
            className="w-full sm:w-auto px-8 py-4 bg-[var(--text-primary)] text-[var(--bg-midnight)] hover:opacity-90 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group"
          >
            Start Playing
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <a
            href="https://github.com/Victorola-coder/riddles"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center gap-3 text-[var(--text-secondary)] px-8 py-4 bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] rounded-full border border-[var(--border-default)] font-medium backdrop-blur-sm transition-all group"
          >
            <span>View on GitHub</span>
            <ArrowRight
              size={16}
              className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
            />
          </a>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-8 w-full max-w-4xl"
        >
          {[
            {
              icon: Gem,
              title: "Earn Gems",
              desc: "Solve riddles to earn virtual currency and unlock rewards",
              gradient: "from-yellow-500/20 via-amber-500/20 to-orange-500/20",
              iconGradient: "from-yellow-400 to-amber-500",
              borderColor: "border-yellow-500/30",
            },
            {
              icon: TrendingUp,
              title: "Progressive Levels",
              desc: "Unlock harder challenges as you master each difficulty tier",
              gradient: "from-purple-500/20 via-pink-500/20 to-fuchsia-500/20",
              iconGradient: "from-purple-400 to-pink-500",
              borderColor: "border-purple-500/30",
            },
            {
              icon: Lightbulb,
              title: "Smart Hints",
              desc: "Get progressive hints when you need a little help",
              gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
              iconGradient: "from-blue-400 to-cyan-500",
              borderColor: "border-blue-500/30",
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative"
              >
                {/* Glow effect */}
                <div
                  className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Card */}
                <div
                  className={`relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border ${feature.borderColor} backdrop-blur-xl overflow-hidden transition-all duration-300 group-hover:border-opacity-60`}
                >
                  {/* Background gradient overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="mb-6">
                      <motion.div
                        className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.gradient} ${feature.borderColor} border backdrop-blur-sm`}
                        whileHover={{ rotate: 5, scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Icon
                          className={`w-6 h-6 text-[var(--text-primary)] group-hover:scale-110 transition-transform duration-300`}
                          style={{
                            filter: "drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))",
                          }}
                        />
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[var(--text-primary)] font-bold text-xl mb-3 transition-colors">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                      {feature.desc}
                    </p>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
