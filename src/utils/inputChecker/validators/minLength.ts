const minLength = (min: number) => (value: string) => {
  return ('' + value).length >= min;
}

export default minLength;
