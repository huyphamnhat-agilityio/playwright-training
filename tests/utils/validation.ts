export const isAscending = (arr: string[]) =>
  arr.every((v, i) => i === 0 || arr[i - 1].localeCompare(v) <= 0);

export const isDescending = (arr: string[]) =>
  arr.every((v, i) => i === 0 || arr[i - 1].localeCompare(v) >= 0);
