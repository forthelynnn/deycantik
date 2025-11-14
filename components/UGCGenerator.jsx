// UGCGenerator.jsx import React, { useState } from "react";

export default function UGCGenerator() { const [includeModel, setIncludeModel] = useState(true); const [productImage, setProductImage] = useState(null); const [modelImage, setModelImage] = useState(null); const [aspectRatio, setAspectRatio] = useState("9:16"); const [imageCount, setImageCount] = useState(2); const [speechLanguage, setSpeechLanguage] = useState("Indonesia");

const [gender, setGender] = useState("Female"); const [hairStyle, setHairStyle] = useState("Long Straight"); const [hairColor, setHairColor] = useState("Black"); const [ethnicity, setEthnicity] = useState("Indonesian"); const [pose, setPose] = useState("Eye Contact"); const [composition, setComposition] = useState("Vlog Style"); const [lighting, setLighting] = useState("Ring Light"); const [colorGrade, setColorGrade] = useState("Natural"); const [vibe, setVibe] = useState("Bedroom Morning");

const handleSubmit = () => { alert("Generator logic belum dihubungkan ke API — UI sudah siap."); };

return ( <div className="generator-wrapper"> <h1 className="title">UGC Outfit Generator</h1>

{/* Include Model Toggle */}
  <label className="toggle-row">
    <input
      type="checkbox"
      checked={includeModel}
      onChange={(e) => setIncludeModel(e.target.checked)}
    />
    <span>Include Model</span>
  </label>

  {/* Upload Boxes */}
  <div className="upload-section">
    <label className="upload-box">
      <span>Upload Product Image</span>
      <input type="file" onChange={(e) => setProductImage(e.target.files[0])} />
    </label>

    <label className="upload-box">
      <span>Upload Model Image (optional)</span>
      <input type="file" onChange={(e) => setModelImage(e.target.files[0])} />
    </label>
  </div>

  {/* Aspect Ratio */}
  <div className="segment">
    <p>Aspect Ratio:</p>
    {['16:9','9:16'].map(v => (
      <button key={v} className={aspectRatio===v?"active":""} onClick={()=>setAspectRatio(v)}>{v}</button>
    ))}
  </div>

  {/* Image Count */}
  <div className="segment">
    <p>Image Count:</p>
    {[1,2,3,4,5,6].map(v => (
      <button key={v} className={imageCount===v?"active":""} onClick={()=>setImageCount(v)}>{v}</button>
    ))}
  </div>

  {/* Speech Language */}
  <div className="segment">
    <p>Speech Language:</p>
    {['Indonesia','English','Malaysia'].map(v => (
      <button key={v} className={speechLanguage===v?"active":""} onClick={()=>setSpeechLanguage(v)}>{v}</button>
    ))}
  </div>

  {/* Dropdowns */}
  <select value={gender} onChange={(e)=>setGender(e.target.value)}>
    <option>Female</option>
    <option>Male</option>
    <option>Androgynous</option>
    <option>Unspecified</option>
  </select>

  <select value={hairStyle} onChange={(e)=>setHairStyle(e.target.value)}>
    <option>Long Straight</option><option>Long Wavy</option><option>Long Curly</option>
    <option>Medium Bob</option><option>Short Bob</option><option>Pixie Cut</option>
    <option>Ponytail</option><option>Bun</option><option>Braided</option>
  </select>

  <select value={hairColor} onChange={(e)=>setHairColor(e.target.value)}>
    <option>Black</option><option>Dark Brown</option><option>Light Brown</option>
    <option>Blonde</option><option>Platinum</option><option>Red</option>
    <option>Ginger</option><option>Ash Grey</option>
  </select>

  <select value={ethnicity} onChange={(e)=>setEthnicity(e.target.value)}>
    <option>Indonesian</option><option>Asian</option><option>Caucasian</option>
    <option>African</option><option>Middle Eastern</option>
    <option>Latin</option><option>Indian</option><option>Mixed</option>
  </select>

  <select value={pose} onChange={(e)=>setPose(e.target.value)}>
    <option>Eye Contact</option><option>Natural Smile</option><option>Side Look</option>
    <option>Walking</option><option>Sitting Casual</option><option>Standing Straight</option>
    <option>Holding Product</option><option>Talking Style</option>
    <option>Over-the-Shoulder</option><option>Leaning Pose</option>
    <option>Looking Down</option><option>Action / Movement</option>
  </select>

  <select value={composition} onChange={(e)=>setComposition(e.target.value)}>
    <option>Vlog Style</option><option>Product Focus</option><option>Full Body</option>
    <option>Half Body</option><option>Close Up</option><option>Lifestyle Shot</option>
    <option>Fashion Editorial</option><option>POV Shot</option>
    <option>Mirror Selfie Style</option><option>Minimalist Studio Shot</option>
  </select>

  <select value={lighting} onChange={(e)=>setLighting(e.target.value)}>
    <option>Ring Light</option><option>Soft Light</option><option>Golden Hour</option>
    <option>Natural Window Light</option><option>Studio Light</option>
    <option>High Contrast</option><option>Low Light Mood</option>
    <option>Neon Light</option><option>Outdoor Shade</option>
  </select>

  <select value={colorGrade} onChange={(e)=>setColorGrade(e.target.value)}>
    <option>Natural</option><option>Warm</option><option>Cool</option>
    <option>Cinematic</option><option>High Contrast</option>
    <option>Soft Pastel</option><option>Moody</option><option>Vibrant</option>
  </select>

  <select value={vibe} onChange={(e)=>setVibe(e.target.value)}>
    <option>Bedroom Morning</option><option>Cafe Aesthetic</option>
    <option>Outdoor Street</option><option>Minimalist Studio</option>
    <option>Luxury Living Room</option><option>Shopping Mall</option>
    <option>Rooftop Sunset</option><option>Beach Daylight</option>
    <option>Office Modern</option><option>Cozy Warm Room</option>
    <option>Clean White Background</option><option>Fashion Runway Style</option>
  </select>

  {/* Submit */}
  <button className="submit-btn" onClick={handleSubmit}>Generate UGC</button>
</div>

); }

/* globals.css (Letakkan di styles/globals.css)

body { background: #1c1c1c; color: white; padding: 20px; font-family: sans-serif; }

.generator-wrapper { max-width: 420px; margin: auto; background: #242424; padding: 20px; border-radius: 16px; }

.upload-box { border: 2px dashed #555; padding: 20px; margin-bottom: 12px; text-align: center; display: block; border-radius: 12px; }

.segment button { background: #333; padding: 6px 12px; margin-right: 6px; border-radius: 8px; }

.segment .active { background: #ffc400; color: black; }

.submit-btn { width: 100%; background: #ffc400; color: black; padding: 12px; border-radius: 12px; margin-top: 20px; font-size: 16px; }*/

