'use client';

import { useState, useEffect } from 'react';

const SECRET_TOKEN = 'my-secret-token'; // This should be in an environment variable

export default function LogoSettings() {
  const [logoUrl, setLogoUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchLogo = async () => {
      const res = await fetch('/api/logo');
      const data = await res.json();
      setLogoUrl(data.logoUrl);
    };
    fetchLogo();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', selectedFile);

    try {
      const res = await fetch('/api/logo/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${SECRET_TOKEN}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setLogoUrl(data.logoUrl);
        setMessage('Logo uploaded successfully!');
        setSelectedFile(null);
      } else {
        setMessage(data.error || 'Upload failed.');
      }
    } catch (error) {
      setMessage('An error occurred during upload.');
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800">Logo Settings</h2>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Current Logo</h3>
        <div className="mt-4 p-4 border rounded-lg inline-block">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="h-20" />
          ) : (
            <p>No logo set.</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-gray-700">Upload New Logo</h3>
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {selectedFile.name}
            </p>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile}
            className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded-md disabled:bg-gray-300"
          >
            Upload
          </button>
          {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
        </div>
      </div>
    </div>
  );
}
