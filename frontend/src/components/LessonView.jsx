import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { fetchLesson, submitQuiz } from '../api';
import CoinIcon from './CoinIcon';
import coinSfx from '../assets/freesound_crunchpixstudio-drop-coin-384921.mp3';
import winnerSfx from '../assets/puyopuyomegafan1234-winner-game-sound-404167.mp3';


export default function LessonView({ lessonId, profile, savedProgress, onProgressChange, onBack, onQuizComplete }) {
  const [lesson, setLesson]               = useState(null);
  const [answers, setAnswers]             = useState([]);
  const [currentQuestion, setCurrentQ]   = useState(0);
  const [result, setResult]               = useState(null);
  const [loading, setLoading]             = useState(true);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState(null);

  const viewportRef        = useRef(null);
  const stripRef           = useRef(null);
  const pendingRef         = useRef(false); // true during the 300 ms answer-preview delay
  const animatingRef       = useRef(false); // true while GSAP slide is in flight
  const initialPositionRef = useRef(false); // false until strip has been positioned after first load

  const coinAudio   = useRef(new Audio(coinSfx));
  const winnerAudio = useRef(new Audio(winnerSfx));

  const alreadyCompleted = profile?.lessons?.some(l => l.lessonId === lessonId && l.completed);
  const allAnswered      = answers.length > 0 && answers.every(a => a !== null);

  useEffect(() => {
    initialPositionRef.current = false;
    setLoading(true);
    setCurrentQ(savedProgress?.currentQuestion ?? 0);
    fetchLesson(lessonId)
      .then(data => {
        setLesson(data);
        setAnswers(savedProgress?.answers ?? new Array(data.questions.length).fill(null));
      })
      .catch(() => setError('Could not load lesson.'))
      .finally(() => setLoading(false));
  }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist progress to parent so it survives unmount.
  useEffect(() => {
    if (lesson && onProgressChange) {
      onProgressChange({ currentQuestion, answers });
    }
  }, [currentQuestion, answers, lesson]); // eslint-disable-line react-hooks/exhaustive-deps

  // Slide the strip horizontally to the active question.
  // Also depends on `lesson` so it re-runs once the strip enters the DOM after loading.
  useEffect(() => {
    if (!stripRef.current || !viewportRef.current) return;
    animatingRef.current = true;
    const w = viewportRef.current.offsetWidth;

    // Jump instantly on first mount (restoring saved position); animate all subsequent navigation.
    const isFirst = !initialPositionRef.current;
    initialPositionRef.current = true;

    const tween = gsap.to(stripRef.current, {
      x: -currentQuestion * w,
      duration: isFirst ? 0 : 0.5,
      ease: 'power3.inOut',
      onComplete: () => { animatingRef.current = false; },
    });

    return () => tween.kill();
  }, [currentQuestion, lesson]);


  function handleAnswerSelect(qi, oi) {
    if (pendingRef.current || animatingRef.current) return;

    const updated = [...answers];
    updated[qi] = oi;
    setAnswers(updated);

    // Advance to the next question after a brief pause so the selection is visible.
    if (qi < lesson.questions.length - 1) {
      pendingRef.current = true;
      setTimeout(() => {
        pendingRef.current = false;
        setCurrentQ(qi + 1);
      }, 300);
    }
  }

  function handleGoBack() {
    if (pendingRef.current || animatingRef.current || currentQuestion === 0) return;
    setCurrentQ(q => q - 1);
  }

  function handleGoNext(qi) {
    if (pendingRef.current || animatingRef.current) return;
    setCurrentQ(qi + 1);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (answers.some(a => a === null)) {
      setError('Please answer all questions before submitting.');
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const data = await submitQuiz(lessonId, answers);
      setResult(data);
      onQuizComplete(data.newBalance);
      if (data.passed) {
        coinAudio.current.currentTime = 0;
        coinAudio.current.play();
        winnerAudio.current.currentTime = 0;
        winnerAudio.current.play();
      }
    } catch (err) {
      if (err?.error?.code === 'ALREADY_COMPLETED') {
        setError('You already completed this lesson.');
      } else {
        setError('Submission failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin text-5xl mb-3">⏳</div>
          <p className="text-indigo-500 font-bold text-lg">Loading lesson…</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-4">😕</p>
        <p className="text-red-500 font-bold text-xl">{error || 'Lesson not found.'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Nav */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white border-b-4 border-indigo-300 active:border-b-0 active:translate-y-1 text-indigo-600 font-bold text-sm px-5 py-2.5 rounded-2xl shadow-md transition-transform duration-100 hover:-translate-y-0.5"
        >
          ← Back
        </button>
      </div>

      {/* Lesson header */}
      <div className="bg-white rounded-3xl border-b-4 border-indigo-200 shadow-xl p-7 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-black uppercase tracking-widest text-violet-500 bg-violet-100 px-3 py-1 rounded-full">
            Lesson
          </span>
          <span className="inline-flex items-center gap-1.5 bg-brand-gold border-b-2 border-brand-gold-dark text-white text-sm font-black px-4 py-1.5 rounded-pill shadow-sm">
            <CoinIcon className="w-4 h-4" />+{lesson.coinReward} on pass!
          </span>
        </div>
        <h1 className="text-3xl font-black text-indigo-700 mb-3 leading-tight">{lesson.title}</h1>
        <p className="text-gray-600 leading-relaxed font-medium">{lesson.content}</p>
      </div>

      {/* Already-completed banner */}
      {alreadyCompleted && !result && (
        <div className="bg-emerald-100 border-b-4 border-emerald-400 rounded-3xl p-5 mb-6 text-emerald-700 font-bold shadow-lg">
          ✅ You already aced this lesson and earned coins!
        </div>
      )}

      {/* Result banner */}
      {result && (
        <div
          className={`rounded-3xl p-6 mb-6 border-b-4 shadow-xl ${
            result.passed
              ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
              : 'bg-red-100 border-red-400 text-red-800'
          }`}
        >
          <p className="text-2xl font-black mb-2">
            {result.passed ? '🎉 You passed!' : '😔 Not quite…'}
          </p>
          <p className="font-semibold">{result.message}</p>
          <p className="mt-1 font-semibold flex items-center gap-1 flex-wrap">
            Score: <strong>{result.score}%</strong>
            {result.passed && (
              <>
                {' '}· Coins earned:{' '}
                <strong className="inline-flex items-center gap-1">
                  +{result.coinsEarned}<CoinIcon className="w-4 h-4" />
                </strong>
                {' '}· New balance: <strong>{result.newBalance}</strong>
              </>
            )}
          </p>
        </div>
      )}

      {/* Quiz */}
      {!result && (
        <form onSubmit={handleSubmit}>
          {/* Progress row */}
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-sm font-bold text-indigo-500">
              Question {currentQuestion + 1} of {lesson.questions.length}
            </span>
            <div className="flex gap-1.5">
              {lesson.questions.map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    i < currentQuestion
                      ? 'bg-indigo-400'
                      : i === currentQuestion
                      ? 'bg-violet-500'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Slider viewport — overflow-hidden clips off-screen question cards */}
          <div
            ref={viewportRef}
            className="overflow-hidden rounded-3xl border-b-4 border-indigo-200 shadow-xl mb-6"
          >
            {/* Strip — CSS grid gives each card exactly the viewport width; GSAP slides X */}
            <div
              ref={stripRef}
              className="grid will-change-transform"
              style={{ gridTemplateColumns: `repeat(${lesson.questions.length}, 100%)` }}
            >
              {lesson.questions.map((q, qi) => (
                <div
                  key={q.id}
                  data-qi={qi}
                  className="bg-white p-6 flex flex-col"
                >
                  {/* Per-card back / next nav */}
                  <div className="flex items-center justify-between mb-3 h-8">
                    {qi > 0 ? (
                      <button
                        type="button"
                        onClick={handleGoBack}
                        className="text-sm font-bold text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        ← 
                      </button>
                    ) : <span />}
                    {answers[qi] !== null && qi < lesson.questions.length - 1 && (
                      <button
                        type="button"
                        onClick={() => handleGoNext(qi)}
                        className="text-sm font-bold text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                         →
                      </button>
                    )}
                  </div>

                  {/* Question + choices */}
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-black text-indigo-800 text-lg mb-5">
                      {qi + 1}. {q.prompt}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((opt, oi) => (
                        <label
                          key={oi}
                          className={`choice-item flex items-center gap-3 rounded-2xl border-b-4 px-5 py-3.5 cursor-pointer transition-all duration-150 ${
                            answers[qi] === oi
                              ? 'border-indigo-400 bg-indigo-100 -translate-y-0.5 shadow-md'
                              : 'border-gray-200 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50 hover:-translate-y-0.5'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q${qi}`}
                            value={oi}
                            checked={answers[qi] === oi}
                            onChange={() => handleAnswerSelect(qi, oi)}
                            className="accent-indigo-600 w-4 h-4"
                          />
                          <span
                            className={`font-semibold ${
                              answers[qi] === oi ? 'text-indigo-700' : 'text-gray-700'
                            }`}
                          >
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-b-4 border-red-400 rounded-2xl px-5 py-3 text-red-600 font-bold shadow-sm mb-4">
              ⚠️ {error}
            </div>
          )}

          {/* Submit appears only after every question has been answered */}
          {allAnswered && (
            <button
              type="submit"
              disabled={submitting || alreadyCompleted}
              className="w-full bg-violet-500 border-b-4 border-violet-700 active:border-b-0 active:translate-y-1 disabled:bg-gray-300 disabled:border-gray-400 disabled:translate-y-0 text-white font-black py-4 rounded-2xl transition-transform duration-100 text-lg shadow-lg"
            >
              {submitting ? '⏳ Submitting…' : alreadyCompleted ? '✅ Already Completed' : 'Submit'}
            </button>
          )}
        </form>
      )}

      {result && (
        <button
          onClick={onBack}
          className="mt-4 w-full bg-indigo-500 border-b-4 border-indigo-700 active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl transition-transform duration-100 text-lg shadow-lg"
        >
          ← Back to Dashboard
        </button>
      )}
    </div>
  );
}
