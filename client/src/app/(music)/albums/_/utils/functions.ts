function getRandomColorInRange(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomTwoColorGradient() {
  const color1 = () => getRandomColorInRange(0, 124);
  const color2 = () => getRandomColorInRange(125, 255);
  const gradient1 = `rgba(${color1()}, ${color1()}, ${color1()},0.8)`;
  const gradient2 = `rgba(${color2()}, ${color2()}, ${color2()},0.8)`;
  return [gradient1, gradient2];
}

export { generateRandomTwoColorGradient, getRandomColorInRange };
