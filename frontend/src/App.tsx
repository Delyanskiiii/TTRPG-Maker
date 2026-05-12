import './App.css';
import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import Refactor from './pages/SystemMaker';
import CharacterViewer, { CharacterViewerNav } from './pages/CharacterViewer';
import SheetMaker, { SheetMakerNav } from './pages/SheetMaker';
import { DataManager, GameSystem, layout, CharacterSheet } from './DataManager';

type ViewMode = 'character' | 'system' | 'sheet';

function App() {
  const dataManager = DataManager.getInstance();
  const [errors, setErrors] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('character');

  // Nav states
  const [layout, setLayout] = useState<layout>(dataManager.getActiveSystem().sheetStructure);
  const [activeCharacter, setActiveCharacter] = useState<CharacterSheet | null>(null);
  const [activeSystem, setActiveSystem] = useState<GameSystem>(dataManager.getMockSystem());

  return (
    <div className="App">
      <nav className="Top-Nav">
        {dataManager.isLocalhost() && (
          <div className="nav-container">
            <div className="nav-left">
              <button className={`button${view === 'system' ? ' active' : ''}`} onClick={() => setView('system')}>System Maker</button>
              <button className={`button${view === 'sheet' ? ' active' : ''}`} onClick={() => setView('sheet')}>Sheet Maker</button>
              <button className={`button${view === 'character' ? ' active' : ''}`} onClick={() => setView('character')}>Character View</button>
            </div>
            <div className="nav-right">
              {view === 'character' && <CharacterViewerNav layout={layout} setLayout={setLayout} activeCharacter={activeCharacter} />}
              {(view === 'sheet' || view === 'system') && <SheetMakerNav activeSystem={activeSystem} setActiveSystem={setActiveSystem} />}
            </div>
          </div>
        )}
        {errors && <div className="nav-error">{errors}</div>}
      </nav>

      <main className="View-Container">

        <div className={`page-panel${view === 'system' ? '' : ' hidden'}`}>
          <Refactor/>
        </div>

        <div className={`page-panel${view === 'sheet' ? '' : ' hidden'}`}>
          <SheetMaker/>
        </div>

        <div className={`page-panel${view === 'character' ? '' : ' hidden'}`}>
          <CharacterViewer layout={layout} setLayout={setLayout} activeCharacter={activeCharacter} setActiveCharacter={setActiveCharacter} />
        </div>

      </main>
    </div>
  );
}
export default App;