import { useState } from "react";

/**
 * UGCGenerator.jsx
 * Simple React component that implements the UI controls and calls /api/generate-ugc
 * - Accepts product & model images (converts to base64)
 * - All dropdowns included (gender, hair style, hair color, pose, etc)
 * - Sends JSON to backend
 */

const defaultOptions = {
  aspectRatio: "9:16",
  imageCount: 2,
  speechLanguage: "Indonesia",
  modelGender: "Female",
  hairStyle: "Long Straight",
  hairColor: "Black",
  ethnicity: "Indonesian",
  poseStyle: "Eye Contact",
  composition: "Vlog Style",
  lighting: "Ring Light",
  colorGrading: "Natural",
  vibe: "Bedroom Morning"
};

function toBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result.split(",")[1]); // return base64 w/o data: prefix
    };
    reader.onerror = (err) => reject(err);
  });
}

export default function UGCGenerator() {
  const [includeModel, setIncludeModel] = useState(true);
  const [options, setOptions] = useState(defaultOptions);
  const [productFile, setProductFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // lists (as specified)
  const hairStyles = ["Long Straight","Long Wavy","Long Curly","Medium Bob","Short Bob","Pixie Cut","Ponytail","Bun","Braided"];
  const hairColors = ["Black","Dark Brown","Light Brown","Blonde","Platinum","Red","Ginger","Ash Grey"];
  const aspectRatios = ["16:9","9:16"];
  const imageCounts = [1,2,3,4,5,6];
  const speechLanguages = ["Indonesia","English","Malaysia"];
  const genders = ["Female","Male","Androgynous","Unspecified"];
  const ethnicities = ["Indonesian","Asian","Caucasian","African","Middle Eastern","Latin","Indian","Mixed"];
  const poseStyles = ["Eye Contact","Natural Smile","Side Look","Walking","Sitting Casual","Standing Straight","Holding Product","Talking Style","Over-the-Shoulder","Leaning Pose","Looking Down","Action / Movement"];
  const compositions = ["Vlog Style","Product Focus","Full Body","Half Body","Close Up","Lifestyle Shot","Fashion Editorial","POV Shot","Mirror Selfie Style","Minimalist Studio Shot"];
  const lightings = ["Ring Light","Soft Light","Golden Hour","Natural Window Light","Studio Light","High Contrast","Low Light Mood","Neon Light","Outdoor Shade"];
  const colorGradings = ["Natural","Warm","Cool","Cinematic","High Contrast","Soft Pastel","Moody","Vibrant"];
  const vibes = ["Bedroom Morning","Cafe Aesthetic","Outdoor Street","Minimalist Studio","Luxury Living Room","Shopping Mall","Rooftop Sunset","Beach Daylight","Office Modern","Cozy Warm Room","Clean White Background","Fashion Runway Style"];

  const handleFileChange = (e, setter) => {
    const f = e.target.files[0] || null;
    setter(f);
  };

  const handleGenerate = async () => {
    if (!productFile) {
      alert("Product image is required.");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      const productBase64 = await toBase64(productFile);
      const modelBase64 = modelFile ? await toBase64(modelFile) : null;

      const payload = {
        product_image: productBase64,
        model_image: modelBase64,
        include_model: includeModel,
        aspect_ratio: options.aspectRatio,
        image_count: options.imageCount,
        speech_language: options.speechLanguage,
        model_gender: options.modelGender,
        hair_style: options.hairStyle,
        hair_color: options.hairColor,
        ethnicity: options.ethnicity,
        pose_style: options.poseStyle,
        composition: options.composition,
        lighting: options.lighting,
        color_grading: options.colorGrading,
        vibe: options.vibe
      };

      const resp = await fetch("/api/generate-ugc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(text || "Server error");
      }
      const data = await resp.json();
      // Expect backend returns array of base64 images data: ["..."] or urls
      if (data.images && Array.isArray(data.images)) {
        setResults(data.images);
      } else {
        // fallback if backend returns object
        setResults([JSON.stringify(data).slice(0,500)]);
      }
    } catch (err) {
      console.error(err);
      alert("Error generating images: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6" style={{ background: "#242424", borderRadius: 12 }}>
      <h2 style={{ color: "#FFC400", fontSize: 20, marginBottom: 8 }}>UGC Outfit Generator</h2>

      {/* Include Model Toggle */}
      <label style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <input type="checkbox" checked={includeModel} onChange={e => setIncludeModel(e.target.checked)} />
        <span>Include Model</span>
      </label>

      {/* Upload boxes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{ padding: 12, border: "2px dashed #3a3a3a", borderRadius: 8 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Product Image (required)</label>
          <input type="file" accept="image/*" onChange={(e)=>handleFileChange(e, setProductFile)} />
          {productFile && <div style={{ marginTop: 8 }}>{productFile.name}</div>}
        </div>

        <div style={{ padding: 12, border: "2px dashed #3a3a3a", borderRadius: 8 }}>
          <label style={{ display: "block", marginBottom: 6 }}>Model Image (optional)</label>
          <input type="file" accept="image/*" onChange={(e)=>handleFileChange(e, setModelFile)} disabled={!includeModel} />
          {modelFile && <div style={{ marginTop: 8 }}>{modelFile.name}</div>}
        </div>
      </div>

      {/* Controls: aspect ratio, count, speech */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ marginBottom: 6 }}>Aspect Ratio</div>
          <select value={options.aspectRatio} onChange={e => setOptions(o=>({...o, aspectRatio: e.target.value}))}>
            {aspectRatios.map(r=> <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Image Count</div>
          <select value={options.imageCount} onChange={e => setOptions(o=>({...o, imageCount: Number(e.target.value)}))}>
            {imageCounts.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Speech Language</div>
          <select value={options.speechLanguage} onChange={e => setOptions(o=>({...o, speechLanguage: e.target.value}))}>
            {speechLanguages.map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Model settings including hair */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ marginBottom: 6 }}>Model Gender</div>
          <select value={options.modelGender} onChange={e => setOptions(o=>({...o, modelGender: e.target.value}))}>
            {genders.map(g=> <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Ethnicity</div>
          <select value={options.ethnicity} onChange={e => setOptions(o=>({...o, ethnicity: e.target.value}))}>
            {ethnicities.map(e=> <option key={e} value={e}>{e}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Hair Style</div>
          <select value={options.hairStyle} onChange={e => setOptions(o=>({...o, hairStyle: e.target.value}))}>
            {hairStyles.map(h=> <option key={h} value={h}>{h}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Hair Color</div>
          <select value={options.hairColor} onChange={e => setOptions(o=>({...o, hairColor: e.target.value}))}>
            {hairColors.map(h=> <option key={h} value={h}>{h}</option>)}
          </select>
        </div>
      </div>

      {/* Pose, composition, lighting, grading, vibe */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
        <div>
          <div style={{ marginBottom: 6 }}>Pose Style</div>
          <select value={options.poseStyle} onChange={e => setOptions(o=>({...o, poseStyle: e.target.value}))}>
            {poseStyles.map(p=> <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Composition</div>
          <select value={options.composition} onChange={e => setOptions(o=>({...o, composition: e.target.value}))}>
            {compositions.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Lighting</div>
          <select value={options.lighting} onChange={e => setOptions(o=>({...o, lighting: e.target.value}))}>
            {lightings.map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div>
          <div style={{ marginBottom: 6 }}>Color Grading</div>
          <select value={options.colorGrading} onChange={e => setOptions(o=>({...o, colorGrading: e.target.value}))}>
            {colorGradings.map(c=> <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>Vibe / Background</div>
        <select value={options.vibe} onChange={e => setOptions(o=>({...o, vibe: e.target.value}))}>
          {vibes.map(v=> <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            background: "#FFC400",
            border: "none",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            minWidth: 180,
            fontWeight: "600"
          }}
        >
          {loading ? "Generating..." : "Generate UGC"}
        </button>
      </div>

      <div>
        <h3 style={{ color: "#fff", marginBottom: 8 }}>Results</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {results.length === 0 && <div style={{ color: "#bbbbbb" }}>No images yet.</div>}
          {results.map((img, idx) => (
            <div key={idx} style={{ background: "#1b1b1b", padding: 8, borderRadius: 8 }}>
              {/* If string starts with data: treat as base64; otherwise show text */}
              {typeof img === "string" && img.startsWith("data:image") ? (
                <>
                  <img src={img} alt={`result-${idx}`} style={{ width: "100%", borderRadius: 6 }} />
                  <a download={`ugc-${idx}.png`} href={img} style={{ display: "inline-block", marginTop: 8 }}>
                    <button style={{ background: "#FFC400", border: "none", padding: "6px 8px", borderRadius: 6 }}>Download</button>
                  </a>
                </>
              ) : typeof img === "string" && img.startsWith("/") ? (
                // image URL
                <>
                  <img src={img} alt={`result-${idx}`} style={{ width: "100%", borderRadius: 6 }} />
                  <a download style={{ display: "inline-block", marginTop: 8 }} href={img}> 
                    <button style={{ background: "#FFC400", border: "none", padding: "6px 8px", borderRadius: 6 }}>Download</button>
                  </a>
                </>
              ) : (
                <pre style={{ color: "#ddd", whiteSpace: "pre-wrap", fontSize: 12 }}>{String(img).slice(0,1000)}</pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
