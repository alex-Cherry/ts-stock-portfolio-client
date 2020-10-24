const nonZero = (value: string) => {
  // console.log('nonZero', value)
  const num = +value;
  return num !== 0 && !isNaN(num);
}

export default nonZero;
