import { useState, useEffect, useCallback } from 'react';
import { fetchProfile, fetchLessons } from './api';
import Dashboard from './components/Dashboard';
import LessonView from './components/LessonView';
import Button from './components/Button';
import CoinBadge from './components/CoinBadge';

export default function App() {
  const [profile, setProfile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      const [prof, lsns] = await Promise.all([fetchProfile(), fetchLessons()]);
      setProfile(prof);
      setLessons(lsns);
    } catch {
      setLoadError('Could not connect to backend at localhost:3000. Is the server running?');
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleQuizComplete(newBalance) {
    setProfile((prev) => ({ ...prev, coinBalance: newBalance }));
    loadData();
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-100">
        <div className="bg-white border-b-4 border-red-400 rounded-3xl p-10 max-w-md text-center shadow-xl">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-red-600 font-bold text-lg">{loadError}</p>
          <Button variant="danger" size="md" onClick={loadData} className="mt-6">
            Try Again!
          </Button>
        </div>
      </div>
    );
  }

  if (!profile || lessons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky-100">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">⏳</div>
          <p className="text-indigo-700 font-bold text-xl">Loading Puberry…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sky-100">
      <header className="bg-indigo-700 px-6 py-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="text-sm font-bold tracking-widest text-white pt-0.5">Puberry</span>
          <CoinBadge balance={profile?.coinBalance ?? 0} />
        </div>
      </header>

      {selectedLessonId ? (
        <LessonView
          lessonId={selectedLessonId}
          profile={profile}
          onBack={() => setSelectedLessonId(null)}
          onQuizComplete={handleQuizComplete}
        />
      ) : (
        <Dashboard
          profile={profile}
          lessons={lessons}
          onSelectLesson={setSelectedLessonId}
        />
      )}
    </div>
  );
}
