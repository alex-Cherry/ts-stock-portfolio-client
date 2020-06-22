export const getQueryParams = (search: string) => {
  // delete an asterisk
  if (search.substring(0, 1) === '?') {
    search = search.substring(1);
  }
  const result: { [key: string]: any } = {};
  search.split('&').forEach(i => {
    const item = i.split('=');
    if (item.length === 1 && item[0]) {
      result[item[0]] = true
    } else if (item.length >= 2) {
      result[item[0]] = item[1]
    }
  })

  return result;
}
