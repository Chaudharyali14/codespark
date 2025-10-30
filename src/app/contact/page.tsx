'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (res.ok) {
        setStatus('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Failed to send message.');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setStatus('Failed to send message.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600">We&apos;d love to hear from you. Please fill out the form below.</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                  />
                </div>
              </div>

              <div className="mt-8">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                ></textarea>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg transition-transform transform hover:scale-105 duration-300 ease-in-out"
                >
                  Send Message
                </button>
              </div>

              {status && (
                <p className="mt-6 text-center text-gray-600">{status}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}