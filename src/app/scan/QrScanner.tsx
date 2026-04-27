'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function QrScanner() {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const router = useRouter();

  const upiSuffix = ".owb";

  useEffect(() => {
    // Dynamic QR Box sizing based on parent width
    const qrboxFunction = (viewfinderWidth: number, viewFinderHeight: number) => {
        let minEdgePercentage = 0.7; // 70%
        let minEdgeSize = Math.min(viewfinderWidth, viewFinderHeight);
        let qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
        return {
            width: qrboxSize,
            height: qrboxSize
        };
    };

    const config = { 
        fps: 20, 
        qrbox: qrboxFunction,
        aspectRatio: 1.0
    };

    const html5QrCode = new Html5Qrcode("reader");
    scannerRef.current = html5QrCode;

    const qrCodeSuccessCallback = (decodedText: string) => {
        if (decodedText.endsWith(upiSuffix)) {
            html5QrCode.stop().then(() => {
                router.push(`/send?to=${encodeURIComponent(decodedText)}`);
            });
        } else {
            setError(`Invalid handle format`);
            setTimeout(() => setError(null), 3000);
        }
    };

    html5QrCode.start(
        { facingMode: "environment" }, 
        config, 
        qrCodeSuccessCallback,
        () => {}
    ).catch((err) => {
        setError("Camera access required");
        console.error(err);
    });

    return () => {
        if (scannerRef.current && scannerRef.current.isScanning) {
            scannerRef.current.stop().catch(console.error);
        }
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[400px] mx-auto overflow-hidden rounded-[3rem] bg-zinc-900 border-4 border-zinc-800 shadow-2xl transition-all duration-500 hover:border-white/20">
      <div id="reader" className="w-full h-full"></div>
      
      {error && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center z-20">
           <AlertCircle size={40} className="text-red-500 mb-4" />
           <p className="text-white font-black uppercase text-xs tracking-tighter">{error}</p>
        </div>
      )}

      {/* Responsive Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-[15%] border-2 border-white/20 rounded-3xl animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 shadow-[0_0_20px_white] animate-scan-fast"></div>
      </div>

      <style jsx global>{`
        #reader { border: none !important; position: relative; }
        #reader video { 
            width: 100% !important; 
            height: 100% !important; 
            object-fit: cover !important; 
        }
        @keyframes scan-fast {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateY(400px); opacity: 0; }
        }
        .animate-scan-fast {
            animation: scan-fast 2.5s infinite linear;
        }
      `}</style>
    </div>
  );
}
