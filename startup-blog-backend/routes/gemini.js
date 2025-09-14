const express = require('express');
const router = express.Router();

// Check if Gemini API is available
let genAI = null;
let GoogleGenerativeAI = null;

try {
    const { GoogleGenerativeAI: GAI } = require('@google/generative-ai');
    GoogleGenerativeAI = GAI;
    
    if (process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        console.log('Gemini AI initialized successfully');
    } else {
        console.warn('GEMINI_API_KEY not found in environment variables');
    }
} catch (error) {
    console.warn('@google/generative-ai package not found. Please install it with: npm install @google/generative-ai');
    console.error('Package error:', error.message);
}

// Test endpoint for debugging Gemini connection
router.post('/test', async (req, res) => {
    console.log('Testing Gemini API...');
    
    // Check if genAI is initialized
    if (!genAI) {
        return res.status(503).json({ 
            error: 'genAI is not initialized',
            hasApiKey: !!process.env.GEMINI_API_KEY,
            apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
        });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const prompt = "Say hello world in one sentence.";
        console.log('Sending test prompt:', prompt);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('Received response:', text);
        
        res.json({ 
            success: true,
            response: text,
            debug: {
                hasApiKey: !!process.env.GEMINI_API_KEY,
                apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
            }
        });
        
    } catch (error) {
        console.error('Gemini Test Error:', error);
        res.status(500).json({ 
            error: 'Gemini test failed',
            details: error.message,
            errorType: error.constructor.name,
            debug: {
                hasApiKey: !!process.env.GEMINI_API_KEY,
                apiKeyLength: process.env.GEMINI_API_KEY?.length || 0
            }
        });
    }
});

// Enhance blog content using Gemini
router.post('/enhance-content', async (req, res) => {
    if (!genAI) {
        return res.status(503).json({ 
            error: 'AI service is not available. Please ensure Gemini API is configured properly.',
            debug: {
                hasApiKey: !!process.env.GEMINI_API_KEY,
                hasGoogleAI: !!GoogleGenerativeAI
            }
        });
    }

    const { currentContent, prompt, enhancementType } = req.body;
    
    if (!currentContent && !prompt) {
        return res.status(400).json({ error: 'Content or prompt is required' });
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        let fullPrompt;
        
        // Different enhancement types
        switch (enhancementType) {
            case 'improve':
                fullPrompt = `Please improve and enhance the following blog content while maintaining its core message and focus on startups. Make it more engaging, clear, and well-structured:

Current content: "${currentContent}"

Additional instructions: ${prompt || 'Make it more professional and engaging'}

Please return only the enhanced content without any explanations or meta-commentary.`;
                break;
                
            case 'expand':
                fullPrompt = `Please expand the following blog content with more details, examples, and insights related to startups. Keep the same tone and style:

Current content: "${currentContent}"

Focus on: ${prompt || 'Adding more practical examples and insights'}

Please return only the expanded content without any explanations or meta-commentary.`;
                break;
                
            case 'summarize':
                fullPrompt = `Please create a concise summary of the following blog content while keeping the key points about startups:

Current content: "${currentContent}"

Style preference: ${prompt || 'Professional and clear summary'}

Please return only the summarized content without any explanations or meta-commentary.`;
                break;
                
            case 'rewrite':
                fullPrompt = `Please rewrite the following blog content according to these instructions, while keeping it focused on startups:

Current content: "${currentContent}"

Rewrite instructions: ${prompt}

Please return only the rewritten content without any explanations or meta-commentary.`;
                break;
                
            case 'continue':
                fullPrompt = `Please continue writing the following blog content about startups, maintaining the same tone and style:

Current content: "${currentContent}"

Direction to continue: ${prompt || 'Continue with relevant startup insights'}

Please return only the continuation without any explanations or meta-commentary.`;
                break;
                
            default:
                fullPrompt = `${prompt}

Context/Current content: "${currentContent}"

Please provide a response that can be used to enhance this startup blog content. Return only the content without explanations.`;
        }
        
        console.log('Sending request to Gemini...');
        console.log('Enhancement type:', enhancementType);
        console.log('Prompt length:', fullPrompt.length);
        
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        
        // Correct way to get text from Gemini response
        const enhancedContent = response.text();
        
        console.log('Received response from Gemini');
        console.log('Response length:', enhancedContent.length);
        
        res.json({ 
            enhancedContent: enhancedContent.trim(),
            originalContent: currentContent,
            enhancementType,
            prompt,
            success: true
        });
        
    } catch (error) {
        console.error('Gemini API Error Details:', {
            message: error.message,
            status: error.status,
            statusText: error.statusText,
            name: error.name
        });
        
        // More specific error handling
        let errorMessage = 'Failed to enhance content with AI';
        let statusCode = 500;
        
        if (error.message?.includes('API key')) {
            errorMessage = 'Invalid API key';
            statusCode = 401;
        } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
            errorMessage = 'API quota exceeded or rate limit hit';
            statusCode = 429;
        } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
            errorMessage = 'Network error connecting to Gemini API';
            statusCode = 502;
        }
        
        res.status(statusCode).json({ 
            error: errorMessage,
            details: error.message,
            success: false,
            debug: process.env.NODE_ENV === 'development' ? {
                hasApiKey: !!process.env.GEMINI_API_KEY,
                apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
                errorType: error.constructor.name,
                stack: error.stack
            } : undefined
        });
    }
});

// Generate blog ideas
router.post('/generate-ideas', async (req, res) => {
    if (!genAI) {
        return res.status(503).json({ 
            error: 'AI service is not available. Please ensure Gemini API is configured properly.' 
        });
    }

    const { topic, category } = req.body;
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const prompt = `Generate 5 engaging blog post ideas about ${topic || 'startups'} in the ${category || 'general startup'} category. 

Please format the response as a JSON array with objects containing 'title' and 'brief_description' fields. 

Example format:
[
    {
        "title": "Blog Title Here",
        "brief_description": "Brief description of what the blog would cover"
    }
]

Focus on practical, actionable content that would be valuable for entrepreneurs and startup enthusiasts. Return only the JSON array, no additional text.`;
        
        console.log('Generating ideas for topic:', topic, 'category:', category);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log('Raw response for ideas:', responseText);
        
        let ideas;
        
        try {
            // Clean up the response and try to extract JSON
            let cleanedResponse = responseText.trim();
            
            // Remove markdown code blocks if present
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            
            // Find JSON array in the response
            const jsonMatch = cleanedResponse.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                ideas = JSON.parse(jsonMatch[0]);
            } else {
                // Try to parse the whole response
                ideas = JSON.parse(cleanedResponse);
            }
            
            // Validate the structure
            if (!Array.isArray(ideas) || ideas.length === 0) {
                throw new Error('Invalid ideas format');
            }
            
        } catch (parseError) {
            console.error('JSON parsing failed:', parseError);
            // Fallback: create a simple response
            ideas = [
                {
                    title: `Blog Ideas for ${topic || 'Startups'}`,
                    brief_description: responseText.substring(0, 200).replace(/[^\w\s]/g, ' ').trim() + "..."
                }
            ];
        }
        
        res.json({ 
            ideas,
            success: true,
            topic: topic || 'startups',
            category: category || 'general'
        });
        
    } catch (error) {
        console.error('Gemini API Error in generate-ideas:', error);
        res.status(500).json({ 
            error: 'Failed to generate ideas with AI',
            details: error.message,
            success: false
        });
    }
});

// Check if content is appropriate for startup blog
router.post('/check-relevance', async (req, res) => {
    if (!genAI) {
        return res.status(503).json({ 
            error: 'AI service is not available. Please ensure Gemini API is configured properly.' 
        });
    }

    const { content } = req.body;
    
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
        
        const prompt = `Analyze the following content and determine if it's relevant and appropriate for a startup-focused blog. Provide a score from 1-10 (10 being highly relevant) and brief feedback:

Content: "${content}"

Please respond in JSON format only:
{
    "relevance_score": number,
    "feedback": "brief feedback about the content's relevance to startups",
    "suggestions": "suggestions to make it more relevant if needed"
}

Return only the JSON object, no additional text.`;
        
        console.log('Checking relevance for content length:', content.length);
        
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const responseText = response.text();
        
        console.log('Relevance check response:', responseText);
        
        try {
            // Clean up and parse JSON
            let cleanedResponse = responseText.trim();
            cleanedResponse = cleanedResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
            
            const analysis = JSON.parse(cleanedResponse);
            
            // Validate the response structure
            if (typeof analysis.relevance_score !== 'number') {
                analysis.relevance_score = 7; // Default score
            }
            
            res.json({
                ...analysis,
                success: true
            });
            
        } catch (parseError) {
            console.error('Failed to parse relevance JSON:', parseError);
            res.json({
                relevance_score: 7,
                feedback: responseText.length > 500 ? responseText.substring(0, 500) + '...' : responseText,
                suggestions: "Consider adding more specific startup examples and actionable insights.",
                success: true
            });
        }
        
    } catch (error) {
        console.error('Gemini API Error in check-relevance:', error);
        res.status(500).json({ 
            error: 'Failed to analyze content relevance',
            details: error.message,
            success: false
        });
    }
});

// Health check for AI service
router.get('/health', (req, res) => {
    const hasApiKey = !!process.env.GEMINI_API_KEY;
    const hasValidApiKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 20;
    
    res.json({
        status: genAI ? 'available' : 'unavailable',
        hasApiKey,
        hasValidApiKey,
        apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
        hasGoogleAI: !!GoogleGenerativeAI,
        message: genAI ? 'AI service is ready' : 'AI service is not configured',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;