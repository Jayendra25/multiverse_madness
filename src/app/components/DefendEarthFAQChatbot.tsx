'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Bot, User, Shield, RotateCcw } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isWelcome?: boolean
}

interface FAQQuestion {
  id: string
  question: string
  answer: string
  followUp?: string[]
}

const faqData: FAQQuestion[] = [
  {
    id: 'asteroids',
    question: 'What are asteroids and why are they dangerous?',
    answer: 'Asteroids are rocky objects that orbit the Sun, primarily found in the asteroid belt between Mars and Jupiter. They become dangerous when their orbits bring them close to Earth. Even small asteroids can cause significant damage due to their incredible speed (up to 70 km/s). The DefendEarth system tracks over 50,000+ Near Earth Objects to identify potential threats.',
    followUp: ['How do we detect asteroids?', 'What happened to the dinosaurs?', 'How big was the Chelyabinsk meteor?']
  },
  {
    id: 'detection',
    question: 'How do we detect asteroids?',
    answer: 'DefendEarth uses real NASA data from multiple sources: ground-based telescopes like Catalina Sky Survey, space-based missions like NEOWISE, and radar systems like Arecibo. Our system integrates with NASA\'s Center for Near Earth Object Studies (CNEOS) to track asteroid positions, sizes, and trajectories in real-time. We can detect objects as small as 1 meter across!',
    followUp: ['What are asteroids and why are they dangerous?', 'How do defense systems work?', 'What is the NASA DART mission?']
  },
  {
    id: 'defense',
    question: 'How do defense systems work?',
    answer: 'DefendEarth features three main defense systems:\n\n🎯 **Kinetic Impactor**: High-speed spacecraft that collides with asteroids to change their trajectory (like NASA\'s DART mission)\n\n⚡ **Firefly Light Array**: Satellites using concentrated laser beams to create thermal stress and alter asteroid spin\n\n🛡️ **Plasma Shield**: Experimental electromagnetic barriers that can vaporize smaller objects\n\nEach system is designed for different threat levels and lead times.',
    followUp: ['What is the NASA DART mission?', 'What are asteroids and why are they dangerous?', 'How accurate are impact predictions?']
  },
  {
    id: 'dart',
    question: 'What is the NASA DART mission?',
    answer: 'DART (Double Asteroid Redirection Test) was NASA\'s first planetary defense mission, launched in 2021. It successfully impacted the asteroid Dimorphos in September 2022, changing its orbital period by 32 minutes! This proved that kinetic impactors can deflect asteroids. DefendEarth\'s Kinetic Impactor system is based on this proven technology but with enhanced targeting and multiple spacecraft capability.',
    followUp: ['How do defense systems work?', 'How do we detect asteroids?', 'What are the chances of impact?']
  },
  {
    id: 'dinosaurs',
    question: 'What happened to the dinosaurs?',
    answer: '66 million years ago, a massive asteroid (~10 km wide) struck Earth near Mexico\'s Yucatan Peninsula. This Chicxulub impact released energy equivalent to billions of nuclear bombs, causing global fires, tsunamis, and a "nuclear winter" effect. It led to the extinction of 75% of Earth\'s species, including non-avian dinosaurs. This event shows why planetary defense is crucial!',
    followUp: ['What are asteroids and why are they dangerous?', 'How big was the Chelyabinsk meteor?', 'What are the chances of impact?']
  },
  {
    id: 'chelyabinsk',
    question: 'How big was the Chelyabinsk meteor?',
    answer: 'The Chelyabinsk meteor (2013) was only about 20 meters wide but exploded with the force of 30 Hiroshima bombs! It injured over 1,500 people from broken glass and shocked the world. This "small" asteroid shows how even modest-sized objects can cause serious damage. Imagine what a 100-meter or 1-kilometer asteroid could do - that\'s why DefendEarth exists!',
    followUp: ['What happened to the dinosaurs?', 'What are asteroids and why are they dangerous?', 'How accurate are impact predictions?']
  },
  {
    id: 'accuracy',
    question: 'How accurate are impact predictions?',
    answer: 'Modern asteroid tracking is incredibly precise! NASA can predict asteroid positions years or even decades in advance with accuracy measured in kilometers. Our DefendEarth simulation uses the same mathematical models as NASA\'s JPL (Jet Propulsion Laboratory). However, small uncertainties can grow over time, which is why continuous monitoring and course corrections are essential for long-term predictions.',
    followUp: ['How do we detect asteroids?', 'What is the NASA DART mission?', 'What are the chances of impact?']
  },
  {
    id: 'chances',
    question: 'What are the chances of impact?',
    answer: 'The good news: Large "civilization-ending" asteroids (>1 km) hit Earth roughly every 500,000 to 1 million years, and we\'ve cataloged 90% of them. The challenge: Smaller asteroids (like Chelyabinsk-size) are more common but harder to detect. Currently, there are no known asteroids on collision course with Earth for the next 100+ years. DefendEarth helps us stay prepared!',
    followUp: ['How big was the Chelyabinsk meteor?', 'What happened to the dinosaurs?', 'How do defense systems work?']
  }
]

export default function DefendEarthFAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [showQuestions, setShowQuestions] = useState(true)
  const [currentQuestions, setCurrentQuestions] = useState<string[]>([
    'What are asteroids and why are they dangerous?',
    'How do we detect asteroids?',
    'How do defense systems work?',
    'What is the NASA DART mission?'
  ])
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chatbot opens
      setMessages([{
        role: 'assistant',
        content: 'Hello! I\'m ARIA, your DefendEarth assistant. I can answer questions about asteroids, planetary defense, and our protection systems. Click on any question below to learn more!',
        timestamp: new Date(),
        isWelcome: true
      }])
    }
  }, [isOpen])

  const handleQuestionClick = (questionText: string) => {
    const faq = faqData.find(f => f.question === questionText)
    if (!faq) return

    // Add user question
    const userMessage: Message = {
      role: 'user',
      content: questionText,
      timestamp: new Date()
    }

    // Add AI answer
    const aiMessage: Message = {
      role: 'assistant',
      content: faq.answer,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage, aiMessage])
    
    // Update question buttons with follow-up questions
    if (faq.followUp) {
      setCurrentQuestions(faq.followUp)
    }
    
    setShowQuestions(true)
  }

  const resetChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat reset! I\'m ARIA, ready to help you learn about planetary defense. What would you like to know?',
      timestamp: new Date(),
      isWelcome: true
    }])
    setCurrentQuestions([
      'What are asteroids and why are they dangerous?',
      'How do we detect asteroids?',
      'How do defense systems work?',
      'What is the NASA DART mission?'
    ])
    setShowQuestions(true)
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-orange-500/25 transition-all duration-300"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">ARIA Assistant</h3>
                  <p className="text-orange-100 text-xs">DefendEarth FAQ • Interactive</p>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-600' 
                      : 'bg-gradient-to-r from-orange-500 to-red-500'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-sm'
                      : 'bg-gray-800 text-gray-100 rounded-tl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Question Buttons */}
            {showQuestions && (
              <div className="p-4 border-t border-gray-700 bg-gray-800/50">
                <p className="text-xs text-gray-400 mb-3 text-center">Click on a question to learn more:</p>
                <div className="grid grid-cols-1 gap-2">
                  {currentQuestions.map((question, index) => (
                    <motion.button
                      key={question + index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      onClick={() => handleQuestionClick(question)}
                      className="text-left p-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-200 hover:text-white transition-all duration-200 border border-gray-600 hover:border-gray-500"
                    >
                      💬 {question}
                    </motion.button>
                  ))}
                </div>
                
                {/* More Questions Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    const allQuestions = faqData.map(f => f.question)
                    const randomQuestions = allQuestions
                      .sort(() => Math.random() - 0.5)
                      .slice(0, 4)
                    setCurrentQuestions(randomQuestions)
                  }}
                  className="w-full mt-3 p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg text-xs text-orange-300 hover:bg-orange-500/30 hover:text-orange-200 transition-all duration-200"
                >
                  🔄 Show Different Questions
                </motion.button>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 bg-gray-800/30 border-t border-gray-700">
              <p className="text-xs text-gray-500 text-center">
                🛡️ ARIA • DefendEarth Knowledge Base • Click questions above
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
