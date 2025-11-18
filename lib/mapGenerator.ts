
import { TileData, ZoneId, TileType, TileTexture } from '../types';

const GRID_SIZE = 20; 

// --- Algorithms ---

// 1. Binary Space Partitioning (BSP) for Salons/Interiors
const generateBSPMap = (map: TileData[][], x: number, y: number, w: number, h: number) => {
    if (w < 6 || h < 6) return; 

    const splitH = Math.random() > 0.5;
    const splitPos = splitH 
        ? Math.floor(Math.random() * (h - 4)) + 2 
        : Math.floor(Math.random() * (w - 4)) + 2;

    if (splitH) {
        // Horizontal Wall
        for (let i = x + 1; i < x + w - 1; i++) {
            map[y + splitPos][i].type = 'WALL';
            // Add Bookshelves along walls occasionally
            if (Math.random() > 0.3) {
                if (map[y+splitPos-1][i].type === 'FLOOR') {
                    map[y+splitPos-1][i].type = 'OBSTACLE';
                    map[y+splitPos-1][i].variant = 101; // Bookshelf North
                }
            }
        }
        // Add Door
        const doorX = Math.floor(Math.random() * (w - 2)) + x + 1;
        map[y + splitPos][doorX].type = 'FLOOR'; 
        map[y + splitPos][doorX].variant = 0; // Clear obstacle if any

        generateBSPMap(map, x, y, w, splitPos);
        generateBSPMap(map, x, y + splitPos + 1, w, h - splitPos - 1);
    } else {
        // Vertical Wall
        for (let i = y + 1; i < y + h - 1; i++) {
            map[i][x + splitPos].type = 'WALL';
        }
        // Add Door
        const doorY = Math.floor(Math.random() * (h - 2)) + y + 1;
        map[doorY][x + splitPos].type = 'FLOOR';

        generateBSPMap(map, x, y, splitPos, h);
        generateBSPMap(map, x + splitPos + 1, y, w - splitPos - 1, h);
    }
};

// 2. Structured City Layout (Streets & Buildings)
const generateCityLayout = (map: TileData[][]) => {
    // Fill with Buildings first
    for(let y=0; y<GRID_SIZE; y++) {
        for(let x=0; x<GRID_SIZE; x++) {
            map[y][x].type = 'WALL'; // Buildings are default
        }
    }

    const mid = Math.floor(GRID_SIZE/2);

    // Main Avenue (North-South)
    for(let y=0; y<GRID_SIZE; y++) {
        // Road
        for(let x=mid-2; x<=mid+2; x++) {
            map[y][x].type = 'FLOOR';
            map[y][x].texture = 'COBBLE';
        }
        // Sidewalks
        map[y][mid-3].type = 'FLOOR';
        map[y][mid-3].texture = 'PAVEMENT';
        map[y][mid+3].type = 'FLOOR';
        map[y][mid+3].texture = 'PAVEMENT';
    }

    // Cross Street (East-West)
    const crossY = Math.floor(GRID_SIZE/2);
    for(let x=0; x<GRID_SIZE; x++) {
        // Road
        for(let y=crossY-1; y<=crossY+1; y++) {
            map[y][x].type = 'FLOOR';
            map[y][x].texture = 'COBBLE';
        }
         // Sidewalks
         map[crossY-2][x].type = 'FLOOR';
         map[crossY-2][x].texture = 'PAVEMENT';
         map[crossY+2][x].type = 'FLOOR';
         map[crossY+2][x].texture = 'PAVEMENT';
    }

    // Place Lampposts/Obstacles on Sidewalks
    for(let y=2; y<GRID_SIZE-2; y+=4) {
        if (map[y][mid-3].type === 'FLOOR') {
             map[y][mid-3].type = 'OBSTACLE';
             map[y][mid-3].variant = 201; // Lamppost
        }
        if (map[y][mid+3].type === 'FLOOR') {
             map[y][mid+3].type = 'OBSTACLE';
             map[y][mid+3].variant = 201; // Lamppost
        }
    }
};

// 3. Park/Esplanade Layout
const generateParkLayout = (map: TileData[][]) => {
    // Fill with Grass
    for(let y=0; y<GRID_SIZE; y++) {
        for(let x=0; x<GRID_SIZE; x++) {
            map[y][x].type = 'FLOOR';
            map[y][x].texture = 'GRASS';
        }
    }

    const mid = Math.floor(GRID_SIZE/2);

    // Wide Central Gravel Path
    for(let y=0; y<GRID_SIZE; y++) {
        for(let x=mid-2; x<=mid+2; x++) {
             map[y][x].type = 'FLOOR';
             map[y][x].texture = 'PAVEMENT'; // Representing gravel/dirt path
        }
    }

    // Trees lining the path
    for(let y=2; y<GRID_SIZE-2; y+=3) {
         map[y][mid-4].type = 'OBSTACLE'; 
         map[y][mid-4].variant = 301; // Tree
         map[y][mid+4].type = 'OBSTACLE'; 
         map[y][mid+4].variant = 301; // Tree
    }

    // Centerpiece Fountain
    map[mid][mid].type = 'OBSTACLE';
    map[mid][mid].variant = 302; // Fountain
};

// 4. Exhibition Grid (Booths and Aisles)
const generateExhibitionMap = (map: TileData[][]) => {
    const boothSize = 4;
    const aisleSize = 2;
    
    for (let y = 2; y < GRID_SIZE - 2; y++) {
        for (let x = 2; x < GRID_SIZE - 2; x++) {
             if ((x % (boothSize + aisleSize)) < boothSize && (y % (boothSize + aisleSize)) < boothSize) {
                 // Inside a booth
                 const isEdge = (x % (boothSize + aisleSize)) === 0 || (y % (boothSize + aisleSize)) === 0;
                 if (isEdge) {
                     map[y][x].type = 'WALL'; // Booth divider
                 } else {
                     map[y][x].type = 'FLOOR';
                     map[y][x].texture = 'METAL';
                     if (Math.random() > 0.7) {
                         map[y][x].type = 'OBSTACLE';
                         map[y][x].variant = 401; // Steam Engine
                     }
                 }
             } else {
                 map[y][x].type = 'FLOOR';
                 map[y][x].texture = 'METAL';
             }
        }
    }
    
    // Clear central aisle
    const mid = Math.floor(GRID_SIZE / 2);
    for(let i=0; i<GRID_SIZE; i++) {
        map[i][mid].type = 'FLOOR';
        map[i][mid].texture = 'METAL';
        map[i][mid].variant = 0;
        
        map[mid][i].type = 'FLOOR';
        map[mid][i].texture = 'METAL';
        map[mid][i].variant = 0;

        map[i][mid+1].type = 'FLOOR';
        map[i][mid+1].texture = 'METAL';
        map[i][mid+1].variant = 0;
    }
};


export const generateZoneMap = (zoneId: ZoneId): TileData[][] => {
  // Initialize Blank Map
  const map: TileData[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: TileData[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({
        x, y,
        type: 'FLOOR',
        texture: 'NONE', // Default
        variant: 0,
        visible: false,
        lit: false,
      });
    }
    map.push(row);
  }

  // Apply Algorithm based on Biome
  if (zoneId === 'SALON') {
      generateBSPMap(map, 1, 1, GRID_SIZE - 2, GRID_SIZE - 2);
      // Texture Check & Rugs
      map.forEach(row => row.forEach(t => { 
          if(t.type==='FLOOR') {
              t.texture='PARQUET';
              // Chance for Rug
              if (Math.random() > 0.9) t.variant = 102; // Rug
          } 
      }));
  } 
  else if (zoneId === 'ESPLANADE') {
      generateParkLayout(map);
  } 
  else if (zoneId === 'STREET') {
      generateCityLayout(map);
      // Add Carriages
      const mid = Math.floor(GRID_SIZE/2);
      map[5][mid].type = 'OBSTACLE'; map[5][mid].variant = 202; // Carriage
      map[15][mid].type = 'OBSTACLE'; map[15][mid].variant = 202; // Carriage
  }
  else if (zoneId === 'MACHINES') {
      generateExhibitionMap(map);
  }
  else if (zoneId === 'TOWER') {
      // Void edges
      for(let y=0; y<GRID_SIZE; y++) {
          for(let x=0; x<GRID_SIZE; x++) {
              if (x < 5 || x > GRID_SIZE - 6 || y < 5 || y > GRID_SIZE - 6) {
                  map[y][x].type = 'VOID';
              } else {
                  map[y][x].type = 'FLOOR';
                  map[y][x].texture = 'METAL';
              }
              if ((x === 5 || x === GRID_SIZE - 6) && (y >=5 && y <= GRID_SIZE-6)) map[y][x].type = 'WALL'; 
              if ((y === 5 || y === GRID_SIZE - 6) && (x >=5 && x <= GRID_SIZE-6)) map[y][x].type = 'WALL';
          }
      }
      // Telescope on tower
      const mid = Math.floor(GRID_SIZE/2);
      map[mid][mid].type = 'OBSTACLE';
      map[mid][mid].variant = 501; // Telescope
  }

  // Borders
  for(let i=0; i<GRID_SIZE; i++) {
      map[0][i].type = 'WALL';
      map[GRID_SIZE-1][i].type = 'WALL';
      map[i][0].type = 'WALL';
      map[i][GRID_SIZE-1].type = 'WALL';
  }

  // Exits
  const mid = Math.floor(GRID_SIZE / 2);
  map[0][mid].type = 'EXIT';
  map[1][mid].type = 'FLOOR'; map[1][mid].variant = 0;
  map[GRID_SIZE-1][mid].type = 'EXIT';
  map[GRID_SIZE-2][mid].type = 'FLOOR'; map[GRID_SIZE-2][mid].variant = 0;

  // Assign Targets
  if (zoneId === 'ESPLANADE') {
      map[0][mid].zoneTarget = 'MACHINES';
      map[GRID_SIZE-1][mid].zoneTarget = 'STREET'; 
  } else if (zoneId === 'MACHINES') {
      map[0][mid].zoneTarget = 'TOWER';
      map[GRID_SIZE-1][mid].zoneTarget = 'ESPLANADE';
  } else if (zoneId === 'TOWER') {
      map[GRID_SIZE-1][mid].zoneTarget = 'MACHINES';
  } else if (zoneId === 'STREET') {
      map[0][mid].zoneTarget = 'ESPLANADE';
      map[GRID_SIZE-1][mid].zoneTarget = 'SALON';
  } else if (zoneId === 'SALON') {
      map[0][mid].zoneTarget = 'STREET';
  }

  // Scatter Events
  let eventCount = 0;
  while (eventCount < 3) {
      const rx = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      const ry = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
      if (map[ry][rx].type === 'FLOOR' && map[ry][rx].texture !== 'GRASS' && map[ry][rx].variant === 0) { 
          map[ry][rx].type = 'EVENT';
          eventCount++;
      }
  }

  return map;
};
