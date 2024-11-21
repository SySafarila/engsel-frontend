const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat().format(amount);
};

export default formatRupiah;
