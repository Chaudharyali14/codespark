'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function LogoPage() {
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/logo');
        if (!res.ok) {
          throw new Error(`Failed to fetch logo: ${res.statusText}`);
        }
        const data = await res.json();
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        alert('Failed to load logo data. Please check the console for more details.');
      }
    };
    fetchLogo();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }

    setIsUploading(true);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      const res = await fetch('/api/logo/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setLogoUrl(data.filePath);
        setUploadSuccess(true);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        setUploadSuccess(false);
      }
    } catch (error) {
      console.error('Failed to upload logo:', error);
      setUploadSuccess(false);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Manage Logo</h1>
      {/* Responsive grid: 1 column on mobile, 2 columns on medium screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Logo Display */}
        <div className="bg-white rounded-lg shadow-md p-8 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Current Logo</h2>
          {logoUrl ? (
            <Image src={logoUrl} alt="CodeSpark Logo" width={200} height={200} className="rounded-lg" />
          ) : (
            <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No logo set</p>
            </div>
          )}
        </div>
        {/* Upload New Logo Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Upload New Logo</h2>
          <div className="flex flex-col items-center">
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              {previewUrl ? (
                <Image src={previewUrl} alt="Logo preview" width={150} height={150} className="rounded-lg" />
              ) : (
                <p className="text-gray-500 text-center">Drag & drop a file or click to select</p>
              )}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleUpload}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ${isUploading || !selectedFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? 'Uploading...' : 'Upload Logo'}
            </button>
          </div>
          {/* Upload status messages */}
          {uploadSuccess === true && (
            <p className="text-green-500 mt-4">Logo uploaded successfully!</p>
          )}
          {uploadSuccess === false && (
            <p className="text-red-500 mt-4">Failed to upload logo. Please try again.</p>
          )}
        </div>
      </div>
    </div>
  );
}