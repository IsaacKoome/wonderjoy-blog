"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { analyzeSkinFromImage } from "@/lib/skinAnalysis";

export default function AnalyzePage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<null | {
    score: number;
    skinType: string;
    concerns: string[];
    recommendations: string[];
    products: { name: string; link: string }[];
  }>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Pre-load camera permission on page load
  useEffect(() => {
    const preloadCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        setPermissionGranted(true);
        // Don't stop the stream immediately - keep it for later use
      } catch (err) {
        console.log("Camera permission denied or error:", err);
        setPermissionGranted(false);
      }
    };
    preloadCamera();
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      // If we already have a stream, use it
      if (streamRef.current && streamRef.current.active) {
        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();
          setCameraActive(true);
        }
        return;
      }
      
      // Otherwise request a new stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user", // Front camera for selfies
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setCameraActive(true);
        };
      }
    } catch (err) {
      console.error("Error starting camera:", err);
      alert("Please allow camera access to analyze your skin.");
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) {
      console.error("Video or canvas ref missing");
      return;
    }
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    console.log("Capturing photo. Video dimensions:", video.videoWidth, "x", video.videoHeight);
    
    if (canvas.width === 0 || canvas.height === 0) {
      console.error("Video dimensions are zero. Video may not be ready.");
      alert("Please wait a moment for the camera to fully load, then try again.");
      return;
    }
    
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    
    // Start analysis
    setAnalyzing(true);
    
    try {
      // Create an image element from the canvas
      const imageElement = new Image();
      imageElement.src = canvas.toDataURL();
      
      // Wait for image to load
      await new Promise((resolve) => {
        imageElement.onload = resolve;
      });
      
      // Run the analysis
      const analysisResults = await analyzeSkinFromImage(imageElement);
      setResults(analysisResults);
    } catch (error) {
      console.error("Analysis failed:", error);
      setResults({
        score: 75,
        skinType: "Normal",
        concerns: ["Analysis couldn't complete. Please try again with better lighting."],
        recommendations: ["Make sure your face is well-lit and try again"],
        products: [],
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResults(null);
    setCameraActive(false);
    setAnalyzing(false);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="text-2xl font-bold text-pink-600 inline-block mb-4">
            Wonderjoy AI
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Analyze Your Skin
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Take a photo of your skin and get personalized skincare recommendations based on your unique needs.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
          
          {/* State 1: Initial + Button */}
          {!cameraActive && !analyzing && !results && (
            <div className="text-center py-12">
              <button
                onClick={startCamera}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center mx-auto"
              >
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <p className="text-gray-500 mt-6">Tap the + button to analyze your skin</p>
              <p className="text-gray-400 text-sm mt-2">We'll ask for camera access — it's only used for analysis</p>
            </div>
          )}

          {/* State 2: Camera Active */}
          {cameraActive && !analyzing && !results && (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden bg-gray-900 aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                  style={{ transform: 'scaleX(-1)' }} // Mirror selfie view
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>
              <div className="flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition"
                >
                  Capture Photo
                </button>
                <button
                  onClick={() => {
                    if (streamRef.current) {
                      streamRef.current.getTracks().forEach(track => track.stop());
                      streamRef.current = null;
                    }
                    setCameraActive(false);
                  }}
                  className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* State 3: Analyzing */}
          {analyzing && (
            <div className="text-center py-12">
              <div className="inline-block w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
              <p className="text-gray-600 mt-6">Analyzing your skin...</p>
              <p className="text-gray-400 text-sm mt-2">This will only take a few seconds</p>
            </div>
          )}

          {/* State 4: Results */}
          {results && !analyzing && !cameraActive && (
            <div className="space-y-8">
              {/* Score Circle */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-40 h-40 rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-600">{results.score}</div>
                    <div className="text-sm text-gray-500">Skin Score</div>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  Your skin appears to be <strong>{results.skinType}</strong> with {results.concerns.length} areas to focus on.
                </p>
              </div>

              {/* Concerns */}
              {results.concerns.length > 0 && (
                <div className="bg-pink-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">🔍 What We Found</h3>
                  <ul className="space-y-2">
                    {results.concerns.map((concern, i) => (
                      <li key={i} className="text-gray-600 flex items-start gap-2">
                        <span className="text-pink-500">•</span>
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {results.recommendations.length > 0 && (
                <div className="bg-white border border-pink-100 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">✨ Our Recommendations</h3>
                  <ul className="space-y-2">
                    {results.recommendations.map((rec, i) => (
                      <li key={i} className="text-gray-600 flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products */}
              {results.products.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🛒 Products We Recommend</h3>
                  <div className="space-y-3">
                    {results.products.map((product, i) => (
                      <a
                        key={i}
                        href={product.link}
                        target="_blank"
                        rel="nofollow"
                        className="block bg-gray-50 hover:bg-gray-100 rounded-xl p-4 transition flex justify-between items-center"
                      >
                        <span className="font-medium text-gray-800">{product.name}</span>
                        <span className="text-pink-500 text-sm">Shop on Amazon →</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={resetAnalysis}
                  className="flex-1 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full transition"
                >
                  Analyze Another Photo
                </button>
                <Link
                  href="/articles"
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-full transition text-center"
                >
                  Read More Articles
                </Link>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-400 text-center pt-4">
                This analysis is for educational purposes. For serious skin concerns, consult a dermatologist.
              </p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}