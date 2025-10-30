
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditTestimonialPage() {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchTestimonial = async () => {
        const res = await fetch(`/api/testimonials/${id}`);
        const data = await res.json();
        setQuote(data.quote);
        setAuthor(data.author);
        setRole(data.role);
      };
      fetchTestimonial();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/testimonials/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote, author, role }),
      });

      if (res.ok) {
        router.push('/admin/testimonials');
      } else {
        console.error('Failed to update testimonial:', res.status, res.statusText);
      }
    } catch (error) {
      console.error('Failed to update testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Testimonial</h1>
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
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}
