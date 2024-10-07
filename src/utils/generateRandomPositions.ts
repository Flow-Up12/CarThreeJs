export const generateRandomPositions = (count: number): [number, number, number][] => {
    const terrainWidth = 400;
    const terrainHeight = 400;
    const terrainDepth = 10;
  
    const positions: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * terrainWidth - terrainWidth / 2;
      const z = Math.random() * terrainHeight - terrainHeight / 2;
      const y = Math.random() * terrainDepth / 2 + 0.5;
      positions.push([x, y, z]);
    }
    return positions;
  };
  