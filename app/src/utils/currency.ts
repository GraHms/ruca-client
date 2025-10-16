const meticalFormatter = new Intl.NumberFormat('pt-MZ', {
  style: 'currency',
  currency: 'MZN',
  minimumFractionDigits: 0
});

export const formatMetical = (value: number): string => meticalFormatter.format(value);
