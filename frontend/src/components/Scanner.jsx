import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, ShieldAlert, AlertTriangle, CheckCircle2, UserCheck, Loader2, RefreshCw, Phone, Mail } from 'lucide-react';

export default function Scanner() {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  // Camera Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);

  const fileInputRef = useRef(null);


  useEffect(() => {
  if (useCamera && stream && videoRef.current) {
    videoRef.current.srcObject = stream;

    videoRef.current
      .play()
      .catch((err) => {
        console.error('Video playback error:', err);
      });
  }
}, [useCamera, stream]);

  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/webp')) {
        setError('Only JPG, PNG and WEBP images are allowed');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
      setScanResult(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      if (!file.type.match('image/jpeg') && !file.type.match('image/png') && !file.type.match('image/webp')) {
        setError('Only JPG, PNG and WEBP images are allowed');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
      setScanResult(null);
    }
  };

const startCamera = async () => {
  setError('');
  setScanResult(null);

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        'Camera API is not supported in this browser or connection.'
      );
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    });

    setStream(mediaStream);
    setUseCamera(true);

  } catch (err) {
    console.error('Camera Error:', err);

    if (err.name === 'NotAllowedError') {
      setError('Camera permission denied. Please allow camera access in your browser.');
    } else if (err.name === 'NotFoundError') {
      setError('No camera was found on this device.');
    } else if (err.name === 'NotReadableError') {
      setError('Camera is already being used by another application.');
    } else {
      setError(err.message || 'Unable to access camera.');
    }
  }
};
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setUseCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Set canvas dimensions matching video feed
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas to blob file
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'snapshot.jpg', { type: 'image/jpeg' });
          setImageFile(file);
          setImagePreview(canvas.toDataURL('image/jpeg'));
          stopCamera();
        }
      }, 'image/jpeg');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setScanResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleScan = async () => {
    if (!imageFile) {
      setError('Provide an input photo to initiate scan.');
      return;
    }

    setScanning(true);
    setError('');
    setScanResult(null);

    const checkData = new FormData();
    checkData.append('file', imageFile);

    try {
      const response = await fetch('/api/find-person', {
        method: 'POST',
        body: checkData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Biometric scan pipeline failed. Ensure face is properly aligned.');
      }

      setScanResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      {/* Visual scanning overlay keyframes */}
      <style>{`
        @keyframes scan-glow {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .laser-line {
          animation: scan-glow 2.5s infinite linear;
        }
      `}</style>

      <div className="bg-zinc-950 border border-zinc-800 rounded p-8 relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-red-500 bg-red-950/20 px-3 py-1 border border-red-900/40 rounded-full mb-3">
              <ShieldAlert size={14} />
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase">REAL-TIME BIOMETRIC DEPLOYMENT</span>
            </div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-white">Citizen Scan Portal</h2>
            <p className="text-xs text-zinc-400 mt-1">
              Upload or capture a snapshot to cross-reference our vector db for matching missing individuals.
            </p>
          </div>

          <div className="flex gap-2">
            {!useCamera ? (
              <button
                onClick={startCamera}
                className="px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none transition-colors"
              >
                <Camera size={14} /> Use Device Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="px-4 py-2 border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 focus:outline-none transition-colors"
              >
                <X size={14} /> Cancel Terminal
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-900/60 text-red-400 text-xs rounded font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Snapshot Area */}
          <div className="flex flex-col items-center">
            {useCamera ? (
              <div className="relative w-full aspect-video border border-zinc-800 bg-black rounded overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                ></video>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* Camera Reticle */}
                  <div className="w-48 h-48 border border-white/20 rounded-full relative">
                    <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-red-500/40"></div>
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-[1px] bg-red-500/40"></div>
                  </div>
                </div>
                <button
                  onClick={capturePhoto}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs uppercase font-extrabold tracking-wider shadow-lg shadow-black/50 border border-red-500 focus:outline-none"
                >
                  Capture Frame
                </button>
              </div>
            ) : (
              <div className="w-full">
                {!imagePreview ? (
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current.click()}
                    className="h-64 border-2 border-dashed border-zinc-800 hover:border-red-650 bg-zinc-900/40 hover:bg-zinc-900/65 rounded flex flex-col justify-center items-center p-6 text-center cursor-pointer transition-all"
                  >
                    <Upload size={32} className="text-zinc-500 mb-3" />
                    <span className="text-xs text-white font-bold">Drag and drop file or browse</span>
                    <span className="text-[10px] text-zinc-500 mt-1 max-w-[220px]">
                      Accepts webp, jpeg, png format images. Biometrics match best with plain camera alignment.
                    </span>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </div>
                ) : (
                  <div className="relative border border-zinc-800 rounded bg-zinc-900 aspect-video overflow-hidden">
                    {/* Scanning glow line animation */}
                    {scanning && (
                      <div className="absolute left-0 right-0 h-[3px] bg-red-500 shadow-[0_0_8px_#ef4444] z-20 laser-line"></div>
                    )}
                    <img
                      src={imagePreview}
                      alt="Scanned subject"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-1.5 bg-black/80 hover:bg-black rounded-full border border-zinc-805 text-zinc-400 hover:text-white transition-colors focus:outline-none z-30"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={handleScan}
              disabled={scanning || !imageFile}
              className="w-full mt-4 py-3 bg-white hover:bg-zinc-200 text-black font-extrabold uppercase tracking-wider text-xs rounded transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {scanning ? (
                <>
                  <Loader2 size={16} className="animate-spin text-black" />
                  Aligning Vectors...
                </>
              ) : (
                'Run Database Match Query'
              )}
            </button>
          </div>

          {/* Results Side */}
          <div className="h-full border border-zinc-800 bg-zinc-900/30 rounded p-6 flex flex-col justify-center min-h-[300px]">
            {!scanning && !scanResult && (
              <div className="text-center py-8">
                <ShieldAlert size={28} className="text-zinc-650 mx-auto mb-3" />
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-zinc-400">Scan Pipeline Idle</h4>
                <p className="text-[10px] text-zinc-500 max-w-xs mx-auto mt-2 leading-relaxed">
                  Terminal is ready to run. Provide a child/adult face print on the viewport side to invoke the Qdrant comparison pipeline.
                </p>
              </div>
            )}

            {scanning && (
              <div className="text-center py-8 flex flex-col items-center justify-center">
                <RefreshCw size={28} className="text-red-500 animate-spin mb-4" />
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-red-500">Calculating biometrics</h4>
                <p className="text-[10px] text-zinc-400 max-w-xs mx-auto mt-2 leading-relaxed">
                  Extracting face vector arrays, communicating with Qdrant vector clustering index, checking minimum confidence weights...
                </p>
              </div>
            )}

            {!scanning && scanResult && (
              <div className="space-y-6">
                {scanResult.match_found ? (
                  <>
                    {/* CONFIDENCE HEADER */}
                    <div className="p-3 bg-red-950/20 border border-red-900/60 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck size={18} className="text-red-500" />
                        <div>
                          <h4 className="text-xs font-bold uppercase text-white tracking-wider">CONFIDENT MATCH FOUND</h4>
                          <p className="text-[9px] text-zinc-400 font-mono">Similarity meets critical values</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black font-mono text-red-500">
                          {(scanResult.similarity * 100).toFixed(1)}%
                        </div>
                        <p className="text-[8px] text-zinc-500 uppercase tracking-widest font-mono">SIMILARITY SCORE</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 items-start">
                      {/* Database image */}
                      <div className="col-span-1 border border-zinc-800 rounded overflow-hidden aspect-[3/4] bg-zinc-950">
                        <img 
                          src={scanResult.missing_person.image_url} 
                          alt="Database record" 
                          className="w-full h-full object-cover shadow-inner"
                        />
                      </div>

                      {/* Person Details */}
                      <div className="col-span-2 space-y-3">
                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Subject Name</div>
                          <div className="text-sm font-bold text-white uppercase">{scanResult.missing_person.name}</div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Age</div>
                            <div className="text-xs font-semibold text-zinc-300">{scanResult.missing_person.age} years</div>
                          </div>
                          <div>
                            <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Gender</div>
                            <div className="text-xs font-semibold text-zinc-300">{scanResult.missing_person.gender}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Last Seen Location</div>
                          <div className="text-xs font-semibold text-zinc-300">{scanResult.missing_person.last_seen_location}</div>
                        </div>

                        <div>
                          <div className="text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Disappeared On</div>
                          <div className="text-xs font-semibold text-zinc-300 font-mono">{scanResult.missing_person.missing_date}</div>
                        </div>
                      </div>
                    </div>

                    {scanResult.missing_person.description && (
                      <div className="text-[11px] text-zinc-400 bg-zinc-950 border border-zinc-800 p-2.5 rounded leading-normal">
                        <span className="font-bold text-zinc-300 uppercase text-[9px] block mb-1">Details:</span>
                        {scanResult.missing_person.description}
                      </div>
                    )}

                    {/* CONTACT PANEL */}
                    <div className="border-t border-zinc-800 pt-5">
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 mb-2">Guardian Contact Information</div>
                      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded space-y-2">
                        <div className="text-xs font-bold text-white">{scanResult.parent.name || 'Anonymous Guardian'}</div>
                        <div className="space-y-1">
                          {scanResult.parent.phone && (
                            <a 
                              href={`tel:${scanResult.parent.phone}`}
                              className="flex items-center gap-2 text-[11px] text-zinc-400 hover:text-white transition-colors"
                            >
                              <Phone size={12} className="text-red-500" />
                              {scanResult.parent.phone}
                            </a>
                          )}
                          {scanResult.parent.email && (
                            <a 
                              href={`mailto:${scanResult.parent.email}`}
                              className="flex items-center gap-2 text-[11px] text-zinc-400 hover:text-white transition-colors"
                            >
                              <Mail size={12} className="text-red-500" />
                              {scanResult.parent.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangle size={36} className="text-zinc-500 mx-auto mb-3" />
                    <h4 className="text-sm font-bold uppercase tracking-wider text-white">NO TARGET CONFIRMED</h4>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-2 leading-relaxed">
                      {scanResult.message || 'The submitted scan similarity did not match any current missing persons records above the threshold parameters.'}
                    </p>
                    {scanResult.similarity !== undefined && (
                      <div className="mt-4 inline-block px-3 py-1 bg-zinc-950 border border-zinc-800 rounded text-xs font-mono text-zinc-500">
                        Peak Match Index: {(scanResult.similarity * 100).toFixed(1)}%
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
