import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Heart } from 'lucide-react';

export default function BirthdayExperience({ data, isPreview, onApprove }) {
  const [scene, setScene] = useState(0);

  const nextScene = () => setScene(s => s + 1);

  if (!data) return <div className="h-screen flex items-center justify-center text-white">Loading magic...</div>;

  return (
    <div className="fixed inset-0 bg-deep-burgundy text-white overflow-hidden flex flex-col">
      {isPreview && (
        <div className="absolute top-0 left-0 w-full bg-gold text-deep-burgundy text-center py-2 font-bold z-50 flex justify-between px-4 items-center shadow-lg">
          <span className="text-sm">PREVIEW MODE</span>
          <button onClick={onApprove} className="bg-deep-burgundy text-white px-4 py-1 rounded-full text-sm hover:bg-deep-burgundy/90">
            Looks good! Generate Link ✨
          </button>
        </div>
      )}

      <div className="flex-1 relative w-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full w-full flex items-center justify-center p-6 py-12">
          <AnimatePresence mode="wait">
            {scene === 0 && <SceneEnvelope key="envelope" next={nextScene} />}
            {scene === 1 && <SceneReveal key="reveal" data={data} next={nextScene} />}
            {scene === 2 && <SceneCake key="cake" data={data} next={nextScene} />}
            {scene === 3 && <SceneBalloons key="balloons" data={data} next={nextScene} />}
            {scene === 4 && <SceneMemories key="memories" data={data} next={nextScene} />}
            {scene === 5 && <SceneLetter key="letter" data={data} next={nextScene} />}
            {scene === 6 && <SceneFinal key="final" data={data} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SceneEnvelope({ next }) {
  return (
    <motion.div className="text-center cursor-pointer" onClick={next} exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}>
      <p className="text-soft-pink mb-4 text-lg font-medium tracking-wide">A little something, for you</p>
      <motion.div 
        animate={{ y: [0, -10, 0] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="text-8xl mb-8"
      >
        💌
      </motion.div>
      <div className="inline-flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
        Tap to open <Sparkles size={16} className="text-gold" />
      </div>
    </motion.div>
  );
}

function SceneReveal({ data, next }) {
  return (
    <motion.div className="text-center w-full" onClick={next} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.1 }}>
      <p className="text-xl text-soft-pink mb-2">it's officially your day</p>
      <motion.h1 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-peach mb-6 leading-tight"
      >
        HAPPY<br/>BIRTHDAY<br/>{data.recipientName.toUpperCase()}
      </motion.h1>
      <p className="text-white/50 text-sm mt-12 animate-pulse">tap anywhere to continue</p>
    </motion.div>
  );
}

function SceneCake({ data, next }) {
  const [blown, setBlown] = useState(false);
  const cakeEmoji = data.cakeType === 'strawberry-blush' ? '🍓' : data.cakeType === 'vanilla-gold' ? '🧁' : '🎂';

  return (
    <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -50 }}>
      <h2 className="text-3xl font-bold mb-12 text-peach">First things first</h2>
      
      <div className="relative inline-block mb-12 cursor-pointer" onClick={() => setBlown(true)}>
        {!blown && (
          <motion.div animate={{ opacity: [1, 0.5, 1] }} transition={{ repeat: Infinity }} className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-4xl">
            🔥
          </motion.div>
        )}
        <div className="text-8xl">{cakeEmoji}</div>
      </div>

      <div className="h-16">
        {!blown ? (
          <p className="text-xl font-medium animate-pulse text-gold">Tap to make a wish & blow the candles ✨</p>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
            <p className="text-2xl font-bold text-soft-pink mb-6">Wish granted! 🎉</p>
            <button onClick={next} className="bg-white text-deep-burgundy px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto">
              Next <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SceneBalloons({ data, next }) {
  const [popped, setPopped] = useState([]);
  
  const popBalloon = (index) => {
    if (!popped.includes(index)) setPopped([...popped, index]);
  };

  const allPopped = popped.length === data.balloons.length;

  return (
    <motion.div className="w-full max-w-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-peach mb-2">Pop the balloons 🎈</h2>
        <p className="text-white/70">Each one hides a reason you're loved</p>
      </div>

      <div className="space-y-4">
        {data.balloons.map((msg, i) => (
          <div key={i} className="relative min-h-[5rem] flex items-center justify-center py-2">
            <AnimatePresence>
              {!popped.includes(i) ? (
                <motion.div 
                  exit={{ opacity: 0, scale: 1.5 }}
                  onClick={() => popBalloon(i)}
                  className="absolute cursor-pointer text-5xl hover:scale-110 transition-transform"
                >
                  🎈
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white/10 border border-peach/30 p-4 rounded-xl text-center backdrop-blur-md"
                >
                  <p className="text-lg font-medium text-warm-cream">{msg}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {allPopped && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-12 text-center">
          <p className="mb-6 text-soft-pink italic">...and a thousand more reasons ✨</p>
          <button onClick={next} className="bg-white text-deep-burgundy px-8 py-3 rounded-full font-bold inline-flex items-center gap-2">
            Keep going <ArrowRight size={18} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function SceneMemories({ data, next }) {
  const [fullScreenIndex, setFullScreenIndex] = useState(0);

  if (!data.memories || data.memories.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-6 text-xl">No photos this time, but lots of love! ❤️</p>
        <button onClick={next} className="bg-white text-deep-burgundy px-8 py-3 rounded-full font-bold">Next</button>
      </div>
    );
  }

  const showCollage = fullScreenIndex >= data.memories.length;

  if (!showCollage) {
    const mem = data.memories[fullScreenIndex];
    return (
      <motion.div 
        key={String('fs-') + fullScreenIndex}
        className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center p-6 cursor-pointer"
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => setFullScreenIndex(prev => prev + 1)}
      >
        <div className="max-w-md w-full bg-white p-3 pb-8 md:pb-10 rounded shadow-2xl relative">
          <div className="aspect-[3/4] bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
            <img src={mem.image_url} alt="Memory" className="w-full h-full object-cover" />
          </div>
          {mem.caption && <p className="text-deep-burgundy font-medium mt-4 text-center hand-drawn-font text-xl">{mem.caption}</p>}
        </div>
        <p className="text-white/60 mt-8 text-sm md:text-base animate-pulse font-medium">Tap anywhere to see next</p>
      </motion.div>
    );
  }

  const rotations = ['-rotate-3', 'rotate-2', '-rotate-6', 'rotate-6', '-rotate-1', 'rotate-3'];

  return (
    <motion.div className="w-full text-center max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }}>
      <h2 className="text-3xl font-bold text-peach mb-2">Memory Lane</h2>
      <p className="text-white/70 mb-8">Some beautiful moments together ✨</p>
      
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 pb-12 px-2">
        {data.memories.map((mem, i) => {
          const r = rotations[i % rotations.length];
          return (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={"w-36 md:w-48 bg-white p-2 md:p-3 pb-6 md:pb-8 rounded shadow-xl hover:scale-110 hover:z-20 transition-all cursor-pointer relative z-10 transform " + r}
          >
            <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
              <img src={mem.image_url} alt="Memory" className="w-full h-full object-cover" />
            </div>
            {mem.caption && <p className="text-deep-burgundy font-medium mt-3 text-sm md:text-base hand-drawn-font">{mem.caption}</p>}
          </motion.div>
        )})}
      </div>

      <button onClick={next} className="bg-white text-deep-burgundy px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 relative z-30 shadow-lg hover:scale-105 transition-transform">
        Keep going <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}

function SceneLetter({ data, next }) {
  const [opened, setOpened] = useState(false);

  return (
    <motion.div className="w-full max-w-2xl text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {!opened ? (
        <div className="cursor-pointer" onClick={() => setOpened(true)}>
          <h2 className="text-3xl font-bold text-peach mb-2">One last thing...</h2>
          <p className="text-white/70 mb-12">Someone wrote you a letter.</p>
          <div className="text-8xl mb-8 hover:scale-110 transition-transform">💌</div>
          <p className="text-gold animate-pulse">✨ Tap to open</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          className="relative text-left p-8 md:p-12 mx-auto"
        >
          <div className="absolute inset-0 bg-[#e8dcc4] bg-noise rounded-sm shadow-[inset_0_0_60px_rgba(101,67,33,0.8),inset_0_0_20px_rgba(0,0,0,0.6),5px_10px_20px_rgba(0,0,0,0.5)] -z-10 transform -rotate-1"></div>
          
          <div className="font-serif text-[#3e2723] relative z-10">
            <p className="text-sm font-bold text-[#5c4033] mb-8 uppercase tracking-widest border-b border-[#8b5a2b]/30 pb-2">From: {data.creatorName}</p>
            <p className="whitespace-pre-wrap text-xl md:text-2xl leading-relaxed mb-12 font-medium" style={{ textShadow: "0.5px 0.5px 1px rgba(0,0,0,0.1)" }}>{data.letter}</p>
            <p className="font-bold text-right text-xl italic text-[#27150c]">With all my love,<br/>{data.creatorName} ❤️</p>
          </div>
          
          <div className="text-center mt-12 relative z-10">
            <button onClick={next} className="bg-[#3e2723] text-[#e8dcc4] px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
              Finish <Sparkles size={18} className="text-gold" />
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function SceneFinal({ data }) {
  return (
    <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gold to-peach mb-4">
        HAPPY BIRTHDAY<br/>{data.recipientName}
      </h1>
      <p className="text-xl text-soft-pink mb-12">Hope you loved your surprise! ✨</p>
      
      <div className="flex flex-col gap-4 max-w-xs mx-auto">
        <button onClick={() => window.location.reload()} className="bg-white/10 border border-white/20 text-white py-3 rounded-full font-medium hover:bg-white/20 transition-all">
          Replay the surprise ✨
        </button>
        <button onClick={() => window.location.href = '/'} className="bg-white text-deep-burgundy py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
          Create your own 🎁
        </button>
      </div>
    </motion.div>
  );
}
