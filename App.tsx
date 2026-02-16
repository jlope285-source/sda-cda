
// Fix: Clean up redundant 'as string[]' casts that were causing 'unknown' type errors.
// Fix: Implement 'Requested entity was not found' error handling.
import React, { useState, useMemo, useEffect } from 'react';
import { EducationalCycle, SelectionState, LearningSituation, ActivitatDetallada, ClassGroup, StudentEvaluation, ProgramacioDetallada } from './types';
import { CDA_DATA, COMPETENCES } from './constants';
import { generateLearningSituation, generateSessionInfographic } from './geminiService';

const ROBOTS = [
  'beebot', 'bluebot', 'mtiny', 'cubetto', 'talebot', 'code and go mouse', 
  'dash', 'edisson v3', 'codey rocky', 'mbot2', 'lego spike essential', 
  'lego spike prime', 'microbit', 'cutebot', 'whapstto:bit', 'keystudio uno', 
  'esp32', 'imagina', 'Scratch (només programari)', 'mBlock (només programari)'
];

const EVALUATION_LEVELS = [
  'No assolit',
  'Assoliment satisfactori',
  'Assoliment notable',
  'Assoliment excel·lent'
];

const BLOCK_COLORS: Record<string, string> = {
  'Esdeveniments': 'bg-amber-400 border-amber-500 text-amber-900',
  'Control': 'bg-orange-500 border-orange-600 text-white',
  'Moviment': 'bg-blue-500 border-blue-600 text-white',
  'Aspecte': 'bg-purple-500 border-purple-600 text-white',
  'So': 'bg-pink-500 border-pink-600 text-white',
  'Sensors': 'bg-sky-400 border-sky-500 text-sky-900',
  'Operadors': 'bg-green-500 border-green-600 text-white',
  'Variables': 'bg-orange-600 border-orange-700 text-white',
  'Llum': 'bg-red-400 border-red-500 text-red-900',
  'Ulls': 'bg-indigo-400 border-indigo-500 text-white'
};

// --- Robot Illustrations (SVGs) ---

const IconCodeyRocky = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-2xl animate-float`} style={{ animationDelay: '0s' }}>
    <rect x="20" y="40" width="60" height="45" rx="10" fill="#f8fafc" />
    <rect x="25" y="45" width="50" height="25" rx="5" fill="#1e293b" />
    <path d="M30 50 Q 50 65 70 50" stroke="#38bdf8" strokeWidth="2" fill="none" opacity="0.5" />
    <circle cx="35" cy="55" r="2" fill="#38bdf8" />
    <circle cx="45" cy="55" r="2" fill="#38bdf8" />
    <circle cx="55" cy="55" r="2" fill="#38bdf8" />
    <circle cx="65" cy="55" r="2" fill="#38bdf8" />
    <rect x="20" y="30" width="15" height="15" rx="4" fill="#f8fafc" />
    <rect x="65" y="30" width="15" height="15" rx="4" fill="#f8fafc" />
    <rect x="30" y="85" width="40" height="10" rx="2" fill="#64748b" />
    <circle cx="35" cy="90" r="4" fill="#334155" />
    <circle cx="65" cy="90" r="4" fill="#334155" />
  </svg>
);

const IconMTiny = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-2xl animate-float`} style={{ animationDelay: '1s' }}>
    <circle cx="50" cy="55" r="35" fill="#f8fafc" />
    <circle cx="35" cy="25" r="12" fill="#1e293b" />
    <circle cx="65" cy="25" r="12" fill="#1e293b" />
    <circle cx="35" cy="50" r="8" fill="#1e293b" />
    <circle cx="65" cy="50" r="8" fill="#1e293b" />
    <circle cx="35" cy="50" r="3" fill="#ffffff" />
    <circle cx="65" cy="50" r="3" fill="#ffffff" />
    <circle cx="50" cy="65" r="5" fill="#1e293b" />
    <path d="M40 75 Q 50 85 60 75" stroke="#1e293b" strokeWidth="2" fill="none" />
  </svg>
);

const IconMicrobit = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-2xl animate-float`} style={{ animationDelay: '2s' }}>
    <rect x="15" y="20" width="70" height="60" rx="4" fill="#2d2d2d" />
    <rect x="35" y="35" width="30" height="30" fill="#1a1a1a" />
    {Array.from({ length: 25 }).map((_, i) => (
      <rect 
        key={i} 
        x={38 + (i % 5) * 5} 
        y={38 + Math.floor(i / 5) * 5} 
        width="3" 
        height="3" 
        fill={Math.random() > 0.6 ? "#ef4444" : "#333"} 
      />
    ))}
    <circle cx="25" cy="50" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
    <circle cx="75" cy="50" r="6" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
    <text x="25" y="53" textAnchor="middle" fontSize="8" fontWeight="black" fill="#92400e">A</text>
    <text x="75" y="53" textAnchor="middle" fontSize="8" fontWeight="black" fill="#92400e">B</text>
    <rect x="15" y="75" width="70" height="5" fill="#fbbf24" />
  </svg>
);

const App: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasUserKey, setHasUserKey] = useState(false);
  const [state, setState] = useState<SelectionState>({
    title: '',
    cycle: EducationalCycle.INICIAL,
    sessions: 6,
    sessionDuration: 60,
    birthYear: new Date().getFullYear() - 6,
    classGroup: 'A',
    selectedCompetenceIds: COMPETENCES.map(c => c.id),
    selectedCriteriaIds: [],
    selectedSaberIds: []
  });
  
  const [result, setResult] = useState<LearningSituation | null>(null);
  const [sessionImages, setSessionImages] = useState<Record<string, { url: string, loading: boolean }>>({});
  const [students, setStudents] = useState<StudentEvaluation[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      // Guideline check: hasSelectedApiKey
      if ((window as any).aistudio && typeof (window as any).aistudio.hasSelectedApiKey === 'function') {
        const hasKey = await (window as any).aistudio.hasSelectedApiKey();
        setHasUserKey(hasKey);
      }
    };
    checkKey();
  }, []);

  const fullData = useMemo(() => CDA_DATA[state.cycle] || { criteria: [], sabers: [] }, [state.cycle]);

  const filteredData = useMemo(() => {
    return {
      criteria: fullData.criteria.filter(c => state.selectedCompetenceIds.includes(c.competenceId)),
      sabers: fullData.sabers.filter(s => state.selectedCompetenceIds.includes(s.competenceId))
    };
  }, [fullData, state.selectedCompetenceIds]);

  const groupedSabers = useMemo(() => {
    const groups: Record<string, any[]> = {};
    filteredData.sabers.forEach(s => {
      if (!groups[s.category]) groups[s.category] = [];
      groups[s.category].push(s);
    });
    return groups;
  }, [filteredData.sabers]);

  const needsRobot = useMemo(() => {
    const criteriaNeed = state.selectedCriteriaIds.some(id => id.startsWith('3.2') || id.startsWith('5.1'));
    const sabersNeed = state.selectedSaberIds.some(id => {
      const s = filteredData.sabers.find(item => item.id === id);
      const desc = s?.description.toLowerCase() || "";
      const cat = s?.category.toLowerCase() || "";
      return desc.includes('robòtica') || desc.includes('programació') || cat.includes('computacional');
    });
    return criteriaNeed || sabersNeed;
  }, [state.selectedCriteriaIds, state.selectedSaberIds, filteredData.sabers]);

  const isFloorRobot = useMemo(() => {
    return state.robot?.toLowerCase().includes('bot') || state.robot?.toLowerCase().includes('tale') || state.robot?.toLowerCase().includes('cubetto');
  }, [state.robot]);

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newStudent: StudentEvaluation = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStudentName,
      scores: {}
    };
    setStudents([...students, newStudent]);
    setNewStudentName('');
  };

  const updateScore = (studentId: string, criteriaId: string, score: string) => {
    setStudents(prev => prev.map(s => 
      s.id === studentId ? { ...s, scores: { ...s.scores, [criteriaId]: score } } : s
    ));
  };

  const exportToCSV = () => {
    if (!result) return;
    const criteriaIds = result.criterisAvaluacio.map(c => c.id);
    const headers = ['Alumne/a', ...criteriaIds.map(id => `CD ${id}`)].join(',');
    const rows = students.map(s => {
      const scores = criteriaIds.map(id => s.scores[id] || '').join(',');
      return `${s.name},${scores}`;
    }).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `avaluacio_${state.title.replace(/\s+/g, '_') || 'projecte'}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    if (step === 1) {
        if (!state.title) {
            setError("Cal posar un títol al projecte.");
            return;
        }
    }
    setError(null);
    setStep(step + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep(step - 1);
  };

  const toggleSelection = (id: string, field: 'selectedCriteriaIds' | 'selectedSaberIds' | 'selectedCompetenceIds') => {
    setState(prev => {
      const current = prev[field] as string[];
      const next = current.includes(id) 
        ? current.filter(item => item !== id) 
        : [...current, id];
      
      if (field === 'selectedCompetenceIds') {
        return { 
          ...prev, 
          [field]: next,
          selectedCriteriaIds: prev.selectedCriteriaIds.filter(cid => {
            const crit = fullData.criteria.find(c => c.id === cid);
            return crit && next.includes(crit.competenceId);
          }),
          selectedSaberIds: prev.selectedSaberIds.filter(sid => {
            const sab = fullData.sabers.find(s => s.id === sid);
            return sab && next.includes(sab.competenceId);
          })
        };
      }
      return { ...prev, [field]: next };
    });
  };

  const handleOpenKeySelector = async () => {
    try {
      if ((window as any).aistudio && typeof (window as any).aistudio.openSelectKey === 'function') {
        await (window as any).aistudio.openSelectKey();
        // Guideline: assume success and proceed
        setHasUserKey(true);
      }
    } catch (e) {
      console.error("Error clau", e);
    }
  };

  const handleGenerate = async () => {
    if (state.selectedCriteriaIds.length === 0 || state.selectedSaberIds.length === 0) {
      setError("Selecciona almenys un criteri i un saber.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await generateLearningSituation(state);
      setResult(res);
      setStep(3);
    } catch (err: any) {
      // Guideline: Handle "Requested entity was not found" by prompting for key selection
      if (err.message?.includes("Requested entity was not found.")) {
        setHasUserKey(false);
        setError("S'ha produït un error amb la clau API. Torna-la a seleccionar des d'un projecte amb facturació activa.");
        handleOpenKeySelector();
      } else {
        setError("Error en la generació. Revisa la teva connexió o prova-ho més tard.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVisual = async (act: ActivitatDetallada) => {
    const key = `${act.sessio}-${act.titol}`;
    setSessionImages(prev => ({ ...prev, [key]: { url: '', loading: true } }));
    try {
      const url = await generateSessionInfographic(act.titol, act.descripcio, state.cycle, state.robot);
      setSessionImages(prev => ({ ...prev, [key]: { url, loading: false } }));
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found.")) {
        setHasUserKey(false);
        handleOpenKeySelector();
      }
      setSessionImages(prev => ({ ...prev, [key]: { url: '', loading: false } }));
    }
  };

  const renderProgramacio = (prog: ProgramacioDetallada | undefined) => {
    if (!prog) return null;
    return (
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-50/50 rounded-2xl border-2 border-dashed border-indigo-200 p-6">
          <h6 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 flex items-center gap-2">
            <span>💡</span> PISTES PER L'ALUMNE/A
          </h6>
          <p className="text-sm font-bold text-indigo-800 leading-relaxed italic mb-4">"{prog.pistesAlumne}"</p>
          <div className="flex flex-wrap gap-2">
            {prog.blocsPrincipals && prog.blocsPrincipals.map((b, i) => (
              <div key={i} className={`px-3 py-1.5 rounded-lg border-2 text-[10px] font-black uppercase tracking-tight shadow-sm ${BLOCK_COLORS[b.categoria] || 'bg-slate-200 border-slate-300'}`}>
                {b.nom}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">💻</div>
          <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
            <span>👨‍🏫</span> GUIA DE LÒGICA (DOCENT)
          </h6>
          <p className="text-sm font-medium leading-relaxed font-mono">
            {prog.solucioDocent}
          </p>
        </div>
      </div>
    );
  };

  const renderActivitat = (act: ActivitatDetallada, idx: number) => {
    const key = `${act.sessio}-${act.titol}`;
    const visual = sessionImages[key];

    return (
      <div key={idx} className="bg-white rounded-[2rem] border-2 border-slate-100 mb-12 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group">
        <div className="bg-slate-50 px-8 py-4 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black shadow-md">S{act.sessio}</span>
                <h5 className="text-xl font-black text-slate-800 tracking-tight">{act.titol}</h5>
            </div>
            <div className="flex gap-2">
                {(act.eines || []).map((e, i) => <span key={i} className="text-[9px] bg-white border border-slate-200 text-indigo-600 px-2 py-1 rounded-md font-black uppercase tracking-tighter shadow-sm">{e}</span>)}
            </div>
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-amber-50/50 p-6 rounded-2xl border-l-4 border-amber-400 shadow-sm">
                    <h6 className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">💡 Objectiu de la Sessió</h6>
                    <p className="text-sm text-slate-700 font-medium leading-relaxed">"{act.descripcio}"</p>
                </div>
                
                <div className="space-y-4">
                    <h6 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 flex items-center gap-2">
                      {isFloorRobot ? '🤖 Mecànica de l\'activitat' : '📋 Guia del Professorat'}
                    </h6>
                    <div className="space-y-3">
                      {(act.pasAPas || []).map((p, i) => (
                        <div key={i} className="flex gap-4 text-sm text-slate-600 bg-slate-50/30 p-4 rounded-xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all">
                          <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-black flex-shrink-0 text-xs">{i+1}</span>
                          <span className="leading-relaxed font-medium">{p}</span>
                        </div>
                      ))}
                    </div>
                </div>

                {renderProgramacio(act.programacio)}

                <div className="bg-slate-900 text-white p-6 rounded-2xl border-b-4 border-indigo-500 shadow-lg group-hover:-translate-y-1 transition-transform">
                    <h6 className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300 mb-2">🎯 Producte Final de Sessió</h6>
                    <p className="text-base font-bold flex items-center gap-3">
                        <span className="text-2xl">📦</span> {act.producte}
                    </p>
                </div>
            </div>

            <div className="lg:col-span-5">
                <div className="relative aspect-[9/16] bg-slate-100 rounded-[2.5rem] border-4 border-slate-200/30 flex flex-col items-center justify-center overflow-hidden shadow-2xl ring-8 ring-slate-50">
                  {visual?.url ? (
                    <img src={visual.url} alt="Visual Repte" className="w-full h-full object-cover animate-fadeIn" />
                  ) : (
                    <div className="text-center p-8 space-y-6">
                      <div className="text-4xl opacity-30">🤖🎨✨</div>
                      {visual?.loading ? (
                        <div className="space-y-4">
                          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                          <p className="text-[9px] font-black text-indigo-600 uppercase tracking-widest animate-pulse">Dissenyant fitxa visual...</p>
                        </div>
                      ) : (
                        <button onClick={() => handleGenerateVisual(act)} className="px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                          Generar Fitxa Alumne
                        </button>
                      )}
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-indigo-800 text-white py-14 px-6 shadow-2xl mb-12 text-center relative overflow-hidden flex flex-col items-center justify-center">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-700 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-900 rounded-full -ml-32 -mb-32 opacity-30 blur-3xl"></div>
        
        {/* Robots at the sides for compact layout */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block opacity-80 pointer-events-none">
          <IconMTiny className="w-20 h-20" />
        </div>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:block opacity-80 pointer-events-none">
          <div className="flex flex-col gap-4 items-center">
            <IconCodeyRocky className="w-20 h-20" />
            <IconMicrobit className="w-16 h-16" />
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-4xl mx-auto relative z-10 space-y-3">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-1 tracking-tighter leading-tight drop-shadow-md">
              Situacions d'Aprenentatge CDA
            </h1>
            <div className="flex items-center justify-center gap-3">
              <div className="h-1 w-8 bg-amber-400 rounded-full opacity-60"></div>
              <p className="text-lg md:text-xl text-indigo-100 font-medium italic opacity-90 tracking-wide">
                Transformant la competència digital en reptes reals
              </p>
              <div className="h-1 w-8 bg-amber-400 rounded-full opacity-60"></div>
            </div>
        </div>

        {/* Mobile Robots (smaller and centered below title) */}
        <div className="flex lg:hidden gap-4 mt-6 opacity-80 pointer-events-none">
          <IconMTiny className="w-12 h-12" />
          <IconCodeyRocky className="w-12 h-12" />
          <IconMicrobit className="w-12 h-12" />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        {error && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-100 rounded-[2rem] text-red-700 font-bold flex justify-between items-center shadow-lg animate-fadeIn">
                <span className="flex items-center gap-3">⚠️ {error}</span>
                <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 font-black">✕</button>
            </div>
        )}

        {step === 1 && (
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-12 animate-fadeIn border border-slate-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b pb-8">
                <h2 className="text-3xl font-black flex items-center gap-4 text-slate-800">
                    <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg">1</span>
                    Configuració del Projecte
                </h2>
                <button onClick={handleOpenKeySelector} className={`text-[10px] font-black uppercase tracking-widest transition-all border px-5 py-2.5 rounded-xl ${hasUserKey ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400'}`}>
                    {hasUserKey ? '✓ Clau Activa' : '🗝️ Configurar Clau'}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 italic">Títol de la Missió</label>
                  <input type="text" className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-indigo-500 focus:shadow-xl outline-none transition-all font-bold text-lg" placeholder="Ex: English Vocabulary Explorer..." value={state.title} onChange={e => setState({...state, title: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Promoció</label>
                    <select className="w-full p-5 bg-slate-50 border-2 border-transparent rounded-2xl outline-none font-bold text-lg" value={state.birthYear} onChange={e => setState({...state, birthYear: parseInt(e.target.value)})}>
                      {Array.from({length: 15}, (_, i) => new Date().getFullYear() - 15 + i).reverse().map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Grup</label>
                    <div className="flex gap-2">
                      {['A', 'B', 'C'].map(g => (
                        <button key={g} onClick={() => setState({...state, classGroup: g as ClassGroup})} className={`flex-1 p-4 rounded-xl border-2 font-black transition-all ${state.classGroup === g ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}>{g}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Competències Digitals Prioritàries</label>
                  <div className="space-y-3">
                    {COMPETENCES.map(c => (
                      <label key={c.id} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${state.selectedCompetenceIds.includes(c.id) ? 'bg-indigo-50 border-indigo-600 shadow-sm' : 'bg-slate-50 border-transparent'}`}>
                        <input type="checkbox" checked={state.selectedCompetenceIds.includes(c.id)} onChange={() => toggleSelection(c.id, 'selectedCompetenceIds')} className="w-6 h-6 rounded-lg accent-indigo-600" />
                        <span className="text-sm font-bold text-slate-700">CD{c.id.replace('C', '')}. {c.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Cicle Educatiu</label>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.values(EducationalCycle).map(c => (
                      <button key={c} onClick={() => setState({...state, cycle: c, selectedCriteriaIds: [], selectedSaberIds: []})} className={`w-full p-4 rounded-xl border-2 text-left font-bold transition-all text-sm ${state.cycle === c ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-md' : 'bg-white border-slate-100 text-slate-500'}`}>{c}</button>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-inner space-y-8">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 flex justify-between">Sessions: <span className="text-2xl font-black">{state.sessions}</span></label>
                        <input type="range" min="1" max="15" value={state.sessions} onChange={e => setState({...state, sessions: parseInt(e.target.value)})} className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4 flex justify-between">Minuts x sessió: <span className="text-2xl font-black">{state.sessionDuration}'</span></label>
                        <input type="range" min="15" max="180" step="15" value={state.sessionDuration} onChange={e => setState({...state, sessionDuration: parseInt(e.target.value)})} className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                    </div>
                </div>
              </div>
            </div>
            
            <button onClick={handleNext} className="w-full p-6 bg-indigo-600 text-white rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-sm active:scale-95">CONTINUAR ➡️</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-12 border border-slate-100">
              <h2 className="text-3xl font-black flex items-center gap-4 text-slate-800 border-b pb-8">
                <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl shadow-lg">2</span>
                Criteris i Sabers CDA
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                    <h3 className="font-black text-indigo-700 text-[11px] uppercase tracking-widest border-l-8 border-indigo-600 pl-4">Criteris d'Avaluació</h3>
                    <div className="max-h-[500px] overflow-y-auto pr-4 space-y-3 custom-scrollbar">
                    {filteredData.criteria.map(c => (
                        <label key={c.id} className={`flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all ${state.selectedCriteriaIds.includes(c.id) ? 'bg-indigo-50 border-indigo-600 shadow-md' : 'bg-slate-50 border-transparent hover:bg-white'}`}>
                        <input type="checkbox" checked={state.selectedCriteriaIds.includes(c.id)} onChange={() => toggleSelection(c.id, 'selectedCriteriaIds')} className="mt-1 w-6 h-6 accent-indigo-600" />
                        <div>
                            <span className="block text-[9px] font-black text-indigo-400 mb-1 uppercase tracking-widest">Criteri {c.id}</span>
                            <span className="text-sm font-bold text-slate-700 leading-relaxed">{c.description}</span>
                        </div>
                        </label>
                    ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <h3 className="font-black text-indigo-700 text-[11px] uppercase tracking-widest border-l-8 border-indigo-600 pl-4">Sabers Digitals</h3>
                    <div className="max-h-[500px] overflow-y-auto pr-4 space-y-8 custom-scrollbar">
                    {Object.entries(groupedSabers).map(([category, items]) => (
                        <div key={category} className="space-y-4">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b pb-2">{category}</h4>
                        <div className="space-y-2">
                            {items.map(s => (
                            <label key={s.id} className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${state.selectedSaberIds.includes(s.id) ? 'bg-indigo-50 border-indigo-600' : 'bg-slate-50 border-transparent hover:bg-white'}`}>
                                <input type="checkbox" checked={state.selectedSaberIds.includes(s.id)} onChange={() => toggleSelection(s.id, 'selectedSaberIds')} className="mt-1 w-5 h-5 accent-indigo-600" />
                                <span className="text-sm font-bold text-slate-700">{s.description}</span>
                            </label>
                            ))}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
              </div>

              {needsRobot && (
                <div className="bg-amber-50 p-8 rounded-[2rem] border-2 border-amber-200 shadow-inner">
                  <h3 className="font-black text-amber-800 text-[11px] uppercase tracking-widest mb-6 flex items-center gap-3 italic">🤖 Selecciona l'Eina Tecnològica</h3>
                  <select className="w-full p-5 bg-white border-2 border-amber-100 rounded-2xl font-black text-lg focus:border-amber-400 outline-none shadow-sm cursor-pointer" value={state.robot || ''} onChange={e => setState({...state, robot: e.target.value})}>
                    <option value="">-- Tria un Robot o Entorn --</option>
                    {ROBOTS.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-6">
              <button onClick={handleBack} className="p-6 flex-1 bg-white border-2 border-slate-200 rounded-3xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs">⬅️ TORNAR</button>
              <button onClick={handleGenerate} disabled={loading} className="p-6 flex-[2] bg-indigo-600 text-white rounded-3xl font-black shadow-2xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs disabled:opacity-50">
                {loading ? 'DISSENYANT EL REPTE...' : 'GENERAR PROPOSTA DIDÀCTICA ✨'}
              </button>
            </div>
          </div>
        )}

        {step === 3 && result && (
          <div className="space-y-12 animate-fadeIn pb-20">
            <div className="bg-indigo-900 text-white p-12 rounded-[3rem] shadow-2xl relative overflow-hidden border-b-8 border-indigo-700">
              <div className="absolute top-0 right-0 p-8 opacity-10 flex gap-2">
                  <div className="w-4 h-4 bg-amber-400 rounded-full"></div>
                  <div className="w-4 h-4 bg-indigo-400 rounded-full"></div>
              </div>
              <div className="max-w-4xl">
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-amber-400 mb-6 block italic">REPTE DIDÀCTIC CDA</span>
                <h1 className="text-6xl font-black mb-10 leading-[1.1] tracking-tight">{result.titol}</h1>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-black uppercase text-[10px] tracking-widest">
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/10">📅 Promoció: {state.birthYear}</div>
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/10">🏫 Grup: {state.classGroup}</div>
                    <div className="bg-white/10 p-5 rounded-2xl border border-white/10">⏱️ {state.sessions} sessions</div>
                    {state.robot && <div className="bg-amber-400 text-indigo-900 p-5 rounded-2xl shadow-xl">🤖 {state.robot}</div>}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl p-12 space-y-16 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <section className="space-y-6">
                        <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                          <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner text-xl">🎯</span> 
                          Context i Missió
                        </h3>
                        <p className="text-slate-600 text-lg leading-relaxed">{result.descripcioContext}</p>
                        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                            <h4 className="font-black text-amber-400 mb-4 uppercase text-[10px] tracking-widest">EL TEU REPTE FINAL</h4>
                            <p className="text-white font-black text-2xl italic leading-tight">"{result.descripcioRepte}"</p>
                        </div>
                    </section>
                    
                    <section className="space-y-8">
                        <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4">
                          <span className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center shadow-inner text-xl">🛠️</span> 
                          Recursos Necesaris
                        </h3>
                        <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100 space-y-6">
                            <div>
                                <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3 italic">Materials físics i fitxes</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(result.materialsGlobals || []).map((mat, i) => (
                                        <span key={i} className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-700 border border-green-200 shadow-sm">● {mat}</span>
                                    ))}
                                </div>
                            </div>
                            {result.extensions && result.extensions.length > 0 && (
                              <div>
                                <h4 className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3 italic">Software i Extensions</h4>
                                <div className="flex flex-wrap gap-2">
                                    {(result.extensions || []).map((ext, i) => (
                                        <span key={i} className="bg-white px-4 py-2 rounded-xl text-xs font-black text-slate-700 border border-green-200 shadow-sm">{ext}</span>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                    </section>
                </div>

                <section className="space-y-10">
                  <h3 className="text-3xl font-black text-slate-800 flex items-center gap-4 border-b pb-6">
                    <span className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner text-xl">📝</span> 
                    Desenvolupament de les Sessions
                  </h3>
                  <div className="space-y-6">
                    {([...(result.activitats.inicials || []),
                        ...(result.activitats.desenvolupament || []),
                        ...(result.activitats.sintesi || []),
                        ...(result.activitats.transferencia || [])]
                    ).map((a, i) => renderActivitat(a, i))}
                  </div>
                </section>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 pt-10">
              <button onClick={() => setStep(4)} className="w-full sm:w-auto px-12 py-6 bg-green-600 text-white font-black rounded-3xl shadow-2xl hover:bg-green-700 hover:scale-105 transition-all uppercase tracking-widest text-sm">📊 OBRIR GRAELLA D'AVALUACIÓ</button>
              <button onClick={() => setStep(1)} className="w-full sm:w-auto px-12 py-6 bg-white border-4 border-slate-100 text-slate-400 font-black rounded-3xl hover:bg-slate-50 transition-all uppercase tracking-widest text-sm">NOVA SdA</button>
            </div>
          </div>
        )}

        {step === 4 && result && (
          <div className="bg-white rounded-[3rem] shadow-2xl p-12 space-y-12 animate-fadeIn border border-slate-100">
            <h2 className="text-4xl font-black text-slate-800 tracking-tight border-b pb-8 flex justify-between items-center">
                <span>Registre d'Avaluació <span className="text-indigo-600 ml-4 font-black">{state.birthYear}-{state.classGroup}</span></span>
                <button onClick={exportToCSV} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest">Exportar CSV</button>
            </h2>
            <div className="bg-slate-50 p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-6 shadow-inner">
              <input type="text" className="flex-1 p-5 rounded-2xl border-2 border-transparent focus:border-indigo-500 outline-none font-bold bg-white text-lg" placeholder="Nom de l'alumne/a..." value={newStudentName} onChange={e => setNewStudentName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddStudent()} />
              <button onClick={handleAddStudent} className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all uppercase tracking-widest text-xs">AFEGIR</button>
            </div>
            <div className="overflow-x-auto rounded-[2rem] border border-slate-100 shadow-2xl custom-scrollbar ring-8 ring-slate-50">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="p-8 font-black text-[10px] uppercase tracking-widest border-r border-white/10 sticky left-0 bg-slate-900 z-10 min-w-[220px]">Alumne/a</th>
                    {result.criterisAvaluacio.map((c) => (
                        <th key={c.id} className="p-8 font-black text-[10px] uppercase tracking-widest border-r border-white/10 text-center">CD {c.id}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {students.map(s => (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-indigo-50/20 transition-colors">
                      <td className="p-8 border-r border-slate-100 font-black text-slate-800 sticky left-0 bg-white">{s.name}</td>
                      {result.criterisAvaluacio.map((c) => (
                        <td key={c.id} className="p-6 border-r border-slate-100">
                          <select className="w-full p-4 rounded-xl font-bold text-xs bg-slate-50 border-2 border-transparent focus:border-indigo-500 transition-all cursor-pointer shadow-sm text-center" value={s.scores[c.id] || ''} onChange={e => updateScore(s.id, c.id, e.target.value)}>
                            <option value="">--</option>
                            {EVALUATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center pt-10">
              <button onClick={() => setStep(3)} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-indigo-600 transition-all">⬅️ TORNAR AL REPTE</button>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-20 text-[10px] font-black text-slate-200 uppercase tracking-[0.4em] select-none">
        IA Educativa • Mentoria 4.0 CDA 2025
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 
          0%, 100% { transform: translateY(0) rotate(0); } 
          50% { transform: translateY(-15px) rotate(2deg); } 
        }
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 3px solid #f8fafc; }
        input[type=range] { -webkit-appearance: none; background: transparent; }
        input[type=range]:focus { outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 24px; width: 24px; border-radius: 10px; background: #4f46e5; cursor: pointer; border: 4px solid white; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
      `}</style>
    </div>
  );
};

export default App;
