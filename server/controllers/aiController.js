import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from 'axios'
import {v2 as cloudinary} from 'cloudinary'
import FormData from "form-data";
import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
 apiKey: process.env.GROQ_API_KEY,
 baseURL: "https://api.groq.com/openai/v1"
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached, upgrade the plan to continue..",
      });
    }


    const response = await AI.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.7,
  max_tokens: Number(length) || 800,
});

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content},'article')`;
    if(plan !== 'premium'){
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        })
    }

    res.json({success: true, content})
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached, upgrade the plan to continue..",
      });
    }


    const response = await AI.chat.completions.create({
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
  temperature: 0.7,
  max_tokens: 800,
});

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content},'blog-title')`;
    if(plan !== 'premium'){
        await clerkClient.users.updateUserMetadata(userId, {
            privateMetadata: {
                free_usage: free_usage + 1
            }
        })
    }

    res.json({success: true, content})
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    const formData = new FormData()
    formData.append('prompt', prompt)
    
    const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', formData, {
      headers: {'x-api-key': process.env.CLIPDROP_API_KEY,...formData.getHeaders()},
      responseType:'arraybuffer',
    })

    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    const {secure_url} = await cloudinary.uploader.upload(base64Image);


    await sql` INSERT INTO creations (user_id, prompt, content, type, publish) VALUES (${userId}, ${prompt}, ${secure_url},'image', ${publish ?? false})`;

    res.json({success: true,content: secure_url})
  } catch (error) {
    console.error("❌ generateImage Error:", error?.response?.data || error.message || error);
res.status(500).json({ success: false, message: error.message });

  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    const {secure_url} = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: 'background_removal',
          background_removal: 'remove_the_background'
        }
      ]
    });


    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background from image', ${secure_url},'image')`;

    res.json({success: true,content: secure_url})
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};


export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const  image  = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }
    const {public_id} = await cloudinary.uploader.upload(image.path);

    const image_url = cloudinary.url(public_id, {
      transformation: [{effect: `gen_remove:${object}`}],
      resource_type: 'image'
    })

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Removed ${object} from image`}, ${image_url},'image')`;

    res.json({success: true, content: image_url})
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};


export const resumeReview = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions",
      });
    }

    if (resume.size > 10 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds.."
      });
    }

    // Read PDF
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `
Review the following resume and provide:

1. Strengths
2. Weaknesses
3. Suggestions for improvement
4. Overall rating out of 10

Resume Content:
${pdfData.text}
`;

    // GROQ AI REQUEST
    const response = await AI.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    res.json({
      success: true,
      content
    });

  } catch (error) {

    console.log("Resume Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const chatBot = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { messages } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Usage limit reached for today.",
      });
    }

    if (!messages || !Array.isArray(messages)) {
      return res.json({
        success: false,
        message: "Invalid messages format",
      });
    }

    // SYSTEM PROMPT FOR PRODUCT ASSISTANT
    const systemPrompt = {
      role: "system",
      content: `
You are NeuroGen AI assistant.

You ONLY help users understand and use THIS platform.

Platform Capabilities:
- AI content generation
- Image generation
- Resume reviewing
- Dashboard-based tools

Your job:
- Guide users step-by-step
- Explain features of THIS platform
- Suggest what they can do next

STRICT RULES:
- NEVER behave like general ChatGPT
- ALWAYS stay within platform context
- If question is unrelated → politely redirect to platform usage

OUTPUT FORMAT (STRICT JSON):
{
  "type": "text | list | action",
  "title": "",
  "content": "",
  "points": [],
  "action": {
    "label": "",
    "target": ""
  }
}
`
    };

    // KEYWORD INTERCEPTION
    const lastMessage = messages[messages.length - 1].content.toLowerCase();

    // 1. How to use / How this works
    if (lastMessage.includes("how to use") || lastMessage.includes("how this works")) {
      return res.json({
        success: true,
        reply: {
          type: "list",
          title: "How to Use NeuroGen AI",
          content: "Follow these steps to get started:",
          points: [
            "Go to Dashboard to access all tools",
            "Select a tool (Text, Image, Resume, etc.)",
            "Enter your input and generate results",
            "Download or reuse your content"
          ],
          action: {
            label: "Go to Dashboard",
            target: "/ai"
          }
        }
      });
    }

    // 2. Features / Tools
    if (lastMessage.includes("features") || lastMessage.includes("tools")) {
      return res.json({
        success: true,
        reply: {
          type: "list",
          title: "NeuroGen AI Features",
          content: "Here’s what you can do:",
          points: [
            "AI Content Generator",
            "AI Image Generator",
            "Resume Reviewer",
            "Smart Dashboard",
            "History & Saved Content",
            "Fast AI responses"
          ],
          action: {
            label: "Explore Tools",
            target: "/ai"
          }
        }
      });
    }

    // 4. Image Generator
    if (lastMessage.includes("image")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "AI Image Generator",
          content: "Create stunning images from text prompts.",
          action: {
            label: "Start Generating",
            target: "/ai/generate-images"
          }
        }
      });
    }

    // 5. Resume Reviewer
    if (lastMessage.includes("resume")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "Resume Reviewer",
          content: "Upload your resume and get AI feedback instantly.",
          action: {
            label: "Review Resume",
            target: "/ai/review-resume"
          }
        }
      });
    }

    // 6. Article / Writing
    if (lastMessage.includes("article") || lastMessage.includes("write")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "AI Article Writer",
          content: "Generate high-quality, engaging articles on any topic.",
          action: {
            label: "Write Article",
            target: "/ai/write-article"
          }
        }
      });
    }

    // 7. Blog / Title
    if (lastMessage.includes("blog") || lastMessage.includes("title")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "Blog Title Generator",
          content: "Find the perfect, catchy title for your blog posts.",
          action: {
            label: "Generate Titles",
            target: "/ai/blog-titles"
          }
        }
      });
    }

    // 8. Background Removal
    if (lastMessage.includes("background")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "Background Removal",
          content: "Effortlessly remove backgrounds from your images.",
          action: {
            label: "Remove Background",
            target: "/ai/remove-background"
          }
        }
      });
    }

    // 9. Object Removal
    if (lastMessage.includes("object")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "Object Removal",
          content: "Remove unwanted objects from your images seamlessly.",
          action: {
            label: "Remove Objects",
            target: "/ai/remove-object"
          }
        }
      });
    }

    // 10. Community
    if (lastMessage.includes("community")) {
      return res.json({
        success: true,
        reply: {
          type: "action",
          title: "Community",
          content: "Explore and share AI-generated content with others.",
          action: {
            label: "Go to Community",
            target: "/ai/community"
          }
        }
      });
    }

    // Filter out existing system messages and add our strict one
    const userMessages = messages.filter(m => m.role !== 'system').slice(-5);
    const finalMessages = [systemPrompt, ...userMessages];

    // SANITIZE MESSAGES: Groq API requires content to be a string
    const sanitizedMessages = finalMessages.map(msg => ({
      ...msg,
      content: typeof msg.content === 'object' ? JSON.stringify(msg.content) : String(msg.content)
    }));

    const response = await AI.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: sanitizedMessages,
      temperature: 0.7,
      max_tokens: 800,
    });

    const reply = response.choices[0].message.content;

    // SAFE PARSING
    let parsed;
    try {
      parsed = JSON.parse(reply);
    } catch (err) {
      parsed = {
        type: "text",
        content: reply
      };
    }

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }

    res.json({ success: true, reply: parsed });
  } catch (error) {
    console.error("ChatBot Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
