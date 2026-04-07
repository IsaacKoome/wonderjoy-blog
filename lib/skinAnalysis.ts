// Skin analysis utility using TensorFlow.js and canvas pixel analysis
// This runs entirely in the browser - no cloud costs

export interface SkinAnalysisResult {
  score: number;
  skinType: "Dry" | "Oily" | "Combination" | "Normal";
  concerns: string[];
  recommendations: string[];
  products: { name: string; link: string }[];
}

// Analyze skin brightness, texture, and redness from image data
export async function analyzeSkinFromImage(imageElement: HTMLImageElement | HTMLVideoElement): Promise<SkinAnalysisResult> {
  // Create a canvas to extract pixel data
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = imageElement.width || 500;
  canvas.height = imageElement.height || 500;
  ctx?.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
  if (!imageData) {
    throw new Error("Could not extract image data");
  }
  
  // Analyze pixel data
  const analysis = analyzePixelData(imageData);
  
  // Generate recommendations based on analysis
  return generateResults(analysis);
}

function analyzePixelData(imageData: ImageData): {
  avgBrightness: number;
  avgRedness: number;
  textureVariance: number;
  oilLevel: number;
} {
  const data = imageData.data;
  let totalBrightness = 0;
  let totalRedness = 0;
  let totalGreenness = 0;
  let totalBlueness = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    // Brightness = (R + G + B) / 3
    const brightness = (r + g + b) / 3;
    totalBrightness += brightness;
    
    // Redness = R / (R + G + B) - higher means more redness (inflammation)
    const sum = r + g + b;
    const redness = sum > 0 ? r / sum : 0;
    totalRedness += redness;
    
    totalGreenness += g;
    totalBlueness += b;
  }
  
  const pixelCount = data.length / 4;
  const avgBrightness = totalBrightness / pixelCount;
  const avgRedness = totalRedness / pixelCount;
  const avgGreenness = totalGreenness / pixelCount;
  const avgBlueness = totalBlueness / pixelCount;
  
  // Calculate texture variance (simplified)
  let variance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = (r + g + b) / 3;
    variance += Math.pow(brightness - avgBrightness, 2);
  }
  const textureVariance = Math.sqrt(variance / pixelCount);
  
  // Estimate oil level (shininess detection via brightness + blue channel)
  // Oily skin tends to have higher brightness and lower blue channel
  const oilLevel = (avgBrightness / 255) * (1 - avgBlueness / 255);
  
  return {
    avgBrightness: avgBrightness / 255,
    avgRedness,
    textureVariance: textureVariance / 100,
    oilLevel,
  };
}

function generateResults(analysis: {
  avgBrightness: number;
  avgRedness: number;
  textureVariance: number;
  oilLevel: number;
}): SkinAnalysisResult {
  const concerns: string[] = [];
  const recommendations: string[] = [];
  const products: { name: string; link: string }[] = [];
  
  // Determine skin type based on oil level and texture
  let skinType: "Dry" | "Oily" | "Combination" | "Normal" = "Normal";
  if (analysis.oilLevel > 0.6) {
    skinType = "Oily";
  } else if (analysis.oilLevel < 0.35) {
    skinType = "Dry";
  } else if (analysis.oilLevel > 0.45 && analysis.oilLevel < 0.55) {
    skinType = "Combination";
  }
  
  // Check for redness (inflammation)
  if (analysis.avgRedness > 0.4) {
    concerns.push("Slight redness detected (possible inflammation)");
    recommendations.push("Use calming ingredients like niacinamide or centella asiatica");
    products.push({
      name: "The Ordinary Niacinamide 10% + Zinc",
      link: "https://amazon.com/dp/B01M1AJ6N2/?tag=wonderjoyai20-20",
    });
  }
  
  // Check for texture issues
  if (analysis.textureVariance > 25) {
    concerns.push("Uneven texture detected");
    recommendations.push("Add gentle exfoliation 2-3 times per week with salicylic or lactic acid");
    products.push({
      name: "Paula's Choice 2% BHA Liquid Exfoliant",
      link: "https://amazon.com/dp/B01M1AJ6N2/?tag=wonderjoyai20-20",
    });
  }
  
  // Check for dullness (low brightness)
  if (analysis.avgBrightness < 0.5) {
    concerns.push("Skin appears slightly dull");
    recommendations.push("Incorporate Vitamin C serum in your morning routine for brightness");
    products.push({
      name: "The Ordinary Vitamin C Suspension 23%",
      link: "https://amazon.com/dp/B07664W7V6/?tag=wonderjoyai20-20",
    });
  }
  
  // Skin type specific recommendations
  if (skinType === "Oily") {
    concerns.push("Higher oil production detected");
    recommendations.push("Use oil-free, non-comedogenic products and consider adding a clay mask weekly");
    products.push({
      name: "CeraVe Foaming Facial Cleanser",
      link: "https://amazon.com/dp/B01N5MZWQY/?tag=wonderjoyai20-20",
    });
  } else if (skinType === "Dry") {
    concerns.push("Lower moisture levels detected");
    recommendations.push("Use a richer moisturizer and consider adding facial oil to your night routine");
    products.push({
      name: "CeraVe Moisturizing Cream",
      link: "https://amazon.com/dp/B00TTD9BRC/?tag=wonderjoyai20-20",
    });
  }
  
  // Add generic recommendation if no specific concerns
  if (concerns.length === 0) {
    recommendations.push("Your skin looks healthy! Maintain your routine with daily sunscreen");
    products.push({
      name: "Black Girl Sunscreen SPF 30",
      link: "https://amazon.com/dp/B0CV9R8DTK/?tag=wonderjoyai20-20",
    });
  }
  
  // Calculate skin score (0-100)
  let score = 70; // base score
  score += (analysis.avgBrightness * 20); // +0 to +20 for brightness
  score -= (analysis.avgRedness * 30); // -0 to -30 for redness
  score -= (analysis.textureVariance * 0.5); // small penalty for texture
  score = Math.min(98, Math.max(45, Math.round(score)));
  
  return {
    score,
    skinType,
    concerns: concerns.slice(0, 3), // max 3 concerns
    recommendations: recommendations.slice(0, 3), // max 3 recommendations
    products: products.slice(0, 3), // max 3 products
  };
}