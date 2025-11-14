import React, { useState } from "react";

export default function UGCGenerator() {
  const [productImage, setProductImage] = useState(null);
  const [modelImage, setModelImage] = useState(null);

  const [includeModel, setIncludeModel] = useState(true);
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [imageCount, setImageCount] = useState(2);
  const [speechLang, setSpeechLang] = useState("Indonesia");

  const [modelGender, setModelGender] = useState("Female");
  const [hairStyle, setHairStyle] = useState("Long Straight");
  const [hairColor, setHairColor] = useState("Black");
  const [ethnicity, setEthnicity] = useState("Indonesian");
  const [poseStyle, setPoseStyle] = useState("Eye Contact");
  const [composition, setComposition] = useState("Full Body");
  const [lighting, setLighting] = useState("Soft Light");
  const [colorGrading, setColorGrading] = useState("Natural");
  const [vibe, setVibe] = useState("Bedroom Morning");

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleProductUpload = (e) => setProductImage(e.target.files[0]);
  const handleModelUpload = (e) => setModelImage(e.target.files[0]);

  const generateUGC = async () => {
    if (!productImage) {
      alert("Product image is required.");
      return;
    }
    setLoading(true);

    const body = new FormData();
    body.append("product_image", productImage);
    if (modelImage) body.append("model_image", modelImage);

    body.append("include_model", includeModel);
    body.append("aspect_ratio", aspectRatio);
    body.append("image_count", imageCount);
    body.append("speech_language", speechLang);
    body.append("model_gender", modelGender);
    body.append("hair_style", hairStyle);
    body.append("hair_color", hairColor);
    body.append("ethnicity", ethnicity);
    body.append("pose_style", poseStyle);
    body.append("composition", composition);
    body.append("lighting", lighting);
    body.append("color_grading", colorGrading);
    body.append("vibe", vibe);

    const res = await fetch("/api/generate-ugc", { method: "POST", body });
    const data = await res.json();

    setResults(data.images || []);
    setLoading(false);
  };

  return (
    <div className="panel">
      <h2 style={{ color: "#FFC400" }}>UGC Outfit Generator</h2>

      <label>
        <input
          type="checkbox"
          checked={includeModel}
          onChange={() => setIncludeModel(!includeModel)}
        />
        Include Model
      </label>

      <div className="upload-box">
        <p>Upload Product Image</p>
        <input type="file" onChange={handleProductUpload} />
      </div>

      <div className="upload-box">
        <p>Upload Model Image (Optional)</p>
        <input type="file" onChange={handleModelUpload} />
      </div>

      <h3>Aspect Ratio</h3>
      <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)}>
        <option>16:9</option>
        <option>9:16</option>
      </select>

      <h3>Image Count</h3>
      <select value={imageCount} onChange={(e) => setImageCount(e.target.value)}>
        {[1,2,3,4,5,6].map(n => <option key={n}>{n}</option>)}
      </select>

      <h3>Speech Language</h3>
      <select value={speechLang} onChange={(e) => setSpeechLang(e.target.value)}>
        <option>Indonesia</option>
        <option>English</option>
        <option>Malaysia</option>
      </select>

      <h3>Model Gender</h3>
      <select value={modelGender} onChange={(e) => setModelGender(e.target.value)}>
        <option>Female</option>
        <option>Male</option>
        <option>Androgynous</option>
        <option>Unspecified</option>
      </select>

      <h3>Hair Style</h3>
      <select value={hairStyle} onChange={(e) => setHairStyle(e.target.value)}>
        <option>Long Straight</option>
        <option>Long Wavy</option>
        <option>Long Curly</option>
        <option>Medium Bob</option>
        <option>Short Bob</option>
        <option>Pixie Cut</option>
        <option>Ponytail</option>
        <option>Bun</option>
        <option>Braided</option>
      </select>

      <h3>Hair Color</h3>
      <select value={hairColor} onChange={(e) => setHairColor(e.target.value)}>
        <option>Black</option>
        <option>Dark Brown</option>
        <option>Light Brown</option>
        <option>Blonde</option>
        <option>Platinum</option>
        <option>Red</option>
        <option>Ginger</option>
        <option>Ash Grey</option>
      </select>

      <h3>Ethnicity</h3>
      <select value={ethnicity} onChange={(e) => setEthnicity(e.target.value)}>
        <option>Indonesian</option>
        <option>Asian</option>
        <option>Caucasian</option>
        <option>African</option>
        <option>Middle Eastern</option>
        <option>Latin</option>
        <option>Indian</option>
        <option>Mixed</option>
      </select>

      <h3>Pose Style</h3>
      <select value={poseStyle} onChange={(e) => setPoseStyle(e.target.value)}>
        <option>Eye Contact</option>
        <option>Natural Smile</option>
        <option>Side Look</option>
        <option>Walking</option>
        <option>Sitting Casual</option>
        <option>Standing Straight</option>
        <option>Holding Product</option>
        <option>Talking Style</option>
        <option>Over-the-Shoulder</option>
        <option>Leaning Pose</option>
        <option>Looking Down</option>
        <option>Action / Movement</option>
      </select>

      <h3>Composition</h3>
      <select value={composition} onChange={(e) => setComposition(e.target.value)}>
        <option>Vlog Style</option>
        <option>Product Focus</option>
        <option>Full Body</option>
        <option>Half Body</option>
        <option>Close Up</option>
        <option>Lifestyle Shot</option>
        <option>Fashion Editorial</option>
        <option>POV Shot</option>
        <option>Mirror Selfie Style</option>
        <option>Minimalist Studio Shot</option>
      </select>

      <h3>Lighting</h3>
      <select value={lighting} onChange={(e) => setLighting(e.target.value)}>
        <option>Ring Light</option>
        <option>Soft Light</option>
        <option>Golden Hour</option>
        <option>Natural Window Light</option>
        <option>Studio Light</option>
        <option>High Contrast</option>
        <option>Low Light Mood</option>
        <option>Neon Light</option>
        <option>Outdoor Shade</option>
      </select>

      <h3>Color Grading</h3>
      <select value={colorGrading} onChange={(e) => setColorGrading(e.target.value)}>
        <option>Natural</option>
        <option>Warm</option>
        <option>Cool</option>
        <option>Cinematic</option>
        <option>High Contrast</option>
        <option>Soft Pastel</option>
        <option>Moody</option>
        <option>Vibrant</option>
      </select>

      <h3>Vibe / Background</h3>
      <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
        <option>Bedroom Morning</option>
        <option>Cafe Aesthetic</option>
        <option>Outdoor Street</option>
        <option>Minimalist Studio</option>
        <option>Luxury Living Room</option>
        <option>Shopping Mall</option>
        <option>Rooftop Sunset</option>
        <option>Beach Daylight</option>
        <option>Office Modern</option>
        <option>Cozy Warm Room</option>
        <option>Clean White Background</option>
        <option>Fashion Runway Style</option>
      </select>

      <button className="button-primary" onClick={generateUGC} disabled={loading}>
        {loading ? "Generating..." : "Generate UGC"}
      </button>

      {results.length > 0 && (
        <div className="results-grid">
          {results.map((img, i) => (
            <img key={i} src={img} style={{ width: "100%", borderRadius: "10px" }} />
          ))}
        </div>
      )}
    </div>
  );
}
