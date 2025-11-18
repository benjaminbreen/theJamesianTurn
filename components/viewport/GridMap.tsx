
import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { PlayerToken } from './PlayerToken';
import { Entity } from '../../types';
import { FloorTile, WallTile, ExitTile, ObstacleTile, AtmosphereOverlay } from '../visuals/TileAssets';
import { NpcSprite } from '../visuals/NpcSprites';

export const GridMap = () => {
  const { mapData, entities, currentZone, setHoverInfo } = useGame();

  if (!mapData || mapData.length === 0) return null;

  const rows = mapData.length;
  const cols = mapData[0].length;
  const cellSize = 40; 

  const handleMouseEnter = (x: number, y: number) => {
      const tile = mapData[y][x];
      // Check for entity first
      const entity = entities.find(e => e.position.x === x && e.position.y === y);
      
      if (entity) {
          setHoverInfo({
              title: entity.name,
              type: entity.type,
              description: entity.description,
              icon: entity.type === 'ITEM' ? entity.itemData?.icon : undefined
          });
          return;
      }

      if (!tile.visible) {
          setHoverInfo(null);
          return;
      }

      // Tile / Obstacle logic
      if (tile.type === 'OBSTACLE') {
          let name = "Obstacle";
          // Simple lookup for variants (could be a map in a real app)
          if (tile.variant === 101) name = "Bookshelf";
          if (tile.variant === 201) name = "Gas Lamppost";
          if (tile.variant === 202) name = "Carriage";
          if (tile.variant === 301) name = "Oak Tree";
          if (tile.variant === 302) name = "Fountain";
          if (tile.variant === 401) name = "Steam Engine";
          if (tile.variant === 501) name = "Telescope";

          setHoverInfo({
              title: name,
              type: 'OBSTACLE',
              description: 'An object of interest.'
          });
      } else if (tile.type === 'EXIT') {
          setHoverInfo({
              title: `Passage to ${tile.zoneTarget || 'Unknown'}`,
              type: 'NAVIGATION',
              description: 'Click or move here to travel.'
          });
      } else if (tile.type !== 'VOID') {
          // Floor
          setHoverInfo({
              title: tile.texture || 'Floor',
              type: 'TERRAIN',
              description: `Walking surface in ${currentZone}.`
          });
      } else {
          setHoverInfo(null);
      }
  };

  return (
    <div 
      className="relative select-none shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      style={{
        width: cols * cellSize,
        height: rows * cellSize,
        backgroundColor: '#1a1614' // Void color
      }}
      onMouseLeave={() => setHoverInfo(null)}
    >
      {/* Tile Layer */}
      <div 
        className="grid absolute inset-0"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {mapData.map((row, y) => (
          row.map((tile, x) => {
            if (tile.type === 'VOID') {
                return <div key={`${x}-${y}`} className="bg-transparent" />;
            }

            if (!tile.lit) {
               return <div key={`${x}-${y}`} className="bg-[#1a1614]" />; // Unexplored
            }
            
            const opacity = tile.visible ? 1 : 0.4; 

            return (
              <div 
                key={`${x}-${y}`} 
                className="w-full h-full relative" 
                style={{ opacity }}
                onMouseEnter={() => handleMouseEnter(x, y)}
              >
                 {/* Base Floor for everything except pure Wall/Void */}
                 {tile.type !== 'WALL' && (
                     <FloorTile 
                        zone={currentZone} 
                        variant={tile.variant || (x+y)%3} 
                        texture={tile.texture} 
                     />
                 )}
                 
                 {tile.type === 'WALL' && <WallTile zone={currentZone} />}
                 {tile.type === 'EXIT' && <ExitTile zone={currentZone} />}
                 {tile.type === 'OBSTACLE' && (
                     <ObstacleTile 
                        zone={currentZone} 
                        variant={tile.variant || (x*y)%5} 
                     />
                 )}
                 
                 {tile.zoneTarget && tile.lit && (
                     <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         <span className="text-[8px] uppercase font-bold text-white bg-black/70 px-1 rounded font-sans">
                             {tile.zoneTarget.substring(0,3)}
                         </span>
                     </div>
                 )}
              </div>
            );
          })
        ))}
      </div>

      {/* Entity Layer - Pass through pointer events for hover on tiles beneath, or handle hover here? */}
      {/* To handle entity hover properly without blocking tiles, we can add mouse enter here too */}
      {entities.map((entity: Entity) => {
         const tile = mapData[entity.position.y][entity.position.x];
         if (!tile || !tile.visible) return null;

         return (
            <div
                key={entity.id}
                className="absolute transition-all duration-300 z-10 pointer-events-auto"
                style={{
                    width: cellSize,
                    height: cellSize,
                    left: entity.position.x * cellSize,
                    top: entity.position.y * cellSize,
                }}
                onMouseEnter={() => handleMouseEnter(entity.position.x, entity.position.y)}
            >
                {entity.type === 'NPC' ? (
                    <div className="w-full h-full">
                        <NpcSprite 
                            direction={entity.facing || 'DOWN'} 
                            seed={entity.id.length} // Deterministic variance
                        />
                    </div>
                ) : (
                    <div className="w-3/4 h-3/4 mx-auto mt-1 flex items-center justify-center">
                         <span className="text-xl animate-bounce">{entity.itemData?.icon || '?'}</span>
                    </div>
                )}
            </div>
         );
      })}

      {/* Player Layer */}
      <PlayerToken cellSize={cellSize} />

      {/* Atmosphere Layer */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          <AtmosphereOverlay zone={currentZone} />
      </div>

    </div>
  );
};
