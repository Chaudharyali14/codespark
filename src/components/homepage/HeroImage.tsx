'use client';

import { useState } from 'react';
import Image from 'next/image';

interface HeroImageProps {
  mainImage: string;
  secondImage: string;
}

export default function HeroImage({ mainImage, secondImage }: HeroImageProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
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
          style={{ objectFit: 'cover' }}
          className="rounded-lg shadow-lg"
        />
      )}
    </div>
  );
}
