import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import Invoice from "../models/Invoice.model.js";
import { ENV } from "../config/env.js";

// Initialize Providers
const genAi = new GoogleGenAI({ apiKey: ENV?.GEMINI_API_KEY });
const openai = new OpenAI({ apiKey: ENV?.OPENAI_API_KEY });
const genAiModel = "models/gemini-2.0-flash"; // safer than 1.5-flash

// --------------------------------------------
// GEMINI — FIXED response parsing
// --------------------------------------------
async function parseWithGemini(prompt) {
  const response = await genAi.models.generateContent({
    model: genAiModel,
    contents: prompt,
  });

  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) throw new Error("Gemini failed to return text");

  return text;
}

// PARSE INVOICE FROM RAW TEXT
export const parseInvoiceFromText = async (req, res) => {
  const { text, provider = "gemini" } = req.body;

  if (!text) return res.status(400).json({ message: "Text is required" });

  try {
    const prompt = `
You are an expert invoice data extraction AI. Analyze the following text and extract invoice details.

Return ONLY this JSON:
{
  "clientName": "string",
  "email": "string | null",
  "address": "string | null",
  "items": [
    { "name": "string", "quantity": number, "unitPrice": number }
  ]
}

--- TEXT START ---
${text}
--- TEXT END ---
`;

    let rawResponse =
      provider === "openai"
        ? await parseWithOpenAI(prompt)
        : await parseWithGemini(prompt);

    const cleanedJson = rawResponse
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const parsedData = JSON.parse(cleanedJson);

    return res.status(200).json({
      success: true,
      provider,
      message: "Invoice parsed successfully",
      data: parsedData,
    });
  } catch (error) {
    console.error("Error occurred in parseInvoiceFromText:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// Generate Reminder Email — Gemini FIXED

// --------------------------------------------
async function generateWithGemini(prompt) {
  const response = await genAi.models.generateContent({
    model: genAiModel,
    contents: prompt,
  });

  // Safe extraction from current SDK response structure
  const text = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

  if (!text) throw new Error("Gemini failed to return text");

  return text;
}

//

async function generateWithOpenAI(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
  });

  const text = response?.choices?.[0]?.message?.content;
  if (!text) throw new Error("OpenAI failed to return text");
  return text;
}

// REMINDER EMAIL
export const generateReminderEmail = async (req, res) => {
  const { invoiceId, provider = "gemini" } = req.body;

  if (!invoiceId)
    return res.status(400).json({ message: "Invoice ID is required" });

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    const clientName = invoice?.billTo?.clientName || "Client";
    const invoiceNumber = invoice?.invoiceNumber || "N/A";
    const amountDue = invoice?.total?.toFixed(2);
    const dueDate = invoice?.dueDate
      ? new Date(invoice.dueDate).toLocaleDateString()
      : "N/A";

    const prompt = `
Write a friendly, concise reminder email for an overdue invoice.

Details:
- Client Name: ${clientName}
- Invoice Number: ${invoiceNumber}
- Amount Due: ${amountDue}
- Due Date: ${dueDate}

Rules:
- MUST start with a subject line.
- Tone: Friendly, professional, short.
`;

    const rawResponse =
      provider === "openai"
        ? await generateWithOpenAI(prompt)
        : await generateWithGemini(prompt);

    return res.status(200).json({
      success: true,
      provider,
      message: "Reminder email generated successfully",
      email: rawResponse,
    });
  } catch (error) {
    console.error("Error occurred in generateReminderEmail:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

//
// DASHBOARD SUMMARY + AI INSIGHTS
export const getDashboardSummary = async (req, res) => {
  const provider = req.body?.provider ?? "gemini"; // safer
  try {
    const invoices = await Invoice.find({ user: req.user?.id }).sort({
      createdAt: -1,
    });

    if (!invoices || invoices.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No invoice data available",
        insights: ["No invoice data available to generate insights."],
        data: {},
      });
    }

    const totalInvoices = invoices.length;
    const paidInvoices = invoices.filter(
      (inv) => inv?.status?.toLowerCase() === "paid"
    );
    const unpaidInvoices = invoices.filter(
      (inv) => inv?.status?.toLowerCase() !== "paid"
    );

    const totalRevenue = paidInvoices.reduce(
      (sum, inv) => sum + (inv?.total ?? 0),
      0
    );
    const totalOutstanding = unpaidInvoices.reduce(
      (sum, inv) => sum + (inv?.total ?? 0),
      0
    );

    const recentInvoices = invoices.slice(0, 5).map((inv) => ({
      id: inv?._id,
      invoiceNumber: inv?.invoiceNumber,
      total: inv?.total,
      status: inv?.status,
      date: inv?.createdAt,
    }));

    const summaryText = `Dashboard Summary:
- Total invoices: ${totalInvoices}
- Paid invoices: ${paidInvoices.length}
- Unpaid invoices: ${unpaidInvoices.length}
- Total revenue: ${totalRevenue.toFixed(2)}
- Outstanding amount: ${totalOutstanding.toFixed(2)}
- Recent: ${recentInvoices
      .map((inv) => `#${inv.invoiceNumber} (${inv.status})`)
      .join(", ")}
`.trim();

    const prompt = `
You are a friendly small-business financial analyst.
Provide 2–3 short, helpful insights based on this summary:

${summaryText}

Rules:
- No repeating numbers.
- Insights must be actionable, supportive, encouraging.
- Return EXACT JSON:
{
  "insights": ["string", "string", "string"]
}
`;

    const aiResponse =
      provider?.toLowerCase() === "openai"
        ? await generateWithOpenAI(prompt)
        : await generateWithGemini(prompt);

    const cleaned =
      aiResponse
        ?.replace(/```json/gi, "")
        ?.replace(/```/g, "")
        ?.trim() ?? "";

    let parsedInsights;
    try {
      parsedInsights = JSON.parse(cleaned)?.insights;
      if (!Array.isArray(parsedInsights))
        throw new Error("Invalid insights format");
    } catch {
      parsedInsights = ["Unable to generate insights. Try again."];
    }

    return res.status(200).json({
      success: true,
      provider,
      message: "Dashboard summary fetched successfully",
      data: {
        totalInvoices,
        paidInvoices: paidInvoices.length,
        unpaidInvoices: unpaidInvoices.length,
        totalRevenue,
        totalOutstanding,
        recentInvoices,
        insights: parsedInsights,
        summaryText,
      },
    });
  } catch (error) {
    console.error("Error occurred in getDashboardSummary:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error?.message,
    });
  }
};
