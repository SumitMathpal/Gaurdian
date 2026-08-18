import React, { useState, useRef } from 'react';
import { Upload, X, ShieldAlert, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';

export default function RegisterPerson({ token, setView, user }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    description: '',
    last_seen_location: '',
    missing_date: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

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
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setError('A identification photo is required.');
      return;
    }

    setLoading(true);
    setError('');

    const sendData = new FormData();
    sendData.append('name', formData.name);
    sendData.append('age', parseInt(formData.age, 10));
    sendData.append('gender', formData.gender);
    sendData.append('description', formData.description);
    sendData.append('last_seen_location', formData.last_seen_location);
    sendData.append('missing_date', formData.missing_date);
    sendData.append('file', imageFile);

    try {
      const response = await fetch('/api/missing-persons', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: sendData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to submit report. Please double-check all fields.');
      }

      // Sync with localStorage for Dashboard persistence
      const storageKey = `guardian_reports_${user?.email || 'guest'}`;
      const currentList = JSON.parse(localStorage.getItem(storageKey) || '[]');
      const newReport = {
        _id: data.person_id,
        ...data.person
      };
      localStorage.setItem(storageKey, JSON.stringify([newReport, ...currentList]));

      setSuccess(true);
      setFormData({
        name: '',
        age: '',
        gender: 'Male',
        description: '',
        last_seen_location: '',
        missing_date: ''
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-xl mx-auto my-12 px-4 text-center">
        <div className="bg-zinc-950 border border-zinc-800 rounded p-8 relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
          <div className="w-16 h-16 bg-red-950/20 border border-red-900/60 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white mb-2">Record Lodged Successfully</h2>
          <p className="text-sm text-zinc-400 max-w-md mx-auto mb-8">
            The profile has been vector-embedded and published to the active search database. Citizen mobile scanning terminals will now match against this face data point.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-bold uppercase tracking-wider rounded transition-all focus:outline-none"
            >
              Report Another
            </button>
            <button
              onClick={() => setView('dashboard')}
              className="px-6 py-2.5 bg-white hover:bg-zinc-200 text-black text-xs font-bold uppercase tracking-wider rounded transition-all focus:outline-none"
            >
              Go to Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-12 px-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded p-8 relative">
        {/* Accent border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

        {/* Back control */}
        <button
          onClick={() => setView('dashboard')}
          className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white mb-6 uppercase tracking-wider font-semibold focus:outline-none"
        >
          <ArrowLeft size={12} /> Console
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 text-red-500 bg-red-950/20 px-3 py-1 border border-red-900/40 rounded-full mb-3">
            <ShieldAlert size={14} />
            <span className="text-[10px] font-mono font-bold tracking-widest uppercase">REGISTRATION PIPELINE DB-V2</span>
          </div>
          <h2 className="text-2xl font-bold uppercase tracking-tight text-white">
            Register Missing Persona
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Build and deploy a biometric scanning identity node. Fields marked must be fully verified.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-950/20 border border-red-900/60 text-red-400 text-xs rounded font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Hand: Vector Input fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  Full Legal Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Subject's name"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                    Age <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="age"
                    required
                    min="0"
                    max="125"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="e.g. 12"
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                  >
                    <option value="Male" className="bg-zinc-950">Male</option>
                    <option value="Female" className="bg-zinc-950">Female</option>
                    <option value="Other" className="bg-zinc-950">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  Last Known Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_seen_location"
                  required
                  value={formData.last_seen_location}
                  onChange={handleChange}
                  placeholder="e.g. Bronx Central Station, NY"
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                  Missing Since <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="missing_date"
                  required
                  value={formData.missing_date}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>

            {/* Right Hand: Photo Input (Drag/Drop) */}
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
                Frontal Identification Image <span className="text-red-500">*</span>
              </label>

              {!imagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current.click()}
                  className="h-[268px] border-2 border-dashed border-zinc-800 hover:border-red-600/70 bg-zinc-900/50 rounded flex flex-col justify-center items-center p-6 text-center cursor-pointer transition-colors"
                >
                  <Upload size={32} className="text-zinc-500 mb-3" />
                  <span className="text-xs text-white font-semibold">Drag & drop files or browse</span>
                  <span className="text-[10px] text-zinc-500 mt-1 max-w-[200px]">
                    Supported formats: JPG, PNG, WEBP. Front facing, clear illumination is highly suggested.
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                  />
                </div>
              ) : (
                <div className="relative border border-zinc-800 rounded overflow-hidden h-[268px] bg-zinc-900">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <div className="text-[10px] text-white font-mono bg-black/60 px-2 py-1 border border-zinc-800 rounded truncate max-w-full">
                      {imageFile.name} ({(imageFile.size / 1024).toFixed(1)} KB)
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 p-1.5 bg-black/85 hover:bg-black rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-zinc-400 mb-1.5">
              Distinguishing Features / General Physical Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Provide context e.g. scar on left chin, wearing dark blue windbreaker jacket at time of disappearance..."
              className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded text-sm text-white focus:outline-none focus:border-red-600 placeholder:text-zinc-650 transition-colors resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider text-xs rounded transition-all flex items-center justify-center gap-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin text-black" />
            ) : (
              'Save & Embed Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
