export let visited: number[] = []

export function resetVisited(mediaCount: number) {
  visited = Array.from({ length: mediaCount }, (_, i) => i + 1)
    .sort(() => Math.random() - 0.5);
}