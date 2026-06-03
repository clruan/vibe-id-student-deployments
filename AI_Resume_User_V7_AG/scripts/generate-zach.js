const fs = require('fs');
const path = require('path');

// To run this script:
// DEEPSEEK_API_KEY=your_key_here node scripts/generate-zach.js

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

if (!DEEPSEEK_API_KEY) {
  console.error("Error: DEEPSEEK_API_KEY environment variable is not set.");
  console.log("Usage: DEEPSEEK_API_KEY=your_key node scripts/generate-zach.js");
  process.exit(1);
}

const prompt = `
You are an AI generating a high-tech portfolio JSON for 'Zach Zhou'.
Zach is a quantitative researcher and AI engineer focusing on complex systems, algorithmic trading, and large language models.
Please return ONLY a valid JSON object matching this structure:
{
  "name": "Zach Zhou",
  "title": "Quantitative Researcher & AI Engineer",
  "summary": "Building next-generation intelligent systems...",
  "contact": { "email": "...", "linkedin": "...", "github": "..." },
  "projects": [
    {
      "id": "project-1",
      "title": "High-Frequency Trading Algorithm",
      "subtitle": "Predictive Alpha Generation",
      "tags": ["Python", "C++", "Deep Learning"],
      "metrics": [{ "label": "Sharpe", "value": "3.5" }],
      "description": "..."
    }
  ],
  "experience": [
    {
      "role": "...",
      "company": "...",
      "period": "...",
      "points": ["...", "..."]
    }
  ]
}
Do not include any markdown formatting or extra text, just the raw JSON.
`;

async function generateZachProfile() {
  console.log("Calling Deepseek API to generate Zach's profile...");
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant that only outputs raw JSON." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    
    // Remove markdown code blocks if they exist
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\n/, '').replace(/\n```$/, '');
    }

    const parsedJson = JSON.parse(content);
    
    const fileContent = `// Automatically generated via Deepseek API
window.profileData_zach = ${JSON.stringify(parsedJson, null, 2)};
`;

    const outputPath = path.join(__dirname, '..', 'assets', 'data', 'zach.js');
    fs.writeFileSync(outputPath, fileContent, 'utf-8');
    console.log(\`Successfully generated and saved to \${outputPath}\`);
    
  } catch (error) {
    console.error("Failed to generate profile:", error);
  }
}

generateZachProfile();
