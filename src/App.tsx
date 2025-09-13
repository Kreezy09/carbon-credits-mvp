import React, { useState } from 'react';
import { Upload, Camera, TreePine, Leaf, ArrowRight, ArrowLeft, CheckCircle, Loader } from 'lucide-react';

interface FileUpload {
  name: string;
  size: number;
  type: string;
  url: string;
}

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [referenceUploaded, setReferenceUploaded] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [treePhotos, setTreePhotos] = useState<FileUpload[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modelCreated, setModelCreated] = useState(false);

  const steps = [
    'Welcome',
    'Reference Photo',
    'Tree Photos',
    'Tree Analysis',
    'Carbon Credits'
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetApp = () => {
    setCurrentStep(0);
    setReferenceUploaded(false);
    setReferenceImage(null);
    setTreePhotos([]);
    setIsProcessing(false);
    setModelCreated(false);
  };

  const handleReferenceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReferenceImage(url);
      setReferenceUploaded(true);
    }
  };

  const handleTreePhotosUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileUpload[] = Array.from(files).map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      setTreePhotos(prev => [...prev, ...newFiles]);
    }
  };

  const generateModel = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setModelCreated(true);
    }, 3000);
  };

  const ProgressBar = () => (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${index !== steps.length - 1 ? 'flex-1' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index < currentStep ? <CheckCircle className="w-5 h-5" /> : index + 1}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  index < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {steps.map((step, index) => (
          <span key={step} className={index <= currentStep ? 'text-emerald-600' : ''}>
            {step}
          </span>
        ))}
      </div>
    </div>
  );

  const LandingPage = () => (
    <div className="text-center">
      <div className="mb-8">
        <TreePine className="w-20 h-20 text-emerald-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Carbon Credits Estimator
        </h1>
        <p className="text-xl text-gray-600 mb-2">MVP Demo</p>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Upload photos of trees to generate 3D models and calculate carbon storage potential. 
          Get instant estimates for carbon credits based on biomass analysis.
        </p>
      </div>
      
      <div className="bg-emerald-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
        <Leaf className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">How it works</h3>
        <ul className="text-sm text-emerald-700 space-y-1">
          <li>• Upload reference photo for scale</li>
          <li>• Take multiple tree photos</li>
          <li>• AI generates 3D model</li>
          <li>• Calculate carbon storage</li>
          <li>• Estimate credit value</li>
        </ul>
      </div>

      <button
        onClick={nextStep}
        className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2 mx-auto"
      >
        Start Measurement
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );

  const ReferencePhotoStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 1: Upload Reference Photo</h2>
        <p className="text-gray-600">
          Upload a photo with a known reference object (person, coin, ruler) for scale calibration.
        </p>
      </div>

      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-6">
        {!referenceUploaded ? (
          <>
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Click to upload reference photo</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleReferenceUpload}
              className="hidden"
              id="reference-upload"
            />
            <label
              htmlFor="reference-upload"
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors inline-block"
            >
              Choose File
            </label>
          </>
        ) : (
          <div>
            <div className="w-64 h-48 bg-gray-200 rounded-lg mx-auto mb-4 overflow-hidden">
              <img 
                src={referenceImage!} 
                alt="Reference" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-emerald-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Reference detected successfully</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Person detected - scale calibrated</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!referenceUploaded}
          className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const TreePhotosStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 2: Upload Tree Photos</h2>
        <p className="text-gray-600">
          Take multiple photos of the tree from different angles for 3D model generation.
        </p>
      </div>

      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-6">
        {treePhotos.length === 0 ? (
          <>
            <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">Select multiple tree photos</p>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleTreePhotosUpload}
              className="hidden"
              id="tree-photos-upload"
              key={treePhotos.length} // Force re-render to allow selecting same files again
            />
            <label
              htmlFor="tree-photos-upload"
              className="bg-emerald-500 text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-emerald-600 transition-colors inline-block"
            >
              {treePhotos.length === 0 ? 'Choose Files' : 'Add More Photos'}
            </label>
          </>
        ) : (
          <div>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleTreePhotosUpload}
                className="hidden"
                id="tree-photos-add-more"
                key={`add-more-${treePhotos.length}`}
              />
              <label
                htmlFor="tree-photos-add-more"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors inline-block text-sm"
              >
                Add More Photos
              </label>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {treePhotos.slice(0, 8).map((file, index) => (
                <div key={index} className="w-full h-20 bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={file.url} 
                    alt={`Tree photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {treePhotos.length > 8 && (
                <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-500">+{treePhotos.length - 8} more</span>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{treePhotos.length} photos uploaded</span>
              </div>
              
              {!isProcessing && !modelCreated && (
                <div className="text-center">
                  <button
                    onClick={generateModel}
                    className="bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                  >
                    Generate 3D Model
                  </button>
                  <p className="text-sm text-gray-500 mt-2">
                    Click when you're done uploading all photos
                  </p>
                </div>
              )}
              
              {isProcessing && (
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generating 3D model...</span>
                </div>
              )}
              
              {modelCreated && !isProcessing && (
                <div className="flex items-center justify-center gap-2 text-emerald-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">3D model created successfully</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={prevStep}
          className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={nextStep}
          disabled={!modelCreated}
          className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          Next
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const TreeAnalysisStep = () => {
    const metrics = [
      { label: 'Tree Height', value: '12.3 m', icon: '📏' },
      { label: 'DBH (Diameter at Breast Height)', value: '38 cm', icon: '⭕' },
      { label: 'Estimated Volume', value: '1.25 m³', icon: '📦' },
      { label: 'Tree Age (estimated)', value: '15-20 years', icon: '🕐' }
    ];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 3: Tree Analysis</h2>
          <p className="text-gray-600">
            AI analysis complete. Here are the calculated tree metrics based on the 3D model.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TreePine className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Tree Measurements</h3>
              <p className="text-sm text-gray-500">Generated from 3D model analysis</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{metric.icon}</span>
                  <div>
                    <p className="text-sm text-gray-600">{metric.label}</p>
                    <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={prevStep}
            className="flex items-center gap-2 px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={nextStep}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  const CarbonCreditsStep = () => {
    const results = [
      { label: 'Total Biomass', value: '950 kg', description: 'Above & below ground biomass' },
      { label: 'Carbon Stored', value: '475 kg', description: '50% of total biomass' },
      { label: 'CO₂ Equivalent', value: '1.74 tCO₂e', description: 'Carbon × 3.67 conversion factor' },
      { label: 'Credits Earned', value: '≈ 1.7 credits', description: 'Based on verified standards' }
    ];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Step 4: Carbon Credits Results</h2>
          <p className="text-gray-600">
            Based on tree measurements, here's the carbon storage and credit potential.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">Carbon Analysis Complete</h3>
            <p className="text-emerald-700">Environmental impact calculated</p>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{result.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{result.value}</p>
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-xs text-gray-500">{result.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-500 rounded-lg text-center">
            <p className="text-white text-lg font-semibold">
              🌍 This tree sequesters approximately 1.7 tonnes of CO₂
            </p>
            <p className="text-emerald-100 text-sm mt-1">
              Equivalent to driving 4,200 miles in an average car
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={resetApp}
            className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Measure Another Tree
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <LandingPage />;
      case 1:
        return <ReferencePhotoStep />;
      case 2:
        return <TreePhotosStep />;
      case 3:
        return <TreeAnalysisStep />;
      case 4:
        return <CarbonCreditsStep />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {currentStep > 0 && <ProgressBar />}
        <div className="max-w-4xl mx-auto">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
}

export default App;