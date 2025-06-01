"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { 
  ChevronLeft, 
  ChevronRight, 
  Rocket, 
  TrendingUp, 
  Zap, 
  Shield, 
  Globe, 
  Puzzle,
  Target,
  Users,
  CreditCard,
  BarChart3,
  Handshake,
  Wallet,
  Link2,
  Sparkles,
  Star,
  Link
} from "lucide-react";

// Color palette
const colors = {
  white: "#FFFFFF",
  black: "#1A1A1A",
  mint: "#A1E9D1",
  lavender: "#DCCEF8",
  peach: "#FFD9B7",
  yellow: "#FFE867",
  coral: "#FFA8A8",
  lightGray: "#F8F8F8",
  bgGray: "#FAFAFA"
};

// Floating confetti component
const FloatingConfetti = ({ count = 20 }: { count?: number }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(count)].map((_, i) => {
        const randomColor = [colors.mint, colors.lavender, colors.peach, colors.yellow, colors.coral][Math.floor(Math.random() * 5)];
        const randomSize = Math.random() * 20 + 10;
        const randomDelay = Math.random() * 5;
        const randomDuration = Math.random() * 20 + 20;
        const randomX = Math.random() * 100;
        
        return (
          <motion.div
            key={`confetti-${i}`}
            className="absolute rounded-full opacity-70"
            style={{
              backgroundColor: randomColor,
              width: randomSize,
              height: randomSize,
              left: `${randomX}%`,
              top: `-${randomSize}px`
            }}
            animate={{
              y: ["0vh", "110vh"],
              x: [0, Math.random() * 40 - 20],
              rotate: [0, 360]
            }}
            transition={{
              duration: randomDuration,
              delay: randomDelay,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear"
            }}
          />
        );
      })}
    </div>
  );
};

// 3D Blob component for visual elements
const Blob3D = ({ color, size = 100, children, className = "" }: { 
  color: string; 
  size?: number; 
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        borderRadius: "30%",
        boxShadow: `0 20px 60px -10px ${color}66`
      }}
      whileHover={{ scale: 1.1 }}
      animate={{
        y: [0, -10, 0],
        rotate: [0, 5, 0]
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// 3D Lightning Bolt Component
const Lightning3D = ({ size = 400 }: { size?: number }) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{
        filter: ["brightness(1)", "brightness(1.2)", "brightness(1)"]
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut"
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-2xl"
      >
        <defs>
          <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors.yellow} />
            <stop offset="100%" stopColor={colors.peach} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <path
          d="M80 20 L110 80 L90 80 L120 180 L90 120 L110 120 L80 20"
          fill="url(#lightningGradient)"
          filter="url(#glow)"
        />
      </svg>
    </motion.div>
  );
};

// 3D Avatar Component
const Avatar3D = ({ variant = "pink" }: { variant?: "pink" | "astronaut" }) => {
  const avatarColors = {
    pink: { hair: colors.coral, shirt: colors.mint },
    astronaut: { helmet: colors.white, suit: colors.lavender }
  };
  
  return (
    <motion.div
      className="relative w-60 h-60"
      animate={{
        y: [0, -10, 0]
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut"
      }}
    >
      {variant === "pink" ? (
        <div className="relative w-full h-full">
          {/* Hair */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-40 rounded-t-full"
            style={{ backgroundColor: avatarColors.pink.hair }}
          />
          {/* Face */}
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-peach-100" />
          {/* Body */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20 rounded-t-3xl"
            style={{ backgroundColor: avatarColors.pink.shirt }}
          >
            {/* Ethereum logo on shirt */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-8 h-8 relative">
                <div className="absolute inset-0 border-2 border-white transform rotate-45" />
              </div>
            </div>
          </div>
          {/* Glasses */}
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-10 h-10 rounded-full bg-black opacity-80" />
            <div className="w-10 h-10 rounded-full bg-black opacity-80" />
          </div>
        </div>
      ) : (
        <div className="relative w-full h-full">
          {/* Helmet */}
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-40 rounded-full border-8 border-gray-400"
            style={{ backgroundColor: avatarColors.astronaut.helmet + "40" }}
          />
          {/* Face */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-peach-100" />
          {/* Body */}
          <div 
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-36 h-24 rounded-t-3xl"
            style={{ backgroundColor: avatarColors.astronaut.suit }}
          >
            {/* Badge */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-green-400 flex items-center justify-center">
              <Globe size={24} className="text-white" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// Logo Component
const MivioLogo = ({ size = 300 }: { size?: number }) => {
  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size / 2 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="text-7xl font-bold text-center" style={{ color: colors.black }}>
        mivio
      </div>
      <motion.div
        className="absolute -top-2 -right-2"
        animate={{
          rotate: [0, 10, -10, 0]
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY
        }}
      >
        <Sparkles size={24} style={{ color: colors.yellow }} />
      </motion.div>
    </motion.div>
  );
};

// Slide 1: Intro & One-liner
const Slide1 = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);
  
  return (
    <motion.div 
      className="relative h-full flex flex-col items-center justify-center p-12"
      style={{ backgroundColor: colors.lightGray }}
      onMouseMove={handleMouseMove}
    >
      <FloatingConfetti count={15} />
      
      {/* Lightning bolt visual */}
      <motion.div
        className="mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, type: "spring", bounce: 0.5 }}
        style={{
          perspective: 1000,
          rotateX,
          rotateY
        }}
      >
        <Lightning3D size={400} />
      </motion.div>
      
      {/* Text content */}
      <motion.div className="text-center max-w-4xl">
        <motion.h1
          className="text-7xl font-bold mb-12"
          style={{ color: colors.black }}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          mivio
        </motion.h1>
        
        <motion.p
          className="text-5xl font-semibold mb-10 leading-relaxed"
          style={{ color: colors.black }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          One wallet, every festival—shop, earn, and connect across all events.
        </motion.p>
        
        <motion.p
          className="text-3xl font-light"
          style={{ color: colors.black }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <b>mivio.xyz</b>
        </motion.p>
      </motion.div>
      
      {/* Avatar in corner */}
      <motion.div
        className="absolute bottom-12 right-12"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2 }}
      >
        <Avatar3D variant="pink" />
      </motion.div>
    </motion.div>
  );
};

// Slide 2: The Problem
const Slide2 = () => {
  const problems = [
    { text: "Users: No rewards, no identity, no privacy—experiences lost after every event.", delay: 0.3 },
    { text: "Shops: High card fees, slow payouts.", delay: 0.6 },
    { text: "Brands & Organizers: They spend millions but still can't segment, retarget, or measure true engagement.", delay: 0.9 },
    { text: "All: Fragmented apps, zero interoperability, everyone loses.", delay: 1.2, highlight: true }
  ];
  
  return (
    <motion.div 
      className="relative h-full flex items-center justify-center p-12"
      style={{ backgroundColor: colors.bgGray }}
    >
      {/* Background festival map */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1920 1080">
          <title>Festival Map Background</title>
          <path
            d="M200 400 L400 400 L400 600 L200 600 Z M600 300 L800 300 L800 500 L600 500 Z M1000 400 L1200 400 L1200 600 L1000 600 Z"
            stroke="#E0E0E0"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="500" cy="700" r="100" stroke="#E0E0E0" strokeWidth="2" fill="none" />
          <rect x="1400" y="400" width="200" height="200" stroke="#E0E0E0" strokeWidth="2" fill="none" rx="20" />
        </svg>
      </div>
      
      <div className="relative z-10 max-w-4xl">
        {problems.map((problem) => (
          <motion.div
            key={problem.text}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: problem.delay }}
            className={`text-center mb-20 ${problem.highlight ? 'mt-12' : ''}`}
          >
            <p 
              className={`${problem.highlight ? 'text-6xl font-bold' : 'text-5xl'} leading-relaxed`}
              style={{ color: colors.black }}
            >
              {problem.text}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Broken chain icon */}
      <motion.div
        className="absolute bottom-12 right-12"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.4 }}
      >
        <Blob3D color={colors.mint} size={80}>
          <Link2 className="text-white" size={40} />
        </Blob3D>
      </motion.div>
    </motion.div>
  );
};

// Slide 3: The Solution
const Slide3 = () => {
  const solutions = [
    { icon: <Zap size={24} />, text: "Reward quests at every booth: XP, badges, prizes." },
    { icon: <Users size={24} />, text: "SBD evolves across events." },
    { icon: <CreditCard size={24} />, text: "Instant no fee payments with direct bank offramp." },
    { icon: <BarChart3 size={24} />, text: "Real-time, anonymous analytics for brands." },
    { icon: <Shield size={24} />, text: "Full privacy — zero personal data shared." }
  ];
  
  return (
    <motion.div 
      className="h-full flex items-center p-12"
      style={{ backgroundColor: colors.white }}
    >
      <div className="w-1/2 pr-12">
        <motion.h2
          className="text-6xl font-bold mb-12"
          style={{ color: colors.black }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          The Solution
        </motion.h2>
        
        <div className="space-y-6">
          {solutions.map((solution) => (
            <motion.div
              key={solution.text}
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: solutions.indexOf(solution) * 0.1 + 0.2 }}
            >
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${colors.mint}30` }}
              >
                {solution.icon}
              </div>
              <p className="text-3xl" style={{ color: colors.black }}>
                {solution.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="w-1/2 flex items-center justify-center">
        {/* Festival Engine Visual */}
        <motion.div
          className="relative w-96 h-96"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: `linear-gradient(135deg, ${colors.mint}40, ${colors.lavender}40)`,
              boxShadow: `0 20px 60px -10px ${colors.mint}40`
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          
          {/* Floating tokens */}
          {[colors.mint, colors.lavender, colors.peach, colors.yellow].map((color, i) => (
            <motion.div
              key={`token-${color}`}
              className="absolute w-16 h-16 rounded-2xl"
              style={{
                backgroundColor: color,
                top: `${50 + 40 * Math.cos(i * Math.PI / 2)}%`,
                left: `${50 + 40 * Math.sin(i * Math.PI / 2)}%`,
                transform: "translate(-50%, -50%)"
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 3 + i,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut"
              }}
            />
          ))}
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Zap size={60} style={{ color: colors.yellow }} className="mx-auto mb-4" />
              <p className="font-bold text-xl">Festival Engine</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Slide 4: Technology
const Slide4 = () => {
  const techStack = [
    { name: "wagmi + viem", desc: "web3 UX", icon: <Wallet size={30} /> },
    { name: "yellow", desc: "state channels", icon: <Zap size={30} /> },
    { name: "vlayer", desc: "on-chain verification", icon: <Shield size={30} /> },
    { name: "flow blockchain", desc: "SBD Dynamic ID", icon: <Globe size={30} /> }
  ];
  
  return (
    <motion.div 
      className="h-full flex items-center p-12"
      style={{ backgroundColor: colors.bgGray }}
    >
      <div className="w-1/2 pr-12">
        <motion.h2
          className="text-6xl font-bold mb-12"
          style={{ color: colors.black }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Technology
        </motion.h2>
        
        <div className="space-y-4">
          <motion.p 
            className="text-3xl"
            style={{ color: colors.black }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            • wagmi + viem (web3 UX)
          </motion.p>
          <motion.p 
            className="text-3xl"
            style={{ color: colors.black }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            • yellow (state channels for instant, scalable payments)
          </motion.p>
          <motion.p 
            className="text-3xl"
            style={{ color: colors.black }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            • vlayer (on-chain verification)
          </motion.p>
          <motion.p 
            className="text-3xl"
            style={{ color: colors.black }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            • flow blockchain (SBD Dynamic ID)
          </motion.p>
          <motion.p 
            className="text-3xl font-semibold mt-8"
            style={{ color: colors.black }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            All interoperable, mobile-first, privacy by design.
          </motion.p>
        </div>
      </div>
      
      <div className="w-1/2 flex items-center justify-center">
        {/* Tech Stack Visual */}
        <motion.div className="relative">
          {techStack.map((tech) => (
            <motion.div
              key={tech.name}
              className="relative mb-4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 + techStack.indexOf(tech) * 0.2, type: "spring" }}
            >
              <motion.div
                className="w-80 h-24 rounded-3xl flex items-center px-8"
                style={{
                  background: `linear-gradient(135deg, ${colors.white}ee, ${colors.white}cc)`,
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)"
                }}
                whileHover={{ y: -8 }}
                animate={{
                  y: [0, -5 + techStack.indexOf(tech) * 2, 0]
                }}
                transition={{
                  y: {
                    duration: 3 + techStack.indexOf(tech),
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut"
                  }
                }}
              >
                <div className="mr-4" style={{ color: colors.mint }}>
                  {tech.icon}
                </div>
                <div>
                  <p className="font-semibold text-lg">{tech.name}</p>
                  <p className="text-sm opacity-70">{tech.desc}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
          
          {/* Privacy ring */}
          <motion.div
            className="absolute -inset-8 rounded-full pointer-events-none"
            style={{
              background: `linear-gradient(45deg, ${colors.mint}40, ${colors.lavender}40)`,
              filter: "blur(40px)"
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Slide 5: Business Model
const Slide5 = () => {
  const revenueStreams = [
    { name: "Automated Sponsorships", icon: <Handshake size={30} /> },
    { name: "Subscription Analytics", icon: <BarChart3 size={30} /> },
    { name: "Custom Integrations", icon: <Puzzle size={30} /> }
  ];
  
  return (
    <motion.div 
      className="h-full flex items-center p-12"
      style={{ backgroundColor: colors.white }}
    >
      <div className="w-2/5 pr-12">
        <motion.h2
          className="text-6xl font-bold mb-12"
          style={{ color: colors.black }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          SPONSORSHIPS, AUTOMATED
        </motion.h2>
        
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h3 className="font-semibold text-2xl mb-2" style={{ color: colors.black }}>
              <b>Festivals turn audiences into data.
              Brands browse, reward, retarget, repeat.
              Mivio takes 10% per activation.</b>
            </h3>
          </motion.div>
          
          <motion.div
            className="pt-8 mt-8 border-t"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <h3 className="font-semibold text-2xl mb-2" style={{ color: colors.black }}>
              Team:
            </h3>
            <p className="text-xl opacity-80" style={{ color: colors.black }}>
              Delivered events for 100K+ visitors in 8 countries, with 7+ years in Web3, privacy, and scalable tech.
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="w-3/5 flex items-center justify-center">
        {/* Revenue Machine Visual */}
        <motion.div
          className="relative w-96 h-96"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {/* Revenue layers */}
          {revenueStreams.map((stream) => (
            <motion.div
              key={stream.name}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transform: `translateY(${revenueStreams.indexOf(stream) * 30 - 30}px)`
              }}
            >
              <motion.div
                className="w-72 h-72 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${[colors.mint, colors.lavender, colors.peach][revenueStreams.indexOf(stream)]}40, ${[colors.mint, colors.lavender, colors.peach][revenueStreams.indexOf(stream)]}20)`,
                  backdropFilter: "blur(10px)",
                  boxShadow: `0 20px 40px -10px ${[colors.mint, colors.lavender, colors.peach][revenueStreams.indexOf(stream)]}40`
                }}
                animate={{
                  rotate: revenueStreams.indexOf(stream) % 2 === 0 ? 360 : -360
                }}
                transition={{
                  duration: 20 + revenueStreams.indexOf(stream) * 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear"
                }}
              >
                <div className="text-center">
                  <div style={{ color: [colors.mint, colors.lavender, colors.peach][revenueStreams.indexOf(stream)] }}>
                    {stream.icon}
                  </div>
                  <p className="mt-2 font-semibold">{stream.name}</p>
                </div>
              </motion.div>
            </motion.div>
          ))}
          
          {/* Floating revenue tokens */}
          {["Whitelabel", "API Access", "Brand Activations"].map((token) => (
            <motion.div
              key={token}
              className="absolute w-24 h-24 rounded-2xl flex items-center justify-center text-sm font-semibold"
              style={{
                backgroundColor: colors.yellow,
                top: `${50 + 45 * Math.cos(["Whitelabel", "API Access", "Brand Activations"].indexOf(token) * 2 * Math.PI / 3)}%`,
                left: `${50 + 45 * Math.sin(["Whitelabel", "API Access", "Brand Activations"].indexOf(token) * 2 * Math.PI / 3)}%`,
                transform: "translate(-50%, -50%)"
              }}
              animate={{
                y: [0, -10, 0],
                rotate: [0, 10, 0]
              }}
              transition={{
                duration: 4 + ["Whitelabel", "API Access", "Brand Activations"].indexOf(token),
                repeat: Number.POSITIVE_INFINITY
              }}
            >
              {token}
            </motion.div>
          ))}
          
          {/* Team platform */}
          <motion.div
            className="absolute -bottom-20 left-1/2 transform -translate-x-1/2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div 
              className="px-6 py-3 rounded-full flex items-center gap-3"
              style={{ 
                backgroundColor: `${colors.mint}20`,
                border: `2px solid ${colors.mint}`
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mint to-lavender flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <p className="text-sm font-semibold">100K visitors • 8 countries • 7+ years</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Slide 6: Roadmap
const Slide6 = () => {
  const milestones = [
    {
      quarter: "Q2 2024",
      title: "Beta live, pilot events launched with major partners.",
      icon: <Rocket size={40} />,
      color: colors.mint
    },
    {
      quarter: "Q3 2024",
      title: "Expand analytics modules, deepen brand integrations, scale to 20+ events.",
      icon: <TrendingUp size={40} />,
      color: colors.lavender
    },
    {
      quarter: "Q4 2024",
      title: "Launch fully automated sponsorship engine, onboard enterprise clients, reach 100K+ user milestone.",
      icon: <Target size={40} />,
      color: colors.peach
    },
    {
      quarter: "2025",
      title: "Global rollout, launch advanced interoperability features, grow brand & festival network at scale.",
      icon: <Globe size={40} />,
      color: colors.yellow
    }
  ];
  
  return (
    <motion.div 
      className="h-full flex flex-col items-center justify-center p-12"
      style={{ backgroundColor: colors.lightGray }}
    >
      <motion.h2
        className="text-6xl font-bold mb-16"
        style={{ color: colors.black }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Roadmap
      </motion.h2>
      
      <div className="relative max-w-5xl w-full">
        {/* Timeline line */}
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full"
          style={{
            background: `linear-gradient(to bottom, ${colors.mint}, ${colors.peach}, ${colors.yellow})`
          }}
          initial={{ height: 0 }}
          animate={{ height: "100%" }}
          transition={{ duration: 1 }}
        />
        
        {/* Milestones */}
        {milestones.map((milestone) => (
          <motion.div
            key={milestone.quarter}
            className={`relative flex items-center mb-16 ${milestones.indexOf(milestone) % 2 === 0 ? 'flex-row-reverse' : ''}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + milestones.indexOf(milestone) * 0.3 }}
          >
            {/* Content */}
            <div className={`w-1/2 ${milestones.indexOf(milestone) % 2 === 0 ? 'pl-12 text-right' : 'pr-12'}`}>
              <h3 className="text-3xl font-bold mb-2" style={{ color: milestone.color }}>
                {milestone.quarter}
              </h3>
              <p className="text-xl" style={{ color: colors.black }}>
                {milestone.title}
              </p>
            </div>
            
            {/* Node */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: milestone.color,
                boxShadow: `0 10px 40px -10px ${milestone.color}`
              }}
              whileHover={{ scale: 1.1 }}
              animate={{
                y: [0, -5, 0]
              }}
              transition={{
                y: {
                  duration: 3 + milestones.indexOf(milestone),
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut"
                }
              }}
            >
              {milestone.icon}
            </motion.div>
            
            {/* Empty space for other side */}
            <div className="w-1/2" />
          </motion.div>
        ))}
        
        {/* 2025 world dots */}
        {milestones[3] && (
          <motion.div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2 }}
          >
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={`dot-${i}`}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: colors.yellow }}
                  animate={{
                    opacity: [0.3, 1, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.2,
                    repeat: Number.POSITIVE_INFINITY
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Slide 7: Market & Edge
const Slide7 = () => {
  const web2Competitors = [
    "Ticketmaster", "Eventbrite", "Dice", "Tixngo", 
    "Universe", "Festicket", "See Tickets", "Eventix"
  ];
  
  const web3Competitors = [
    "POAP", "Tokenproof", "GET Protocol", "Sugo",
    "The Fanz", "Yellow", "Flowverse"
  ];
  
  return (
    <motion.div 
      className="h-full flex flex-col items-center justify-center p-12"
      style={{ backgroundColor: colors.bgGray }}
    >
      {/* Market Size */}
      <motion.div
        className="mb-12"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 
          className="text-7xl font-bold text-center bg-gradient-to-r from-mint to-peach bg-clip-text"
          style={{
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundImage: `linear-gradient(135deg, ${colors.mint}, ${colors.peach})`
          }}
        >
          $80B+ Festival Economy
        </h2>
        <p className="text-center text-2xl mt-4" style={{ color: colors.black }}>
          and growing fast.
        </p>
      </motion.div>
      
      {/* Competitors */}
      <motion.div
        className="w-full max-w-4xl mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-3xl font-semibold mb-6 text-center" style={{ color: colors.black }}>
          Competitors:
        </h3>
        
        <div className="flex gap-8">
          {/* Web2 */}
          <motion.div
            className="flex-1 p-6 rounded-2xl"
            style={{ backgroundColor: colors.white }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="font-semibold text-xl mb-4" style={{ color: colors.black }}>Web2</h4>
            <div className="space-y-2">
              {web2Competitors.map((comp) => (
                <motion.p
                  key={comp}
                  className="text-lg hover:underline cursor-pointer transition-all"
                  style={{ color: colors.black }}
                  whileHover={{ x: 5 }}
                >
                  {comp}
                </motion.p>
              ))}
            </div>
          </motion.div>
          
          {/* Web3 */}
          <motion.div
            className="flex-1 p-6 rounded-2xl"
            style={{ backgroundColor: colors.white }}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h4 className="font-semibold text-xl mb-4" style={{ color: colors.black }}>Web3</h4>
            <div className="space-y-2">
              {web3Competitors.map((comp) => (
                <motion.p
                  key={comp}
                  className="text-lg hover:underline cursor-pointer transition-all"
                  style={{ color: colors.black }}
                  whileHover={{ x: 5 }}
                >
                  {comp}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* mivio difference */}
      <motion.div
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <h3 className="text-3xl font-semibold mb-6 text-center" style={{ color: colors.black }}>
          mivio difference:
        </h3>
        
        <div className="flex gap-4">
          <motion.div
            className="flex-1 p-6 rounded-2xl"
            style={{ backgroundColor: "#ECECEC" }}
            whileHover={{ scale: 0.98 }}
          >
            <p className="text-xl" style={{ color: colors.black }}>
              Competitors focus on ticketing or badges
            </p>
          </motion.div>
          
          <motion.div
            className="flex-1 p-6 rounded-2xl text-white"
            style={{ backgroundColor: colors.mint }}
            whileHover={{ scale: 1.02 }}
            animate={{
              boxShadow: [
                `0 10px 40px -10px ${colors.mint}40`,
                `0 20px 60px -10px ${colors.mint}60`,
                `0 10px 40px -10px ${colors.mint}40`
              ]
            }}
            transition={{
              duration: 6,
              repeat: Number.POSITIVE_INFINITY
            }}
          >
            <p className="text-xl font-semibold">
              mivio delivers full gamification, analytics, and payments with no fees.
            </p>
            <p className="text-lg mt-2">
              Our edge: one wallet, full interoperability, and automated sponsorships.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Slide 8: Closing
const Slide8 = () => {
  return (
    <motion.div 
      className="relative h-full flex flex-col items-center justify-center p-12"
      style={{ backgroundColor: colors.white }}
    >
      <FloatingConfetti count={20} />
      
      {/* Background glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        animate={{
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY
        }}
      >
        <div 
          className="w-96 h-96 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.mint}20, transparent)`,
            filter: "blur(60px)"
          }}
        />
      </motion.div>
      
      {/* Logo */}
      <motion.div
        className="mb-12"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <MivioLogo size={300} />
      </motion.div>
      
      {/* Text content */}
      <motion.div className="text-center relative z-10">
        <motion.h1
          className="text-7xl font-bold mb-12"
          style={{ color: colors.black }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          mivio
        </motion.h1>
        
        <motion.p
          className="text-5xl font-semibold mb-10"
          style={{ color: colors.black }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          rewarding, cashless, connected. For everyone, every festival.
        </motion.p>
        
        <motion.a
          href="https://mivio.xyz"
          className="text-3xl hover:underline transition-all"
          style={{ color: colors.black }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ 
            scale: 1.1,
            textShadow: `0 0 20px ${colors.mint}` 
          }}
        >
          mivio.xyz
        </motion.a>
      </motion.div>
      
      {/* Avatar decoration */}
      <motion.div
        className="absolute bottom-12 right-12"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Avatar3D variant="astronaut" />
      </motion.div>
    </motion.div>
  );
};

// Main presentation component
export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const slides = [
    <Slide1 key="slide1" />,
    <Slide2 key="slide2" />,
    <Slide3 key="slide3" />,
    <Slide4 key="slide4" />,
    <Slide5 key="slide5" />,
    <Slide6 key="slide6" />,
    <Slide7 key="slide7" />,
    <Slide1 key="slide1" />,
  ];
  
  const nextSlide = () => {
    if (currentSlide < slides.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  const prevSlide = () => {
    if (currentSlide > 0 && !isTransitioning) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(currentSlide - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  const goToSlide = (index: number) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" && currentSlide < slides.length - 1 && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide(currentSlide + 1);
          setIsTransitioning(false);
        }, 300);
      }
      if (e.key === "ArrowLeft" && currentSlide > 0 && !isTransitioning) {
        setIsTransitioning(true);
        setTimeout(() => {
          setCurrentSlide(currentSlide - 1);
          setIsTransitioning(false);
        }, 300);
      }
    };
    
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide, isTransitioning, slides.length]);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white">
      {/* Slide container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="absolute inset-0"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {slides[currentSlide]}
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation buttons */}
      <button
        type="button"
        onClick={prevSlide}
        className={`absolute left-8 top-1/2 transform -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-sm transition-all ${
          currentSlide === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20"
        }`}
        disabled={currentSlide === 0}
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        type="button"
        onClick={nextSlide}
        className={`absolute right-8 top-1/2 transform -translate-y-1/2 p-4 rounded-full bg-white/10 backdrop-blur-sm transition-all ${
          currentSlide === slides.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-white/20"
        }`}
        disabled={currentSlide === slides.length - 1}
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            type="button"
            key={`indicator-${index}`}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index
                ? "w-8 bg-gray-800"
                : "bg-gray-400 hover:bg-gray-600"
            }`}
          />
        ))}
      </div>
      
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200">
        <motion.div
          className="h-full"
          style={{ backgroundColor: colors.mint }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}