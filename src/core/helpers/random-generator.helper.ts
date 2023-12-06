export function randomCodeGenerator(offset: number): string {
  const random = Math.random().toString();
  return random.substring(random.length - offset, random.length);
}
