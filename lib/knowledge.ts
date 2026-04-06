export const PRODUCT_SPECS = {
  name: "Vulcan OmniPro 220",
  processes: ["MIG", "Flux-Cored", "DC TIG", "Stick"],
  inputVoltage: ["120V", "240V"],
  dutyCycles: {
    "240V": {
      MIG: "25% @ 200A",
      TIG: "30% @ 175A",
      Stick: "25% @ 175A",
    },
    "120V": {
      MIG: "40% @ 90A",
      TIG: "40% @ 110A",
      Stick: "40% @ 80A",
    },
  },
  polaritySetup: {
    MIG: {
      description: "DCEP - Electrode Positive",
      torch: "Positive (+)",
      ground: "Negative (-)",
      shieldingGas: "Required (typically 75% Ar / 25% CO2)",
    },
    "Flux-Cored": {
      description: "DCEN - Electrode Negative",
      torch: "Negative (-)",
      ground: "Positive (+)",
      shieldingGas: "None / Self-shielded",
    },
    Stick: {
      description: "DCEP - Electrode Positive",
      torch: "Positive (+)",
      ground: "Negative (-)",
    },
    TIG: {
      description: "DCEN - Electrode Negative",
      torch: "Negative (-)",
      ground: "Positive (+)",
      shieldingGas: "100% Argon",
    },
  },
  troubleshooting: {
    porosity: [
      "Check shielding gas flow/pressure",
      "Ensure base metal is clean (no rust/oil/paint)",
      "Check for wind or drafts blowing gas away",
      "Verify correct polarity (especially for Flux-Cored)",
      "Check for leaks in gas hose or O-rings",
    ],
  },
};
