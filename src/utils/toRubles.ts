const toRubles = (value: number) => {
  const num = +value;
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(num);
}

export {
  toRubles
};
