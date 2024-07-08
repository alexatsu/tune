function randomRGBPastelColor(): [number, number, number] {
  const r = Math.floor(Math.random() * (150 + 1)) + 100;
  const g = Math.floor(Math.random() * (150 + 1)) + 100;
  const b = Math.floor(Math.random() * (150 + 1)) + 100;
  return [r, g, b];
}

export { randomRGBPastelColor };
