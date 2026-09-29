// We export this as initial data to load into the store
export const initialSaccos = [
  {
    id: 'SAC-001',
    name: 'Kina SACCO',
    route: 'Nairobi - Machakos',
    color: 'bg-blue-500',
  },
  {
    id: 'SAC-002',
    name: 'Prestige SACCO',
    route: 'Nairobi - Mwingi',
    color: 'bg-purple-500',
  },
  {
    id: 'SAC-003',
    name: 'Makos SACCO',
    route: 'Nairobi - Makueni',
    color: 'bg-green-500',
  },
];

export const getSaccoById = (id, saccosList) => {
  return saccosList.find((s) => s.id === id);
};
