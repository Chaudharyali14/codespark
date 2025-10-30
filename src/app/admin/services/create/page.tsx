'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateServicePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);

    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setSubmitSuccess(true);
        router.push('/admin/services');
      } else {
        setSubmitSuccess(false);
      }
    } catch (error) {
      console.error('Failed to add service:', error);
      setSubmitSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Add New Service</h1>
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="description" className="block text-gray-700 text-sm font-bold mb-2">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Service'}
            </button>
          </div>
          {submitSuccess === true && (
            <p className="text-green-500 mt-4">Service added successfully!</p>
          )}
          {submitSuccess === false && (
            <p className="text-red-500 mt-4">Failed to add service. Please try again.</p>
          )}
        </form>
      </div>
    </div>
  );
}
