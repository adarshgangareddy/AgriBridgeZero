export type MeasurementType =
  | "measured"
  | "estimated"
  | "predicted"
  | "unavailable"
  | "requires_lab_validation";

export interface ParameterReading {
  value: number | null;
  unit: string;
  status: "Good" | "Attention" | "Stable" | "Low" | "Suitable" | "Moderate";
  measurementType: MeasurementType;
  source: "device" | "model" | "lab" | "unavailable";
  confidence?: number;
  timestamp: string;
}

export interface SoilScan {
  id: string;
  timestamp: string;
  depthCm: number;
  soil: Record<string, ParameterReading>;
  nutrients: Record<string, ParameterReading>;
  contaminants: Record<string, ParameterReading>;
}

export interface CadastralParcel {
  id: string;
  surveyNumber: string;
  name: string;
  areaAcres: number;
  location: string;
  soilType: string;
  crop: string;
  status: "Attention required" | "Healthy" | "Needs review";
  lastScan: string;
  coordinates: [number, number][];
  image: string;
  snapshot: {
    ph: { value: number; status: "Suitable" | "Attention" };
    nitrogen: { value: string; status: "Low" | "Good" | "Medium" };
    phosphorus: { value: string; status: "Low" | "Good" | "Attention" };
    potassium: { value: string; status: "Good" | "Stable" };
    moisture: { value: number; status: "Moderate" | "Good" };
    ec: { value: number; status: "Normal" | "High" };
  };
  weather: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    rainfall: number;
  };
}

export interface CropInfo {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  phRange: string;
  optimalMoisture: string;
  npkRequirement: string;
  durationDays: string;
  yieldPotential: string;
  keyNutrientTip: string;
}

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: "Fertilizers" | "Seeds" | "Soil Amendments" | "Inputs";
  image: string;
  description: string;
  targetRequirement: string;
  supplier: string;
  rating: number;
  verified: boolean;
}

export interface AIAgentInfo {
  id: string;
  name: string;
  role: string;
  iconName: string;
  description: string;
  specialty: string;
}

export const demoParcels: CadastralParcel[] = [
  {
    id: "PARCEL-402",
    surveyNumber: "Sy. No. 128/2A",
    name: "GVK Farm",
    areaAcres: 4.02,
    location: "Bengaluru, Karnataka",
    soilType: "Red Loamy Soil",
    crop: "Tomato",
    status: "Attention required",
    lastScan: "17 Sep 2026",
    coordinates: [
      [13.0698, 77.7982],
      [13.0722, 77.8016],
      [13.0694, 77.8045],
      [13.0664, 77.8009],
    ],
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    snapshot: {
      ph: { value: 6.4, status: "Suitable" },
      nitrogen: { value: "Low", status: "Low" },
      phosphorus: { value: "Low", status: "Low" },
      potassium: { value: "Good", status: "Good" },
      moisture: { value: 31, status: "Moderate" },
      ec: { value: 0.72, status: "Normal" },
    },
    weather: {
      temp: 27,
      condition: "Clear Sky",
      humidity: 62,
      wind: 12,
      rainfall: 0,
    },
  },
  {
    id: "PARCEL-284",
    surveyNumber: "Sy. No. 129/1",
    name: "East Field Parcel",
    areaAcres: 2.84,
    location: "Bengaluru, Karnataka",
    soilType: "Sandy Clay Loam",
    crop: "Chilli",
    status: "Healthy",
    lastScan: "16 Sep 2026",
    coordinates: [
      [13.0724, 77.8018],
      [13.0745, 77.8048],
      [13.0718, 77.8072],
      [13.0696, 77.8047],
    ],
    image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80",
    snapshot: {
      ph: { value: 6.8, status: "Suitable" },
      nitrogen: { value: "Good", status: "Good" },
      phosphorus: { value: "Good", status: "Good" },
      potassium: { value: "Good", status: "Good" },
      moisture: { value: 38, status: "Good" },
      ec: { value: 0.54, status: "Normal" },
    },
    weather: {
      temp: 27,
      condition: "Clear Sky",
      humidity: 62,
      wind: 12,
      rainfall: 0,
    },
  },
  {
    id: "PARCEL-350",
    surveyNumber: "Sy. No. 127/4",
    name: "North Terrace Block",
    areaAcres: 3.5,
    location: "Bengaluru, Karnataka",
    soilType: "Alluvial Red Soil",
    crop: "Maize",
    status: "Healthy",
    lastScan: "14 Sep 2026",
    coordinates: [
      [13.0662, 77.7946],
      [13.0696, 77.798],
      [13.0663, 77.8007],
      [13.0638, 77.7968],
    ],
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80",
    snapshot: {
      ph: { value: 6.6, status: "Suitable" },
      nitrogen: { value: "Medium", status: "Good" },
      phosphorus: { value: "Good", status: "Good" },
      potassium: { value: "Stable", status: "Good" },
      moisture: { value: 34, status: "Good" },
      ec: { value: 0.65, status: "Normal" },
    },
    weather: {
      temp: 27,
      condition: "Clear Sky",
      humidity: 62,
      wind: 12,
      rainfall: 0,
    },
  },
];

export const soilTypesList = [
  { id: "red-loamy", name: "Red Loamy Soil", desc: "Rich in iron, moderate drainage, ideal for vegetables and flowers" },
  { id: "black-cotton", name: "Black Cotton Soil", desc: "High clay, excellent moisture retention, rich in calcium and magnesium" },
  { id: "sandy-loam", name: "Sandy Loam Soil", desc: "High aeration, fast draining, rapid root growth" },
  { id: "alluvial", name: "Alluvial Soil", desc: "Highly fertile river basin soil, rich in potash and humus" },
  { id: "clay", name: "Clayey Soil", desc: "Dense texture, retains high nutrients and water" },
  { id: "laterite", name: "Laterite Soil", desc: "Porous, acidic, well suited with organic amendments" },
];

export const irrigationMethods = [
  { id: "drip", name: "Drip Irrigation", desc: "Targeted root zone delivery, 40-60% water saving" },
  { id: "sprinkler", name: "Sprinkler System", desc: "Simulates uniform rainfall for leafy crops and flowers" },
  { id: "borewell", name: "Borewell / Furrow", desc: "Traditional groundwater furrow delivery" },
  { id: "canal", name: "Canal / Flood", desc: "Surface gravity water delivery" },
  { id: "rainfed", name: "Rainfed (Monsoon)", desc: "Dependent on seasonal precipitation" },
];

export const farmingSeasons = [
  { id: "kharif", name: "Kharif (Monsoon: Jun - Oct)", desc: "Warm & humid conditions" },
  { id: "rabi", name: "Rabi (Winter: Nov - Mar)", desc: "Cool weather & controlled moisture" },
  { id: "zaid", name: "Zaid (Summer: Mar - Jun)", desc: "High heat & frequent irrigation" },
];

export const cropLibrary: CropInfo[] = [
  {
    id: "crop-tomato",
    name: "Tomato",
    scientificName: "Solanum lycopersicum",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    phRange: "6.0 - 6.8",
    optimalMoisture: "30 - 35%",
    npkRequirement: "120:60:60 NPK kg/ha",
    durationDays: "90 - 120 days",
    yieldPotential: "35 - 45 tonnes/ha",
    keyNutrientTip: "Requires steady phosphorus for vigorous flowering and calcium to prevent blossom end rot.",
  },
  {
    id: "crop-potato",
    name: "Potato",
    scientificName: "Solanum tuberosum",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80",
    phRange: "5.0 - 6.5",
    optimalMoisture: "30 - 38%",
    npkRequirement: "180:80:150 NPK kg/ha",
    durationDays: "90 - 110 days",
    yieldPotential: "25 - 35 tonnes/ha",
    keyNutrientTip: "Heavy consumer of potassium (K). Slightly acidic soil prevents common scab disease on tubers.",
  },
  {
    id: "crop-rose",
    name: "Rose Flower",
    scientificName: "Rosa hybrida",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80",
    phRange: "6.0 - 6.8",
    optimalMoisture: "32 - 40%",
    npkRequirement: "100:80:80 NPK kg/ha",
    durationDays: "Perennial / Annual Pruning",
    yieldPotential: "1.8 - 2.5 lakh stems/ha",
    keyNutrientTip: "High organic matter demand. Regular micronutrient foliar spray (iron and zinc) enhances bud color and size.",
  },
  {
    id: "crop-marigold",
    name: "Marigold",
    scientificName: "Tagetes erecta",
    image: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=600&q=80",
    phRange: "6.5 - 7.5",
    optimalMoisture: "25 - 30%",
    npkRequirement: "80:40:40 NPK kg/ha",
    durationDays: "75 - 90 days",
    yieldPotential: "12 - 18 tonnes/ha",
    keyNutrientTip: "Hardy crop with natural nematode-repellent roots. Avoid waterlogging during bloom phase.",
  },
  {
    id: "crop-chrysanthemum",
    name: "Chrysanthemum (Sevanti)",
    scientificName: "Chrysanthemum indicum",
    image: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80",
    phRange: "6.2 - 6.8",
    optimalMoisture: "30 - 36%",
    npkRequirement: "100:60:60 NPK kg/ha",
    durationDays: "120 - 140 days",
    yieldPotential: "10 - 14 tonnes/ha",
    keyNutrientTip: "Sensitive to high salinity. Nitrogen boost during early vegetative growth followed by potassium for stalk firmness.",
  },
  {
    id: "crop-cauliflower",
    name: "Cauliflower",
    scientificName: "Brassica oleracea var. botrytis",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=600&q=80",
    phRange: "6.0 - 7.0",
    optimalMoisture: "35 - 45%",
    npkRequirement: "150:80:100 NPK kg/ha",
    durationDays: "85 - 110 days",
    yieldPotential: "20 - 30 tonnes/ha",
    keyNutrientTip: "Crucial boron and molybdenum requirement; deficiency causes brown curd rotting and whiptail.",
  },
  {
    id: "crop-capsicum",
    name: "Capsicum (Bell Pepper)",
    scientificName: "Capsicum annuum var. grossum",
    image: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=600&q=80",
    phRange: "6.0 - 6.8",
    optimalMoisture: "30 - 35%",
    npkRequirement: "140:70:90 NPK kg/ha",
    durationDays: "110 - 130 days",
    yieldPotential: "25 - 40 tonnes/ha",
    keyNutrientTip: "Demands well-drained loamy soil with steady magnesium to keep leaves deep green and glossy.",
  },
  {
    id: "crop-onion",
    name: "Onion",
    scientificName: "Allium cepa",
    image: "https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=600&q=80",
    phRange: "6.0 - 7.0",
    optimalMoisture: "25 - 32%",
    npkRequirement: "100:50:80 NPK kg/ha",
    durationDays: "120 - 140 days",
    yieldPotential: "20 - 25 tonnes/ha",
    keyNutrientTip: "Requires sulfur (20-25 kg/ha) to enhance pungency, bulb firmness and long storage shelf-life.",
  },
  {
    id: "crop-chilli",
    name: "Chilli",
    scientificName: "Capsicum annuum",
    image: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80",
    phRange: "6.2 - 7.5",
    optimalMoisture: "28 - 34%",
    npkRequirement: "100:50:50 NPK kg/ha",
    durationDays: "150 - 180 days",
    yieldPotential: "15 - 20 tonnes/ha",
    keyNutrientTip: "Needs calcium and zinc; prevent water stagnation to eliminate root rot and leaf curl virus vectors.",
  },
  {
    id: "crop-maize",
    name: "Maize (Sweet Corn)",
    scientificName: "Zea mays",
    image: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80",
    phRange: "5.8 - 7.2",
    optimalMoisture: "35 - 42%",
    npkRequirement: "150:75:50 NPK kg/ha",
    durationDays: "95 - 110 days",
    yieldPotential: "7 - 9 tonnes/ha",
    keyNutrientTip: "Requires zinc sulfate at basal stage and split nitrogen during knee-high and tasseling stages.",
  },
];

export interface CropSuitabilityResult {
  score: number; // 0 - 100%
  status: "Highly Suitable" | "Suitable with Care" | "Requires Soil Amendment";
  reasons: string[];
  careGuide: {
    watering: string;
    fertilizer: string;
    soilTreatment: string;
    criticalPeriod: string;
  };
}

export function evaluateCropSuitability(
  crop: CropInfo,
  soilType: string,
  ph = 6.4,
  moisture = 31
): CropSuitabilityResult {
  let score = 90;
  const reasons: string[] = [];

  // Parse pH range
  const parts = crop.phRange.split("-").map(s => parseFloat(s.trim()));
  const minPh = parts[0] || 6.0;
  const maxPh = parts[1] || 7.0;

  if (ph >= minPh && ph <= maxPh) {
    score += 5;
    reasons.push(`Soil pH (${ph}) is within the optimal ${crop.phRange} range for ${crop.name}.`);
  } else {
    score -= 15;
    reasons.push(`Soil pH (${ph}) is slightly outside ideal ${crop.phRange}; requires mild adjustment.`);
  }

  // Soil type compatibility
  if (soilType.toLowerCase().includes("loam") || soilType.toLowerCase().includes("red")) {
    score += 5;
    reasons.push(`${soilType} offers healthy drainage and root aeration for ${crop.name}.`);
  } else {
    reasons.push(`Maintain good soil porosity in ${soilType} using farmyard compost.`);
  }

  // Moisture comparison
  if (moisture >= 25 && moisture <= 45) {
    reasons.push(`Current moisture level (${moisture}%) matches germination and vegetative uptake.`);
  }

  const boundedScore = Math.min(98, Math.max(65, score));
  const status =
    boundedScore >= 85
      ? "Highly Suitable"
      : boundedScore >= 75
      ? "Suitable with Care"
      : "Requires Soil Amendment";

  return {
    score: boundedScore,
    status,
    reasons,
    careGuide: {
      watering: `Maintain soil moisture around ${crop.optimalMoisture} using drip irrigation to avoid leaf wetness.`,
      fertilizer: `Apply balanced ${crop.npkRequirement}. ${crop.keyNutrientTip}`,
      soilTreatment: "Incorporate well-rotted FYM (Farm Yard Manure) at 10 tonnes/acre to enrich organic carbon.",
      criticalPeriod: `Monitor closely during flowering and fruit/bloom set (${crop.durationDays} cycle).`,
    },
  };
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "prod-ssp",
    name: "Single Super Phosphate (SSP)",
    category: "Fertilizers",
    image: "https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=400&q=80",
    description: "Granular phosphorus (16% P2O5) + 11% Sulfur + 19% Calcium for vigorous root growth.",
    targetRequirement: "Corrects low phosphorus detected on Sy. No. 128/2A",
    supplier: "Kisan Agro Supplies Ltd.",
    rating: 4.8,
    verified: true,
  },
  {
    id: "prod-bio-npk",
    name: "Certified Bio-NPK Consortium",
    category: "Fertilizers",
    image: "https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=400&q=80",
    description: "Multi-strain bacterial consortium for natural nitrogen fixation and phosphorus solubilization.",
    targetRequirement: "Enhances soil microbial health and nutrient uptake",
    supplier: "BioGreen Agriculture",
    rating: 4.9,
    verified: true,
  },
  {
    id: "prod-tomato-seeds",
    name: "Arka Rakshak F1 Hybrid Tomato",
    category: "Seeds",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80",
    description: "Triple disease-resistant hybrid bred for southern loamy soils. High yield potential.",
    targetRequirement: "Optimal for Sy. No. 128/2A microclimate",
    supplier: "ICAR-IIHR Certified Seeds",
    rating: 4.9,
    verified: true,
  },
  {
    id: "prod-gypsum",
    name: "Agricultural Grade Gypsum",
    category: "Soil Amendments",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6ef23961?auto=format&fit=crop&w=400&q=80",
    description: "Improves soil structure, relieves compaction, and balances Electrical Conductivity.",
    targetRequirement: "Maintains optimal soil flocculation and moisture retention",
    supplier: "SoilCare India",
    rating: 4.7,
    verified: true,
  },
];

export const aiSpecialistAgents: AIAgentInfo[] = [
  {
    id: "agent-soil",
    name: "SOIL AGENT",
    role: "Soil Chemist & Pedologist",
    iconName: "Activity",
    description: "Understands soil conditions, pH balancing, salinity, EC and mineral kinetics.",
    specialty: "pH, EC, Organic Carbon, Texture",
  },
  {
    id: "agent-crop",
    name: "CROP AGENT",
    role: "Agronomist Specialist",
    iconName: "Sprout",
    description: "Understands crop physiological needs, phenology stages and nutrient deficits.",
    specialty: "Crop matching, NPK timelines",
  },
  {
    id: "agent-contaminant",
    name: "CONTAMINANT AGENT",
    role: "Risk & Residue Analyst",
    iconName: "AlertTriangle",
    description: "Analyzes supported risk signals, heavy metals, toxic residues and salinity drift.",
    specialty: "Heavy metals, chemical safety",
  },
  {
    id: "agent-weather",
    name: "WEATHER AGENT",
    role: "Meteorological Forecaster",
    iconName: "CloudSun",
    description: "Understands microclimate, rainfall patterns, humidity, and evapotranspiration.",
    specialty: "Microclimate, irrigation scheduling",
  },
  {
    id: "agent-knowledge",
    name: "KNOWLEDGE AGENT",
    role: "Agricultural Researcher",
    iconName: "Database",
    description: "Retrieves scientific research, regional agricultural university packages of practice.",
    specialty: "Verified agro-scientific literature",
  },
  {
    id: "agent-farmer",
    name: "FARMER ASSISTANT",
    role: "Multilingual Advisor",
    iconName: "UserRound",
    description: "Translates complex biochemical readings into plain, actionable advice in your mother tongue.",
    specialty: "Kannada, Telugu, Hindi, English, Japanese",
  },
];

export const whyAgriBridgeItems = [
  {
    title: "DATA FROM YOUR LAND",
    description: "Uses actual field measurements from our multi-depth physical sensor probe rather than generic regional averages.",
  },
  {
    title: "CROP-AWARE",
    description: "Interprets soil chemistry specifically against the exact physiological requirements of your selected crop.",
  },
  {
    title: "AI-POWERED",
    description: "Leverages Machine Learning, Deep Learning, GenAI and specialized agricultural agents to extract deep meaning.",
  },
  {
    title: "MAP-CENTRIC",
    description: "Connects every sensor scan point to a real cadastral land parcel with precise GPS coordinates.",
  },
  {
    title: "CONTINUOUS",
    description: "Tracks changes over crop cycles to ensure long-term soil regeneration and sustainable yield growth.",
  },
  {
    title: "FARMER-FIRST",
    description: "Explains complex soil chemistry in plain, understandable language across your native mother tongue.",
  },
];

export const hardwareSpecs = {
  model: "AgriBridgeZero ABZ-001",
  tagline: "All-in-one intelligent field analyzer",
  depths: [
    { range: "0 - 10 cm", label: "Top Soil (Root crown & seedbed)" },
    { range: "10 - 30 cm", label: "Mid Layer (Active feeding zone)" },
    { range: "30 - 60 cm", label: "Deep Layer (Subsoil & moisture reserve)" },
  ],
  modules: [
    { title: "Soil Chemistry Module", items: "pH, EC, NPK, Calcium, Magnesium, Sulfur, Micronutrients" },
    { title: "Contaminant Detection Module", items: "Heavy metals (Pb, Cd, As), pesticide residues, nitrates" },
    { title: "Soil Biology Module", items: "Organic carbon, microbial activity index, soil respiration" },
    { title: "Soil Physical Module", items: "Volumetric moisture, temperature, compaction, salinity" },
  ],
  capabilities: [
    "Macro & Micro Nutrient Analysis",
    "Toxic Substance & Heavy Metal Detection",
    "Soil Health Index (SHI) Score",
    "Crop-Specific Recommendations",
    "Plant Health Imaging via Integrated AI Camera",
    "Location-Based GNSS High-Precision Mapping",
    "Environmental Sensors (Air temp, humidity, light)",
    "Multilingual Voice & Screen AI Advisory",
  ],
};
