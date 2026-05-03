import express from 'express'
import { auth } from '../middlewares/auth.js';
import { generateArticle, generateBlogTitle, generateImage, removeImageBackground, removeImageObject, resumeReview, chatBot, pdfQa, rewriteContent } from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

aiRouter.post('/generate-article', auth , generateArticle);
aiRouter.post('/generate-blog-title', auth , generateBlogTitle);
aiRouter.post('/generate-image', auth , generateImage);
aiRouter.post('/remove-image-background',upload.single('image') ,auth , removeImageBackground);
aiRouter.post('/remove-image-object',upload.single('image') ,auth , removeImageObject);
aiRouter.post('/resume-review',upload.single('resume') ,auth , resumeReview);
aiRouter.post('/chat', auth, chatBot);

// New Routes
aiRouter.post('/pdf-qa', upload.single('pdf'), auth, pdfQa);
aiRouter.post('/rewrite', auth, rewriteContent);

export default aiRouter