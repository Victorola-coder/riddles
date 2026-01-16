'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0f0f] via-[#000000] to-[#0f0f0f]" />
      
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/60 backdrop-blur-sm hover:bg-white/10 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
            <span>Open Source on GitHub</span>
          </motion.a>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-bold text-center tracking-tight leading-[1.1]"
          >
            <span className="bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
              Challenge
            </span>{' '}
            your mind <br className="hidden md:block" /> with{' '}
            <span className="bg-white/10 text-white rounded-2xl px-4 py-1 inline-block">
              riddles
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xl md:text-2xl text-center text-white/60 max-w-2xl leading-relaxed"
          >
            Riddle Quest is a gamified puzzle platform where you solve riddles,
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
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-full font-bold text-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group"
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
            className="w-full sm:w-auto flex items-center gap-3 text-white/60 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 font-medium backdrop-blur-sm transition-all group"
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
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl"
        >
          {[
            { icon: '💎', title: 'Earn Gems', desc: 'Solve riddles to earn virtual currency' },
            { icon: '🎯', title: 'Progressive Levels', desc: 'Unlock harder challenges as you progress' },
            { icon: '💡', title: 'Smart Hints', desc: 'Get help when you need it' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
