import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplet, FileText, CheckCircle, AlertCircle, BarChart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ImageUploader } from '../../components/ui/ImageUploader';

const WaterQualityUpload = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    classification: 'healthy' | 'unhealthy';
    confidence: number;
  } | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleImageSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setUploadSuccess(false);
    setAnalysisResult(null);
    
    // Mock ML processing
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate ML classification
      const isHealthy = Math.random() > 0.3; // 70% chance of being healthy
      setAnalysisResult({
        classification: isHealthy ? 'healthy' : 'unhealthy',
        confidence: Math.random() * 0.2 + (isHealthy ? 0.75 : 0.65) // Random confidence between 75-95% for healthy, 65-85% for unhealthy
      });
      setIsProcessing(false);
    }, 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !analysisResult) {
      toast.error('Please upload a water quality image first');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setUploadSuccess(true);
      
      // Show appropriate toast based on classification
      if (analysisResult.classification === 'healthy') {
        toast.success('Water quality analysis submitted: Healthy');
      } else {
        toast.error('Water quality analysis submitted: Unhealthy', {
          style: {
            borderLeft: '4px solid #ef4444',
          },
        });
      }
      
      // Clear form after short delay
      setTimeout(() => {
        setFile(null);
        setAnalysisResult(null);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Upload Water Quality Image</h1>
        <p className="mt-1 text-slate-500">
          Upload a clear image of the STP water for AI-based quality analysis
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        {/* Step 1: Upload image */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">1</span>
            Upload Water Image
          </h2>
          
          <ImageUploader
            title="Water Quality Image"
            description="Take a clear photo of the STP water to assess quality"
            onImageSelect={handleImageSelect}
            loading={isProcessing}
          />
        </div>

        {/* Step 2: View analysis results */}
        <div className="mb-8">
          <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">2</span>
            View Analysis Results
          </h2>
          
          {isProcessing ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent"></div>
              <p className="mt-2 text-sm text-slate-600">Analyzing water quality with AI...</p>
            </div>
          ) : analysisResult ? (
            <div className={`rounded-lg border p-4 ${
              analysisResult.classification === 'healthy' 
                ? 'border-success-200 bg-success-50' 
                : 'border-error-200 bg-error-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-900">Water Quality Classification</p>
                  <p className={`text-2xl font-bold ${
                    analysisResult.classification === 'healthy' 
                      ? 'text-success-600'
                      : 'text-error-600'
                  }`}>
                    {analysisResult.classification.toUpperCase()}
                  </p>
                </div>
                
                <div className={`rounded-full p-2 ${
                  analysisResult.classification === 'healthy'
                    ? 'bg-success-100 text-success-500'
                    : 'bg-error-100 text-error-500'
                }`}>
                  {analysisResult.classification === 'healthy' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-700">
                    Analysis Confidence: {Math.round(analysisResult.confidence * 100)}%
                  </p>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                  <div 
                    className={`h-full rounded-full ${
                      analysisResult.classification === 'healthy' 
                        ? 'bg-success-500' 
                        : 'bg-error-500'
                    }`} 
                    style={{ width: `${analysisResult.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {analysisResult.classification === 'unhealthy' && (
                <div className="mt-4 rounded-md border border-error-200 bg-white p-3">
                  <p className="text-sm font-medium text-error-800">Potential Issues:</p>
                  <ul className="mt-1 list-disc pl-5 text-xs text-slate-700">
                    <li>Excessive suspended solids</li>
                    <li>Potential biological contamination</li>
                    <li>Abnormal color or turbidity</li>
                    <li>Consider maintenance of filtration system</li>
                  </ul>
                </div>
              )}
            </div>
          ) : file ? (
            <div className="rounded-lg border border-warning-200 bg-warning-50 p-4">
              <div className="flex items-start">
                <AlertCircle size={20} className="mr-2 text-warning-500" />
                <p className="text-sm text-warning-800">
                  Waiting for AI analysis to complete...
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start">
                <Droplet size={20} className="mr-2 text-slate-400" />
                <p className="text-sm text-slate-600">
                  Upload a water quality image to get AI analysis
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Submit analysis */}
        <div>
          <h2 className="mb-4 flex items-center text-lg font-semibold text-slate-800">
            <span className="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-800">3</span>
            Submit Analysis
          </h2>
          
          {uploadSuccess ? (
            <div className="rounded-lg border border-success-200 bg-success-50 p-4">
              <div className="flex items-center text-success-800">
                <CheckCircle size={20} className="mr-2 text-success-500" />
                <div>
                  <p className="font-medium">Analysis submitted successfully!</p>
                  <p className="text-sm">The water quality analysis has been recorded in the system.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!file || isProcessing || !analysisResult || isSubmitting}
                className={`inline-flex items-center rounded-md border border-transparent bg-primary-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  (!file || isProcessing || !analysisResult || isSubmitting)
                    ? 'cursor-not-allowed opacity-50'
                    : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <BarChart size={16} className="mr-2" />
                    Submit Analysis
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
          Tips for Good Water Quality Images
        </h3>
        <ul className="ml-6 list-disc space-y-1 text-xs text-slate-600">
          <li>Take photos in good lighting conditions</li>
          <li>Ensure the water is clearly visible</li>
          <li>Include some context of the tank/container</li>
          <li>Avoid excessive glare or reflections on the water surface</li>
          <li>Include the water surface and any visible sedimentation</li>
        </ul>
      </div>
    </div>
  );
};

export default WaterQualityUpload;