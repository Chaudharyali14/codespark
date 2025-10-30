
import React from 'react';
import { FaQuoteLeft } from 'react-icons/fa';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, author, role }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden p-8 h-full flex flex-col justify-between">
        <div>
            <FaQuoteLeft className="text-indigo-600 text-4xl mb-4" />
            <p className="text-gray-600 italic text-lg mb-6">{quote}</p>
        </div>
      <div className="flex items-center">
        <div>
          <p className="font-bold text-gray-800 text-xl">{author}</p>
          <p className="text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
