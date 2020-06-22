const nonZero = (value: string) => {
  const num = +value;
  return num !== 0 && !isNaN(num);
}

export default nonZero;
