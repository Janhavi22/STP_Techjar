// File: src/pages/operator/FlowmeterUpload.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gauge, CheckCircle, AlertCircle, Info, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ImageUploader } from '../../components/ui/ImageUploader';

const FlowmeterUpload = () => {
  const { user, token } = useAuth(); // Get logged-in user & JWT token from context
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractedValue, setExtractedValue] = useState<number | null>(null);
  const [manualValue, setManualValue] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploadSuccess(false);
    setExtractedValue(null);
    setManualValue('');
    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('http://localhost:8000/upload-flowmeter', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('OCR processing failed');
      }

      const data = await response.json();

      setExtractedValue(data.flow_value);
      setIsProcessing(false);
    } catch (error) {
      console.error('Error during OCR processing:', error);
      toast.error('OCR processing failed');
      setIsProcessing(false);
    }
  };

  const handleManualOverride = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Please upload a flowmeter image first');
      return;
    }

    const valueToSubmit = manualValue ? parseFloat(manualValue) : extractedValue;

    if (!valueToSubmit || isNaN(valueToSubmit)) {
      toast.error('No valid reading value to submit');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/save-flowreading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reading: valueToSubmit,
          site_id: user?.siteId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit flow reading');
      }

      setUploadSuccess(true);
      toast.success('Flowmeter reading submitted successfully');

      setTimeout(() => {
        setFile(null);
        setExtractedValue(null);
        setManualValue('');
        setUploadSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error during flow reading submission:', error);
      toast.error('Failed to submit flow reading');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Upload Flowmeter Reading</h1>
        <p className="mt-1 text-slate-500">
          Upload a clear image of your flowmeter display for automatic reading extraction
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {/* Step 1: Upload image */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
              1
            </span>
            Upload Flowmeter Image
          </h2>

          <ImageUploader
            title="Flowmeter Image"
            description="Take a clear photo of your flowmeter display"
            onImageSelect={handleImageSelect}
            loading={isProcessing}
          />
        </div>

        {/* Step 2: Verify extracted value */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
              2
            </span>
            Verify Reading
          </h2>

          {isProcessing ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-slate-600">Processing image with OCR...</p>
            </div>
          ) : extractedValue !== null ? (
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Extracted Reading</p>
                  <p className="text-2xl font-bold text-primary-600">{extractedValue} L/min</p>
                </div>

                <div className="rounded-full bg-success-50 p-2 text-success-500">
                  <CheckCircle size={20} />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">Manual Override (if needed)</label>
                <div className="mt-1 flex items-center">
                  <input
                    type="number"
                    value={manualValue}
                    onChange={handleManualOverride}
                    step="0.1"
                    min="0"
                    max={1000}
                    className="block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                    placeholder={extractedValue.toString()}
                  />
                  <span className="ml-2 text-sm text-slate-500">L/min</span>
                </div>
              </div>
            </div>
          ) : file ? (
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
              <div className="flex items-start">
                <AlertCircle size={20} className="mr-2 text-warning-500" />
                <p className="text-sm text-warning-800">Waiting for OCR processing to complete...</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start">
                <Info size={20} className="mr-2 text-slate-400" />
                <p className="text-sm text-slate-600">Upload an image first to extract the flowmeter reading</p>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Submit reading */}
        <div>
          <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">
              3
            </span>
            Submit Reading
          </h2>

          {uploadSuccess ? (
            <div className="rounded-lg border border-success-200 bg-success-50 p-4">
              <div className="flex items-center text-success-800">
                <CheckCircle size={20} className="mr-2 text-success-500" />
                <div>
                  <p className="font-medium">Reading submitted successfully!</p>
                  <p className="text-sm">The flowmeter reading has been recorded in the system.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || isSubmitting || (!extractedValue && !manualValue)}
                className={`inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  (!file || isSubmitting || (!extractedValue && !manualValue)) ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Gauge size={16} className="mr-2" />
                    Submit Reading
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/operator')}
                className="inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Help section */}
      <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
        <h3 className="mb-2 flex items-center text-sm font-medium text-slate-800">
          <FileText size={16} className="mr-2 text-slate-500" />
          Tips for Good Flowmeter Images
        </h3>
        <ul className="ml-6 list-disc space-y-1 text-xs text-slate-600">
          <li>Ensure the meter display is clearly visible and in focus</li>
          <li>Avoid glare or shadows on the display</li>
          <li>Make sure all digits are visible in the frame</li>
          <li>Clean the display before taking the photo if necessary</li>
        </ul>
      </div>
    </div>
  );
};

export default FlowmeterUpload;
