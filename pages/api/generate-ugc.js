// pages/api/generate-ugc.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const body = req.body;

    // Basic validation
    if (!body.product_image) {
      return res.status(400).json({ error: "product_image is required (base64 string)" });
    }

    const {
      product_image,
      model_image,
      include_model,
      aspect_ratio,
      image_count,
      speech_language,
      model_gender,
      hair_style,
      hair_color,
      ethnicity,
      pose_style,
      composition,
      lighting,
      color_grading,
      vibe
    } = body;

    // Build the image generation prompt using the exact spec you provided
    const basePrompt = `Generate a photorealistic UGC TikTok-style fashion image.

Product: [PRODUCT_DESCRIPTION]
Model: [MODEL_GENDER], ethnicity [ETHNICITY], realistic skin, natural anatomy.
Pose Style: [POSE_STYLE]
Composition: [COMPOSITION]
Lighting: [LIGHTING]
Color Grading: [COLOR_GRADING]
Vibe / Background: [VIBE]

Aspect Ratio: [ASPECT_RATIO]
Quality: ultra realistic, 4K, clean shadows, no distortion.`;

    // Replace placeholders with actual selections (PRODUCT_DESCRIPTION is passed as metadata)
    // Since we provide product_image inline, include a short description
    const productDescription = "Uploaded product image (provided by user).";

    const prompt = basePrompt
      .replace("[PRODUCT_DESCRIPTION]", productDescription)
      .replace("[MODEL_GENDER]", model_gender || "Female")
      .replace("[ETHNICITY]", ethnicity || "Indonesian")
      .replace("[POSE_STYLE]", pose_style || "Eye Contact")
      .replace("[COMPOSITION]", composition || "Vlog Style")
      .replace("[LIGHTING]", lighting || "Ring Light")
      .replace("[COLOR_GRADING]", color_grading || "Natural")
      .replace("[VIBE]", vibe || "Bedroom Morning")
      .replace("[ASPECT_RATIO]", aspect_ratio || "9:16");

    // Prepare payload for AI Studio / Gemini
    // NOTE: adjust endpoint/model name if Google updates API spec.
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY not configured in environment" });
    }

    // Construct request body. Many generative APIs accept mixed text + inline images.
    // We will call the Generative Language API (example URL) — adapt as needed for your AI Studio account.
    const requestBody = {
      // The structure here is a general example. Depending on actual AI Studio expectation, you may need to change key names.
      // We'll use a common pattern: send prompt text + inline image bytes (base64).
      instances: [
        {
          prompt,
          image_inputs: [
            { role: "product", mime: "image/png", content: product_image }
          ],
          modelConfig: {
            aspectRatio: aspect_ratio,
            imageCount: image_count || 1
          }
        }
      ]
    };

    // If model image exists, attach it
    if (model_image && include_model) {
      requestBody.instances[0].image_inputs.push({ role: "model", mime: "image/png", content: model_image });
    }

    // Call the generative endpoint
    // NOTE: Update endpoint if needed. Here we call a generic endpoint; some accounts use different path/params.
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0:generateImage?key=${apiKey}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("Gemini error:", txt);
      return res.status(502).json({ error: "AI generation failed", details: txt });
    }

    const aiResult = await response.json();

    // Attempt to extract images.
    // Different AI responses have different shapes. We'll try common fields.
    let images = [];

    // Example attempt: some responses include base64 images in aiResult.output or aiResult.data
    // Try a few common locations:
    if (aiResult?.images && Array.isArray(aiResult.images)) {
      images = aiResult.images.map(i => {
        if (i.base64) return `data:image/png;base64,${i.base64}`;
        if (i.url) return i.url;
        return null;
      }).filter(Boolean);
    } else if (aiResult?.candidates && Array.isArray(aiResult.candidates)) {
      images = aiResult.candidates.map(c => c.image ? `data:image/png;base64,${c.image}` : null).filter(Boolean);
    } else if (aiResult?.outputs) {
      // generic fallback
      const out = aiResult.outputs;
      for (const o of out) {
        if (o?.content?.images && Array.isArray(o.content.images)) {
          for (const img of o.content.images) {
            if (img?.image_base64) images.push(`data:image/png;base64,${img.image_base64}`);
            else if (img?.uri) images.push(img.uri);
          }
        }
      }
    }

    // If still nothing, return full aiResult for debugging
    if (images.length === 0) {
      return res.status(200).json({ images: [], debug: aiResult });
    }

    return res.status(200).json({ images });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err) });
  }
}
