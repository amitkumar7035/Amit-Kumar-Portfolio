import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Send,
  User,
  Image as ImageIcon,
  Music,
  Video,
  Globe,
  Loader2,
  RefreshCw,
  ExternalLink,
  Play,
  Pause,
  Download,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Wand2,
  Sliders,
  ChevronRight
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: Array<{ title: string; url: string }>;
  timestamp: string;
}

interface GeminiStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'chat' | 'image' | 'music' | 'video';
}

export const GeminiStudioModal: React.FC<GeminiStudioModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'chat',
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'image' | 'music' | 'video'>(defaultTab);

  // Synchronize initial activeTab when opened with specific prop
  useEffect(() => {
    if (isOpen && defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // CHAT STATE
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **Amit's Gemini AI Copilot**, powered by Google Gemini 3.5 with live **Google Search Grounding**.\n\nAsk me anything about Amit's projects, tech stack, education, or feel free to ask general programming and web development questions!`,
      timestamp: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // IMAGE GENERATION STATE
  const [imagePrompt, setImagePrompt] = useState('');
  const [imageAspectRatio, setImageAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  // MUSIC GENERATION STATE
  const [musicPrompt, setMusicPrompt] = useState('');
  const [isMusicGenerating, setIsMusicGenerating] = useState(false);
  const [musicAudioUrl, setMusicAudioUrl] = useState<string | null>(null);
  const [musicError, setMusicError] = useState<string | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // VIDEO GENERATION STATE
  const [videoPrompt, setVideoPrompt] = useState('');
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isVideoGenerating, setIsVideoGenerating] = useState(false);
  const [videoStatusText, setVideoStatusText] = useState('');
  const [generatedVideoBlobUrl, setGeneratedVideoBlobUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // CHAT SEND HANDLER
  const handleSendChat = async (e?: React.FormEvent, promptOverride?: string) => {
    if (e) e.preventDefault();
    const promptToSend = promptOverride || chatInput.trim();
    if (!promptToSend || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setChatInput('');
    setIsChatLoading(true);
    setChatError(null);

    try {
      // Map history for server
      const payloadMessages = newHistory.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payloadMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to get Gemini response');
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'No response generated.',
        sources: data.sources || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setChatError(err.message || 'An error occurred during communication with Gemini.');
    } finally {
      setIsChatLoading(false);
    }
  };

  // IMAGE GENERATION HANDLER
  const handleGenerateImage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!imagePrompt.trim() || isImageGenerating) return;

    setIsImageGenerating(true);
    setImageError(null);

    try {
      const res = await fetch('/api/gemini/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt.trim(),
          aspectRatio: imageAspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      setGeneratedImage({
        base64: data.imageBase64,
        mimeType: data.mimeType || 'image/png',
      });
    } catch (err: any) {
      console.error('Image generation error:', err);
      setImageError(err.message || 'Failed to generate image. Please check API settings.');
    } finally {
      setIsImageGenerating(false);
    }
  };

  // MUSIC GENERATION HANDLER
  const handleGenerateMusic = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!musicPrompt.trim() || isMusicGenerating) return;

    setIsMusicGenerating(true);
    setMusicError(null);
    setMusicAudioUrl(null);
    setIsPlayingMusic(false);

    try {
      const res = await fetch('/api/gemini/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: musicPrompt.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate music clip');
      }

      // Convert base64 audio to object URL
      const binary = atob(data.audioBase64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
      const url = URL.createObjectURL(blob);
      setMusicAudioUrl(url);
    } catch (err: any) {
      console.error('Music error:', err);
      setMusicError(err.message || 'Failed to generate music audio.');
    } finally {
      setIsMusicGenerating(false);
    }
  };

  // VIDEO GENERATION HANDLER
  const handleGenerateVideo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!videoPrompt.trim() || isVideoGenerating) return;

    setIsVideoGenerating(true);
    setVideoError(null);
    setGeneratedVideoBlobUrl(null);
    setVideoStatusText('Submitting prompt to Veo 3...');

    try {
      // 1. Start generation
      const startRes = await fetch('/api/gemini/video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: videoPrompt.trim(),
          aspectRatio: videoAspectRatio,
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok) {
        throw new Error(startData.error || 'Failed to initiate Veo video operation');
      }

      const operationName = startData.operationName;
      setVideoStatusText('Rendering video frames with Veo (may take 1-2 minutes)...');

      // 2. Poll for completion
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60;

      while (!isDone && attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 6000));
        attempts++;
        setVideoStatusText(`Synthesizing motion & details (step ${attempts}/${maxAttempts})...`);

        const pollRes = await fetch('/api/gemini/video-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ operationName }),
        });

        const pollData = await pollRes.json();
        if (pollData.error) {
          throw new Error(pollData.error);
        }

        if (pollData.done) {
          isDone = true;
          break;
        }
      }

      if (!isDone) {
        throw new Error('Video generation timed out. Please try a simpler prompt.');
      }

      // 3. Download stream
      setVideoStatusText('Downloading finished video...');
      const dlRes = await fetch('/api/gemini/video-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operationName }),
      });

      if (!dlRes.ok) {
        throw new Error('Failed to download completed video stream');
      }

      const blob = await dlRes.blob();
      const videoUrl = URL.createObjectURL(blob);
      setGeneratedVideoBlobUrl(videoUrl);
      setVideoStatusText('Video generated successfully!');
    } catch (err: any) {
      console.error('Video error:', err);
      setVideoError(err.message || 'Veo video generation failed.');
    } finally {
      setIsVideoGenerating(false);
    }
  };

  const sampleChatPrompts = [
    "What are Amit's main web development skills?",
    "Tell me about Amit's Algorithm Visualizer project",
    "How can I contact Amit for an internship or project?",
    "Explain what React Server Components are with recent web data",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-4 flex flex-col h-[90vh] max-h-[820px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header with High-Visibility Top-Right X Close Button */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50/90 dark:bg-slate-950/85">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  Amit's Gemini AI Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  Gemini 3.5 &amp; Multimodal
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                Interactive chatbot with Google Search Grounding &amp; Creative Generative Studio
              </p>
            </div>
          </div>

          {/* Prominent Visible X Close Button */}
          <button
            type="button"
            onClick={onClose}
            title="Close Gemini AI Studio (Esc)"
            aria-label="Close Gemini AI modal"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-200 hover:bg-rose-600 dark:bg-slate-800 dark:hover:bg-rose-600 text-slate-700 dark:text-slate-200 hover:text-white dark:hover:text-white border-2 border-slate-300 dark:border-slate-700 hover:border-rose-500 shadow-md transition-all duration-200 cursor-pointer active:scale-95 group shrink-0 focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <X className="w-5 h-5 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
            <span className="text-xs font-bold hidden sm:inline">Close</span>
          </button>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-none py-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Gemini Chat &amp; Search</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('image')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'image'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Image Studio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('music')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'music'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Music (Lyria)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'video'
                ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>Video (Veo 3)</span>
          </button>
        </div>

        {/* TAB 1: GEMINI MULTI-TURN CHAT WITH SEARCH GROUNDING */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[88%] sm:max-w-[80%] ${
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                        : 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                    }`}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60'
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Google Search Grounding Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="pt-1 flex flex-wrap gap-1.5 items-center">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-cyan-500">
                          <Globe className="w-3 h-3" /> Grounded with Google:
                        </span>
                        {msg.sources.map((src, idx) => (
                          <a
                            key={idx}
                            href={src.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 transition-colors border border-cyan-500/20 truncate max-w-[180px]"
                          >
                            <span className="truncate">{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="text-[10px] font-mono text-slate-400 px-1">{msg.timestamp}</div>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 max-w-[80%] mr-auto">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-tl-none flex items-center gap-2 text-xs">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-500" />
                    <span>Gemini is synthesizing with live search data...</span>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{chatError}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-4 py-2 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider shrink-0 self-center">
                Suggested:
              </span>
              {sampleChatPrompts.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendChat(undefined, sample)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-500 border border-slate-200 dark:border-slate-700 text-xs whitespace-nowrap cursor-pointer transition-colors shadow-xs"
                >
                  {sample}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={handleSendChat}
              className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about Amit's background, projects, or any tech question..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm border border-transparent focus:border-cyan-500 focus:outline-none transition-colors"
                disabled={isChatLoading}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isChatLoading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all cursor-pointer shadow-md shadow-cyan-500/20"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: CREATE & EDIT IMAGES (gemini-3.1-flash-image) */}
        {activeTab === 'image' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Wand2 className="w-4 h-4 text-cyan-400" />
                  Text-to-Image Generation (gemini-3.1-flash-image)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Create high-quality custom visuals, UI mockups, or abstract wallpapers using Gemini's image model.
                </p>
              </div>

              <form onSubmit={handleGenerateImage} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                    Describe your image
                  </label>
                  <textarea
                    rows={3}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="e.g. Modern minimalist 3D developer workspace with dark cyan neon glow, laptop with code, isometric style, 4k detail"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Aspect Ratio:</span>
                    {(['1:1', '16:9', '9:16'] as const).map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setImageAspectRatio(ratio)}
                        className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                          imageAspectRatio === ratio
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={!imagePrompt.trim() || isImageGenerating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    {isImageGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Rendering...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {imageError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}

              {generatedImage && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Generated Artwork
                    </span>
                    <a
                      href={`data:${generatedImage.mimeType};base64,${generatedImage.base64}`}
                      download="gemini-generated-image.png"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-400 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center border border-slate-700">
                    <img
                      src={`data:${generatedImage.mimeType};base64,${generatedImage.base64}`}
                      alt="Gemini generated result"
                      className="max-h-[380px] w-auto object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: GENERATE MUSIC (lyria-3-clip-preview) */}
        {activeTab === 'music' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Music className="w-4 h-4 text-cyan-400" />
                  AI Music Generator (Lyria 3)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Generate 30-second soundtrack clips, atmospheric coding vibes, or ambient background music using Google Lyria.
                </p>
              </div>

              <form onSubmit={handleGenerateMusic} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                    Music style &amp; mood
                  </label>
                  <textarea
                    rows={3}
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    placeholder="e.g. Mellow lo-fi chillhop beat with electric piano, gentle rain sounds, and smooth bassline for late-night coding"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!musicPrompt.trim() || isMusicGenerating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    {isMusicGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Composing Track...</span>
                      </>
                    ) : (
                      <>
                        <Music className="w-4 h-4" />
                        <span>Generate Track (30s)</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {musicError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{musicError}</span>
                </div>
              )}

              {musicAudioUrl && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500 text-white flex items-center justify-center shadow-md">
                        <Music className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Generated Audio Track
                        </div>
                        <div className="text-[10px] text-cyan-400 font-mono">Lyria 3 Preview Clip</div>
                      </div>
                    </div>

                    <a
                      href={musicAudioUrl}
                      download="lyria-track.wav"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Save Audio</span>
                    </a>
                  </div>

                  <audio
                    ref={audioRef}
                    src={musicAudioUrl}
                    controls
                    className="w-full rounded-lg"
                    onPlay={() => setIsPlayingMusic(true)}
                    onPause={() => setIsPlayingMusic(false)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: GENERATE VIDEO (veo-3.1-fast-generate-preview) */}
        {activeTab === 'video' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            <div className="max-w-2xl mx-auto space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-cyan-400" />
                  AI Video Generator (Veo 3)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Synthesize high-definition motion video from descriptive text prompts using Google Veo 3.
                </p>
              </div>

              <form onSubmit={handleGenerateVideo} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 uppercase mb-1.5">
                    Video prompt
                  </label>
                  <textarea
                    rows={3}
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="e.g. Cinematic camera pan of glowing cyan neural network circuits flowing through a sleek futuristic microchip, 4k slow motion"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-xs sm:text-sm border border-slate-200 dark:border-slate-700 focus:border-cyan-500 focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400">Orientation:</span>
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('16:9')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        videoAspectRatio === '16:9'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      16:9 (Landscape)
                    </button>
                    <button
                      type="button"
                      onClick={() => setVideoAspectRatio('9:16')}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                        videoAspectRatio === '9:16'
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      9:16 (Portrait)
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={!videoPrompt.trim() || isVideoGenerating}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs sm:text-sm hover:opacity-90 disabled:opacity-50 active:scale-95 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
                  >
                    {isVideoGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Rendering with Veo...</span>
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4" />
                        <span>Generate Video</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {isVideoGenerating && (
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 animate-spin text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Processing video generation
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      {videoStatusText}
                    </div>
                  </div>
                </div>
              )}

              {videoError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{videoError}</span>
                </div>
              )}

              {generatedVideoBlobUrl && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Completed Veo Video
                    </span>
                    <a
                      href={generatedVideoBlobUrl}
                      download="veo-video.mp4"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-500 hover:text-cyan-400 font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download MP4</span>
                    </a>
                  </div>
                  <div className="rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-700">
                    <video
                      src={generatedVideoBlobUrl}
                      controls
                      autoPlay
                      loop
                      className="max-h-[380px] w-auto"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/70 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Powered by Google Gemini 3.5 &amp; Google Search Grounding</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs cursor-pointer active:scale-95 transition-all shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
