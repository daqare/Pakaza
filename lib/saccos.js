export const saccos = [
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

export const getSaccoById = (id) => {
  return saccos.find((s) => s.id === id);
};
