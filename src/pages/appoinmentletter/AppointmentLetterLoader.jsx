import { motion } from "framer-motion";
import { AiOutlineFileText, AiOutlineCloudSync } from "react-icons/ai";
import { RiAiGenerate, RiFilePaper2Line } from "react-icons/ri";
import { FaRegFilePdf } from "react-icons/fa";
import { TbFileCertificate } from "react-icons/tb";

export default function AppointmentLetterLoader() {
  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-blue-50/90 to-white/90 backdrop-blur-xl flex items-center justify-center">
      <div className="relative bg-white rounded-3xl p-8 shadow-2xl text-center max-w-md w-full mx-4 border border-blue-100/50 overflow-hidden">
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #0ea5e9 2px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated Document Icon */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto w-24 h-24 mb-6"
        >
          {/* Outer glow */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 blur-lg opacity-50"
          />
          
          {/* Document container */}
          <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-white rounded-2xl flex items-center justify-center shadow-xl border border-blue-100/50">
            {/* Document pages effect */}
            <div className="absolute -top-2 right-4 w-16 h-20 bg-gradient-to-br from-blue-100/80 to-white rounded-lg transform rotate-6 border border-blue-200/30"></div>
            <div className="absolute -top-1 right-2 w-16 h-20 bg-gradient-to-br from-blue-50 to-white rounded-lg transform rotate-3 border border-blue-200/50"></div>
            
            {/* Main document */}
            <div className="relative w-16 h-20 bg-gradient-to-br from-white to-blue-50 rounded-lg flex items-center justify-center shadow-inner border border-blue-200">
              <motion.div
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <TbFileCertificate className="text-blue-500 text-3xl" />
              </motion.div>
              
              {/* Animated seal/stamp */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-white text-xs font-bold">✓</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Title with gradient */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2"
        >
          Creating Appointment Letter
        </motion.h2>

        {/* Status text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8 text-sm font-medium"
        >
          Securely generating your official HR document
        </motion.p>

        {/* Progress bar */}
        <div className="relative h-2 bg-blue-100 rounded-full overflow-hidden mb-8">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "85%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 rounded-full"
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </motion.div>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-between items-center mb-6 px-2">
          {['Formatting', 'Processing', 'Finalizing'].map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.3 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-2 border-blue-200 flex items-center justify-center mb-2"
              >
                <span className="text-blue-600 text-xs font-bold">{index + 1}</span>
              </motion.div>
              <span className="text-xs text-gray-500 font-medium">{step}</span>
            </div>
          ))}
        </div>

        {/* AI Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-full border border-blue-200/50"
        >
          <div className="relative">
            <RiAiGenerate className="text-blue-600" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
          </div>
          <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            AI-Powered Generation
          </span>
          <AiOutlineCloudSync className="text-blue-400 animate-pulse" />
        </motion.div>

        {/* Estimated time */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-4 text-xs text-gray-400"
        >
          Estimated time: <span className="font-semibold text-blue-500">15-20 seconds</span>
        </motion.p>
      </div>
    </div>
  );
}