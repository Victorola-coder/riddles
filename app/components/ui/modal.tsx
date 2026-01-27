import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  close?: boolean;
  children: React.ReactNode;
  className?: string;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  close,
  children,
  className,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className={`bg-[#161616] rounded-lg border border-[#FFFFFF1A] p-6 
                w-full max-w-[500px] max-h-[90vh] flex flex-col shadow-xl ${className}`}
            >
              {title && (
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white bg-gradient-to-r from-[#8b5cf6] to-[#fbbf24] bg-clip-text text-transparent">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#1A1A1A] rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              {close && !title && (
                <div className="flex justify-end mb-4">
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-[#1A1A1A] rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>
              )}
              <div className="overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
