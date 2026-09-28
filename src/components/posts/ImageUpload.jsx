import { useState, useRef, useEffect } from 'react';
import { X, Loader2, ImageUp } from 'lucide-react';
import { uploadImage } from '../../services/uploadService';
import Toast from '../common/Toast';

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
        <button
          type="button"
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          disabled={disabled || isUploading}
          className="flex h-24 w-full items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white text-slate-600 transition hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Uploading image...</span>
            </>
          ) : (
            <>
              <ImageUp className="lucide-image-up h-5 w-5" />
              <span>Click to upload image</span>
            </>
          )}
        </button>
      )}

      <Toast message={error} onClose={() => setError(null)} />
    </div>
  );
}
