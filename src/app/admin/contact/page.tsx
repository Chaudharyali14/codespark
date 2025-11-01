
'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import AdminTable from '../components/AdminTable';
import Modal from '../components/Modal';

interface Message {
  id: number;
  name: string;
  email: string;
  message: string;
}

export default function ContactPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/contact');
        const data = await res.json();
        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessages(messages.filter((message) => message.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleViewMessage = (message: Message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const columns = ['Name', 'Email', 'Message'];

  const data = messages.map((message) => ({
    ...message,
    message: message.message.length > 50 ? `${message.message.substring(0, 50)}...` : message.message,
  }));

  return (
    // This page is responsive because it uses the responsive AdminHeader, AdminTable, and Modal components.
    <div className="container mx-auto px-4 py-8">
      <AdminHeader title="Contact Messages" addHref={''} />
      <AdminTable columns={columns} data={data} editHrefBase="/admin/contact/edit" onDelete={handleDelete} onView={handleViewMessage} />
      {selectedMessage && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Message from ${selectedMessage.name}`}>
          <p><strong>Email:</strong> {selectedMessage.email}</p>
          <p className="mt-4">{selectedMessage.message}</p>
        </Modal>
      )}
    </div>
  );
}
