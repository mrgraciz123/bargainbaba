import { NextResponse } from 'next/server';

// Initialize OpenRouter API
const apiKey = process.env.OPENROUTER_API_KEY || '';

// Helper to generate hilarious mock data if OpenRouter API key is missing
function generateFunnyMockAnalysis(inputs: {
  budget: number;
  guestCount: number;
  city: string;
  weddingType: string;
  venueType: string;
  decorStyle: string;
  cateringPref: string;
  photographyBudget: number;
}) {
  const {
    budget,
    guestCount,
    city,
    weddingType,
    venueType,
    decorStyle,
    cateringPref,
    photographyBudget,
  } = inputs;

  // Let's create city-specific flavor!
  let cityFlavors = {
    drama: "Maternal uncle (Mama ji) expressing disappointment about the quality of dry fruits.",
    paneerRisk: 75,
    relativeQuote: "In our times, we finished the whole wedding in 2 Lakhs. Today they spend that much on just photographic drone!",
    overpricingVendor: "Farmhouse Venue",
    overpricingCharge: Math.round(budget * 0.35),
    overpricingMarket: Math.round(budget * 0.22),
  };

  const lowerCity = city.toLowerCase();
  if (lowerCity.includes('delhi') || lowerCity.includes('ncr')) {
    cityFlavors = {
      drama: "Phupha Ji angry because the valet parking took 15 minutes to find his Fortuner.",
      paneerRisk: 88,
      relativeQuote: "Yaar, butter chicken is fine but where is the live counter of Russian salad? Standard down lag raha hai.",
      overpricingVendor: "Chhatarpur Premium Farmhouse",
      overpricingCharge: Math.round(budget * 0.45),
      overpricingMarket: Math.round(budget * 0.3),
    };
  } else if (lowerCity.includes('lucknow') || lowerCity.includes('kanpur') || lowerCity.includes('up')) {
    cityFlavors = {
      drama: "Maternal uncle (Mama ji) angry because he was not given the VIP center stage sofa during the garland exchange.",
      paneerRisk: 95,
      relativeQuote: "Hum Lucknow ke hain bhaiya, izzat pehle aati hai. Biryani me mutton kam, aur paneer tikka thanda... ghor kalyug!",
      overpricingVendor: "Lakhnavi Royal Lawn",
      overpricingCharge: Math.round(budget * 0.38),
      overpricingMarket: Math.round(budget * 0.24),
    };
  } else if (lowerCity.includes('mumbai') || lowerCity.includes('pune')) {
    cityFlavors = {
      drama: "Groom's family comparing the small banquet hall to a matchbox size, despite 2500 Rs per plate charge.",
      paneerRisk: 62,
      relativeQuote: "AC is not working properly, humidity is 95%. But they charged 5 Lakhs for just 4 hours? Ridiculous!",
      overpricingVendor: "South Mumbai AC Banquet",
      overpricingCharge: Math.round(budget * 0.4),
      overpricingMarket: Math.round(budget * 0.28),
    };
  } else if (lowerCity.includes('bangalore') || lowerCity.includes('bengaluru')) {
    cityFlavors = {
      drama: "Tech-cousins trying to pitch startup ideas to the wealthy groom while standing in the filter coffee line.",
      paneerRisk: 55,
      relativeQuote: "Bro, the decor has no VR integration? And they didn't even put a QR code on the shagun envelopes. So legacy.",
      overpricingVendor: "Outer Ring Road Heritage Palace",
      overpricingCharge: Math.round(budget * 0.35),
      overpricingMarket: Math.round(budget * 0.24),
    };
  }

  // Calculate actual ratios
  const perGuestCost = Math.round(budget / guestCount);
  const isBudgetStrained = perGuestCost < 1500;
  const isCateringHeavy = cateringPref === 'Premium Royal Buffet' || cateringPref === 'Authentic Organic Spread';

  // Budget Breakdown
  const suggestedVenue = Math.round(budget * 0.25);
  const plannedVenue = Math.round(budget * 0.35);

  const suggestedDecor = Math.round(budget * 0.15);
  const plannedDecor = Math.round(budget * 0.22);

  const suggestedCatering = Math.round(budget * 0.3);
  const plannedCatering = Math.round(budget * 0.33);

  const suggestedPhoto = Math.round(budget * 0.1);
  const plannedPhoto = photographyBudget;

  const totalPlanned = plannedVenue + plannedDecor + plannedCatering + plannedPhoto;
  const totalSuggested = suggestedVenue + suggestedDecor + suggestedCatering + suggestedPhoto;

  const savingsPct = Math.round(((totalPlanned - totalSuggested) / budget) * 100);

  return {
    budgetHealth: {
      status: isBudgetStrained ? "Critically Strained 🚨" : "Moderately Inflated ⚠️",
      percentage: isBudgetStrained ? 42 : 74,
      label: isBudgetStrained 
        ? "Your budget-to-guest ratio is extremely low. Relatives will eat but will complain about the tissue thickness."
        : "Overall healthy budget, but vendor margins are heavily bloated. Negotiation is mandatory.",
      breakdown: [
        { category: "Venue & Banquet", planned: plannedVenue, suggested: suggestedVenue, status: "Highly Inflated" },
        { category: "Decoration & Themes", planned: plannedDecor, suggested: suggestedDecor, status: "Heavily Overpriced" },
        { category: "Catering & Plate Charge", planned: plannedCatering, suggested: suggestedCatering, status: "Inflated" },
        { category: "Photography & Cinema", planned: plannedPhoto, suggested: suggestedPhoto, status: plannedPhoto > suggestedPhoto ? "Overpriced" : "Reasonable" }
      ]
    },
    vendorOverpricing: [
      {
        vendor: "Venue Coordinator",
        charge: plannedVenue,
        marketRate: suggestedVenue,
        overpricePercent: Math.round(((plannedVenue - suggestedVenue) / suggestedVenue) * 100),
        flag: "Critical",
        advice: `They are charging a heavy premium. Say you have alternate options in nearby areas; they'll drop standard charges by 15%.`
      },
      {
        vendor: decorStyle + " Decorator",
        charge: plannedDecor,
        marketRate: suggestedDecor,
        overpricePercent: Math.round(((plannedDecor - suggestedDecor) / suggestedDecor) * 100),
        flag: "Critical",
        advice: `They are charging for 'imported orchids' which are actually dyed carnations from the local wholesale market. Demand a material audit!`
      },
      {
        vendor: cateringPref + " Caterer",
        charge: plannedCatering,
        marketRate: suggestedCatering,
        overpricePercent: Math.round(((plannedCatering - suggestedCatering) / suggestedCatering) * 100),
        flag: "Moderate",
        advice: `Bargain on plate count! Tell them 15% of your guests are strict fasting on that day and won't touch the main course.`
      },
      {
        vendor: "Cinematographer",
        charge: plannedPhoto,
        marketRate: suggestedPhoto,
        overpricePercent: Math.round(((plannedPhoto - suggestedPhoto) / suggestedPhoto) * 100),
        flag: plannedPhoto > suggestedPhoto ? "Moderate" : "Good",
        advice: `Ask them to cut the 'cinematic drone teaser' from the package. Nobody watches the 4-hour raw footage anyway.`
      }
    ],
    savingsSuggestions: [
      {
        title: "The 'Only 1 Main Sweets' Cut",
        amount: Math.round(budget * 0.05),
        description: "You have 5 types of Halwa and 4 types of Rabri. Cut down to 1 hot Gulab Jamun + Ice Cream. Guests will still get a sugar rush, and you save thousands.",
        difficulty: "Easy"
      },
      {
        title: "Switch Orchids to Local Marigold & LED",
        amount: Math.round(budget * 0.08),
        description: "Replace the foreign imported flowers with premium local marigold (Genda Phool) and dramatic golden LED backlighting. Looks double as rich, costs one-third.",
        difficulty: "Medium"
      },
      {
        title: "Plate Guarantee Buffer Squeeze",
        amount: Math.round(budget * 0.06),
        description: "Never guarantee the full guest count. Guarantee 80% of guests. Caterers always make 15% extra buffer anyway. If 20 people don't turn up, you don't pay 3000 Rs per plate for empty chairs.",
        difficulty: "Hard"
      }
    ],
    bargainingMessages: [
      {
        vendorType: "Catering",
        guiltLevel: "Emotional Blackmail (Chacha Card)",
        tone: "Polite yet Heartbreaking",
        message: `Bhaiya, namaste. Caterer to aapse hi final karna hai, ghar me sab bol rahe hain ki swad sach me bahut lajawab hai. Par problem ye hai ki mere chacha ji jo financial support kar rahe the, unka thoda business me issue ho gaya hai aur budget ab extreme limit pe chala gaya hai. Agar aap 150 Rs per plate thoda adjust kar dein to hum advance abhi bhej dein... beti ki shadi hai thoda aashirwad samajh ke haan kar dijiye...😭`
      },
      {
        vendorType: "Venue",
        guiltLevel: "Middle Class Guarantee Card",
        tone: "Firm but Respectful",
        message: `Sir, hum aam middle class log hain. Hamein koi dikhava nahi karna, bas bacchon ki khushi dekhni hai. Dusre banquets hume 1.5 Lakhs kam me de rahe hain, lekin hum aapki brand reputation ke wajah se aapse baat kar rahe hain. Agar aap standard service charges aur electricity cost adjust kar sakein, to hum direct full digital payment kar denge. Kripya hum aam parivar ke liye thoda sa hath aage badhaiye.`
      },
      {
        vendorType: "Decorator",
        guiltLevel: "Shaadi Ek Hi Baar Hoti Hai",
        tone: "Excited and Dreamy",
        message: `Bhaiya, decor ka design to kamaal hai! Par thoda rate zyada lag raha hai. Dekhiye, shadi to bachhi ki ek hi baar hoti hai. Mera sapna hai ki vo isi mandap me bethe. Par budget 2.5 Lakhs se bilkul upar nahi ja sakta. Agar aap artificial flowers ka thoda blend kar dein aur heavy structures replace karein to hamare budget me fit ho jayega. Hum aapse 2 aur shadiyon ke decor ki deal pakka dilwa denge agle saal!`
      }
    ],
    dramaPrediction: {
      mamaJiDrama: Math.round(45 + Math.random() * 50),
      paneerShortageRisk: cityFlavors.paneerRisk,
      djConflictRisk: Math.round(60 + Math.random() * 35),
      shagunArgumentRisk: Math.round(30 + Math.random() * 60),
      relativeQuotes: [
        "Arey, cold coffee counter pe to ladki ke chacha ji ne 2 ghante se kabza kar rakha hai!",
        cityFlavors.relativeQuote,
        "Shadi ka khana badhiya tha par paneer ke pieces itne chhote the jaise paneer nahi, paneer ki shradhanjali ho!",
        "Shaadi to theek hai par cold drink me barf pighal gayi thi... hum chalo hotel chalte hain."
      ]
    },
    riskScore: Math.round(65 + Math.random() * 30),
    riskFactors: [
      "Furious maternal uncle (Phupha/Mama) drama risk due to sit-down seat assignment",
      "DJ curfew violation after 10 PM by local police squad",
      "Paneer cube volume size deficiency triggering relative disappointment",
      "Caterer plate count manipulation (double-counting plates)"
    ],
    strategy: [
      "Step 1: Guarantee only 85% plates to the caterer. Make a dedicated relative stand at the entry and count the plates.",
      "Step 2: Present the 'Chacha ji business loss' emotional card to the Decorator to get a flat 18% discount.",
      "Step 3: Replace imported orchids with local genda phool + high power gold LEDs to preserve the premium aesthetic.",
      "Step 4: Hide the special Kaju Katli boxes from distant relatives and serve only to VIP chachas."
    ]
  };
}

// Helper to extract JSON from conversational or markdown content
function extractJsonString(str: string): string {
  const jsonRegex = /\{[\s\S]*\}/;
  const match = str.match(jsonRegex);
  return match ? match[0] : str;
}

export async function POST(req: Request) {
  let inputs: any = null;
  try {
    inputs = await req.json();
    const {
      budget,
      guestCount,
      city,
      weddingType,
      venueType,
      decorStyle,
      cateringPref,
      photographyBudget,
    } = inputs;

    if (!apiKey) {
      // Fallback if API key is missing
      const mockResult = generateFunnyMockAnalysis(inputs);
      await new Promise(resolve => setTimeout(resolve, 3000));
      return NextResponse.json(mockResult);
    }

    const prompt = `
You are BargainBaba AI, India's most cunning, hilarious, and expert wedding negotiation strategist.
An Indian wedding is being planned with these parameters:
- City: ${city}
- Total Wedding Budget: ₹${budget} (INR)
- Guest Count: ${guestCount} guests
- Wedding Style/Type: ${weddingType}
- Venue Type: ${venueType}
- Decor Style/Preference: ${decorStyle}
- Catering Menu Choice: ${cateringPref}
- Planned Photography/Cinema Budget: ₹${photographyBudget} (INR)

Analyze these parameters and generate a full analysis in strictly valid JSON format.
Add extreme Indian cultural sarcasm, regional funny details (e.g., if Delhi, reference Phupha ji's Fortuner or Russian salad; if Lucknow, reference Tunday kebabs, sharafat, and Mama Jistage drama; if Mumbai, reference matchbox hall sizes and humidity).

The response MUST be a single JSON object. DO NOT include any conversational introduction, markdown blocks, backticks, or "json" prefix. The response must start with '{' and end with '}'.

The JSON structure must be exactly:
{
  "budgetHealth": {
    "status": "string (e.g., Critically Inflated, Moderately Strained, Healthy but Bloated)",
    "percentage": number (0 to 100 representing health score, where 100 is perfectly optimized, and 20 is heavily bleeding money)",
    "label": "string (funny diagnostic comment about the budget and guest count ratio)",
    "breakdown": [
      { "category": "Venue & Banquet", "planned": number, "suggested": number, "status": "string (e.g., Overpriced, Bloated, Optimized)" },
      { "category": "Decoration & Themes", "planned": number, "suggested": number, "status": "string" },
      { "category": "Catering & Plate Charge", "planned": number, "suggested": number, "status": "string" },
      { "category": "Photography & Cinema", "planned": number, "suggested": number, "status": "string" }
    ]
  },
  "vendorOverpricing": [
    {
      "vendor": "string (vendor name or type, e.g., Venue Host)",
      "charge": number,
      "marketRate": number,
      "overpricePercent": number,
      "flag": "string (Critical | Moderate | Good)",
      "advice": "string (cunning, actionable strategy to negotiate and lower this specific rate)"
    }
  ],
  "savingsSuggestions": [
    {
      "title": "string (funny title, e.g., The Genda Phool Squeeze)",
      "amount": number (approximate savings in INR),
      "description": "string (detailed funny advice explaining how to execute this savings)",
      "difficulty": "string (Easy | Medium | Hard)"
    }
  ],
  "bargainingMessages": [
    {
      "vendorType": "string (Catering, Venue, Decor, etc.)",
      "guiltLevel": "string (e.g., Extreme Guilt, Chacha Loss Card, Poor Family Routine)",
      "tone": "string (e.g., Heartbreaking, Sweet Talk, Professional Pressure)",
      "message": "string (a full, realistic, copy-paste-ready WhatsApp/SMS message in Hindi-English (Hinglish) using extreme emotional leverage to get discounts)"
    }
  ],
  "dramaPrediction": {
    "mamaJiDrama": number (percentage probability),
    "paneerShortageRisk": number (percentage probability),
    "djConflictRisk": number (percentage probability),
    "shagunArgumentRisk": number (percentage probability),
    "relativeQuotes": ["string (funny quotes from relatives gossiping behind the family's back)"]
  },
  "riskScore": number (overall wedding chaos risk score from 0 to 100),
  "riskFactors": ["string (funny specific risk factors like: 'Cousin stealing groom's shoes and asking 50,000 Rs')"],
  "strategy": ["string (step-by-step master plan of action for the family to survive the wedding financially)"]
}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "BargainBaba AI",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "google/gemma-2-9b-it:free",
        "messages": [
          {
            "role": "user",
            "content": prompt
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const textResponse = data.choices?.[0]?.message?.content || '';

    const cleanedText = extractJsonString(textResponse);
    const parsedData = JSON.parse(cleanedText);
    return NextResponse.json(parsedData);

  } catch (error: any) {
    console.error('AI Strategy execution error:', error);
    const fallbackInputs = {
      budget: inputs?.budget || 1500000,
      guestCount: inputs?.guestCount || 300,
      city: inputs?.city || "Delhi/Lucknow",
      weddingType: inputs?.weddingType || "Grand Royal Wedding",
      venueType: inputs?.venueType || "AC Banquet Lawn",
      decorStyle: inputs?.decorStyle || "Marigold Modernist",
      cateringPref: inputs?.cateringPref || "Premium Royal Buffet",
      photographyBudget: inputs?.photographyBudget || 150000
    };
    try {
      const mockResult = generateFunnyMockAnalysis(fallbackInputs);
      return NextResponse.json(mockResult);
    } catch {
      return NextResponse.json({ error: "Failed to generate wedding intelligence." }, { status: 500 });
    }
  }
}
