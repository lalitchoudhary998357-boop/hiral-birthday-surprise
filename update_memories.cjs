const fs = require('fs');
const file = 'D:/New folder/open-birthday-surprise/frontend/src/pages/BirthdayExperience.jsx';
let content = fs.readFileSync(file, 'utf8');

const replacement = `function SceneMemories({ data, next }) {
  if (!data.memories || data.memories.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-6 text-xl">No photos this time, but lots of love! ❤️</p>
        <button onClick={next} className="bg-white text-deep-burgundy px-8 py-3 rounded-full font-bold">Next</button>
      </div>
    );
  }

  // Pre-defined rotations for that scattered "polaroid on a desk" look
  const rotations = ['-rotate-3', 'rotate-2', '-rotate-6', 'rotate-6', '-rotate-1', 'rotate-3'];

  return (
    <motion.div className="w-full text-center max-w-4xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -100 }}>
      <h2 className="text-3xl font-bold text-peach mb-2">Memory Lane</h2>
      <p className="text-white/70 mb-8">Some beautiful moments together ✨</p>
      
      <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 pb-12 px-2">
        {data.memories.map((mem, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            className={\`w-36 md:w-48 bg-white p-2 md:p-3 pb-6 md:pb-8 rounded shadow-xl hover:scale-110 hover:z-20 transition-all cursor-pointer relative z-10 transform \${rotations[i % rotations.length]}\`}
          >
            <div className="aspect-square bg-gray-100 rounded-sm overflow-hidden border border-gray-100">
              <img src={mem.image_url} alt="Memory" className="w-full h-full object-cover" />
            </div>
            {mem.caption && <p className="text-deep-burgundy font-medium mt-3 text-sm md:text-base hand-drawn-font">{mem.caption}</p>}
          </motion.div>
        ))}
      </div>

      <button onClick={next} className="bg-white text-deep-burgundy px-8 py-3 rounded-full font-bold inline-flex items-center gap-2 relative z-30 shadow-lg hover:scale-105 transition-transform">
        Keep going <ArrowRight size={18} />
      </button>
    </motion.div>
  );
}`;

const regex = /function SceneMemories\(\{ data, next \}\) \{[\s\S]*?(?=function SceneLetter)/;
content = content.replace(regex, replacement + '\n\n');
fs.writeFileSync(file, content, 'utf8');
console.log('Done');
