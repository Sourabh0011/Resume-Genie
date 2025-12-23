'use client';
import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, ShieldCheck, ArrowRight, Linkedin, Mail, Loader2, CheckCircle2, LayoutDashboard, Clock, Send, X } from 'lucide-react';

const ResumeGenie = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({ email: '', linkedinUrl: '' });
  const [view, setView] = useState('home'); // 'home' or 'dashboard'
  const [requests, setRequests] = useState([]);
  const [showWorkflow, setShowWorkflow] = useState(false);

  // 1. Fetch requests for Dashboard (Fixed to GET)
  const fetchRequests = async () => {
    try {
      const response = await fetch('https://resume-backend-umber.vercel.app/requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };

  // 2. Update Status Function (Mark as Sent)
  const markAsSent = async (id) => {
    try {
      const response = await fetch(`https://resume-backend-umber.vercel.app/api/requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Sent' })
      });
      if (response.ok) {
        fetchRequests(); // Refresh the list after updating
      }
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  useEffect(() => {
    if (view === 'dashboard') fetchRequests();
  }, [view]);

  // Handle Progress Animation
  useEffect(() => {
    if (submitted && progress < 100) {
      const timer = setTimeout(() => {
        const increment = progress > 80 ? 1 : 4;
        setProgress(prev => Math.min(prev + increment, 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [submitted, progress]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('https://resume-backend-umber.vercel.app/request-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setLoading(false);
        setSubmitted(true);
      }
    } catch (error) {
      console.error("Submission failed", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 selection:bg-indigo-500/30 font-sans overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-2xl tracking-tighter cursor-pointer" onClick={() => setView('home')}>
          <div className="bg-gradient-to-tr from-indigo-500 to-blue-400 p-1.5 rounded-lg shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">LimitLess</span>
        </div>
        <button 
          onClick={() => setView(view === 'home' ? 'dashboard' : 'home')}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-2.5 rounded-full text-sm font-semibold transition-all backdrop-blur-md"
        >
          {view === 'home' ? <><LayoutDashboard size={16}/> Dashboard</> : "Back to Home"}
        </button>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto pt-12 pb-32 px-6">
        {view === 'home' ? (
          <div className="text-center">
            {/* Hero Header */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-800 bg-slate-900/50 text-xs font-medium text-indigo-400 mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              AI Agent Status: Online
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Paste LinkedIn Link,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400">
                Get Resume Instantly
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-12">
              Transform your LinkedIn profile into a world-class, ATS-optimized resume in minutes.
            </p>

            {/* Input Card */}
            <div className="max-w-xl mx-auto transition-all duration-500">
              {!submitted ? (
                <div className="bg-[#0f172a]/90 backdrop-blur-xl rounded-[32px] p-8 md:p-10 border border-slate-800/50 shadow-2xl">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="text-left space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Delivery Email</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" />
                        <input required type="email" placeholder="you@example.com" className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                      </div>
                    </div>
                    <div className="text-left space-y-2">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">LinkedIn URL</label>
                      <div className="relative group">
                        <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400" />
                        <input required type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-12 pr-4 py-4 text-white outline-none focus:ring-2 focus:ring-indigo-500/50" onChange={(e) => setFormData({...formData, linkedinUrl: e.target.value})} />
                      </div>
                    </div>
                    <button disabled={loading} type="submit" className="w-full group bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2">
                      {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : <>Generate Resume <ArrowRight size={18}/></>}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-slate-900/40 border border-indigo-500/30 backdrop-blur-xl p-10 rounded-[32px] text-left">
                  <div className="flex justify-between items-end mb-4">
                    <h3 className="text-xl font-bold text-white">AI Engine Active</h3>
                    <span className="text-indigo-400 font-mono font-bold text-lg">{progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-8">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <div className="space-y-4">
                    {["Extracting Profile Data", "AI Keyword Analysis", "Formatting PDF"].map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${progress > (i*33) ? "bg-emerald-500 border-emerald-500" : "border-slate-700"}`}>
                          {progress > (i*33) && <CheckCircle2 size={12} className="text-white" />}
                        </div>
                        <span className={`text-sm ${progress > (i*33) ? "text-slate-200" : "text-slate-500"}`}>{step}</span>
                      </div>
                    ))}
                  </div>
                  {progress === 100 && (
                    <div className="mt-8 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-emerald-400 text-xs text-center">
                      Success! We'll email your resume to {formData.email} shortly.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Dashboard View */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold text-white">Request History</h2>
              <button onClick={fetchRequests} className="text-sm text-indigo-400 hover:text-indigo-300">Refresh Data</button>
            </div>
            
            <div className="grid gap-4">
              {requests.length > 0 ? requests.map((req, i) => (
                <div key={i} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-slate-700 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{req.email}</h4>
                      <p className="text-slate-500 text-xs truncate max-w-xs">{req.linkedinUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden md:block">
                      <p className="text-slate-500 text-[10px] uppercase tracking-widest mb-1">Date</p>
                      <p className="text-slate-300 text-sm">{new Date(req.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                    {/* Updated Status Button */}
                    <button 
                      onClick={() => markAsSent(req._id)}
                      disabled={req.status === 'Sent'}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 transition-all ${
                        req.status === 'Sent' 
                        ? "bg-emerald-500/10 text-emerald-400 cursor-default" 
                        : "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 active:scale-95"
                      }`}
                    >
                      {req.status === 'Sent' ? <Send size={12}/> : <Clock size={12}/>}
                      {req.status === 'Sent' ? 'Completed' : 'Mark as Sent'}
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800 text-slate-500">
                  No requests found yet. Submit your first one!
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- Final Enhanced Footer --- */}
        <footer className="relative z-10 mt-24 border-t border-slate-800/50 bg-slate-900/60 backdrop-blur-2xl">
          <div className="max-w-7xl mx-auto px-8 py-16">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              
              <div className="flex flex-col items-center lg:items-start gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-indigo-500 rounded-full blur opacity-30 animate-pulse"></div>
                    <img 
                      src="https://github.com/sourabh0011.png" 
                      alt="Sourabh Sharma" 
                      className="relative w-16 h-16 rounded-full border-2 border-slate-700 object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="text-xl font-bold text-white tracking-tight">Sourabh Sharma</h4>
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-widest">
                      <Sparkles size={12} /> MERN Developer
                    </div>
                  </div>
                </div>

                {/* YouTube Stats Card */}
                <a 
                  href="https://github.com/sourabh0011" 
                  target="_blank"
                  className="group relative p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-red-500/50 transition-all duration-500 overflow-hidden w-full max-w-[280px]"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg className="w-12 h-12 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </div>
                  <div className="relative z-10 flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                       <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Youtube: YCYC</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-lg font-bold text-white">11.1K+</p>
                        <p className="text-[10px] text-slate-500 uppercase">Subscribers</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-white">1M+</p>
                        <p className="text-[10px] text-slate-500 uppercase">Total Views</p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>

              <div className="flex flex-col items-center gap-6">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setShowWorkflow(true)}
                    className="px-6 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-sm font-medium hover:bg-slate-700 transition-all"
                  >
                    Workflow
                  </button>
                  <a 
                    href="https://github.com/sourabh0011/Resume-Genie" 
                    className="px-6 py-2 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium hover:bg-indigo-600/20 transition-all"
                  >
                    Source Code
                  </a>
                </div>
                <p className="text-slate-500 text-sm text-center max-w-[300px] leading-relaxed">
                  Built for the community. Open source. Optimized for results.
                </p>
              </div>

              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="flex gap-4">
                   <a href="https://www.linkedin.com/in/sourabh-sharmaa/" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-pink-500 hover:border-pink-500/50 transition-all">
                     <Linkedin size={20} />
                   </a>
                   <a href="#" className="p-3 rounded-xl bg-white/5 border border-white/10 hover:text-indigo-500 hover:border-indigo-500/50 transition-all">
                     <ArrowRight size={20} />
                   </a>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.3em] mb-1 font-bold">&copy; 2025 LIMITLESS AI</p>
                  <p className="text-xs text-slate-500 font-medium">Crafted with precision by Sourabh</p>
                </div>
              </div>

            </div>
          </div>
        </footer>

        {/* --- Workflow Modal --- */}
        {showWorkflow && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[32px] p-8 md:p-12 shadow-3xl overflow-hidden">
              <button 
                onClick={() => setShowWorkflow(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                <Sparkles className="text-indigo-400" /> The LimitLess Workflow
              </h2>

              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-[2px] bg-slate-800"></div>
                {[
                  { title: "Profile Analysis", desc: "Our system safely captures your LinkedIn professional data and verifies credentials.", icon: <Linkedin size={14}/> },
                  { title: "Claude AI Optimization", desc: "Claude 3.5 Sonnet analyzes your experience and suggests high-impact keywords.", icon: <Sparkles size={14}/> },
                  { title: "ATS Formatting", desc: "Data is mapped to a high-conversion, recruiter-approved PDF template.", icon: <ShieldCheck size={14}/> },
                  { title: "Secure Delivery", desc: "The finalized resume is delivered straight to your inbox.", icon: <CheckCircle2 size={14}/> }
                ].map((step, i) => (
                  <div key={i} className="relative pl-12 group">
                    <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-indigo-400 group-hover:border-indigo-500 transition-colors">
                      {step.icon}
                    </div>
                    <h4 className="text-white font-bold mb-1">{step.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setShowWorkflow(false)}
                className="mt-10 w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all"
              >
                Got it!
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeGenie;