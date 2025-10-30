'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function EditProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [mainImage, setMainImage] = useState(0);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const res = await fetch(`/api/projects/${id}`);
          const data = await res.json();
          if (data) {
            setTitle(data.title);
            setDescription(data.description);
            // Note: Handling existing images and video would require more complex logic
            // to display and replace them. For simplicity, we are not handling them here.
          }
        } catch (error) {
          console.error('Failed to fetch project:', error);
        }
      };
      fetchProject();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files) {
      const newImages = [...images];
      newImages[index] = e.target.files[0];
      setImages(newImages);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    images.forEach((image) => {
      if (image) {
        formData.append('images', image);
      }
    });
    if (video) {
      formData.append('video', video);
    }
    formData.append('mainImage', mainImage.toString());

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin/projects');
      } else {
        alert('Failed to update project: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to update project:', error);
      alert('Failed to update project. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block font-medium">Images</label>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <input
                type="file"
                onChange={(e) => handleImageChange(e, i)}
                className="w-full border rounded px-3 py-2"
              />
              <label>
                <input
                  type="radio"
                  name="mainImage"
                  checked={mainImage === i}
                  onChange={() => setMainImage(i)}
                />
                Main
              </label>
            </div>
          ))}
        </div>
        <div>
          <label htmlFor="video" className="block font-medium">Video</label>
          <input
            id="video"
            type="file"
            onChange={(e) => setVideo(e.target.files ? e.target.files[0] : null)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update
        </button>
      </form>
    </div>
  );
}
