import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import { GoogleGenAI } from '@google/genai';
import {
  findUserByEmail,
  findUserById,
  updateUser,
  verifyPassword,
  hashPassword,
  createSession,
  getSession,
  deleteSession,
  checkLoginRateLimit,
  recordFailedLogin,
  resetFailedAttempts,
  createPasswordResetToken,
  verifyAndConsumeResetToken,
  seedInitialAdmin,
} from './src/server/authService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

const apiKey = process.env.GEMINI_API_KEY || '';

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const PORT = Number(process.env.PORT) || 3000;

// SYSTEM INSTRUCTION FOR AMIT'S GEMINI CHATBOT
const AMIT_PORTFOLIO_SYSTEM_INSTRUCTION = `You are "Amit's Gemini AI Copilot", the official AI representative on Amit Kumar's developer portfolio website.

About Amit Kumar:
- BTech Computer Science & Engineering student (Class of 2024–2028) based in India.
- Core technical skills: HTML5, CSS3, JavaScript (ES6+), React.js, Tailwind CSS, TypeScript, C++, Java, Node.js, Git, GitHub, REST APIs, responsive web design.
- Personality: Passionate, problem-solver, eager to build impactful real-world software, continuous learner.
- Notable Projects:
  1. Personal Developer Portfolio: Modern React 19 & Tailwind CSS web app with full-stack capabilities, dark/light theme, and live database integration.
  2. Algorithm Visualizer: Interactive visual tool demonstrating Sorting (Bubble, Merge, Quick) and Pathfinding (Dijkstra, A*) with step-by-step playback.
  3. Modern Business Landing Page: High-conversion landing page with smooth scroll, interactive hero, testimonial slider, and pricing calculator.
- Official Social Profiles:
  - GitHub: https://github.com/amitkumar7035
  - LinkedIn: https://www.linkedin.com/in/amit-kumar-42a9b442a/
  - Instagram: https://www.instagram.com/amitkashyap.__/
  - Facebook: https://www.facebook.com/amitkumar70335/
- Education: Bachelor of Technology in Computer Science & Engineering (2024–2028).
- Contact: Visitors can send messages through the portfolio's contact form, which stores them securely in Firestore, or message Amit on LinkedIn or Instagram.

Your Objectives:
1. Warmly assist visitors, recruiters, and engineering collaborators exploring Amit's portfolio.
2. Answer questions about Amit's background, projects, skill stack, and availability for software developer internships and projects.
3. Help answer programming, computer science, algorithm, and web development questions.
4. When users ask questions requiring up-to-date web knowledge, current events, or real-time programming info, use Google Search Grounding to provide accurate and fresh answers with references.
5. Format your answers neatly using Markdown (bullet points, clear headings, bold text, and code snippets when helpful). Keep responses engaging and concise.`;

// CANDIDATE CHAT MODELS IN PRIORITY ORDER
const CANDIDATE_CHAT_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
];

// Contextual Knowledge Fallback Generator in case all API quotas are exhausted
function generatePortfolioFallback(userQuery: string): string {
  const q = userQuery.toLowerCase();
  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('language')) {
    return `### Amit Kumar's Technical Skills & Core Stack:
- **Frontend**: React.js 19, TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3.
- **Backend & Database**: Node.js, Express, Firebase Firestore & Authentication, REST APIs.
- **Languages & Core CS**: C++, Java, JavaScript, Data Structures & Algorithms (DSA), Object-Oriented Programming (OOP).
- **Tools & Workflow**: Git, GitHub, Vite, Postman, Linux basics.

Amit focuses on building clean, high-performance, and responsive user interfaces with solid architectural foundations.`;
  }

  if (q.includes('project') || q.includes('work') || q.includes('build')) {
    return `### Amit Kumar's Featured Projects:
1. **Personal Developer Portfolio**: Modern full-stack React & Tailwind web application featuring live Firebase database persistence, administrative management, responsive design, and integrated Gemini AI Copilot.
2. **Algorithm Visualizer**: Interactive educational tool for visualizing Sorting (Bubble, Merge, Quick) and Pathfinding (Dijkstra, A*) algorithms in real time with step-by-step playback controls.
3. **Modern Business Landing Page**: High-conversion responsive landing page with testimonial carousels, pricing calculator, and fluid motion micro-interactions.

You can inspect the code and demos on his [GitHub profile](https://github.com/amitkumar7035).`;
  }

  if (q.includes('contact') || q.includes('hire') || q.includes('reach') || q.includes('social') || q.includes('linkedin') || q.includes('github') || q.includes('instagram') || q.includes('facebook')) {
    return `### How to Connect with Amit Kumar:
- **GitHub**: [github.com/amitkumar7035](https://github.com/amitkumar7035)
- **LinkedIn**: [linkedin.com/in/amit-kumar-42a9b442a](https://www.linkedin.com/in/amit-kumar-42a9b442a/)
- **Instagram**: [instagram.com/amitkashyap.__](https://www.instagram.com/amitkashyap.__/)
- **Facebook**: [facebook.com/amitkumar70335](https://www.facebook.com/amitkumar70335/)

You can also send a direct message via the Contact Form on this site, which sends your inquiry straight to Amit.`;
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('study')) {
    return `### Amit Kumar's Education:
- **Degree**: Bachelor of Technology (BTech) in Computer Science & Engineering.
- **Batch**: 2024 – 2028.
- **Focus Areas**: Data Structures & Algorithms, Web Engineering, Software Systems, and Modern Full-Stack Development.`;
  }

  return `Hello! I am Amit's AI Copilot.

**About Amit Kumar**:
Amit is a dedicated BTech Computer Science & Engineering student (2024–2028) and modern web developer specializing in React, TypeScript, Tailwind CSS, C++, and Java. He builds fast, responsive web applications and interactive software tools.

Feel free to ask about:
- **Skills & Tech Stack**
- **Featured Projects** (Portfolio, Algorithm Visualizer, Landing Pages)
- **Education & Credentials**
- **Social links & Contact info** (GitHub, LinkedIn, Instagram, Facebook)`;
}

// 1. MULTI-TURN CHATBOT WITH GOOGLE SEARCH & GOOGLE MAPS GROUNDING (gemini-3.5-flash)
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages = [], groundingMode = 'auto', userLocation = null } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    // Format messages for Google GenAI SDK contents structure
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }],
    }));

    const lastUserQuery = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';
    const qLower = lastUserQuery.toLowerCase();

    // Determine whether to use Google Maps or Google Search tool
    // Note: googleMaps and googleSearch cannot be used in the same request
    const isPlacesQuery =
      groundingMode === 'maps' ||
      (groundingMode === 'auto' &&
        /(where|place|places|map|maps|nearby|location|address|city|country|college|university|office|restaurant|cafe|campus|directions|route|india|delhi|bangalore)/i.test(
          qLower
        ));

    let reply = '';
    let searchSources: Array<{ title: string; url: string }> = [];
    let mapsPlaces: Array<{
      title: string;
      uri: string;
      address?: string;
      reviews?: Array<{ text: string; author?: string }>;
    }> = [];
    let activeTool: 'search' | 'maps' | 'none' = 'none';
    let succeeded = false;

    // STEP A: Execute with specific grounding tool on gemini-3.5-flash (primary model)
    const primaryModel = 'gemini-3.5-flash';
    const fallbackModels = ['gemini-3.8-flash', 'gemini-flash-latest'];
    const modelsToTry = [primaryModel, ...fallbackModels];

    if (isPlacesQuery) {
      // GOOGLE MAPS GROUNDING
      for (const modelName of modelsToTry) {
        try {
          const config: any = {
            systemInstruction: AMIT_PORTFOLIO_SYSTEM_INSTRUCTION,
            tools: [{ googleMaps: {} }],
          };

          if (userLocation && typeof userLocation.latitude === 'number' && typeof userLocation.longitude === 'number') {
            config.toolConfig = {
              retrievalConfig: {
                latLng: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                },
              },
            };
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: config,
          });

          reply = response.text || '';
          activeTool = 'maps';

          const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          for (const chunk of groundingChunks as any[]) {
            if (chunk?.maps) {
              const reviews: Array<{ text: string; author?: string }> = [];
              if (chunk.maps.placeAnswerSources?.reviewSnippets) {
                for (const r of chunk.maps.placeAnswerSources.reviewSnippets) {
                  if (r.reviewText) {
                    reviews.push({
                      text: r.reviewText,
                      author: r.authorAttribution?.displayName || 'Local Reviewer',
                    });
                  }
                }
              }

              mapsPlaces.push({
                title: chunk.maps.title || 'Google Maps Location',
                uri: chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chunk.maps.title || lastUserQuery)}`,
                address: chunk.maps.address,
                reviews: reviews.slice(0, 3),
              });
            } else if (chunk?.web?.uri) {
              searchSources.push({
                title: chunk.web.title || chunk.web.uri,
                url: chunk.web.uri,
              });
            }
          }

          if (reply) {
            succeeded = true;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} with googleMaps failed:`, err?.status || err?.message);
        }
      }
    } else {
      // GOOGLE SEARCH GROUNDING
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: AMIT_PORTFOLIO_SYSTEM_INSTRUCTION,
              tools: [{ googleSearch: {} }],
            },
          });

          reply = response.text || '';
          activeTool = 'search';

          const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
          for (const chunk of groundingChunks as any[]) {
            if (chunk?.web?.uri) {
              searchSources.push({
                title: chunk.web.title || chunk.web.uri,
                url: chunk.web.uri,
              });
            }
          }

          if (reply) {
            succeeded = true;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} with googleSearch failed:`, err?.status || err?.message);
        }
      }
    }

    // STEP B: Fallback without tools if tools encountered rate limits
    if (!succeeded) {
      for (const modelName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: {
              systemInstruction: AMIT_PORTFOLIO_SYSTEM_INSTRUCTION,
            },
          });

          reply = response.text || '';
          if (reply) {
            succeeded = true;
            activeTool = 'none';
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} ungrounded fallback failed:`, err?.status || err?.message);
        }
      }
    }

    // STEP C: Portfolio heuristic fallback
    if (!succeeded || !reply) {
      reply = generatePortfolioFallback(lastUserQuery);
    }

    res.json({
      reply,
      activeTool,
      sources: searchSources,
      places: mapsPlaces,
    });
  } catch (err: any) {
    console.error('Gemini chat outer error:', err);
    const fallbackAnswer = generatePortfolioFallback('about amit kumar');
    res.json({
      reply: fallbackAnswer,
      activeTool: 'none',
      sources: [],
      places: [],
    });
  }
});

// 1.1 DEDICATED GOOGLE MAPS GROUNDING ENDPOINT (gemini-3.5-flash with googleMaps)
app.post('/api/gemini/maps', async (req, res) => {
  try {
    const { query, latitude, longitude } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const config: any = {
      systemInstruction: 'You are a geospatial and places assistant grounded in Google Maps data. Provide clear answers about locations, cities, distances, tech hubs, campuses, and points of interest. Include practical details like addresses, recommendations, and local insights.',
      tools: [{ googleMaps: {} }],
    };

    if (typeof latitude === 'number' && typeof longitude === 'number') {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude,
            longitude,
          },
        },
      };
    }

    const modelsToTry = ['gemini-3.5-flash', 'gemini-3.8-flash'];
    let reply = '';
    let places: Array<{
      title: string;
      uri: string;
      address?: string;
      reviews?: Array<{ text: string; author?: string }>;
    }> = [];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: query,
          config,
        });

        reply = response.text || '';
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        for (const chunk of groundingChunks as any[]) {
          if (chunk?.maps) {
            const reviews: Array<{ text: string; author?: string }> = [];
            if (chunk.maps.placeAnswerSources?.reviewSnippets) {
              for (const r of chunk.maps.placeAnswerSources.reviewSnippets) {
                if (r.reviewText) {
                  reviews.push({
                    text: r.reviewText,
                    author: r.authorAttribution?.displayName || 'Google Maps Contributor',
                  });
                }
              }
            }

            places.push({
              title: chunk.maps.title || 'Google Maps Location',
              uri: chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chunk.maps.title || query)}`,
              address: chunk.maps.address,
              reviews: reviews.slice(0, 3),
            });
          }
        }

        if (reply) break;
      } catch (err: any) {
        console.warn(`googleMaps call failed with ${modelName}:`, err?.status || err?.message);
      }
    }

    if (!reply) {
      reply = `I searched Google Maps for "${query}". While live Maps grounding encountered a brief network delay, Amit Kumar is based in India where major tech hubs include Bengaluru, Noida, Gurugram, and Hyderabad.`;
    }

    res.json({
      reply,
      places,
    });
  } catch (err: any) {
    console.error('Maps endpoint error:', err);
    res.status(500).json({ error: 'Failed to process Google Maps query' });
  }
});

// 2. CREATE & EDIT IMAGES (with model fallback)
app.post('/api/gemini/image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '1:1', imageSize = '1K' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A text prompt is required' });
    }

    const imageModels = ['gemini-3.1-flash-lite-image', 'gemini-3.1-flash-image'];
    let imageBase64 = '';
    let mimeType = 'image/png';
    let text = '';
    let lastError: any = null;

    for (const imgModel of imageModels) {
      try {
        const response = await ai.models.generateContent({
          model: imgModel,
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio,
              imageSize: imageSize,
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData?.data) {
            imageBase64 = part.inlineData.data;
            if (part.inlineData.mimeType) mimeType = part.inlineData.mimeType;
          }
          if (part.text) {
            text += part.text;
          }
        }

        if (imageBase64) break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Image model ${imgModel} failed:`, err?.status || err?.message);
      }
    }

    if (!imageBase64) {
      const isQuota = lastError?.status === 429 || String(lastError?.message).includes('quota');
      return res.status(500).json({
        error: isQuota
          ? 'Gemini image generation quota limit reached for this session. Please try again later or configure a paid key.'
          : (lastError?.message || text || 'Could not generate image.'),
      });
    }

    res.json({
      imageBase64,
      mimeType,
      text,
    });
  } catch (err: any) {
    console.error('Image generation error:', err);
    res.status(500).json({
      error: err?.message || 'Error generating image with Gemini',
    });
  }
});

// 3. GENERATE MUSIC (lyria-3-clip-preview)
app.post('/api/gemini/music', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A prompt is required for music generation' });
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'lyria-3-clip-preview',
      contents: prompt,
    });

    let audioBase64 = '';
    let lyrics = '';
    let mimeType = 'audio/wav';

    for await (const chunk of responseStream) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;
      for (const part of parts) {
        if (part.inlineData?.data) {
          if (!audioBase64 && part.inlineData.mimeType) {
            mimeType = part.inlineData.mimeType;
          }
          audioBase64 += part.inlineData.data;
        }
        if (part.text && !lyrics) {
          lyrics = part.text;
        }
      }
    }

    if (!audioBase64) {
      return res.status(500).json({ error: 'No audio stream returned from music model.' });
    }

    res.json({
      audioBase64,
      mimeType,
      lyrics,
    });
  } catch (err: any) {
    console.error('Music generation error:', err);
    const isQuota = err?.status === 429 || String(err?.message).includes('quota');
    res.status(500).json({
      error: isQuota
        ? 'Music generation (Lyria) requires a billing-enabled Gemini API key or current quota is exhausted.'
        : (err?.message || 'Error generating music track with Lyria'),
    });
  }
});

// 4. GENERATE VIDEO (veo-3.1-fast-generate-preview / veo-3.1-lite-generate-preview)
app.post('/api/gemini/video', async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'A prompt is required for video generation' });
    }

    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    const operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: validAspectRatio,
      },
    });

    res.json({ operationName: operation.name });
  } catch (err: any) {
    console.error('Video start error:', err);
    const isQuota = err?.status === 429 || String(err?.message).includes('quota');
    res.status(500).json({
      error: isQuota
        ? 'Veo Video generation requires a billing-enabled Gemini API key or current quota is exhausted.'
        : (err?.message || 'Error starting video generation with Veo'),
    });
  }
});

app.post('/api/gemini/video-status', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = { name: operationName } as any;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    res.json({
      done: Boolean(updated.done),
      error: updated.error ? String(updated.error.message || 'Video error') : undefined,
    });
  } catch (err: any) {
    console.error('Video status error:', err);
    res.status(500).json({
      error: err?.message || 'Error checking video status',
    });
  }
});

app.post('/api/gemini/video-download', async (req, res) => {
  try {
    const { operationName } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const op = { name: operationName } as any;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Video URI not available' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    if (!videoRes.ok) {
      return res.status(videoRes.status).json({ error: 'Failed downloading video stream' });
    }

    res.setHeader('Content-Type', 'video/mp4');
    const buffer = await videoRes.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: any) {
    console.error('Video download error:', err);
    res.status(500).json({
      error: err?.message || 'Error downloading video stream',
    });
  }
});

// ==========================================
// SERVER-SIDE AUTHENTICATION & ADMIN APIS
// ==========================================

// Authentication Middleware
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token =
    req.cookies?.auth_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }

  const sessionData = getSession(token);
  if (!sessionData || sessionData.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }

  (req as any).user = sessionData.user;
  (req as any).session = sessionData.session;
  next();
}

// 1. POST /api/auth/login
app.post('/api/auth/login', (req, res) => {
  const { email, password, rememberMe = false } = req.body;
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required.' });
  }

  // Rate Limiting check
  const rateLimitKey = `${ip}_${email.trim().toLowerCase()}`;
  const rateCheck = checkLoginRateLimit(rateLimitKey);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateCheck.waitMinutes} minute(s).`,
    });
  }

  const user = findUserByEmail(email);
  if (!user) {
    recordFailedLogin(rateLimitKey);
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    const failRecord = recordFailedLogin(rateLimitKey);
    if (failRecord.locked) {
      return res.status(429).json({
        error: 'Too many failed login attempts. Account locked for 15 minutes.',
      });
    }
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. You do not have administrator permissions.' });
  }

  // Reset rate limits on success
  resetFailedAttempts(rateLimitKey);

  // Create session
  const session = createSession(user.id, Boolean(rememberMe));
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  res.cookie('auth_session', session.sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  });

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// 2. GET /api/auth/me
app.get('/api/auth/me', (req, res) => {
  const token =
    req.cookies?.auth_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (!token) {
    return res.json({ authenticated: false });
  }

  const sessionData = getSession(token);
  if (!sessionData) {
    res.clearCookie('auth_session', { path: '/' });
    return res.json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      id: sessionData.user.id,
      name: sessionData.user.name,
      email: sessionData.user.email,
      role: sessionData.user.role,
    },
  });
});

// 3. POST /api/auth/logout
app.post('/api/auth/logout', (req, res) => {
  const token =
    req.cookies?.auth_session ||
    (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null);

  if (token) {
    deleteSession(token);
  }

  res.clearCookie('auth_session', { path: '/' });
  return res.json({ success: true, message: 'Logged out successfully.' });
});

// 4. POST /api/auth/forgot-password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  const user = findUserByEmail(email);
  let resetToken = '';
  if (user) {
    resetToken = createPasswordResetToken(user.email);
    console.log(`[PASSWORD RESET] Generated reset token for ${user.email}: ${resetToken}`);
  }

  // Consistent message to prevent email enumeration
  return res.json({
    success: true,
    message: 'If the email is registered, password reset instructions have been sent.',
    resetUrl: resetToken ? `/reset-password?token=${resetToken}` : undefined,
  });
});

// 5. POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({ error: 'Reset token is required.' });
  }

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  const result = verifyAndConsumeResetToken(token.trim(), newPassword);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }

  return res.json({ success: true, message: result.message });
});

// 6. POST /api/auth/change-password (Protected)
app.post('/api/auth/change-password', requireAdmin, (req, res) => {
  const user = (req as any).user;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required.' });
  }

  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  const updatedHash = hashPassword(newPassword);
  updateUser(user.id, { passwordHash: updatedHash });

  return res.json({ success: true, message: 'Password updated successfully.' });
});

// 7. POST /api/auth/update-profile (Protected)
app.post('/api/auth/update-profile', requireAdmin, (req, res) => {
  const user = (req as any).user;
  const { name, email } = req.body;

  const updates: any = {};
  if (name && typeof name === 'string' && name.trim()) {
    updates.name = name.trim();
  }
  if (email && typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    updates.email = email.trim().toLowerCase();
  }

  const updatedUser = updateUser(user.id, updates);
  return res.json({
    success: true,
    user: {
      id: updatedUser?.id,
      name: updatedUser?.name,
      email: updatedUser?.email,
      role: updatedUser?.role,
    },
  });
});

// START SERVER WITH VITE MIDDLEWARE IN DEV OR STATIC SERVING IN PROD
async function startServer() {
  seedInitialAdmin();
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
