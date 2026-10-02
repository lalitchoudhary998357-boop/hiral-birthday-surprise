import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChevronRight, ChevronLeft, Upload, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CreateBirthday() {
  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    recipientName: '',
    creatorName: '',
    age: '',
    date: '',
    cakeType: 'midnight-chocolate',
    balloons: [''],
    photos: [], 
    letter: ''
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    navigate('/preview', { state: { formData } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-widest text-deep-burgundy/60 uppercase mb-2">
            Step {step} of {totalSteps}
          </p>
          <div className="h-1 w-full bg-soft-pink/30 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-deep-burgundy"
              initial={{ width: 0 }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-peach/20 p-8 sm:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {step === 1 && <Step1Details key="step1" data={formData} update={updateForm} next={nextStep} />}
            {step === 2 && <Step2Cake key="step2" data={formData} update={updateForm} next={nextStep} prev={prevStep} />}
            {step === 3 && <Step3Balloons key="step3" data={formData} update={updateForm} next={nextStep} prev={prevStep} />}
            {step === 4 && <Step4Memories key="step4" data={formData} update={updateForm} next={nextStep} prev={prevStep} />}
            {step === 5 && <Step5Letter key="step5" data={formData} update={updateForm} prev={prevStep} submit={handleSubmit} />}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// --- STEP 1: DETAILS ---
function Step1Details({ data, update, next }) {
  const isValid = data.recipientName.trim() !== '' && data.creatorName.trim() !== '';

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-bold text-deep-burgundy mb-2">Who's the birthday star?</h2>
      <p className="text-gray-500 mb-8">You're about to make someone's day unforgettable 🎀</p>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Their Name *</label>
          <input type="text" placeholder="e.g. Ananya" value={data.recipientName} onChange={e => update('recipientName', e.target.value)} className="w-full p-4 bg-warm-cream/50 border border-peach/30 rounded-xl focus:ring-2 focus:ring-peach outline-none transition-all" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input type="text" placeholder="e.g. Rahul" value={data.creatorName} onChange={e => update('creatorName', e.target.value)} className="w-full p-4 bg-warm-cream/50 border border-peach/30 rounded-xl focus:ring-2 focus:ring-peach outline-none transition-all" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turning Age (Optional)</label>
            <input type="number" placeholder="e.g. 25" value={data.age} onChange={e => update('age', e.target.value)} className="w-full p-4 bg-warm-cream/50 border border-peach/30 rounded-xl focus:ring-2 focus:ring-peach outline-none transition-all" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Birthday (Optional)</label>
            <input type="date" value={data.date} onChange={e => update('date', e.target.value)} className="w-full p-4 bg-warm-cream/50 border border-peach/30 rounded-xl focus:ring-2 focus:ring-peach outline-none transition-all" />
          </div>
        </div>
        
        <button onClick={next} disabled={!isValid} className="w-full mt-6 flex items-center justify-center gap-2 bg-deep-burgundy text-white py-4 rounded-xl font-medium disabled:opacity-50 hover:bg-deep-burgundy/90 transition-all">
          Let's begin 🎂 <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

// --- STEP 2: CAKE ---
function Step2Cake({ data, update, next, prev }) {
  const cakes = [
    { id: 'midnight-chocolate', name: 'Midnight Chocolate', desc: 'Rich, dark & dreamy', icon: '🍫' },
    { id: 'strawberry-blush', name: 'Strawberry Blush', desc: 'Soft, sweet & rosy', icon: '🍓' },
    { id: 'vanilla-gold', name: 'Vanilla Gold', desc: 'Classic, warm & glowing', icon: '✨' }
  ];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-bold text-deep-burgundy mb-2">Pick their cake</h2>
      <p className="text-gray-500 mb-8">They'll light it, wish on it, and cut it.</p>

      <div className="space-y-4">
        {cakes.map(cake => (
          <div 
            key={cake.id} 
            onClick={() => update('cakeType', cake.id)}
            className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${data.cakeType === cake.id ? 'border-deep-burgundy bg-soft-pink/10 shadow-md' : 'border-gray-100 hover:border-peach/50'}`}
          >
            <div className="text-4xl">{cake.icon}</div>
            <div>
              <h3 className="font-bold text-gray-800">{cake.name}</h3>
              <p className="text-sm text-gray-500">{cake.desc}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 mt-8">
        <button onClick={prev} className="px-6 py-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"><ChevronLeft size={20} /></button>
        <button onClick={next} className="flex-1 flex items-center justify-center gap-2 bg-deep-burgundy text-white py-4 rounded-xl font-medium hover:bg-deep-burgundy/90 transition-all">
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

// --- STEP 3: BALLOONS ---
function Step3Balloons({ data, update, next, prev }) {
  const updateBalloon = (index, val) => {
    const newB = [...data.balloons];
    newB[index] = val;
    update('balloons', newB);
  };
  
  const addBalloon = () => {
    if(data.balloons.length < 6) update('balloons', [...data.balloons, '']);
  };

  const removeBalloon = (index) => {
    const newB = data.balloons.filter((_, i) => i !== index);
    update('balloons', newB);
  };

  const suggestions = ["Your laugh is my favourite sound.", "You make ordinary days feel special.", "Life is better with you around."];

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-bold text-deep-burgundy mb-2">Fill the balloons</h2>
      <p className="text-gray-500 mb-6">Each balloon hides one reason they're loved.</p>

      <div className="space-y-3 mb-6 max-h-[40vh] overflow-y-auto no-scrollbar pb-4">
        {data.balloons.map((b, i) => (
          <div key={i} className="flex gap-2">
            <input type="text" placeholder="e.g. You always make me smile" value={b} onChange={e => updateBalloon(i, e.target.value)} className="flex-1 p-4 bg-warm-cream/50 border border-peach/30 rounded-xl focus:ring-2 focus:ring-peach outline-none" />
            {data.balloons.length > 1 && (
              <button onClick={() => removeBalloon(i)} className="p-4 text-red-400 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
            )}
          </div>
        ))}
        {data.balloons.length < 6 && (
          <button onClick={addBalloon} className="w-full p-4 border-2 border-dashed border-peach/40 text-peach rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-peach/5 transition-all">
            <Plus size={18} /> Add another reason
          </button>
        )}
      </div>

      <div className="mb-6 p-4 bg-gold/10 rounded-xl">
        <p className="text-xs font-bold text-gold uppercase mb-2 flex items-center gap-1"><Sparkles size={14}/> Need a spark? Tap to use</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, i) => (
            <span key={i} onClick={() => updateBalloon(data.balloons.length-1, s)} className="text-sm bg-white px-3 py-1.5 rounded-full shadow-sm text-gray-600 cursor-pointer hover:bg-gold/20 transition-all border border-gold/20">{s}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={prev} className="px-6 py-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"><ChevronLeft size={20} /></button>
        <button onClick={next} disabled={!data.balloons[0].trim()} className="flex-1 flex items-center justify-center gap-2 bg-deep-burgundy text-white py-4 rounded-xl font-medium disabled:opacity-50 hover:bg-deep-burgundy/90 transition-all">
          Continue <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

// --- STEP 4: MEMORIES ---
function Step4Memories({ data, update, next, prev }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-bold text-deep-burgundy mb-2">Hang up memories</h2>
      <p className="text-gray-500 mb-8">Up to 5 photos, strung on fairy lights.</p>

      <div className="p-8 border-2 border-dashed border-peach/50 rounded-2xl flex flex-col items-center justify-center text-center mb-8 bg-warm-cream/30 relative">
        <Upload className="text-peach mb-4" size={32} />
        <p className="font-medium text-gray-700 mb-1">Tap to upload photos</p>
        <p className="text-sm text-gray-400">JPG, PNG up to 5MB (Max 5)</p>
        <input 
          type="file" 
          multiple 
          accept="image/*" 
          title="Upload photos"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          onChange={(e) => update('photos', Array.from(e.target.files).slice(0, 5))} 
        />
      </div>

      {data.photos.length > 0 && (
        <p className="text-sm text-green-600 font-medium mb-4 text-center">{data.photos.length} photos selected ✨</p>
      )}

      <div className="flex gap-4">
        <button onClick={prev} className="px-6 py-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"><ChevronLeft size={20} /></button>
        <button onClick={next} className="flex-1 flex items-center justify-center gap-2 bg-deep-burgundy text-white py-4 rounded-xl font-medium hover:bg-deep-burgundy/90 transition-all">
          {data.photos.length > 0 ? 'Continue' : 'Skip photos for now'} <ChevronRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}

// --- STEP 5: LETTER ---
function Step5Letter({ data, update, prev, submit }) {
  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h2 className="text-3xl font-bold text-deep-burgundy mb-2">Write your letter</h2>
      <p className="text-gray-500 mb-6">This is the part they'll read twice.</p>

      <div className="relative mb-8">
        <textarea 
          placeholder="Every year I try to find the perfect words..."
          value={data.letter}
          onChange={e => update('letter', e.target.value.substring(0, 500))}
          className="w-full h-48 p-5 bg-warm-cream/50 border border-peach/30 rounded-2xl focus:ring-2 focus:ring-peach outline-none resize-none transition-all leading-relaxed"
        />
        <div className="absolute bottom-4 right-4 text-xs font-medium text-gray-400">
          {data.letter.length} / 500
        </div>
      </div>

      <div className="flex gap-4">
        <button onClick={prev} className="px-6 py-4 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"><ChevronLeft size={20} /></button>
        <button onClick={submit} className="flex-1 flex items-center justify-center gap-2 bg-deep-burgundy text-white py-4 rounded-xl font-bold hover:bg-deep-burgundy/90 transition-all shadow-lg shadow-deep-burgundy/30">
          <Sparkles size={18} /> Preview Magic ✨
        </button>
      </div>
    </motion.div>
  );
}
