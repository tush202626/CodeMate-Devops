"use client"

import Button from "./componenets/ui/button"
import { Card , CardContent } from "./componenets/ui/card"
import { motion } from "framer-motion"
import { Code2, Users, Terminal, MessageSquare, FolderKanban, Zap, ChevronRight, ArrowRight } from "lucide-react"
import {Link} from "react-router-dom"
import { Tilt } from "react-tilt"
import { CodeEditor } from "./componenets/code-editor"
import LanguageSlider from "./componenets/language-slider"

export default function LandingPage() {
  const features = [
    {
      title: "Collaborative Editing",
      description: "Code together in real-time with multiple developers on the same file.",
      icon: <Users className="h-8 w-8" />,
    },
    {
      title: "Code Execution",
      description: "Run your code directly in the browser with instant feedback.",
      icon: <Terminal className="h-8 w-8" />,
    },
    {
      title: "Integrated Chat",
      description: "Communicate with your team without leaving the editor.",
      icon: <MessageSquare className="h-8 w-8" />,
    },
    {
      title: "File Management",
      description: "Organize your projects with our intuitive file system.",
      icon: <FolderKanban className="h-8 w-8" />,
    },
    {
      title: "Multi-Language Support",
      description: "Code in JavaScript, Python, Java, C++, C, C# and many more.",
      icon: <Code2 className="h-8 w-8" />,
    },
    {
      title: "Lightning Fast",
      description: "Optimized performance for a smooth coding experience.",
      icon: <Zap className="h-8 w-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-white text-gray-800 overflow-hidden">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-6 w-6 text-black" />
            <span className="text-xl font-bold text-gray-900">CodeMate</span>
          </div>
          {/* <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#demo" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Demo
            </Link>
            <Link href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav> */}
          {/* <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Log In
            </Button>
            <Button size="sm" className="bg-black text-white hover:bg-black/80">
              Sign Up
            </Button>
          </div> */}
        </div>
      </header>

      <main>
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <motion.div
                className="inline-block px-3 py-1 rounded-full bg-gray-100 text-black text-sm font-medium mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                The Future of Coding
              </motion.div>
              <motion.h1
                className="text-4xl md:text-6xl font-bold mb-6 text-gray-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Collaborate on code in <span className="text-black">real-time</span>
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                A powerful collaborative code editor that brings teams together. Write, execute, and share code
                seamlessly.
              </motion.p>
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Link to="/dashboard">
                <Button size="lg" className="bg-black text-white hover:bg-black/80" onClick={()=>{}}>
                  Start Coding Now
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                </Link>
                {/* <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Watch Demo
                </Button> */}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mx-auto max-w-5xl"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-gray-200/50 to-transparent blur-3xl -z-10 rounded-full"></div>
              <CodeEditor />
            </motion.div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Supported Languages</h2>
            </div>
            <LanguageSlider />
          </div>
        </section>

        <section id="features" className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <motion.div
                className="inline-block px-3 py-1 rounded-full bg-gray-100 text-black text-sm font-medium mb-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Features
              </motion.div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4 text-gray-900"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Powerful Features
              </motion.h2>
              <motion.p
                className="text-gray-600 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                Everything you need to code collaboratively in one platform
              </motion.p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Tilt key={index} options={{ max: 10, scale: 1.01 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-white border-gray-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="bg-gray-100 text-black rounded-lg p-3 w-fit mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Tilt>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

