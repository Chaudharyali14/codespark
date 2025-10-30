
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateTestimonialPage() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote, author, role }),
      });

      if (res.ok) {
        router.push('/admin/testimonials');
      } else {
        console.error('Failed to create testimonial:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Failed to create testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Create Testimonial</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quote" className="block font-medium">Quote</label>
          <textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="author" className="block font-medium">Author</label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="role" className="block font-medium">Role</label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}
