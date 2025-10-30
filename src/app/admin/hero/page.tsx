'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function HeroPage() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [secondImage, setSecondImage] = useState('');
  const [selectedMainFile, setSelectedMainFile] = useState<File | null>(null);
  const [previewMainUrl, setPreviewMainUrl] = useState<string | null>(null);
  const [selectedSecondFile, setSelectedSecondFile] = useState<File | null>(null);
  const [previewSecondUrl, setPreviewSecondUrl] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch('/api/hero');
        if (!res.ok) {
          throw new Error(`Failed to fetch hero data: ${res.statusText}`);
        }
        const data = await res.json();
        if (data) {
          setTitle(data.title);
          setSubtitle(data.subtitle);
          setMainImage(data.mainImage);
          setSecondImage(data.secondImage);
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
        alert('Failed to load hero data. Please check the console for more details.');
      }
    };
    fetchHeroData();
  }, []);

  const handleMainFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedMainFile(file);
      setPreviewMainUrl(URL.createObjectURL(file));
    }
  };

  const handleSecondFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedSecondFile(file);
      setPreviewSecondUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateSuccess(null);

    try {
      const res = await fetch('/api/hero/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, subtitle }),
      });

      const data = await res.json();
      if (data.success) {
        setUpdateSuccess(true);
      } else {
        setUpdateSuccess(false);
      }
    } catch (error) {
      console.error('Failed to update hero data:', error);
      setUpdateSuccess(false);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleImageUpload = async (imageType: 'main' | 'second') => {
    const file = imageType === 'main' ? selectedMainFile : selectedSecondFile;
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('imageType', imageType);

    try {
      const res = await fetch('/api/hero/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        if (imageType === 'main') {
          setMainImage(data.filePath);
          setSelectedMainFile(null);
          setPreviewMainUrl(null);
        } else {
          setSecondImage(data.filePath);
          setSelectedSecondFile(null);
          setPreviewSecondUrl(null);
        }
        setUploadSuccess(`${imageType === 'main' ? 'Main' : 'Second'} image uploaded successfully!`);
        setTimeout(() => setUploadSuccess(null), 3000); // Clear after 3 seconds
      } else {
        alert('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Manage Hero Section</h1>
      
      {/* Form for updating hero text content */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="mb-6">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="subtitle" className="block text-gray-700 text-sm font-bold mb-2">Subtitle</label>
          <textarea
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleUpdate}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update Hero'}
          </button>
        </div>
        {updateSuccess === true && (
          <p className="text-green-500 mt-4">Hero section updated successfully!</p>
        )}
        {updateSuccess === false && (
          <p className="text-red-500 mt-4">Failed to update hero section. Please try again.</p>
        )}
        {uploadSuccess && (
          <p className="text-green-500 mt-4">{uploadSuccess}</p>
        )}
      </div>

      {/* Responsive grid for image uploads: 1 column on mobile, 2 on medium screens and up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Main Image Upload */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Main Image</h2>
          <div className="flex flex-col items-center">
            {mainImage && (
              <div className="mb-4">
                <Image src={mainImage} alt="Main image" width={200} height={200} className="rounded-lg" />
              </div>
            )}
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              {previewMainUrl ? (
                <Image src={previewMainUrl} alt="Main image preview" width={150} height={150} className="rounded-lg" />
              ) : (
                <p className="text-gray-500 text-center">Drag & drop a file or click to select</p>
              )}
            </div>
            <input
              type="file"
              onChange={handleMainFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => handleImageUpload('main')}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ${!selectedMainFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedMainFile}
            >
              Upload Main Image
            </button>
          </div>
        </div>

        {/* Second Image Upload */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Second Image</h2>
          <div className="flex flex-col items-center">
            {secondImage && (
              <div className="mb-4">
                <Image src={secondImage} alt="Second image" width={200} height={200} className="rounded-lg" />
              </div>
            )}
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
              {previewSecondUrl ? (
                <Image src={previewSecondUrl} alt="Second image preview" width={150} height={150} className="rounded-lg" />
              ) : (
                <p className="text-gray-500 text-center">Drag & drop a file or click to select</p>
              )}
            </div>
            <input
              type="file"
              onChange={handleSecondFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => handleImageUpload('second')}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ${!selectedSecondFile ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!selectedSecondFile}
            >
              Upload Second Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}