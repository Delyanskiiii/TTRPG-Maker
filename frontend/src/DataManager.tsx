export interface CategorySelection {
  category: string;
}

export interface ItemSelection {
  category: string;
  itemName: string;
}

export interface PropertySelection {
  category: string;
  itemName: string;
  property: string;
}

export interface DiceSelection {
  dice: 'd2' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';
  diceMultiplier: number;
}

export interface Uses {
  category?: CategorySelection[];
  itemName?: ItemSelection[];
  tag?: string[];
}

export interface Calculation {
  property: PropertySelection[];
  formula: string;
}

export interface Property {
  name: string;
  value: number | number[] | string | string[] | CategorySelection | CategorySelection[] | ItemSelection | ItemSelection[] | PropertySelection | PropertySelection[]| DiceSelection | DiceSelection[] | Uses | Calculation;
}

export interface Item {
  name: string;
  maxTier?: number;
  properties: Property[];
}

export interface Category {
  name: string;
  propertyKeys: string[];
  items: Item[];
  showProps?: boolean;
  minimized?: boolean;
}

export interface lg {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  moved: boolean;
  static: boolean;
  isDraggable: boolean;
  isResizable: boolean;
}

export interface layout {
  lg: lg[];
  md?: lg[];
  sm?: lg[];
  xs?: lg[];
  xxs?: lg[];
}

export interface CharacterSheet {
  type: 'sheet';
  system: string;
  name: string;
  sheetStructure: layout;
}

export interface GameSystem {
  type: 'system';
  name: string;
  categories: Category[];
  tags: string[];
  sheetStructure: layout;
}

const isLocalhost =
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1' ||
  window.location.hostname.endsWith('.local');

export class DataManager {
  private static instance: DataManager;
  private systemsCache: GameSystem[] = [];
  private activeSystem: GameSystem = this.getMockSystem();
  private charactersCache: CharacterSheet[] = [];
  private activeCharacter: CharacterSheet | null = null;
  private errors: string[] = [];

  private constructor() {}

  public static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  public getMockSystem(): GameSystem {
    return {type: 'system', name: 'MockSystem', categories: [], tags: [], sheetStructure: {lg: [{"i": "Sample Window","x": 0,"y": 0,"w": 1,"h": 1,"moved": false,"static": false,"isDraggable": true,"isResizable": true}]}};
  }

  public isLocalhost(): boolean {
    return isLocalhost;
  }

  public getErrors(): string[] {
    return this.errors;
  }

  public clearErrors(): void {
    this.errors = [];
  }

  // CHARACTER MANAGEMENT:

  public getActiveCharacter(): CharacterSheet | null {
    return this.activeCharacter;
  }

  public setActiveCharacter(character: CharacterSheet | null): void {
    this.activeCharacter = character;
  }

  public getCharactersCache(): CharacterSheet[] {
    return this.charactersCache;
  }

  public async loadCharactersForCurrentSystem(): Promise<CharacterSheet[]> {
    try {
      this.charactersCache = await this.getCharactersForCurrentSystemFromServer();
      return this.charactersCache;
    } catch (error) {
      this.errors.push(`Error loading characters: ${error instanceof Error ? error.message : String(error)}`);
      return this.charactersCache;
    }
  }

  public async saveCharacter(character: CharacterSheet): Promise<void> {
    try {
      await this.saveCharacterToServer(character);
    } catch (error) {
      this.errors.push(`Error saving character: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // ACTIVE SYSTEM MANAGEMENT:

  public getActiveSystem(): GameSystem {
    return this.activeSystem;
  }

  public async loadActiveSystem(): Promise<GameSystem> {
    try {
      const system = await this.getCurrentSystemFromServer();
      if (system == null) {
        this.errors.push('No active system found'); 
        return this.activeSystem;
      }
      this.setActiveSystem(system);
      return system;
    } catch (error) {
      this.errors.push(`Error loading active system: ${error instanceof Error ? error.message : String(error)}`);
      return this.activeSystem;
    }
  }

  public setActiveSystem(game: GameSystem): void {
    this.activeSystem = game;
    try {
      this.setCurrentSystemOnServer(game.name);
    } catch (error) {
      this.errors.push(`Error setting current system on server: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  public async loadAllSystems(): Promise<GameSystem[]> {
    try {
      this.systemsCache = await this.getAllSystemsFromServer();
      return this.systemsCache;
    } catch (error) {
      this.errors.push(`Error loading systems: ${error instanceof Error ? error.message : String(error)}`);
      return this.systemsCache;
    }
  }

  public getAllSystemsCache(): GameSystem[] {
    return this.systemsCache;
  }

  public async saveSystem(system: GameSystem): Promise<void> {
    try {
      await this.saveSystemToServer(system);
    } catch (error) {
      this.errors.push(`Error saving system: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // VALIDATION:

  private validateGameSystem(data: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Early validation for basic structure
    if (!this.isValidObject(data)) {
      return { valid: false, errors: ['Data must be a non-null object'] };
    }

    // Validate required root fields
    this.validateRootFields(data, errors);
    if (errors.length > 0) return { valid: false, errors };

    // Validate arrays
    this.validateArrays(data, errors);

    return { valid: errors.length === 0, errors };
  }

  private isValidObject(data: any): boolean {
    return typeof data === 'object' && data !== null;
  }

  private validateRootFields(data: any, errors: string[]): void {
    if (data.type !== 'system') {
      errors.push(`Expected type 'system', got '${data.type}'`);
    }

    if (!this.isValidString(data.name)) {
      errors.push('Name must be a non-empty string');
    }
  }

  private isValidString(value: any): boolean {
    return typeof value === 'string' && value.trim().length > 0;
  }

  private validateArrays(data: any, errors: string[]): void {
    // Validate categories
    if (!Array.isArray(data.categories)) {
      errors.push('Categories must be an array');
    } else {
      this.validateCategories(data.categories, errors);
    }

    // Validate tags
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    }

    // Validate sheet structure
    if (!Array.isArray(data.sheetStructure)) {
      errors.push('Sheet structure must be an array');
    } else {
      this.validateSheetStructure(data.sheetStructure, errors);
    }
  }

  private validateCategories(categories: any[], errors: string[]): void {
    categories.forEach((category, idx) => {
      if (!this.isValidString(category.name)) {
        errors.push(`Category[${idx}]: name must be a non-empty string`);
      }
      if (!Array.isArray(category.propertyKeys)) {
        errors.push(`Category[${idx}] '${category.name}': propertyKeys must be an array`);
      }
      if (!Array.isArray(category.items)) {
        errors.push(`Category[${idx}] '${category.name}': items must be an array`);
      }
    });
  }

  private validateSheetStructure(sheetStructure: any[], errors: string[]): void {
    sheetStructure.forEach((window, idx) => {
      if (!this.isValidString(window.i)) {
        errors.push(`Sheet[${idx}]: window id (i) must be a string`);
      }
      if (!this.isValidNumber(window.x) || !this.isValidNumber(window.y)) {
        errors.push(`Sheet[${idx}]: x and y must be numbers`);
      }
      if (!this.isValidNumber(window.w) || !this.isValidNumber(window.h)) {
        errors.push(`Sheet[${idx}]: w and h must be numbers`);
      }
    });
  }

  private isValidNumber(value: any): boolean {
    return typeof value === 'number' && !isNaN(value);
  }

  // API INTERACTIONS:

  private async getAllSystemsFromServer(): Promise<GameSystem[]> {
    try {
      const res = await fetch('/api/systems')
      if (!res.ok) throw new Error('Failed to fetch systems')
      return await res.json()
    } catch (error) {
      throw new Error(`Unable to load systems: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async saveSystemToServer(system: GameSystem): Promise<void> {
    try {
      const res = await fetch('/api/system', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(system)
      })
      if (!res.ok) throw new Error('Failed to save system')
    } catch (error) {
      throw new Error(`Unable to save system: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async getCurrentSystemFromServer(): Promise<GameSystem | null> {
    try {
      const res = await fetch('/api/system/current')
      if (!res.ok) throw new Error('Failed to fetch current system')
      return await res.json()
    } catch (error) {
      throw new Error(`Unable to load current system: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async setCurrentSystemOnServer(name: string | null): Promise<void> {
    try {
      const res = await fetch('/api/system/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      })
      if (!res.ok) throw new Error('Failed to set current system')
      await res.json()
    } catch (error) {
      throw new Error(`Unable to set current system: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async getCharactersForCurrentSystemFromServer(): Promise<CharacterSheet[]> {
    try {
      const res = await fetch('/api/characters')
      if (!res.ok) throw new Error('Failed to fetch characters')
      return await res.json()
    } catch (error) {
      throw new Error(`Unable to load characters: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  private async saveCharacterToServer(character: CharacterSheet): Promise<void> {
    try {
      const res = await fetch('/api/character', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(character)
      })
      if (!res.ok) throw new Error('Failed to save character')
      await res.json()
    } catch (error) {
      throw new Error(`Unable to save character: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}