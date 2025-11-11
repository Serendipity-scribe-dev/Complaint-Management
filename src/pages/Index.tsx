import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-50 to-white px-6 text-center">
      
      {/* Animated Icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="mb-6 bg-blue-100 p-6 rounded-full"
      >
        <ClipboardList className="w-14 h-14 text-blue-600" />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
      >
        Smart Complaint Management System
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-gray-600 max-w-2xl mb-8 text-lg"
      >
        Simplify complaint tracking and resolution with real-time monitoring, 
        role-based access, and a user-friendly interface.
      </motion.p>

      {/* Call to Action */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 rounded-lg shadow-md transition-all duration-300"
          onClick={() => {
            window.location.href = "/auth";
          }}
        >
          Get Started
        </Button>
      </motion.div>

      {/* Background subtle design */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1 }}
          className="w-[800px] h-[800px] bg-blue-200 rounded-full blur-3xl absolute top-[-200px] right-[-300px]"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1.2 }}
          className="w-[600px] h-[600px] bg-indigo-200 rounded-full blur-3xl absolute bottom-[-200px] left-[-300px]"
        ></motion.div>
      </div>
    </div>
  );
};

export default Index;
