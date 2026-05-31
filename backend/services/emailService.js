const { Resend } = require('resend');
const PDFDocument = require('pdfkit');

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

/**
 * Generate a PDF Buffer from the analysis data
 */
function generatePDFBuffer(analysis) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // --- COVER PAGE ---
      doc.fillColor('#8B1E3F').fontSize(32).text('BARGAINBABA', { align: 'center' });
      doc.fillColor('#D4AF37').fontSize(16).text('AI WEDDING ARCHITECT REPORT', { align: 'center' });
      doc.moveDown(2);
      
      const pSummary = analysis.procurementSummary || {};
      const profile = analysis.religionProfile || {};
      
      doc.fillColor('#333333').fontSize(14).text(`Generated for your upcoming wedding in ${profile.community || profile.religion} tradition.`, { align: 'center' });
      doc.moveDown(4);
      doc.fontSize(12).text(`Estimated Budget: ₹${pSummary.marketCost || 0}`);
      doc.text(`Optimized Cost: ₹${pSummary.optimizedCost || 0}`);
      doc.text(`Total Savings: ₹${pSummary.estimatedSavingsOpportunity || 0}`);
      
      doc.addPage();

      // --- WEDDING THEME & DELIVERABLES ---
      doc.fillColor('#8B1E3F').fontSize(20).text('AI Recommended Themes', { underline: true });
      doc.moveDown();
      const themes = analysis.weddingConcepts || [];
      themes.forEach(t => {
        doc.fillColor('#D4AF37').fontSize(16).text(`${t.conceptName} (${t.tier})`);
        doc.fillColor('#333333').fontSize(12).text(t.description || '');
        doc.text(`Estimated Cost: ${t.estimatedCost || 'N/A'}`);
        doc.moveDown();
      });

      doc.addPage();

      // --- DELIVERABLES ---
      doc.fillColor('#8B1E3F').fontSize(20).text('Wedding Deliverables', { underline: true });
      doc.moveDown();
      const deliverables = analysis.weddingDeliverables || [];
      deliverables.forEach(d => {
        doc.fillColor('#D4AF37').fontSize(16).text(`Theme: ${d.themeName}`);
        doc.fillColor('#333333').fontSize(12).text(`Venue: ${d.venueConcept}`);
        doc.text(`Decor: ${d.decorationPlan}`);
        doc.text(`Photography: ${d.photographyPlan}`);
        doc.text(`Food: ${d.foodExperience}`);
        doc.moveDown();
      });

      doc.addPage();

      // --- TIMELINE ---
      doc.fillColor('#8B1E3F').fontSize(20).text('Wedding Timeline', { underline: true });
      doc.moveDown();
      const timeline = analysis.weddingTimeline || [];
      timeline.forEach(t => {
        doc.fillColor('#D4AF37').fontSize(14).text(t.milestone);
        doc.fillColor('#333333').fontSize(12);
        (t.tasks || []).forEach(task => doc.text(`• ${task}`));
        doc.moveDown();
      });

      doc.addPage();

      // --- CULTURAL BLUEPRINT ---
      doc.fillColor('#8B1E3F').fontSize(20).text('Cultural Blueprint', { underline: true });
      doc.moveDown();
      const cb = analysis.culturalBlueprint || {};
      doc.fillColor('#D4AF37').fontSize(14).text('Required Rituals:');
      doc.fillColor('#333333').fontSize(12);
      (cb.requiredRituals || []).forEach(r => doc.text(`• ${r}`));
      doc.moveDown();
      doc.fillColor('#D4AF37').fontSize(14).text('Important Notes:');
      doc.fillColor('#333333').fontSize(12);
      (cb.specialRequirements || []).forEach(r => doc.text(`• ${r}`));

      doc.addPage();

      // --- VENDOR RECOMMENDATIONS ---
      doc.fillColor('#8B1E3F').fontSize(20).text('Vendor Recommendations', { underline: true });
      doc.moveDown();
      const vendors = analysis.recommendedVendors?.length > 0 ? analysis.recommendedVendors : (analysis.vendorPool || []);
      vendors.forEach(v => {
        doc.fillColor('#D4AF37').fontSize(14).text(`${v.name} - ${v.category}`);
        doc.fillColor('#333333').fontSize(12).text(`Rating: ${v.rating} | Price Estimate: ₹${v.priceEstimate || 'N/A'}`);
        doc.text(`Reason: ${v.reason || 'Verified by AI'}`);
        doc.moveDown();
      });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate HTML Email Body
 */
function generateHTMLBody(analysis) {
  const pSummary = analysis.procurementSummary || {};
  const jf = analysis.judgeFeatures || {};
  const profile = analysis.religionProfile || {};
  const theme = (analysis.weddingConcepts && analysis.weddingConcepts[0]) || {};
  const cb = analysis.culturalBlueprint || {};
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #110204; color: #ffffff; padding: 0;">
      <!-- Header -->
      <div style="background-color: #8B1E3F; padding: 30px 20px; text-align: center; border-bottom: 3px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-size: 28px; letter-spacing: 2px;">BARGAINBABA AI</h1>
        <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Wedding Intelligence Report</p>
      </div>

      <!-- Executive Summary -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #D4AF37; font-size: 18px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 10px;">Executive Summary</h2>
        <table style="width: 100%; margin-top: 15px; color: #cccccc; font-size: 14px;">
          <tr>
            <td style="padding: 5px 0;"><strong>Religion/Community:</strong> ${profile.religion} ${profile.community ? `(${profile.community})` : ''}</td>
            <td style="padding: 5px 0;"><strong>Market Cost:</strong> ₹${(pSummary.marketCost || 0).toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0;"><strong>Optimized Cost:</strong> ₹${(pSummary.optimizedCost || 0).toLocaleString()}</td>
            <td style="padding: 5px 0; color: #10B981;"><strong>Savings:</strong> ₹${(pSummary.estimatedSavingsOpportunity || 0).toLocaleString()}</td>
          </tr>
        </table>
      </div>

      <!-- AI Scores -->
      <div style="padding: 20px; background-color: rgba(255,255,255,0.02); margin: 0 20px; border: 1px solid rgba(212,175,55,0.2); border-radius: 8px;">
        <h2 style="color: #D4AF37; font-size: 16px; margin-top: 0;">AI Architect Scores</h2>
        <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
          <div style="width: 45%; margin-bottom: 15px;">
            <div style="color: #D4AF37; font-size: 20px; font-weight: bold;">${jf.aiCompatibilityScore || 0}%</div>
            <div style="color: #888; font-size: 11px; text-transform: uppercase;">AI Compatibility</div>
          </div>
          <div style="width: 45%; margin-bottom: 15px;">
            <div style="color: #D4AF37; font-size: 20px; font-weight: bold;">${jf.luxuryIndex || 0}/100</div>
            <div style="color: #888; font-size: 11px; text-transform: uppercase;">Luxury Index</div>
          </div>
          <div style="width: 45%;">
            <div style="color: #10B981; font-size: 14px; font-weight: bold;">${jf.trendAnalysis || 'N/A'}</div>
            <div style="color: #888; font-size: 11px; text-transform: uppercase;">Trend Analysis</div>
          </div>
          <div style="width: 45%;">
            <div style="color: #D4AF37; font-size: 20px; font-weight: bold;">${jf.culturalAuthenticityScore || 0}%</div>
            <div style="color: #888; font-size: 11px; text-transform: uppercase;">Cultural Match</div>
          </div>
        </div>
      </div>

      <!-- Recommended Theme -->
      <div style="padding: 30px 20px;">
        <h2 style="color: #D4AF37; font-size: 18px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 10px;">Recommended Theme</h2>
        <h3 style="color: #ffffff; margin: 15px 0 5px 0;">${theme.conceptName || 'Classic Elegance'}</h3>
        <p style="color: #cccccc; font-size: 14px; line-height: 1.5; margin: 0 0 10px 0;">${theme.description || 'A beautiful traditional wedding setup.'}</p>
        <p style="color: #D4AF37; font-size: 14px; font-weight: bold; margin: 0;">Est. Cost: ${theme.estimatedCost || 'N/A'}</p>
      </div>

      <!-- Cultural Blueprint Snippet -->
      <div style="padding: 0 20px 30px 20px;">
        <h2 style="color: #D4AF37; font-size: 18px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 10px;">Cultural Blueprint Highlights</h2>
        <ul style="color: #cccccc; font-size: 14px; line-height: 1.6; padding-left: 20px;">
          ${(cb.requiredRituals || []).slice(0, 5).map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>

      <!-- Footer -->
      <div style="background-color: #0A0102; padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #666666; font-size: 12px; margin: 0;">
          This document is generated automatically by the BargainBaba AI Architect.<br/>
          Attached is your full, detailed PDF Blueprint.
        </p>
      </div>
    </div>
  `;
}

/**
 * Main service function to generate PDF and send email
 */
async function sendWeddingReportEmail(email, analysis) {
  if (!email || !process.env.RESEND_API_KEY) {
    console.log("Skipping email: No email provided or RESEND_API_KEY missing.");
    return;
  }

  try {
    console.log(`EMAIL RECIPIENT: ${email}`);
    
    // Generate PDF
    const pdfBuffer = await generatePDFBuffer(analysis);
    console.log("PDF GENERATED");

    // Generate HTML
    const htmlBody = generateHTMLBody(analysis);

    // Send via Resend
    const result = await resend.emails.send({
      from: 'BargainBaba AI <onboarding@resend.dev>',
      to: [email],
      subject: '✨ Your AI Wedding Blueprint is Ready',
      html: htmlBody,
      attachments: [
        {
          filename: 'BargainBaba_AI_Wedding_Blueprint.pdf',
          content: pdfBuffer,
        }
      ]
    });

    if (result.error) {
      console.error("RESEND RETURNED ERROR:", result.error);
      return;
    }

    console.log("EMAIL SENT SUCCESSFULLY", result.data?.id);
    return result;
  } catch (error) {
    console.error("EMAIL FAILED", error);
    // Rethrowing is avoided intentionally so we don't break the main flow.
  }
}

module.exports = {
  sendWeddingReportEmail
};
