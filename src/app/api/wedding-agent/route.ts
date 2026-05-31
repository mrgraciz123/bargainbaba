import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined in environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey || 'dummy-key');

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { religion, community, state, city, budget, guestCount, priorities } = body;

    if (!religion || !state || !city || !budget || !guestCount || !priorities) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are an elite Cultural Wedding Intelligence Consultant.
      A user has provided the following details for their upcoming wedding:
      - Religion: ${religion}
      - Community: ${community || 'General'}
      - Location: ${city}, ${state}
      - Budget: ₹${budget}
      - Guest Count: ${guestCount}
      - Priorities: ${priorities.join(', ')}

      Your task is to generate a comprehensive, highly personalized cultural wedding strategy.
      
      Output a JSON response with EXACTLY the following structure (do not include markdown block formatting, just raw JSON):
      {
        "culturalIntelligence": {
          "requiredRituals": ["ritual 1 with brief description", "ritual 2..."],
          "recommendedTimeline": [
            { "day": "Day 1", "events": "Description of events" },
            { "day": "Day 2", "events": "Description of events" }
          ],
          "procurementRequirements": ["Item 1 to buy", "Item 2..."],
          "vendorCategoriesNeeded": ["Vendor 1", "Vendor 2..."],
          "costAllocationStrategy": [
            { "category": "Venue & Food", "percentage": 40 },
            { "category": "Decor", "percentage": 20 }
          ],
          "themeRecommendations": ["Theme 1", "Theme 2"],
          "culturalBestPractices": ["Practice 1", "Practice 2"]
        },
        "plans": [
          {
            "tier": "Budget Optimized",
            "estimatedCost": "₹X",
            "compatibilityScore": 85,
            "pros": ["pro1", "pro2"],
            "cons": ["con1", "con2"],
            "procurementStrategy": "How to procure within this budget constraint",
            "expectedSavings": "Areas where money is saved"
          },
          {
            "tier": "Balanced Recommendation",
            "estimatedCost": "₹Y",
            "compatibilityScore": 95,
            "pros": ["pro1", "pro2"],
            "cons": ["con1", "con2"],
            "procurementStrategy": "Strategy for a balanced approach",
            "expectedSavings": "Smart savings areas"
          },
          {
            "tier": "Premium Experience",
            "estimatedCost": "₹Z",
            "compatibilityScore": 90,
            "pros": ["pro1", "pro2"],
            "cons": ["con1", "con2"],
            "procurementStrategy": "Strategy for premium procurement",
            "expectedSavings": "Where the premium value lies"
          }
        ]
      }
      
      Ensure the costAllocationStrategy percentages sum to exactly 100.
      Generate exactly 3 plans in the 'plans' array corresponding to Budget Optimized, Balanced Recommendation, and Premium Experience.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean markdown formatting if gemini returns it
    let cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating cultural wedding research:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
