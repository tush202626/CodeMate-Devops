// import codeIllustration from "../../assets/code-illustration.jpg"
// import FormComponent from "../../forms/FormComponent"
import AuthFormComponent from "../../forms/AuthFormComponent"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white text-black overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-gray-200 opacity-60 animate-float-slow"></div>
        <div className="absolute top-1/4 -right-12 w-36 h-36 rounded-full bg-gray-300 opacity-50 animate-float"></div>
        <div className="absolute bottom-1/3 -left-16 w-48 h-48 rounded-full bg-gray-400 opacity-40 animate-float-reverse"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex w-full max-w-6xl flex-col-reverse items-center justify-center gap-12 px-6 py-12 sm:flex-row sm:px-16">
        {/* Left Section - Illustration */}
        {/* <div className="flex w-full justify-center sm:w-1/2">
          <div className="relative">
            <img
              src={codeIllustration || "/placeholder.svg"}
              alt="Code Collaboration"
              className="relative w-[280px] sm:w-[420px] rounded-2xl drop-shadow-lg transition-all duration-500 hover:scale-105 hover:rotate-1 animate-float-medium"
            />
          </div>
        </div> */}

        {/* Right Section - Form */}
        <div className="flex w-full sm:w-1/2 items-center justify-center">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 sm:p-10 shadow-lg border border-gray-300">
            <div className="mb-8">
              <h2 className="mb-3 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Get Started 🚀
              </h2>
              <p className="text-center text-lg text-gray-700">Join the collaboration now!</p>
            </div>
            <AuthFormComponent />
          </div>
        </div>
      </div>

      {/* Bottom Animated SVG Waves */}
      <svg className="absolute rotate-180 bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          fill="rgba(0, 0, 0, 0.08)"
          d="M0,320L40,288C80,256,160,192,240,186.7C320,181,400,235,480,245.3C560,256,640,224,720,208C800,192,880,192,960,181.3C1040,171,1120,149,1200,138.7C1280,128,1360,128,1400,128L1440,128L1440,0L0,0Z"
        ></path>
      </svg>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes float-reverse {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        .animate-float-slow {
          animation: float-slow 7s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-reverse {
          animation: float-reverse 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}