import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Lessons() {
  const [user, setUser] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState('');
  const [lessonNotes, setLessonNotes] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    else router.push('/');
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  const dummyLessonContent = {
    'module-1': "Cognitive Restructuring involves identifying and challenging negative thought patterns. In this module, we will explore how your thoughts directly influence your emotions and behaviors...",
    'module-2': "Mindfulness is the practice of being fully present in the moment without judgment. This ancient practice, adapted for modern psychology, helps ground the nervous system...",
  };

  if (!user) return <div className="min-h-screen bg-black flex items-center justify-center text-teal-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* 🧭 SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-gray-950 border-r border-gray-800 flex flex-col p-6 z-10">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">Cognitive Space</h1>
          <p className="text-xs text-teal-400 mt-1 uppercase tracking-wider font-semibold">{user.role} Portal</p>
        </div>
        <nav className="flex-1 space-y-3">
          <button onClick={() => router.push('/dashboard')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-all">
            <span className="text-lg">🏠</span> Home
          </button>
          <button onClick={() => router.push('/chat')} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl font-medium transition-all">
            <span className="text-lg">💬</span> Therapy Chat
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-teal-900/30 text-teal-400 border border-teal-800/50 rounded-xl font-medium transition-colors">
            <span className="text-lg">📖</span> Lessons
          </button>
        </nav>
        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-400 hover:bg-red-950/30 rounded-xl font-medium transition-colors">
          <span className="text-lg">🚪</span> Log Out
        </button>
      </aside>

      {/* 🎛️ MAIN CONTENT AREA */}
      <main className="flex-1 p-8 md:p-12 flex flex-col max-w-4xl mx-auto w-full">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Curriculum</h2>
          <p className="text-gray-400">Select a lesson to continue your journey.</p>
        </header>

        {/* 🔻 DROPDOWN (From your sketch) */}
        <select 
          value={selectedLesson} 
          onChange={(e) => setSelectedLesson(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 mb-8 appearance-none cursor-pointer"
        >
          <option value="" disabled>Choose Lesson ▼</option>
          <option value="module-1">Module 1: Cognitive Restructuring</option>
          <option value="module-2">Module 2: Applied Mindfulness</option>
        </select>

        {/* 〰️ LESSON CONTENT (The squiggly lines) */}
        <div className="flex-1 bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl mb-8 min-h-[300px]">
          {selectedLesson ? (
            <p className="text-gray-300 leading-relaxed text-lg">
              {dummyLessonContent[selectedLesson]}
            </p>
          ) : (
            <p className="text-gray-600 text-center mt-20 italic">Please select a lesson from the dropdown above.</p>
          )}
        </div>

        {/* 📝 TEXT INPUT AT BOTTOM (From your sketch) */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 flex gap-3">
          <input 
            value={lessonNotes}
            onChange={(e) => setLessonNotes(e.target.value)}
            placeholder="Write your notes or reflections on this lesson here..."
            className="flex-1 bg-gray-900 border border-gray-700 text-white p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all placeholder-gray-500" 
          />
          <button 
            onClick={() => { alert("Notes saved!"); setLessonNotes(''); }}
            className="bg-teal-600 hover:bg-teal-500 text-black font-bold px-8 rounded-xl transition-all shadow-[0_0_10px_rgba(20,184,166,0.2)]"
          >
            Save Notes
          </button>
        </div>

      </main>
    </div>
  );
}