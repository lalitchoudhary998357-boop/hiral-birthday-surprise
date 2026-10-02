import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BirthdayExperience from './BirthdayExperience';
import IntroExperience from '../components/Intro/IntroExperience';

export default function PreviewBirthday() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  
  const [introFinished, setIntroFinished] = useState(false);

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-cream">
        <div className="text-center">
          <p className="text-xl mb-4">No surprise data found to preview!</p>
          <button onClick={() => navigate('/')} className="bg-deep-burgundy text-white px-6 py-2 rounded-full">Go Back</button>
        </div>
      </div>
    );
  }

  // Format data specifically for the experience view (handling File objects as blob URLs for preview)
  const previewData = {
    ...formData,
    memories: formData.photos.map(file => ({
      image_url: URL.createObjectURL(file),
      caption: '' 
    }))
  };

  const handleApprove = async () => {
    navigate('/share', { state: { formData } });
  };

  if (!introFinished) {
    return (
      <IntroExperience 
        onComplete={() => setIntroFinished(true)} 
        messageText={`Happy Birthday, ${formData.recipientName} ✨`}
        buttonText="Open Surprise"
      />
    );
  }

  return (
    <BirthdayExperience 
      data={previewData} 
      isPreview={true} 
      onApprove={handleApprove} 
    />
  );
}
