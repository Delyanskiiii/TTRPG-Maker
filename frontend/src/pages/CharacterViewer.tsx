import { useState, useCallback, useEffect } from 'react';
import { DataManager, CharacterSheet, layout, lg } from '../DataManager';
import { Responsive } from 'react-grid-layout';

function CharacterViewerNav({ activeCharacter, setActiveCharacter, availableCharacters, setAvailableCharacters }: { activeCharacter: CharacterSheet | null; setActiveCharacter: React.Dispatch<React.SetStateAction<CharacterSheet | null>>; availableCharacters: CharacterSheet[]; setAvailableCharacters: React.Dispatch<React.SetStateAction<CharacterSheet[]>> }) {
  const dataManager = DataManager.getInstance();

  const lockGrid = useCallback(() => {
    if (!activeCharacter) return;
    setActiveCharacter({
      ...activeCharacter,
      sheetStructure: {
        ...activeCharacter.sheetStructure,
        lg: activeCharacter.sheetStructure.lg.map(item => ({
          ...item,
          isDraggable: !item.isDraggable,
          isResizable: !item.isResizable,
        }))
      }
    });
  }, [activeCharacter, setActiveCharacter]);

  return (
    <>
    <div className={`page-panel${activeCharacter ? '' : ' hidden'}`}>
      <button className="button small" onClick={() => setActiveCharacter(null)} title="Back to character list">🔙</button>
    </div>
    <button className="button small" onClick={async () => {setAvailableCharacters(await dataManager.loadCharactersForCurrentSystem())}} title="Load Characters">📂</button>
    {activeCharacter &&
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <button onClick={() => lockGrid()} className="button small" style={{ cursor: 'pointer' }}>
          🔒 Lock/Unlock Grid
        </button>
        <button className="button small" onClick={async () => {await dataManager.saveCharacter(activeCharacter);}} title="Save character">💾</button>
      </div>
    }
    </>
  );
}

function CharacterViewer({ activeCharacter, setActiveCharacter, availableCharacters, setAvailableCharacters }: { activeCharacter: CharacterSheet | null; setActiveCharacter: React.Dispatch<React.SetStateAction<CharacterSheet | null>>; availableCharacters: CharacterSheet[]; setAvailableCharacters: React.Dispatch<React.SetStateAction<CharacterSheet[]>> }) {
  const dataManager = DataManager.getInstance();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      setAvailableCharacters(await dataManager.loadCharactersForCurrentSystem());
    };
    fetchCharacters();
  }, [dataManager]);

  const onLayoutChange = (currentLayout: any, allLayouts: any) => {
    if (activeCharacter) {
      setActiveCharacter({ ...activeCharacter, sheetStructure: allLayouts });
    }
  };

  const createNewCharacter = () => {
    const sys = dataManager.getActiveSystem();
    setActiveCharacter({
      type: 'sheet',
      system: sys.name,
      name: 'New Character',
      sheetStructure: sys.sheetStructure
    });
  }

  return (
    <div className='CharacterViewer'>
      {activeCharacter ? (
        <Responsive className="Layout" layouts={activeCharacter.sheetStructure} width={windowWidth} onLayoutChange={onLayoutChange}>
          {activeCharacter.sheetStructure.lg.map((item: lg) => {
            return (
              <div key={item.i} className="Box">
                <div className="Drag-handle">{item.i.toUpperCase()}</div>
                <div className="Box-content">
                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* {systemCategory.items.map((it) => (
                      <div key={it.id} style={{ border: '1px solid #444', padding: '10px', textAlign: 'left', width: '100%' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '4px', borderBottom: '1px solid #333' }}>{it.name}</div>
                        {it.description && (
                          <div style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '8px', fontStyle: 'italic' }}>
                            {Array.isArray(it.description) ? it.description[0] : it.description}
                          </div>
                        )}
                        {systemCategory.propertyKeys.filter(k => !NON_TIERED_PROPS.includes(k) && k !== 'description').map(prop => (
                          <PropertyDisplay key={prop} prop={prop} value={(it as any)[prop]} />
                        ))}
                      </div>
                    ))} */}
                  </div>
                </div>
              </div>
            );
          })}
        </Responsive>
      ) : (
        <div className="page-content">
          <h1>Select Your Character</h1>
          <div className="grid-row">
            {availableCharacters.map(char => (
              <button key={char.name} className="char-button" onClick={() => setActiveCharacter(char)}>
                {char.name}
              </button>
            ))}
            <button onClick={createNewCharacter} className="char-button new">
              + NEW CHARACTER
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterViewer;
export { CharacterViewerNav };