'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QrScanner() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  const handleValidation = (decodedText: string) => {
    if (decodedText.startsWith('okwepay:')) {
        const paymentId = decodedText.split(':')[1];
        setSuccess("Merchant Payment Detected");
        stopAndNavigate(`https://okwepay.vercel.app/pay/${paymentId}`);
        return true;
    }

    if (decodedText.endsWith('.owb')) {
        setSuccess("User Handle Detected");
        stopAndNavigate(`/send?to=${encodeURIComponent(decodedText)}`);
        return true;
    }
    return false;
  };

  const stopAndNavigate = (url: string) => {
    if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
            router.push(url);
        }).catch(() => {
            router.push(url); // Navigate anyway
        });
    }
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const qrboxFunction = (viewfinderWidth: number, viewFinderHeight: number) => {
        let minEdgeSize = Math.min(viewfinderWidth, viewFinderHeight);
        let qrboxSize = Math.floor(minEdgeSize * 0.7);
        return { width: qrboxSize, height: qrboxSize };
    };

    html5QrCode.start(
        { facingMode: "environment" }, 
        { fps: 20, qrbox: qrboxFunction, aspectRatio: 1.0 }, 
        (decodedText) => {
            if (handleValidation(decodedText)) {
                // Handled in validation
            } else {
                setError("Invalid Okwe QR");
                setTimeout(() => setError(null), 3000);
            }
        },
        () => {}
    ).catch((err) => {
        setError("Camera permission required");
    });

    // CRITICAL: Stop camera when user leaves the page
    return () => {
        if (html5QrCode.isScanning) {
            html5QrCode.stop().catch(err => console.error("Failed to stop scanner", err));
        }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto overflow-hidden rounded-[3rem] bg-zinc-900 border-4 border-zinc-800 shadow-2xl">
      <div id="reader" className="w-full h-full"></div>
      
      {success && (
        <div className="absolute inset-0 bg-[#21C179]/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-30 animate-in fade-in">
            <CheckCircle2 size={64} className="text-white mb-4" />
            <p className="text-white font-black uppercase text-lg">{success}</p>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 bg-red-600/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-20">
           <AlertCircle size={40} className="text-white mb-4" />
           <p className="text-white font-black uppercase text-xs">{error}</p>
        </div>
      )}

      <div className="absolute inset-0 pointer-events-none z-10 border-[16px] border-black/40">
        <div className="absolute inset-0 border-4 border-white/20 rounded-[2rem] animate-pulse"></div>
      </div>

      <style jsx global>{`
        #reader video { width: 100% !important; height: 100% !important; object-fit: cover !important; }
      `}</style>
    </div>
  );
}
