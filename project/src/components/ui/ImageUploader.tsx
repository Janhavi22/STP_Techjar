import { useState, useCallback } from 'react';
import { Upload, X, Image, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploaderProps {
  title: string;
  description: string;
  onImageSelect: (file: File) => void;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  loading?: boolean;
}

export const ImageUploader = ({
  title,
  description,
  onImageSelect,
  maxSize = 5, // Default 5MB
  acceptedTypes = ['image/jpeg', 'image/png'],
  loading = false,
}: ImageUploaderProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast.error(`File type not accepted. Please upload ${acceptedTypes.join(' or ')}`);
      return false;
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File too large. Maximum size is ${maxSize}MB`);
      return false;
    }

    return true;
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) return;

    setSelectedImage(file);
    onImageSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFile(e.dataTransfer.files[0]);
      }
    },
    [onImageSelect]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview(null);
  };

  return (
    <div className="w-full">
      {!selectedImage ? (
        <div
          className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-slate-300 hover:border-primary-300 hover:bg-slate-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <Upload
              className={`mb-3 h-10 w-10 ${
                isDragging ? 'text-primary-500' : 'text-slate-400'
              }`}
            />
            <h3 className="mb-1 text-sm font-medium text-slate-900">{title}</h3>
            <p className="mb-4 text-xs text-slate-500">{description}</p>
            <label
              htmlFor="file-upload"
              className="cursor-pointer rounded-md bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-100 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2"
            >
              Select Image
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept={acceptedTypes.join(',')}
              />
            </label>
            <p className="mt-2 text-xs text-slate-500">
              Drag and drop or click to browse. Maximum file size: {maxSize}MB.
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {preview && (
                <div className="relative h-16 w-16 overflow-hidden rounded-md">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {selectedImage.name}
                </p>
                <p className="text-xs text-slate-500">
                  {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              {loading ? (
                <div className="rounded-full bg-primary-50 p-1.5 text-primary-500">
                  <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="rounded-full bg-primary-50 p-1.5 text-primary-500">
                  <CheckCircle size={20} />
                </div>
              )}
              <button
                onClick={removeImage}
                className="rounded-full bg-slate-50 p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};