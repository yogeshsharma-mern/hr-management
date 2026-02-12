// components/common/Modal.jsx
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md", // sm | md | lg | xl | full
  showCloseIcon = true,
  closeOnOverlayClick = true,
  type = "default", // default, success, warning, error, info
  showHeader = true,
  showFooter = false,
  footerContent,
  primaryAction,
  secondaryAction,
  overlayBlur = true,
  animation = "scale", // scale, slide-up, slide-down, fade
  hideScrollbar = false,
  maxHeight = "90vh", // Custom max height
  customClassName = "",
}) {
  // Close modal on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
    "2xl": "max-w-4xl",
    "3xl": "max-w-6xl",
    full: "max-w-[95vw] w-[95vw]",
  };

  const typeStyles = {
    default: {
      header: "bg-[var(--bg-surface)]",
      accent: "from-blue-500 to-cyan-500",
      text: "text-[var(--text-primary)]",
      border: "border-[var(--border-color)]",
    },
    success: {
      header: "bg-gradient-to-r from-emerald-50 to-green-50",
      accent: "from-emerald-500 to-green-500",
      text: "text-emerald-800",
      border: "border-emerald-200",
    },
    warning: {
      header: "bg-gradient-to-r from-amber-50 to-orange-50",
      accent: "from-amber-500 to-orange-500",
      text: "text-amber-800",
      border: "border-amber-200",
    },
    error: {
      header: "bg-gradient-to-r from-red-50 to-rose-50",
      accent: "from-red-500 to-rose-500",
      text: "text-red-800",
      border: "border-red-200",
    },
    info: {
      header: "bg-[(--bg-gradient)]",
      accent: "from-blue-500 to-cyan-500",
      text: "text-blue-800",
      border: "border-blue-200",
    },
  };

  const animationClasses = {
    scale: "animate-modal-scale",
    "slide-up": "animate-modal-slide-up",
    "slide-down": "animate-modal-slide-down",
    fade: "animate-modal-fade",
  };

  const currentType = typeStyles[type];

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Overlay with blur effect */}
      <div
        className={`absolute inset-0 h-[100vh] bg-gradient-to-br from-black/30 via-black/30 to-black/40  transition-all duration-300 ${
          overlayBlur ? "" : ""
        }`}
        onClick={handleOverlayClick}
      />

      {/* Modal Container */}
      <div
        className={`relative w-full ${sizeClasses[size]} ${animationClasses[animation]} ${customClassName}`}
        style={{
          maxHeight: maxHeight,
        }}
      >
        {/* Modal Card */}
        <div className="bg-[var(--bg-surface)] rounded-2xl shadow-2xl shadow-black/20 border border-[var(--border-color)] overflow-hidden flex flex-col h-full">
          {/* Header with gradient */}
          {showHeader && (
            <div className={`relative ${currentType.header} px-6 py-5 border-b ${currentType.border}`}>
              {/* Accent line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${currentType.accent}`}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Optional icon */}
                  {type !== "default" && (
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${currentType.accent} flex items-center justify-center`}>
                      {type === "success" && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {type === "error" && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      {type === "warning" && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {type === "info" && (
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  )}
                  <h2 className={`text-xl font-bold ${currentType.text}`}>
                    {title}
                  </h2>
                </div>

                {showCloseIcon && (
                  <button
                    onClick={onClose}
                    className="group w-10 h-10 flex items-center justify-center cursor-pointer rounded-xl bg-gray-100 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 text-gray-500 hover:text-red-500 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-200"
                    aria-label="Close modal"
                  >
                    <MdClose size={22} className="transition-transform cursor-pointer group-hover:rotate-90" />
                  </button>
                )}
              </div>

              {/* Optional subtitle */}
              {title && (
                <p className="text-sm text-gray-500 mt-2">
                  Please review the information below
                </p>
              )}
            </div>
          )}

          {/* Body - Scrollable */}
          <div
            className={`flex-1 overflow-y-auto p-6 ${
              hideScrollbar ? "scrollbar-hide" : "custom-scrollbar"
            }`}
            style={{
              maxHeight: `calc(${maxHeight} - ${showHeader ? "80px" : "0px"} - ${showFooter ? "80px" : "0px"})`,
            }}
          >
            <div className="space-y-4">{children}</div>
          </div>

          {/* Footer */}
          {showFooter && (
            <div className={`px-6 py-5 border-t ${currentType.border} bg-gradient-to-r from-gray-50 to-white/50`}>
              <div className="flex items-center justify-between">
                {footerContent ? (
                  <div className="text-sm text-gray-600">{footerContent}</div>
                ) : (
                  <div />
                )}
                
                <div className="flex items-center space-x-3">
                  {secondaryAction && (
                    <button
                      onClick={secondaryAction.onClick}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 min-w-[100px]"
                    >
                      {secondaryAction.label || "Cancel"}
                    </button>
                  )}
                  
                  {primaryAction && (
                    <button
                      onClick={primaryAction.onClick}
                      className={`px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 min-w-[100px] bg-gradient-to-r ${currentType.accent} hover:opacity-90 hover:scale-[1.02]`}
                      disabled={primaryAction.loading}
                    >
                      {primaryAction.loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin h-4 w-4 mr-2 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        primaryAction.label || "Confirm"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}