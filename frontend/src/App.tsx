import './App.css';
import { useEffect, useState, useCallback, Dispatch, SetStateAction } from 'react';
import Refactor from './pages/SystemMaker';
import CharacterViewer, { CharacterViewerNav } from './pages/CharacterViewer';
import SheetMaker from './pages/SheetMaker';
import { DataManager, GameSystem } from './DataManager';

type ViewMode = 'character' | 'system' | 'sheet';

function App() {
  const dataManager = DataManager.getInstance();
  const [errors, setErrors] = useState<string | null>(null);
  const [availableSystems, setAvailableSystems] = useState<GameSystem[]>([dataManager.getActiveSystem()]);
  const [view, setView] = useState<ViewMode>('character');

  return (
    <div className="App">
      <nav className="Top-Nav">
        {dataManager.isLocalhost() && (
          <div className="nav-container">
            <div className="nav-left">
              <button className={`button${view === 'system' ? ' active' : ''}`} onClick={() => setView('system')}>System Maker</button>
              <button className={`button${view === 'sheet' ? ' active' : ''}`} onClick={() => setView('sheet')}>Sheet Maker</button>
              <button className={`button${view === 'character' ? ' active' : ''}`} onClick={() => setView('character')}>Character View</button>
              {view === 'character' && dataManager.getActiveCharacter() && <CharacterViewerNav/>}
            </div>
            <div className="nav-right">
              <select className="system-input" value={dataManager.getActiveSystem().name} onChange={(e) => {
                const selected = availableSystems.find(sys => sys.name === e.target.value);
                if (selected) {
                  dataManager.setActiveSystem(selected);
                }
              }}>
                {availableSystems.map(sys => (
                  <option key={sys.name} value={JSON.stringify(sys)}>{sys.name}</option>
                ))}
              </select>
              <button className="button small" onClick={async () => {await dataManager.saveSystem();}} title="Save All">💾</button>
              <button className="button small" onClick={async () => {setAvailableSystems((await dataManager.loadAllSystems()).concat(dataManager.getMockSystem()));}} title="Load Systems">📂</button>
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
          <CharacterViewer/>
        </div>

      </main>
    </div>
  );
}
export default App;