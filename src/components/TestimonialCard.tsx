
import React from 'react';
import Image from 'next/image';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 p-8">
      <div className="relative">
        <p className="relative text-gray-600 italic text-lg">{quote}</p>
      </div>
      <div className="flex items-center mt-6">
        <div>
          <p className="font-bold text-gray-800 text-xl">{author}</p>
          <p className="text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
