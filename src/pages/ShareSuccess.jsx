import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Copy, MessageCircle, Gift, Plus } from 'lucide-react';

export default function ShareSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state?.formData;
  
  const [loading, setLoading] = useState(true);
  const [shareToken, setShareToken] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formData) {
      navigate('/');
      return;
    }

    const saveSurprise = async () => {
      try {
        // 1. Create surprise record
        const response = await fetch('http://localhost:3000/api/birthdays', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recipient_name: formData.recipientName,
            creator_name: formData.creatorName,
            recipient_age: formData.age ? parseInt(formData.age) : null,
            birthday_date: formData.date || null,
            cake_type: formData.cakeType,
            letter: formData.letter,
            balloons: formData.balloons.filter(b => b.trim() !== '')
          })
        });

        if (!response.ok) throw new Error('Failed to create surprise');
        const data = await response.json();
        const token = data.shareToken;

        // 2. Upload photos if any
        if (formData.photos && formData.photos.length > 0) {
          const photoData = new FormData();
          formData.photos.forEach(photo => photoData.append('photos', photo));
          
          await fetch(`http://localhost:3000/api/birthdays/${token}/memories`, {
            method: 'POST',
            body: photoData
          });
        }

        setShareToken(token);
      } catch (err) {
        console.error(err);
        setError('Oops, something went wrong saving your surprise.');
      } finally {
        setLoading(false);
      }
    };

    saveSurprise();
  }, [formData, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Sparkles size={48} className="text-peach animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-deep-burgundy">Crafting the surprise...</h2>
        <p className="text-gray-500 mt-2">Lighting the candles and tying the balloons 🎈</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">{error}</div>
    );
  }

  const shareUrl = `${window.location.origin}/birthday/${shareToken}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-warm-cream">
      <div className="bg-white rounded-3xl shadow-xl shadow-peach/20 p-8 sm:p-12 w-full max-w-md text-center">
        <div className="w-20 h-20 bg-soft-pink/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Sparkles size={32} className="text-deep-burgundy" />
        </div>
        
        <h2 className="text-3xl font-black text-deep-burgundy mb-2">Your surprise is ready ✨</h2>
        <p className="text-gray-500 mb-8">Share it with someone special. (No payment required!)</p>

        <div className="bg-warm-cream/50 p-4 rounded-xl border border-peach/30 mb-8 break-all font-mono text-sm text-gray-700">
          {shareUrl}
        </div>

        <div className="flex flex-col gap-3">
          <button onClick={copyLink} className="w-full flex items-center justify-center gap-2 bg-deep-burgundy text-white py-4 rounded-xl font-bold hover:bg-deep-burgundy/90 transition-all">
            <Copy size={18} /> Copy Private Link
          </button>
          
          <a href={`https://wa.me/?text=I made a birthday surprise for you! Open it here: ${shareUrl}`} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-xl font-bold hover:bg-[#25D366]/90 transition-all">
            <MessageCircle size={18} /> Share on WhatsApp
          </a>

          <button onClick={() => window.open(shareUrl, '_blank')} className="w-full flex items-center justify-center gap-2 bg-peach text-white py-4 rounded-xl font-bold hover:bg-peach/90 transition-all mt-4">
            <Gift size={18} /> Open Surprise
          </button>
          
          <button onClick={() => navigate('/')} className="w-full flex items-center justify-center gap-2 bg-transparent text-gray-500 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all mt-2">
            <Plus size={18} /> Create Another
          </button>
        </div>
      </div>
    </div>
  );
}
