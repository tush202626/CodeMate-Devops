"use client"

import { motion } from "framer-motion"
import { FileCode2, Braces, Database, Code2, Server, Globe } from "lucide-react"
import { useRef, useEffect, useState } from "react"

const LanguageSlider = () => {
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(0)

  const languages = [
    { name: "JavaScript", icon: <FileCode2 className="h-5 w-5" />, color: "#F7DF1E" },
    { name: "Python", icon: <FileCode2 className="h-5 w-5" />, color: "#3776AB" },
    { name: "Java", icon: <FileCode2 className="h-5 w-5" />, color: "#007396" },
    { name: "C++", icon: <FileCode2 className="h-5 w-5" />, color: "#00599C" },
    { name: "TypeScript", icon: <FileCode2 className="h-5 w-5" />, color: "#3178C6" },
    { name: "PHP", icon: <FileCode2 className="h-5 w-5" />, color: "#777BB4" },
    { name: "Ruby", icon: <FileCode2 className="h-5 w-5" />, color: "#CC342D" },
    { name: "Go", icon: <FileCode2 className="h-5 w-5" />, color: "#00ADD8" },
    { name: "Swift", icon: <FileCode2 className="h-5 w-5" />, color: "#FA7343" },
    { name: "Kotlin", icon: <FileCode2 className="h-5 w-5" />, color: "#7F52FF" },
    { name: "Rust", icon: <FileCode2 className="h-5 w-5" />, color: "#000000" },
    { name: "C#", icon: <FileCode2 className="h-5 w-5" />, color: "#239120" },
    { name: "Node.js", icon: <Server className="h-5 w-5" />, color: "#339933" },
  ]

  // Duplicate the languages array to create a seamless loop
  const duplicatedLanguages = [...languages, ...languages]

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.scrollWidth / 2)
    }
  }, [])

  return (
    <div className="overflow-hidden w-full py-6" ref={containerRef}>
      <motion.div
        className="flex"
        animate={{
          x: [-containerWidth, 0],
        }}
        transition={{
          x: {
            duration: 50,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          },
        }}
        style={{
          width: containerWidth * 2,
        }}
      >
        {duplicatedLanguages.map((language, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-2 mx-2 bg-white rounded-lg shadow-sm border border-gray-100"
            style={{ minWidth: "fit-content" }}
          >
            <div className="mr-2 text-gray-700">{language.icon}</div>
            <span className="font-medium text-gray-800">{language.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default LanguageSlider
