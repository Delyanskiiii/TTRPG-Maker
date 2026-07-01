import React, { useState, useEffect, useCallback } from 'react';
import { DataManager, Property, PropertyTypes, GameSystem, Category, Item } from '../DataManager';

export const getCategoryKeys = (category: Category) => (category.propertyKeys);

// export const PropertyDisplay = ({ prop, value }: { prop: string; value: any }) => {
//   const type = getPropertyType(prop);
//   if (value === undefined || value === null || (Array.isArray(value) && value.length === 0)) return null;

//   const isNativeArray = ARRAY_TYPES.includes(type);
//   const actualValue = !isNativeArray && Array.isArray(value) ? value[0] : value;

//   const renderContent = () => {
//     if (type === 'requirements' || type === 'affection') {
//       return (
//         <div style={{ fontSize: '0.85em', color: '#aaa', marginLeft: '10px' }}>
//           {actualValue.map((v: any, i: number) => (
//             <div key={i}>
//               • {v.category && `${v.category}: `}{v.itemName && `${v.itemName} `}
//               {v.property} {v.affection} {v.value}
//             </div>
//           ))}
//         </div>
//       );
//     }
//     if (type === 'uses') {
//       return (
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginLeft: '10px' }}>
//           {actualValue.map((v: any, i: number) => (
//             <span key={i} style={{ fontSize: '0.8em', border: '1px solid #00ff0044', padding: '0 4px', borderRadius: '2px' }}>
//               {v.type === 'tag' ? `#${v.tag}` : v.type === 'category' ? `[${v.category}]` : `${v.category}: ${v.itemName}`}
//             </span>
//           ))}
//         </div>
//       );
//     }
//     if (type === 'damageInterface') {
//       return <span style={{ marginLeft: '10px' }}>{actualValue.map((d: any) => `${d.diceMultiplier}${d.extraDice}`).join(', ')}</span>;
//     }
//     if (prop === 'range' && typeof actualValue === 'object') {
//       return <span style={{ marginLeft: '10px' }}>{actualValue.type === 'Melee' ? 'Melee' : `Ranged (${actualValue.normal}/${actualValue.disadvantage})`}</span>;
//     }
//     if (Array.isArray(actualValue)) return <span style={{ marginLeft: '10px' }}>{actualValue.join(', ')}</span>;
//     return <span style={{ marginLeft: '10px' }}>{String(actualValue)}</span>;
//   };

//   return (
//     <div style={{ marginBottom: '4px' }}>
//       <span style={{ fontSize: '0.7em', textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.5px' }}>{prop}: </span>
//       {renderContent()}
//     </div>
//   );
// };

// --- Sub-Components ---

const TagManager = ({ tags, setTags }: { tags: string[]; setTags: React.Dispatch<React.SetStateAction<string[]>> }) => {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInputValue('');
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #aaa', borderRadius: '4px', background: '#fcfcfc' }}>
      <h3 style={{ marginTop: 0 }}>Global Tag Manager</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter tag name..."
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{ flex: 1, padding: '5px' }}
        />
        <button onClick={handleAdd}>Add Tag</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {tags.map((tag) => (
          <div key={tag} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#e0e0e0', borderRadius: '16px', fontSize: '14px' }}>
            {tag}
            <button onClick={() => setTags(tags.filter((t) => t !== tag))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#666', padding: '0 2px' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

const PropertyManager = ({ properties, setProperties }: { properties: Property[]; setProperties: React.Dispatch<React.SetStateAction<Property[]>> }) => {
  const [inputName, setInputName] = useState('');
  const [inputValue, setInputValue] = useState(PropertyTypes[0]);

  const handleAdd = () => {
    const trimmed = inputName.trim();
    if (trimmed && !properties.some((p) => p.name === trimmed)) {
      setProperties([...properties, { name: trimmed, value : inputValue }]);
      setInputName('');
    }
  };

  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #aaa', borderRadius: '4px', background: '#fcfcfc' }}>
      <h3 style={{ marginTop: 0 }}>Global Property Manager</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          placeholder="Enter property name..."
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          style={{ flex: 1, padding: '5px' }}
        />
        <select
          value={inputValue}
          onChange={(e) => {
            const newType = e.target.value as string;
            setInputValue(newType);
          }}
          style={{ padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {PropertyTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
        </select>
        <button onClick={handleAdd}>Add Property</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {properties.map((property) => (
          <div key={property.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#e0e0e0', borderRadius: '16px', fontSize: '14px' }}>
            {property.name + ': ' + property.value.toString()}
            <button onClick={() => setProperties(properties.filter((p) => p.name !== property.name))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#666', padding: '0 2px' }}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};

// function ObjectArrayEditor({ type, value, onChange, categories = [], globalTags = [], globalProperties = [] }: { type: PropertyType, value: any[], onChange: (val: any[]) => void, categories?: Category[], globalTags?: string[], globalProperties?: Property[] }) {
//   const addItem = (customDefault?: any) => {
//     if (customDefault) {
//       onChange([...value, customDefault]);
//       return;
//     }
//     const defaults: Record<string, any> = {
//       requirements: { category: '', itemName: '', property: 'name', affection: 'equal', value: '' },
//       affection: { category: '', itemName: '', property: 'name', affection: 'plus', value: '' },
//       uses: { type: 'tag', tag: '' },
//       damageInterface: { extraDice: 'd4', diceMultiplier: 1 }
//     };
//     onChange([...value, defaults[type] || {}]);
//   };

//   const updateEntry = (idx: number, field: string, val: any) => {
//     const next = [...value];
//     next[idx] = { ...next[idx], [field]: val };
//     onChange(next);
//   };

//   return (
//     <div style={{ paddingLeft: '10px', borderLeft: '2px solid #eee' }}>
//       {value.map((obj, i) => (
//         <div key={i} style={{ display: 'flex', gap: '5px', marginBottom: '5px', alignItems: 'center' }}>
//           {type === 'requirements' && (
//             <>
//               <select value={obj.category} onChange={e => {
//                 const next = [...value];
//                 next[i] = { ...obj, category: e.target.value, itemName: '', property: '' };
//                 onChange(next);
//               }}>
//                 <option value="">Select Category</option>
//                 {categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
//               </select>
              
//               <select value={obj.itemName} onChange={e => {
//                 const next = [...value];
//                 next[i] = { ...obj, itemName: e.target.value, property: '' };
//                 onChange(next);
//               }}>
//                 <option value="">Select Item</option>
//                 {obj.category && <option value="any">Any Item</option>}
//                 {obj.category && categories.find(c => c.name === obj.category)?.items.map(item => (
//                   <option key={item.id} value={item.name}>{item.name}</option>
//                 ))}
//               </select>

//               <select value={obj.property} onChange={e => updateEntry(i, 'property', e.target.value)}>
//                 <option value="">Select Property</option>
//                 {obj.category && categories.find(c => c.name === obj.category)?.propertyKeys.map(prop => (
//                   <option key={prop} value={prop}>{prop}</option>
//                 ))}
//               </select>

//               <select value={obj.affection} onChange={e => updateEntry(i, 'affection', e.target.value)}>
//                 {['equal', 'less', 'more'].map(a => <option key={a} value={a}>{a}</option>)}
//               </select>
//               <div style={{ flex: 1, minWidth: '120px' }}>
//                 <PropertyField 
//                   propKey={obj.property} 
//                   value={obj.value} 
//                   onChange={val => updateEntry(i, 'value', val)} 
//                   globalTags={globalTags}
//                   categories={categories}
//                 />
//               </div>
//             </>
//           )}
//           {type === 'affection' && (
//             <>
//               <select value={obj.category} onChange={e => {
//                 const next = [...value];
//                 next[i] = { ...obj, category: e.target.value, itemName: '', property: '' };
//                 onChange(next);
//               }}>
//                 <option value="">Select Category</option>
//                 {categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
//               </select>
              
//               <select value={obj.itemName} onChange={e => {
//                 const next = [...value];
//                 next[i] = { ...obj, itemName: e.target.value, property: '' };
//                 onChange(next);
//               }}>
//                 <option value="">Select Item</option>
//                 {obj.category && <option value="any">Any Item</option>}
//                 {obj.category && categories.find(c => c.name === obj.category)?.items.map(item => (
//                   <option key={item.id} value={item.name}>{item.name}</option>
//                 ))}
//               </select>

//               <select value={obj.property} onChange={e => updateEntry(i, 'property', e.target.value)}>
//                 <option value="">Select Property</option>
//                 {obj.category && categories.find(c => c.name === obj.category)?.propertyKeys.map(prop => (
//                   <option key={prop} value={prop}>{prop}</option>
//                 ))}
//               </select>

//               <select value={obj.affection} onChange={e => updateEntry(i, 'affection', e.target.value)}>
//                 {['replace', 'minus', 'plus', 'divide', 'multiply'].map(a => <option key={a} value={a}>{a}</option>)}
//               </select>
//               <div style={{ flex: 1, minWidth: '120px' }}>
//                 <PropertyField 
//                   propKey={obj.property} 
//                   value={obj.value} 
//                   onChange={val => updateEntry(i, 'value', val)} 
//                   globalTags={globalTags}
//                   categories={categories}
//                 />
//               </div>
//             </>
//           )}
//           {type === 'uses' && (
//             <>
//               <span style={{ fontSize: '0.8em', minWidth: '35px' }}>
//                 {obj.type === 'tag' ? 'Tag:' : obj.type === 'category' ? 'Cat:' : 'Item:'}
//               </span>
//               {obj.type === 'tag' ? (
//                 <select value={obj.tag || ''} onChange={e => updateEntry(i, 'tag', e.target.value)}>
//                   <option value="">Select Tag</option>
//                   {globalTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
//                 </select>
//               ) : (
//                 <>
//                   <select value={obj.category || ''} onChange={e => {
//                     const next = [...value];
//                     next[i] = { ...obj, category: e.target.value, itemName: '' };
//                     onChange(next);
//                   }}>
//                     <option value="">Select Category</option>
//                     {categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
//                   </select>

//                   {obj.type === 'item' && (
//                     <select value={obj.itemName || ''} onChange={e => updateEntry(i, 'itemName', e.target.value)}>
//                       <option value="">Select Item</option>
//                       {obj.category && <option value="any">Any Item</option>}
//                       {obj.category && categories.find(c => c.name === obj.category)?.items.map(item => (
//                         <option key={item.id} value={item.name}>{item.name}</option>
//                       ))}
//                     </select>
//                   )}
//                 </>
//               )}
//             </>
//           )}
//           {type === 'damageInterface' && (
//             <>
//               <select value={obj.extraDice} onChange={e => updateEntry(i, 'extraDice', e.target.value)}>
//                 {DICE_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
//               </select>
//               <input type="number" value={obj.diceMultiplier} onChange={e => updateEntry(i, 'diceMultiplier', parseFloat(e.target.value))} style={{ width: '50px' }} />
//             </>
//           )}
//           <button onClick={() => onChange(value.filter((_, idx) => idx !== i))}>x</button>
//         </div>
//       ))}
//       {type === 'uses' ? (
//         <div style={{ display: 'flex', gap: '5px' }}>
//           <button onClick={() => addItem({ type: 'tag', tag: '' })} style={{ fontSize: '0.8em' }}>+ Add Tag</button>
//           <button onClick={() => addItem({ type: 'category', category: '' })} style={{ fontSize: '0.8em' }}>+ Add Category</button>
//           <button onClick={() => addItem({ type: 'item', category: '', itemName: '' })} style={{ fontSize: '0.8em' }}>+ Add Item</button>
//         </div>
//       ) : (
//         <button onClick={() => addItem()} style={{ fontSize: '0.8em' }}>+ Add Entry</button>
//       )}
//     </div>
//   );
// }

// function PropertyField({ propKey, value, onChange, globalTags = [], categories = [] }: { propKey: string, value: any, onChange: (val: any) => void, globalTags?: string[], categories?: Category[] }) {
//   const type = getPropertyType(propKey);

//   if (propKey === 'tags') {
//     const selectedTags = Array.isArray(value) ? value : [];
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', alignItems: 'center' }}>
//         {selectedTags.map((tag, i) => (
//           <span key={i} style={{ background: '#e0e0e0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.9em', display: 'flex', alignItems: 'center', gap: '4px' }}>
//             {tag}
//             <button onClick={() => onChange(selectedTags.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, fontWeight: 'bold', color: '#666' }}>×</button>
//           </span>
//         ))}
//         <select value="" onChange={(e) => e.target.value && onChange([...selectedTags, e.target.value])} style={{ padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}>
//           <option value="" disabled>+ Add Tag</option>
//           {globalTags.filter(t => !selectedTags.includes(t)).map(tag => <option key={tag} value={tag}>{tag}</option>)}
//         </select>
//       </div>
//     );
//   }

//   if (propKey === 'range') {
//     const rangeValue = value || { type: 'Melee' }; // Ensure a default structure
//     return (
//       <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
//         <select
//           value={rangeValue.type}
//           onChange={(e) => {
//             const newType = e.target.value as 'Melee' | 'Ranged';
//             if (newType === 'Melee') {
//               onChange({ type: 'Melee' });
//             } else {
//               onChange({ type: 'Ranged', normal: 0, disadvantage: 0 });
//             }
//           }}
//           style={{ padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
//         >
//           <option value="Melee">Melee</option>
//           <option value="Ranged">Ranged</option>
//         </select>
//         {rangeValue.type === 'Ranged' && (
//           <>
//             <label>Normal Range:</label>
//             <input
//               type="number"
//               value={rangeValue.normal || 0}
//               onChange={(e) => onChange({ ...rangeValue, normal: parseFloat(e.target.value) || 0 })}
//               style={{ flex: 1 }}
//             />
//             <label>Disadvantage Range:</label>
//             <input
//               type="number"
//               value={rangeValue.disadvantage || 0}
//               onChange={(e) => onChange({ ...rangeValue, disadvantage: parseFloat(e.target.value) || 0 })}
//               style={{ flex: 1 }}
//             />
//           </>
//         )}
//       </div>
//     );
//   }

//   if (['requirements', 'affection', 'damageInterface', 'uses'].includes(type)) {
//     return <ObjectArrayEditor type={type} value={Array.isArray(value) ? value : []} onChange={onChange} categories={categories} globalTags={globalTags} />;
//   }

//   if (type === 'stringArray' || type === 'numberArray') {
//     const arr = Array.isArray(value) ? value : [];
//     return (
//       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
//         {arr.map((v, i) => (
//           <div key={i} style={{ display: 'flex' }}>
//             <input type={type === 'numberArray' ? 'number' : 'text'} value={v} onChange={e => {
//               const next = [...arr];
//               next[i] = type === 'numberArray' ? parseFloat(e.target.value) || 0 : e.target.value;
//               onChange(next);
//             }} style={{ width: '80px' }} />
//             <button onClick={() => onChange(arr.filter((_, idx) => idx !== i))}>x</button>
//           </div>
//         ))}
//         <button onClick={() => onChange([...arr, type === 'numberArray' ? 0 : ''])}>+</button>
//       </div>
//     );
//   }

//   return <input type={type === 'number' ? 'number' : 'text'} value={value} onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)} style={{ flex: 1 }} />;
// }

// --- Main Component ---

function Refactor({ system, setSystem }: { system: GameSystem; setSystem: React.Dispatch<React.SetStateAction<GameSystem>> }) {
  const hostname = window.location.hostname;
  const [globalTags, setGlobalTags] = useState<string[]>(system.tags);
  const [globalProperties, setGlobalProperties] = useState<Property[]>(system.properties);
  //const [categories, setCategories] = useState<Category[]>([]);
  const [selectedPropertyToAdd, setSelectedPropertyToAdd] = useState<Record<number, string>>({});

  useEffect(() => {
    setGlobalTags(system.tags);
    setGlobalProperties(system.properties);
  }, [system]);

  useEffect(() => {
    setSystem({ ...system, tags: globalTags, properties: globalProperties});
  }, [globalProperties, globalTags]);

  // Category Management Functions
  const addCategory = () => {
    const existingNames = system.categories.map(c => c.name.trim());
    let newName = "New Category";
    let i = 1;
    while (existingNames.includes(newName)) {
      newName = `New Category ${i++}`;
    }
    setSystem({ ...system, categories: [...system.categories, { name: newName, propertyKeys: [], items: [], showProps: true, minimized: false }] });
  };
  const updateCategory = (idx: number, patch: Partial<Category>) => setSystem({ ...system, categories: system.categories.map((category, i) => i === idx ? { ...category, ...patch } : category) });
  const removeCategory = (idx: number) => setSystem({ ...system, categories: system.categories.filter((_, i) => i !== idx) });

  // Item Management Functions
  const addItem = (catIdx: number) => {
    const category = system.categories[catIdx];
    const existingNames = category.items.map(c => c.name.trim());
    let newName = "New Item";
    let i = 1;
    while (existingNames.includes(newName)) {
      newName = `New Item ${i++}`;
    }
    const newItem = {name: newName, maxTier: 1, properties: system.categories[catIdx].propertyKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {})} as Item;
    setSystem({ ...system, categories: system.categories.map((c, i) => i === catIdx ? { ...c, items: [...c.items, newItem] } : c) });
  };

  // const toggleCategoryProperty = (catIdx: number, key: string) => {
  //   const category = categories[catIdx];
  //   const keys = getCategoryKeys(category);
  //   const nextKeys = keys.includes(key) ? keys.filter(k => k !== key) : [...keys, key];
  //   const finalKeys = Array.from(new Set([...nextKeys, 'name']));
  //   // updateCategory(catIdx, { propertyKeys: finalKeys, items: category.items.map(it => normalizeItem(it, finalKeys)) });
  // };

  // const setItem = (catIdx: number, itemIdx: number, patch: Partial<Item>) => setCategories(prev => {
  //   const next = [...prev];
  //   const category = next[catIdx];
  //   const keys = getCategoryKeys(category);
  //   let item = { ...category.items[itemIdx] };

  //   // Migration logic for tiers
  //   if ('maxTier' in patch) {
  //     const newMaxTier = patch.maxTier ?? 1;
  //     const oldMaxTier = item.maxTier ?? 1;

  //     if (newMaxTier !== oldMaxTier) {
  //       keys.forEach(prop => {
  //         if (NON_TIERED_PROPS.includes(prop)) return;
  //         const val = (item as any)[prop];
  //         const type = getPropertyType(prop);

  //         if (newMaxTier >= 2) {
  //           let newArr = Array.isArray(val) && oldMaxTier >= 2 ? [...val] : [val ?? getDefaultValue(type)];
  //           while (newArr.length < newMaxTier) newArr.push(getDefaultValue(type));
  //           (item as any)[prop] = newArr.slice(0, newMaxTier);
  //         } else if (oldMaxTier >= 2 && Array.isArray(val)) {
  //           (item as any)[prop] = val[0];
  //         }
  //       });
  //     }
  //   }

  //   const updatedItem = { ...item, ...patch };
  //   const items = [...next[catIdx].items];
  //   items[itemIdx] = updatedItem as Item;
  //   next[catIdx] = { ...next[catIdx], items };
  //   return next;
  // });

  // const normalizeItem = useCallback((item: Partial<Item>, propertyKeys: string[]): Item => {
  //   const normalized: any = { id: Date.now() };
  //   const mTier = item.maxTier ?? 1;

  //   propertyKeys.forEach((key) => {
  //     const type = getPropertyType(key);
  //     const val = (item as any)[key];
  //     const isArrType = ARRAY_TYPES.includes(type);

  //     if (NON_TIERED_PROPS.includes(key)) {
  //       normalized[key] = val ?? getDefaultValue(type);
  //     } else if (mTier >= 2) {
  //       let arr: any[];
  //       if (Array.isArray(val)) {
  //         if (isArrType) {
  //           if (val.length > 0 && Array.isArray(val[0])) arr = [...val];
  //           else arr = [val];
  //         } else {
  //           arr = [...val];
  //         }
  //       } else {
  //         arr = [val ?? getDefaultValue(type)];
  //       }
  //       while (arr.length < mTier) arr.push(getDefaultValue(type));
  //       normalized[key] = arr.slice(0, mTier);
  //     } else {
  //       if (Array.isArray(val)) {
  //         if (isArrType) {
  //           normalized[key] = (val.length > 0 && Array.isArray(val[0])) ? val[0] : val;
  //         } else {
  //           normalized[key] = val[0];
  //         }
  //       } else {
  //         normalized[key] = val ?? getDefaultValue(type);
  //       }
  //     }
  //   });
  //   return normalized as Item;
  // }, []);

  // const addItem = (catIdx: number, category: Category) => updateCategory(catIdx, { 
  //   items: [...category.items, normalizeItem({ name: 'New Item' }, category.propertyKeys)] 
  // });

  const removeItem = (catIdx: number, itemIdx: number) => updateCategory(catIdx, { 
    items: system.categories[catIdx].items.filter((_, i) => i !== itemIdx) 
  });

  const renderDMTools = () => (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', background: '#333', position: 'sticky', top: 0, zIndex: 10, display: 'flex', gap: '10px' }}>
        <button onClick={addCategory}>Add Category</button>
      </div>
      <div style={{ padding: '20px' }}>
      <TagManager tags={globalTags} setTags={setGlobalTags} />
      <PropertyManager properties={globalProperties} setProperties={setGlobalProperties} />



      <h2>DM Category Manager 2</h2>



      {system.categories.map((category, categoryIndex) => {
        const isDuplicate = system.categories.some((c, i) => i !== categoryIndex && c.name.trim() === category.name.trim() && category.name.trim() !== "");
        return (
          <div key={categoryIndex} style={{ marginBottom: '15px', padding: '5px', border: '1px dashed #ccc' }}>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button 
                onClick={() => updateCategory(categoryIndex, { minimized: !category.minimized })}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.1em', padding: '0 5px' }}
                title={category.minimized ? "Expand Category" : "Minimize Category"}
              >
                {category.minimized ? '▶' : '▼'}
              </button>
              <input 
                placeholder="Category name" 
                value={category.name} 
                onChange={(e) => updateCategory(categoryIndex, { name: e.target.value })} 
                style={{ flex: 1, borderColor: isDuplicate ? 'red' : undefined }} 
              />
              <button onClick={() => removeCategory(categoryIndex)}>Remove</button>
            </div>
            {isDuplicate && <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>Category name must be unique.</div>}

          {!category.minimized && (
            <>
              <button style={{ marginTop: '10px', marginBottom: '8px' }} onClick={() => updateCategory(categoryIndex, { showProps: !category.showProps })}>
                {category.showProps ? 'Hide' : 'Show'} Item Properties
              </button>
              {category.showProps && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '5px' }}>
                  <select
                    value={selectedPropertyToAdd[categoryIndex] || ''}
                    onChange={(e) => setSelectedPropertyToAdd(prev => ({ ...prev, [categoryIndex]: e.target.value }))}
                    style={{ padding: '2px', borderRadius: '4px', border: '1px solid #ccc' }}
                  >
                    <option value="" disabled>Select Properties to Add</option>
                    {globalProperties.map((property) => (<option key={property.name} value={property.name}>{property.name}</option>))}
                  </select>
                  <button
                    onClick={() => {
                      const propertyName = selectedPropertyToAdd[categoryIndex];
                      if (!propertyName) return;
                      const keys = getCategoryKeys(category);
                      if (!keys.includes(propertyName)) {
                        updateCategory(categoryIndex, { propertyKeys: [...keys, propertyName] });
                      }
                      setSelectedPropertyToAdd(prev => ({ ...prev, [categoryIndex]: '' }));
                    }}
                  >Add</button>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {category.propertyKeys.map((name) => (
                      <div key={name} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#e0e0e0', borderRadius: '16px', fontSize: '14px' }}>
                        {name}
                        <button onClick={() => updateCategory(categoryIndex, { propertyKeys: category.propertyKeys.filter((p) => p !== name) })} style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 'bold', color: '#666', padding: '0 2px' }}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ marginTop: '10px' }}>
                <strong>Items</strong>
                <button onClick={() => addItem(categoryIndex)} style={{ marginLeft: '5px' }}>+ Item</button>
                {category.items.map((it, ii) => (
                  <div key={ii} style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd', background: '#222' }}>
                    <div style={{ marginBottom: '10px', border: '1px solid #444', padding: '10px', borderRadius: '4px' }}>
                      <div style={{ fontSize: '0.7em', color: '#888', marginBottom: '5px' }}>PREVIEW</div>
                      <div style={{ fontWeight: 'bold', fontSize: '1.1em', marginBottom: '4px', borderBottom: '1px solid #333' }}>{it.name}</div>
                      {/* {getCategoryKeys(category).filter(k => !NON_TIERED_PROPS.includes(k) && k !== 'description').map(prop => (
                        <PropertyDisplay key={prop} prop={prop} value={(it as any)[prop]} />
                      ))} */}
                    </div>

                    {/* {getCategoryKeys(category).map((prop) => {
                      const type = getPropertyType(prop);
                      return (
                        <div key={prop} style={{ marginBottom: '10px' }}>
                          {((it.maxTier ?? 1) >= 2 && !NON_TIERED_PROPS.includes(prop)) ? (
                            <div style={{ padding: '8px', backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px' }}>
                              <div style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '0.9em', color: '#444' }}>{prop} (Tiered Values):</div>
                              {[...Array(it.maxTier)].map((_, tIdx) => {
                                const isColumn = type.includes('Array') || ['requirements', 'affection', 'damageInterface', 'uses'].includes(type);
                                return (
                                  <div key={tIdx} style={{ display: 'flex', marginBottom: '8px', gap: '10px', flexDirection: isColumn ? 'column' : 'row' }}>
                                    <label style={{ minWidth: '60px', fontSize: '0.85em', color: '#666', paddingTop: isColumn ? '0' : '4px' }}>Tier {tIdx + 1}:</label>
                                    <PropertyField 
                                      propKey={prop} 
                                      value={(it as any)[prop]?.[tIdx] ?? getDefaultValue(type)} 
                                      onChange={val => {
                                        const old = (it as any)[prop];
                                        const arr = Array.isArray(old) ? [...old] : [old];
                                        while(arr.length <= tIdx) arr.push(getDefaultValue(type));
                                        arr[tIdx] = val;
                                        setItem(categoryIndex, ii, { [prop]: arr });
                                      }} 
                                      globalTags={globalTags} 
                                      categories={categories} 
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: type.includes('Array') || ['requirements', 'affection', 'damageInterface', 'uses'].includes(type) ? 'column' : 'row' }}>
                              <label style={{ minWidth: '140px', fontWeight: 'bold' }}>{prop}:</label>
                              <PropertyField propKey={prop} value={(it as any)[prop]} onChange={val => setItem(categoryIndex, ii, { [prop]: val })} globalTags={globalTags} categories={categories} />
                            </div>
                          )}
                        </div>
                      );
                    })} */}
                    <button onClick={() => removeItem(categoryIndex, ii)}>Delete Item</button>
                  </div>
                ))}
              </div>
            </>
          )}
          </div>
        );
      })}
      </div>
    </div>
  );

  return (
    <div>
      {(hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) ? (
        <div>
          <h1>Welcome, DM!</h1>
          {renderDMTools()}
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <h1>Access Denied</h1>
          <p>DM Tools are only available on the host machine.</p>
        </div>
      )}
    </div>
  );
}

export default Refactor;
