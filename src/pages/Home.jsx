import React, { useState } from 'react';
import IntroExperience from '../components/Intro/IntroExperience';
import BirthdayExperience from './BirthdayExperience';

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false);

  // Hardcoded data for Hiral from Lalit
  const hiralData = {
    recipientName: 'Hiral',
    creatorName: 'Lalit',
    age: 19,
    date: '2007-10-06',
    cakeType: 'midnight-chocolate',
    balloons: [
      "Happy Birthday to my forever Sister — the sweetest, strongest, most caring person who deserves all the happiness in the world! 🥹❤️🎂",
      "Happy Birthday to my beautiful Sister , whose pure heart, endless care, and crazy personality make her impossible not to love! ❤️😂🎂",
      "Happy Birthday to my sister by heart — stay as kind, crazy, strong, and wonderfully yourself as you are! 🫂✨❤️",
      "Happy Birthday to the most caring, understanding, crazy, and beautiful soul who is not just my bestie but truly my sister by heart! 🫂❤️🎂"
    ],
    memories: [
      { image_url: '/photos/photo1.jpg', caption: '' },
      { image_url: '/photos/photo2.jpg', caption: '' },
      { image_url: '/photos/photo3.jpg', caption: '' },
      { image_url: '/photos/photo4.jpg', caption: '' },
      { image_url: '/photos/photo5.png', caption: '' },
      { image_url: '/photos/photo6.jpg', caption: '' }
    ],
    letter: `Happy Birthday Hiral 🥹❤️\n\nYou’re not just my best friend, you’re that one person who somehow became family without sharing the same blood. From random conversations to stupid arguments, from laughing over the most useless things to being there when things weren't okay — I’m genuinely grateful for every moment with you. 🫶🏻\n\nI hope this new year of your life brings you endless happiness, peace, success, and all the things you've been wishing for. ✨ You deserve people who value you, moments that make you smile for no reason, and a life that feels as beautiful as you are.\n\nStay the same crazy, caring and amazing person you are. ❤️\n\nHappy Birthday once again, meri behen! 🎂🫂\n\nKeep smiling, keep shining, and never forget — I'm always just one call away. ❤️✨`
  };

  if (introFinished) {
    // Show the actual birthday experience directly!
    return <BirthdayExperience data={hiralData} isPreview={false} />;
  }

  return (
    <IntroExperience 
      onComplete={() => setIntroFinished(true)} 
      messageText={`Happy Birthday, ${hiralData.recipientName} ✨`}
      buttonText="Open Surprise 🎁"
    />
  );
}
