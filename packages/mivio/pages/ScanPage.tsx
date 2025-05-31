
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { PASTEL_COLORS } from '../constants';
import OfflineBanner from '../components/brandActivationDetail/OfflineBanner';
import Confetti from '../components/brandActivationDetail/Confetti';
import { XMarkIcon, CameraIcon, SignalIcon, CheckCircleIcon, ExclamationCircleIcon, SparklesIcon } from '../components/icons/NavIcons';

type ScanStep = 'initializing' | 'scanning' | 'success' | 'error_scan' | 'no_camera_nfc';

const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const [scanStep, setScanStep] = useState<ScanStep>('initializing');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [hasCameraSupport, setHasCameraSupport] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [successMessageIndex, setSuccessMessageIndex] = useState(0);

  const successMessages = ["Congrats!", "Check-In Complete!"];

  useEffect(() => {
    // Initial animation for the overlay
    const overlay = document.getElementById('scan-page-overlay');
    if (overlay) {
        overlay.classList.remove('opacity-0');
        overlay.classList.add('opacity-100');
    }
    
    if (scanStep === 'initializing') {
      // Check for camera support
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraSupport(false);
        setScanStep('no_camera_nfc');
      } else {
        setHasCameraSupport(true);
        setScanStep('scanning');
      }
    }
    
    if (scanStep === 'scanning') {
      const scanTimer = setTimeout(() => {
        setSuccessMessageIndex(Math.floor(Math.random() * successMessages.length));
        setScanStep('success');
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000); // Confetti duration
      }, 2000); // Simulate 1.5-2 seconds scan time
      return () => clearTimeout(scanTimer);
    }

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [scanStep, successMessages.length]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      navigate(-1); // Go back to the previous page
    }, 300); // Duration of fadeOut animation
  }, [navigate]);

  const handleTryAgainFromError = () => {
    setScanStep('scanning');
  };
  
  const renderScanningContent = () => (
    <div className="flex flex-col items-center justify-center text-center h-full animate-fadeInSlow">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-6">Scan QR or Tap Your NFC Wristband</h1>
      
      {/* Animated Camera Frame */}
      <div id="qr-scanner-area" className="relative w-60 h-60 sm:w-72 sm:h-72 mx-auto mb-5 bg-slate-100 rounded-2xl shadow-xl overflow-hidden p-1 ring-4 ring-white/50 ring-offset-2 ring-offset-slate-100">
        <div className={`absolute inset-0 ${PASTEL_COLORS.mint.light} opacity-20 animate-softGlow`}></div>
        <CameraIcon className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 text-slate-500 opacity-50" />
        {/* Animated Corners */}
        {[0,1,2,3].map(i => (
          <div key={i} className={`absolute w-8 h-8 border-4 ${PASTEL_COLORS.mint.DEFAULT.replace('bg-', 'border-')} animate-corner-pulse 
            ${i===0 ? 'top-2 left-2 border-r-0 border-b-0 rounded-tl-lg' : ''}
            ${i===1 ? 'top-2 right-2 border-l-0 border-b-0 rounded-tr-lg' : ''}
            ${i===2 ? 'bottom-2 left-2 border-r-0 border-t-0 rounded-bl-lg' : ''}
            ${i===3 ? 'bottom-2 right-2 border-l-0 border-t-0 rounded-br-lg' : ''}
          `}/>
        ))}
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-green-300 to-transparent animate-scan-line shadow-lg"></div>
      </div>

      <div className="flex items-center justify-center space-x-1.5 mb-2">
        <p className="text-xl font-semibold text-slate-700">Scanning</p>
        <div className="flex space-x-1">
          {[0,1,2].map(i => (
            <div key={i} className={`w-2 h-2 ${PASTEL_COLORS.mint.DEFAULT} rounded-full animate-dot-pulse`} style={{animationDelay: `${i * 0.2}s`}}></div>
          ))}
        </div>
      </div>
      <p className={`${PASTEL_COLORS.textLight} text-sm max-w-xs mx-auto`}>
        Check in to earn XP and unlock rewards!
      </p>
    </div>
  );

  const renderSuccessContent = () => (
    <div className="flex flex-col items-center justify-center text-center animate-fadeInScale">
      <div className="relative mb-6">
        {/* Choose one icon, e.g., SparklesIcon for XP gem */}
        <SparklesIcon className={`w-24 h-24 ${PASTEL_COLORS.yellow.filled_icon} animate-success-icon-pop`} />
        {/* Or CheckCircleIcon */}
        {/* <CheckCircleIcon className={`w-24 h-24 ${PASTEL_COLORS.mint.text} animate-success-icon-pop`} /> */}
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-3">{successMessages[successMessageIndex]}</h1>
      <p className={`${PASTEL_COLORS.textDark} text-lg mb-1`}>You’ve earned <span className="font-bold text-green-600">+50 XP</span>.</p>
      <p className={`${PASTEL_COLORS.textLight} text-sm mb-1`}>Welcome to <span className="font-semibold">Synthwave Fest</span>!</p>
      <p className={`${PASTEL_COLORS.textLight} text-sm mb-8 max-w-xs`}>Keep exploring to win more badges!</p>
      <button
        onClick={handleClose}
        className={`${PASTEL_COLORS.mint.button} text-white text-lg font-semibold py-3.5 px-10 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all transform animate-button-bounce-in`}
      >
        Continue
      </button>
    </div>
  );
  
  const renderErrorScanContent = () => (
     <div className="flex flex-col items-center justify-center text-center h-full animate-fadeInSlow">
        <div id="error-scanner-area" className="relative w-60 h-60 sm:w-72 sm:h-72 mx-auto mb-5 bg-slate-100 rounded-2xl shadow-xl overflow-hidden p-1 animate-shake">
             <ExclamationCircleIcon className={`absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 ${PASTEL_COLORS.red.text} opacity-70`} />
        </div>
        <p className={`${PASTEL_COLORS.red.text} font-semibold mb-4 text-center`}>
            Scan failed. Try again, or tap your NFC wristband.
        </p>
        <button
            onClick={handleTryAgainFromError}
            className={`${PASTEL_COLORS.sky.button} text-white text-md font-semibold py-3 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all`}
        >
            Try Again
        </button>
    </div>
  );

  const renderNoCameraNfcContent = () => (
    <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-2xl shadow-xl animate-fadeInScale">
        <ExclamationCircleIcon className={`w-16 h-16 ${PASTEL_COLORS.yellow.text} mb-4`} />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Device Support Issue</h2>
        <p className={`${PASTEL_COLORS.textLight} text-sm mb-6`}>
            Show your QR to staff or enter code manually. This device may not support camera or NFC scanning.
        </p>
        <button
            onClick={handleClose}
            className={`${PASTEL_COLORS.sky.button} text-white text-md font-semibold py-3 px-8 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all`}
        >
            Close
        </button>
    </div>
  );

  const getCurrentStepContent = () => {
    switch(scanStep) {
      case 'scanning': return renderScanningContent();
      case 'success': return renderSuccessContent();
      case 'error_scan': return renderErrorScanContent();
      case 'no_camera_nfc': return renderNoCameraNfcContent();
      case 'initializing':
      default:
        return ( // Placeholder for initializing or if something unexpected happens
          <div className="flex items-center justify-center h-full">
            <div className={`w-8 h-8 border-4 ${PASTEL_COLORS.mint.border} border-t-transparent rounded-full animate-spin`}></div>
          </div>
        );
    }
  };

  return (
    <div 
        id="scan-page-overlay"
        className={`fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4 overflow-y-auto transition-opacity duration-300 opacity-0 ${isClosing ? 'animate-fadeOutPage' : ''}`}
    >
      <OfflineBanner isOnline={isOnline} message="Offline – your check-in will be saved and synced when online."/>
      
      <button
        onClick={handleClose}
        className="absolute top-5 right-5 p-2 bg-slate-100 hover:bg-slate-200 rounded-full shadow-md transition-colors active:scale-90 z-20"
        aria-label="Close scan overlay"
      >
        <XMarkIcon className="w-6 h-6 text-slate-600" />
      </button>

      <div className="w-full max-w-lg flex flex-col items-center justify-center flex-grow">
        {getCurrentStepContent()}
      </div>

      {showConfetti && <Confetti />}
      
      <style>{`
        @keyframes fadeInPage {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeInPage { animation: fadeInPage 0.3s ease-out forwards; }
        @keyframes fadeOutPage {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        .animate-fadeOutPage { animation: fadeOutPage 0.3s ease-out forwards; }
        
        @keyframes fadeInSlow {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0px); }
        }
        .animate-fadeInSlow { animation: fadeInSlow 0.5s ease-out forwards; }


        @keyframes cornerPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        .animate-corner-pulse { animation: cornerPulse 1.5s infinite ease-in-out; }

        @keyframes scanLine {
          0% { transform: translateY(-10%); opacity: 0.3; }
          50% { transform: translateY(110%); opacity: 0.8; }
          100% { transform: translateY(-10%); opacity: 0.3; }
        }
        .animate-scan-line { animation: scanLine 2.5s infinite ease-in-out; }
        
        @keyframes softGlow {
          0%, 100% { opacity: 0.2; box-shadow: 0 0 15px 5px ${PASTEL_COLORS.mint.light.replace('bg-','').replace('-100','(default)')}; } /* Assuming a default if not specified */
          50% { opacity: 0.3; box-shadow: 0 0 25px 10px ${PASTEL_COLORS.mint.light.replace('bg-','').replace('-100','(default)')}; }
        }
        .animate-softGlow { animation: softGlow 2.5s infinite ease-in-out alternate; }


        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .animate-dot-pulse { animation: dotPulse 1.2s infinite ease-in-out; }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeInScale { animation: fadeInScale 0.4s ease-out forwards; }
        
        @keyframes successIconPop {
          0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(10deg); opacity: 1; }
          80% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        .animate-success-icon-pop { animation: successIconPop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }

        @keyframes buttonBounceIn {
          0% { transform: scale(0.7) translateY(10px); opacity: 0; }
          60% { transform: scale(1.05) translateY(-5px); opacity: 1; }
          80% { transform: scale(0.98) translateY(0px); }
          100% { transform: scale(1) translateY(0px); opacity: 1; }
        }
        .animate-button-bounce-in { animation: buttonBounceIn 0.5s ease-out 0.2s forwards; /* Delay after icon */ }
      `}</style>
    </div>
  );
};

export default ScanPage;
