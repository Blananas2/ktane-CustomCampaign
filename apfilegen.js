function downloadYAML(slotName, options, campHash, version) {
  let yamlData = [
    `name: ${slotName}`,
    ``,
    `# Used to describe your yaml. Useful if you have multiple files.`,
    `description: Keep Talking Custom Campaign for ${slotName} generated with hash ${campHash} on version ${version}`,
    ``,
    `game: Manual_KTCC${campHash}_Blan`,
    `requires:`,
    `  version: 0.6.6 # Version of Archipelago required for this yaml to work as expected.`,
    ``,
    `Manual_KTCC${campHash}_Blan:`,
    `  ################`,
    `  # Game Options #`,
    `  ################`,
    `  progression_balancing:`,
    `    '${options.progressionBalancing}': 1`,
    ``,
    `  death_link:`,
    `    '${options.deathlink}': 1`,
    ``,
    `  accessibility:`,
    `    # Set rules for reachability of your items/locations.`,
    `    #`,
    `    # **Full:** ensure everything can be reached and acquired.`,
    `    #`,
    `    # **Minimal:** ensure what is needed to reach your goal can be acquired.`,
    `    full: 50`,
    `    minimal: 0`,
    ``,
    `  ###########################`,
    `  # Item & Location Options #`,
    `  ###########################`,
    `  local_items:`,
    `    # Forces these items to be in their native world.`,
    `    []`,
    ``,
    `  non_local_items:`,
    `    # Forces these items to be outside their native world.`,
    `    []`,
    ``,
    `  start_inventory:`,
    `    # Start with the specified amount of these items. Example: "Bomb: 1"`,
    `    {}`,
    ``,
    `  start_inventory_from_pool:`,
    `    # Start with the specified amount of these items and don't place them in the world. Example: "Bomb: 1"`,
    `    #`,
    `    # The game decides what the replacement items will be.`,
    `    {}`,
    ``,
    `  start_hints:`,
    `    # Start with these item's locations prefilled into the \`\`!hint\`\` command.`,
    `    []`,
    ``,
    `  start_location_hints:`,
    `    # Start with these locations and their item prefilled into the \`\`!hint\`\` command.`,
    `    []`,
    ``,
    `  exclude_locations:`,
    `    # Prevent these locations from having an important item.`,
    `    []`,
    ``,
    `  priority_locations:`,
    `    # Prevent these locations from having an unimportant item.`,
    `    []`,
    ``,
    `  item_links:`,
    `    # Share part of your item pool with other players.`,
    `    []`,
    ``,
    `  plando_items:`,
    `    # Generic items plando.`,
    `    []`
  ].join('\n');
  let yamlFile = new File([yamlData], `${slotName}.yaml`, { type: "application/yaml" });

  downloadFile(`${slotName}.yaml`, yamlFile, yamlFile.type);
}

async function downloadApworld(dlink, camp, campHash) {
  const zip = new JSZip();

  let worldData = generateManualData(dlink, camp, campHash);
  
  const manifest = await fetch("manifest.json").then(r => r.json());

  await Promise.all(
    manifest.files.map(async (fileName) => {
      const res = await fetch(`Manual_KTCC_Blan/${fileName}`);
      const content = await res.text();

      zip.file(`Manual_KTCC${campHash}_Blan/${fileName}`, content);
    })
  );
  
  let worldFiles = [ "events", "game", "items", "locations", "regions" ];

  for (let f = 0; f < worldFiles.length; f++) {
    zip.file(`Manual_KTCC${campHash}_Blan/data/${worldFiles[f]}.json`, JSON.stringify(worldData[f], null, 4));
  }

  let apworldBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  downloadFile(`Manual_KTCC${campHash}_Blan.apworld`, apworldBlob, "application/zip");
}

function generateManualData(dlink, camp, campHash) {
  let events = {
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.events.schema.json",
    data: []
  };
  let game = {
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.game.schema.json",
    "game": `KTCC${campHash}`,
    "creator": "Blan",
    "filler_item_name": "Blank Manual Page",
    "starting_items": [ { "items": [] } ],
    "death_link": dlink,
    "starting_index": 1 //Might be unnecessary since the item numbering is done app-side?
  };
  let items = { 
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.items.schema.json",
    data: [] 
  };
  let locations = { 
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.locations.schema.json",
    data: [] 
  };
  let regions = {
    "Tablet": {
      "starting": true,
      "connects_to": []
    }
  };

  camp.forEach((bomb, bix) => {
    let bombName = "Bomb " + natoExcel(bix+1);

    let moduleTotals = {};
    bomb.forEach(module => {
      moduleTotals[module] = (moduleTotals[module] || 0) + 1;
    })

    let moduleCounts = {};

    bomb.forEach(module => {
      moduleCounts[module] = (moduleCounts[module] || 0) + 1;
      let occurrence = moduleCounts[module];
      let hasDuplicates = moduleTotals[module] > 1;
      let moduleEntry = items.data.find((entry) => entry.name == module);
      
      if (!moduleEntry) {
        items.data.push({
          name: module,
          category: ["Module"],
          progression: true
        });
        moduleEntry = items.data.find((entry) => entry.name == module);
      }
      
      if (!moduleEntry.category.includes(`${bombName} Mods`)) {
        moduleEntry.category.push(`${bombName} Mods`);
      }

      let locationName = `${bombName} - ${module}`;
      if (hasDuplicates) { locationName += ` #${occurrence}`; }

      locations.data.push({
        name: locationName,
        category: [`${bombName} Checks`],
        region: bombName,
        requires: `|@${bombName} Mods:ALL|`
      });

      if (bix == 0) { game["starting_items"][0]["items"].push(module); }
    });

    pushLocationDefused(bombName);
  });

  freeplay.forEach((bomb, ix) => {
    let bombName = `Freeplay #${ix+1}`;

    bomb.forEach(module => {
      moduleName = moduleIdToName(module);
      let moduleEntry = items.data.find((entry) => entry.name == moduleName);
      moduleEntry.category.push(`${bombName} Mods`);

      locations.data.push({
        name: `${bombName} - ${moduleName}`,
        category: [`${bombName} Checks`],
        region: bombName,
        requires: `|@${bombName} Mods:ALL|`
      });
    });

    pushLocationDefused(bombName);
  });

  locations.data.push({
    name: `All Bombs Defused`,
    category: "Victory",
    requires: `|@${overall[overall.length - 1]} Defused:ALL|`, //Set to the latest bomb ensures it will be the last check (for 100%)
    victory: true
  });

  overall.forEach((bomb, bix) => { 
    if (bix == 0) { regions["Tablet"]["connects_to"].push(bomb); }
      
    regions[bomb] = {
      "connects_to": [],
      "requires": `|@${bomb} Mods:ALL|`
    };

    if (bix != overall.length - 1) { regions[bomb]["connects_to"].push(overall[bix + 1]); }
  });

  return [ events, game, items, locations, regions ];

  function pushLocationDefused(bn) {
    locations.data.push({
      name: `${bn} Defused`,
      category: [`${bn} Checks`],
      region: bn,
      requires: `|@${bn} Mods:ALL|`
    });
    events.data.push({
      name: `${bn} Defused Event`,
      category: ["Bombs Defused"],
      copy_location: `${bn} Defused`
    });
  }
}

async function downloadDMGFiles(campHash) {
  const zip = new JSZip();

  dmgStrings[0].forEach((str, ix) => {
    zip.file(`${nameBomb(true, ix)}.txt`, str);
  });
  dmgStrings[1].forEach((str, ix) => {
    zip.file(`${nameBomb(false, ix)}.txt`, str);
  });

  let dmgFilesBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  downloadFile(`KTCC ${campHash}.zip`, dmgFilesBlob, "application/zip");
}

function downloadFile(filename, content, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}