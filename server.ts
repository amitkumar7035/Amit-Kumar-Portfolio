import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '25mb' }));

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

// 1. MULTI-TURN CHATBOT WITH GOOGLE SEARCH GROUNDING & AUTOMATIC FALLBACK
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { messages = [] } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid messages array is required' });
    }

    // Format messages for Google GenAI SDK contents structure
    const contents = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content || '' }],
    }));

    const lastUserQuery = messages.filter((m) => m.role === 'user').slice(-1)[0]?.content || '';

    let reply = '';
    let searchSources: Array<{ title: string; url: string }> = [];
    let succeeded = false;

    // STEP A: Try with Google Search Grounding across candidate models
    for (const modelName of CANDIDATE_CHAT_MODELS) {
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
        // If Google Search tool hits quota limit (429) or high demand, proceed to try without search tool
        console.warn(`Model ${modelName} with search grounding encountered error:`, err?.status || err?.message);
      }
    }

    // STEP B: If search tool calls were rate-limited or failed, retry without search tool
    if (!succeeded) {
      for (const modelName of CANDIDATE_CHAT_MODELS) {
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
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} without search encountered error:`, err?.status || err?.message);
        }
      }
    }

    // STEP C: If all online API quotas are exhausted, provide rich portfolio answer
    if (!succeeded || !reply) {
      reply = generatePortfolioFallback(lastUserQuery);
    }

    res.json({
      reply,
      sources: searchSources,
    });
  } catch (err: any) {
    console.error('Gemini chat outer error:', err);
    // Even on unexpected error, return a helpful portfolio answer
    const fallbackAnswer = generatePortfolioFallback('about amit kumar');
    res.json({
      reply: fallbackAnswer,
      sources: [],
    });
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

// START SERVER WITH VITE MIDDLEWARE IN DEV OR STATIC SERVING IN PROD
async function startServer() {
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
