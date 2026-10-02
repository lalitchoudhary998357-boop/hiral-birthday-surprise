import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import BirthdayExperience from './BirthdayExperience';
import IntroExperience from '../components/Intro/IntroExperience';
import { Sparkles } from 'lucide-react';

export default function ViewBirthday() {
  const { shareToken } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const fetchSurprise = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/birthdays/${shareToken}`);
        if (!response.ok) throw new Error('Surprise not found');
        const result = await response.json();
        
        // Map backend data to frontend expected format
        const mappedData = {
          recipientName: result.recipient_name,
          creatorName: result.creator_name,
          age: result.recipient_age,
          date: result.birthday_date,
          cakeType: result.cake_type,
          letter: result.letter,
          balloons: result.balloons || [],
          memories: result.memories ? result.memories.map(m => ({
            image_url: `http://localhost:3000${m.image_url}`,
            caption: m.caption
          })) : []
        };
        
        setData(mappedData);
      } catch (err) {
        console.error(err);
        setError('Oops! This little surprise couldn\'t be found 💛');
      } finally {
        setLoading(false);
      }
    };

    fetchSurprise();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-deep-burgundy text-white">
        <Sparkles size={48} className="text-peach animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-warm-cream text-center p-6">
        <h2 className="text-2xl font-bold text-deep-burgundy mb-4">{error}</h2>
        <button onClick={() => window.location.href = '/'} className="bg-deep-burgundy text-white px-8 py-3 rounded-full font-bold">
          Create a new surprise 🎂
        </button>
      </div>
    );
  }

  if (!introFinished) {
    return (
      <IntroExperience 
        onComplete={() => setIntroFinished(true)} 
        messageText={`Happy Birthday, ${data.recipientName} ✨`}
        buttonText="Open Surprise"
      />
    );
  }

  return <BirthdayExperience data={data} isPreview={false} />;
}
