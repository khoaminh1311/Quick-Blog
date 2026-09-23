import { useState, useRef, useEffect } from 'react';
import { X, Loader2, UploadCloud } from 'lucide-react';
import { uploadImage } from '../../services/uploadService';

/**
 * ImageUpload Component
 * Handles local preview, uploading to Cloudinary, and removing the image.
 * 
 * @param {string} value - The current image URL (secure_url from Cloudinary).
 * @param {function} onChange - Callback when image is uploaded or removed, receives the URL string.
 * @param {boolean} disabled - Whether the input is disabled (e.g. during form submission).
 */
export default function ImageUpload({ value, onChange, disabled }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [localPreview, setLocalPreview] = useState(null);
  const fileInputRef = useRef(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (localPreview && !localPreview.startsWith('http')) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional basic validation
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Set local preview
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);
    setError(null);
    setIsUploading(true);

    try {
      const secureUrl = await uploadImage(file);
      onChange(secureUrl);
      setLocalPreview(null); // Clear local preview, will rely on value now
    } catch (err) {
      setError(err.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
      // Reset input value so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    setLocalPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Determine which image to show
  const displayImage = localPreview || value;

  return (
    <div className="w-full">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {displayImage ? (
        <div className="relative border-2 border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden group aspect-[2/1] sm:aspect-video bg-slate-100 dark:bg-slate-800">
          <img 
            src={displayImage} 
            alt="Cover Preview" 
            className={`w-full h-full object-cover ${isUploading ? 'opacity-50' : 'opacity-100'} transition-opacity`}
          />
          
          {/* Overlay loading state */}
          {isUploading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 backdrop-blur-sm text-white">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="font-medium text-sm">Uploading...</span>
            </div>
          )}

          {/* Remove Button */}
          {!isUploading && !disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-700 hover:text-red-600 dark:text-slate-300 dark:hover:text-red-400 p-2 rounded-full shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      ) : (
        <div 
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 transition-colors ${
            disabled || isUploading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer group'
          }`}
        >
          {isUploading ? (
             <Loader2 className="w-8 h-8 animate-spin mb-3 text-indigo-500" />
          ) : (
            <UploadCloud className="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          )}
          <span className="text-sm font-medium">
            {isUploading ? 'Uploading...' : 'Click to upload cover image'}
          </span>
          <span className="text-xs text-slate-400 mt-1">
            JPG, PNG or GIF (max. 5MB)
          </span>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-start gap-2 text-red-600 dark:text-red-400 text-sm">
          <span className="flex-1 font-medium">{error}</span>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-semibold underline underline-offset-2"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
