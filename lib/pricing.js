// Pricing: 200 KES per KG (rounded up)
export const calculatePrice = (weight) => {
  const billableWeight = Math.ceil(weight);
  return billableWeight * 200;
};

// Revenue Split: 50% PAKAZA, 45% Operator, 5% SACCO
export const calculateSplit = (total) => {
  return {
    pakaza: Math.round(total * 0.50),
    operator: Math.round(total * 0.45),
    sacco: Math.round(total * 0.05),
  };
};

// Generate tracking ID (e.g., PAK-7842)
export const generateTrackingId = () => {
  return `PAK-${Math.floor(1000 + Math.random() * 9000)}`;
};
