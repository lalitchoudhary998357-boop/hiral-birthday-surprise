const fs = require('fs');
const file = 'D:/New folder/open-birthday-surprise/frontend/src/pages/BirthdayExperience.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `function SceneLetter({ data, next }) {
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
          {/* Burnt Paper Background Effect */}
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
}`;

const regex = /function SceneLetter\(\{ data, next \}\) \{[\s\S]*?(?=function SceneFinal)/;
content = content.replace(regex, replacement + '\n\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
