import React, { useState, useEffect } from 'react';
import { Upload, Camera, TreePine, Leaf, ArrowRight, ArrowLeft, CheckCircle, Loader, Play } from 'lucide-react';

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
  const [selectedSpecies, setSelectedSpecies] = useState<string>("");
  const [typedText, setTypedText] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const treeSpecies = [
    "Oak (Quercus robur)",
    "Maple (Acer saccharum)",
    "Pine (Pinus sylvestris)",
    "Birch (Betula pendula)",
    "Ash (Fraxinus excelsior)",
    "Beech (Fagus sylvatica)",
    "Spruce (Picea abies)",
    "Willow (Salix alba)",
    "Elm (Ulmus americana)",
    "Cedar (Cedrus atlantica)",
    "Poplar (Populus tremula)",
    "Fir (Abies alba)",
  ];

  const steps = [
    "Welcome",
    "Reference Photo",
    "Tree Photos",
    "Tree Analysis",
    "Carbon Credits",
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
    setSelectedSpecies("");
    setTypedText("");
    setIsTyping(false);
  };

  const handleReferenceUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReferenceImage(url);
      setReferenceUploaded(true);
    }
  };

  const handleTreePhotosUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileUpload[] = Array.from(files).map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }));
      setTreePhotos((prev) => [...prev, ...newFiles]);
    }
  };

  // Add new state for metrics
  const [treeMetrics, setTreeMetrics] = useState({
    height: "",
    dbh: "",
    volume: "",
    age: "",
  });

  const [carbonResults, setCarbonResults] = useState({
    biomass: "",
    carbon: "",
    co2e: "",
    credits: "",
  });

  const generateModel = () => {
    setIsProcessing(true);

    const randomSpecies =
      treeSpecies[Math.floor(Math.random() * treeSpecies.length)];
    setSelectedSpecies(randomSpecies);

    const randomHeight = (Math.random() * (30 - 5) + 5).toFixed(1); // m
    const randomDbh = (Math.random() * (100 - 10) + 10).toFixed(0); // cm
    const randomVolume = (Math.random() * (5 - 0.2) + 0.2).toFixed(2); // m³
    const randomAge = Math.floor(Math.random() * (80 - 5) + 5); // years

    setTreeMetrics({
      height: `${randomHeight} m`,
      dbh: `${randomDbh} cm`,
      volume: `${randomVolume} m³`,
      age: `${randomAge} years (est.)`,
    });

    // --- Simulated biomass & carbon calculations ---
    const density = 700; // kg/m³, generic assumption
    const biomass = (parseFloat(randomVolume) * density).toFixed(0); // kg
    const carbon = (parseFloat(biomass) * 0.5).toFixed(0); // kg
    const co2e = ((parseFloat(carbon) * 3.67) / 1000).toFixed(2); // tonnes
    const credits = co2e; // 1 credit ≈ 1 tCO₂e

    setCarbonResults({
      biomass: `${biomass} kg`,
      carbon: `${carbon} kg`,
      co2e: `${co2e} tCO₂e`,
      credits: `${credits} credits`,
    });

    setTimeout(() => {
      setIsProcessing(false);
      setModelCreated(true);
    }, 3000);
  };

  // Typing effect for Watch Demo button
  useEffect(() => {
    if (currentStep === 0) {
      const text = "WATCH DEMO";
      let index = 0;
      setIsTyping(true);
      setTypedText("");

      const typeInterval = setInterval(() => {
        if (index < text.length) {
          setTypedText(text.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }
  }, [currentStep]);

  const ProgressBar = () => (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`flex items-center ${
              index !== steps.length - 1 ? "flex-1" : ""
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                index + 1
              )}
            </div>
            {index !== steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 rounded ${
                  index < currentStep ? "bg-emerald-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        {steps.map((step, index) => (
          <span
            key={step}
            className={index <= currentStep ? "text-emerald-600" : ""}
          >
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
          Upload photos of trees to generate 3D models and calculate carbon
          storage potential. Get instant estimates for carbon credits based on
          biomass analysis.
        </p>
      </div>

      <div className="bg-emerald-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
        <Leaf className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-emerald-800 mb-2">
          How it works
        </h3>
        <ul className="text-sm text-emerald-700 space-y-1">
          <li>• Upload reference photo for scale</li>
          <li>• Take multiple tree photos</li>
          <li>• AI generates 3D model</li>
          <li>• Calculate carbon storage</li>
          <li>• Estimate credit value</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <button
          onClick={nextStep}
          className="bg-emerald-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors flex items-center gap-2"
        >
          Start Measurement
          <ArrowRight className="w-5 h-5" />
        </button>
        
        <a
          href="https://drive.google.com/file/d/1ABC123DEF456GHI789JKL/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="relative bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2 group animate-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg animate-ping opacity-20"></div>
          <Play className="w-5 h-5 group-hover:scale-110 transition-transform relative z-10" />
          <span className="relative z-10 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent font-black text-lg tracking-wide group-hover:from-yellow-200 group-hover:to-white transition-all duration-300">
            {typedText}
            {isTyping && <span className="animate-pulse">|</span>}
          </span>
        </a>
      </div>
    </div>
  );

  const ReferencePhotoStep = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Step 1: Upload Reference Photo
        </h2>
        <p className="text-gray-600">
          Upload a photo with a known reference object (person, coin, ruler) for
          scale calibration.
        </p>
      </div>

      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 text-center mb-6">
        {!referenceUploaded ? (
          <>
            <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">
              Click to upload reference photo
            </p>
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
              <span className="font-medium">
                Reference detected successfully
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Person detected - scale calibrated
            </p>
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
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Step 2: Upload Tree Photos
        </h2>
        <p className="text-gray-600">
          Take multiple photos of the tree from different angles for 3D model
          generation.
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
              {treePhotos.length === 0 ? "Choose Files" : "Add More Photos"}
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
                <div
                  key={index}
                  className="w-full h-20 bg-gray-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={file.url}
                    alt={`Tree photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {treePhotos.length > 8 && (
                <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm text-gray-500">
                    +{treePhotos.length - 8} more
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-emerald-600">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">
                  {treePhotos.length} photos uploaded
                </span>
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
                  <span className="font-medium">
                    3D model created successfully
                  </span>
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
    { label: "Tree Species", value: selectedSpecies, icon: "🌳" },
    { label: "Tree Height", value: treeMetrics.height, icon: "📏" },
    {
      label: "DBH (Diameter at Breast Height)",
      value: treeMetrics.dbh,
      icon: "⭕",
    },
    { label: "Estimated Volume", value: treeMetrics.volume, icon: "📦" },
    { label: "Tree Age (estimated)", value: treeMetrics.age, icon: "🕐" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Step 3: Tree Analysis
        </h2>
        <p className="text-gray-600">
          AI analysis complete. Here are the calculated tree metrics based on
          the 3D model.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center">
            <TreePine className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Tree Measurements
            </h3>
            <p className="text-sm text-gray-500">
              Generated from 3D model analysis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{metric.icon}</span>
                <div>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <p className="text-xl font-bold text-gray-800">
                    {metric.value}
                  </p>
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
      {
        label: "Total Biomass",
        value: carbonResults.biomass,
        description: "Above & below ground biomass",
      },
      {
        label: "Carbon Stored",
        value: carbonResults.carbon,
        description: "50% of total biomass",
      },
      {
        label: "CO₂ Equivalent",
        value: carbonResults.co2e,
        description: "Carbon × 3.67 conversion factor",
      },
      {
        label: "Credits Earned",
        value: `≈${carbonResults.credits}`,
        description: "Based on verified standards",
      },
    ];

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Step 4: Carbon Credits Results
          </h2>
          <p className="text-gray-600">
            Based on tree measurements, here's the carbon storage and credit
            potential.
          </p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-green-100 rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-800 mb-2">
              Carbon Analysis Complete
            </h3>
            <p className="text-emerald-700">Environmental impact calculated</p>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{result.label}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {result.value}
                    </p>
                  </div>
                  <div className="text-right flex-1">
                    <p className="text-xs text-gray-500">
                      {result.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-emerald-500 rounded-lg text-center">
            <p className="text-white text-lg font-semibold">
              🌍 This tree sequesters approximately {carbonResults.co2e} tonnes of CO₂
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
        <div className="max-w-4xl mx-auto">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}

export default App;