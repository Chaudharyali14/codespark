'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditMissionPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await fetch(`/api/mission/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch mission');
        }
        const mission = await res.json();
        setTitle(mission.title);
        setDescription(mission.description);
      } catch (error) {
        console.error('Failed to fetch mission:', error);
        alert('Failed to load mission data');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchMission();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/mission/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        router.push('/admin/mission');
      } else {
        alert('Failed to update mission');
      }
    } catch (error) {
      console.error('Failed to update mission:', error);
      alert('Failed to update mission');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-gray-800">Edit Mission</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
        <div className="mb-6">
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
            {isSubmitting ? 'Updating...' : 'Update Mission'}
          </button>
        </div>
      </form>
    </div>
  );
}
