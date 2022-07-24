export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function randint(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randSample(start: number, end: number, length: number) {
  const sample = new Set<number>();
  while (sample.size < length) {
    sample.add(randint(start, end));
  }
  return [...sample];
}
