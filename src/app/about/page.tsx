
import React from 'react';

async function getVisionMission() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/vision-mission`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
}

const AboutPage = async () => {
  const data = await getVisionMission();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
      <p className="text-lg text-center mb-12">
        This is the about page for CodeSpark. We are a team of passionate developers
        dedicated to creating amazing web applications.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Our Vision</h2>
          <h3 className="text-2xl font-semibold mb-2">{data.vision?.title}</h3>
          <p className="text-lg">{data.vision?.description}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-indigo-600">Our Mission</h2>
          <h3 className="text-2xl font-semibold mb-2">{data.mission?.title}</h3>
          <p className="text-lg">{data.mission?.description}</p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
