require('dotenv').config();
const { sendWeddingReportEmail } = require('./services/emailService');

const dummyAnalysis = {
  procurementSummary: { marketCost: 10000, optimizedCost: 8000, estimatedSavingsOpportunity: 2000 },
  religionProfile: { religion: 'Hindu', community: 'Punjabi' },
  weddingConcepts: [{ conceptName: 'Test Theme', description: 'Test Description', estimatedCost: '₹8,00,000', tier: 'Premium' }],
  judgeFeatures: { aiCompatibilityScore: 90, luxuryIndex: 80, trendAnalysis: 'Trending', culturalAuthenticityScore: 95 }
};

async function run() {
  console.log("Testing email service...");
  try {
    await sendWeddingReportEmail('test@example.com', dummyAnalysis);
  } catch (e) {
    console.error("Caught error:", e);
  }
}

run();
