'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Hero() {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [secondImage, setSecondImage] = useState('');

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await fetch('/api/hero');
        const data = await res.json();
        if (data) {
          setTitle(data.title);
          setSubtitle(data.subtitle);
          setMainImage(data.mainImage);
          setSecondImage(data.secondImage);
        }
      } catch (error) {
        console.error('Failed to fetch hero data:', error);
      }
    };
    fetchHeroData();
  }, []);

  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="bg-neutral-light text-primary py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{title}</h1>
            <p className="text-lg md:text-xl mb-8">{subtitle}</p>
            <div className="flex space-x-4">
              <a href="/apply" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200">Apply Now</a>
              <a href="/courses" className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200">View Courses</a>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div
              className="relative w-full h-96"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {mainImage && (
                <Image
                  src={isHovered && secondImage ? secondImage : mainImage}
                  alt="Hero Image"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg shadow-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
