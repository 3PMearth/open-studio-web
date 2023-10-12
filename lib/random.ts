export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomSlug() {
  const rnd = Math.random().toString(36).substring(2, 6);
  const timestamp = new Date().getTime().toString(36).substring(2, 5);
  return `user-${rnd}${timestamp}`;
}
