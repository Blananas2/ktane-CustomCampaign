function downloadYAML(slotName, campHash) {
  let desc = `Keep Talking Custom Campaign for ${slotName} generated with hash ${campHash}`;
  let yamlData = [
    `name: ${slotName}`,
    ``,
    `# Used to describe your yaml. Useful if you have multiple files.`,
    `description: ${desc}`,
    ``,
    `game: Manual_KTCC${campHash}_Blananas2`,
    `requires:`,
    `  version: 0.6.4 # Version of Archipelago required for this yaml to work as expected.`,
    ``,
    `Manual_KTCC${campHash}_Blananas2:`,
    `  ################`,
    `  # Game Options #`,
    `  ################`,
    `  progression_balancing:`,
    `    # A system that can move progression earlier, to try and prevent the player from getting stuck and bored early.`,
    `    #`,
    `    # A lower setting means more getting stuck. A higher setting means less getting stuck.`,
    `    #`,
    `    # You can define additional values between the minimum and maximum values.`,
    `    # Minimum value is 0`,
    `    # Maximum value is 99`,
    `    random: 0`,
    `    random-low: 0`,
    `    random-high: 0`,
    `    disabled: 0 # equivalent to 0`,
    `    normal: 50 # equivalent to 50`,
    `    extreme: 0 # equivalent to 99`,
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

async function downloadApworld(camp, campHash) {
  const zip = new JSZip();

  let worldSpecific = generateManualData(camp, campHash);
  
  const manifest = await fetch("manifest.json").then(r => r.json());

  await Promise.all(
    manifest.files.map(async (fileName) => {
      const res = await fetch(`Manual_KTCC_Blan/${fileName}`);
      const content = await res.text();

      zip.file(`Manual_KTCC${campHash}_Blananas2/${fileName}`, content);
    })
  );
  zip.file(`Manual_KTCC${campHash}_Blananas2/data/game.json`, JSON.stringify(worldSpecific[0], null, 4));
  zip.file(`Manual_KTCC${campHash}_Blananas2/data/items.json`, JSON.stringify(worldSpecific[1], null, 4));
  zip.file(`Manual_KTCC${campHash}_Blananas2/data/locations.json`, JSON.stringify(worldSpecific[2], null, 4));

  let apworldBlob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  downloadFile(`Manual_KTCC${campHash}_Blananas2.apworld`, apworldBlob, "application/zip");
}

function generateManualData(camp, campHash) {
  let game = {
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.game.schema.json",
    "game": `KTCC${campHash}`,
    "creator": "Blananas2",
    "filler_item_name": "Blank Manual Page",
    "starting_items": [ { "item_categories": ["Bomb 1 Mods"] } ],
    "death_link": false,
    "starting_index": 1
  };
  let items = { 
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.items.schema.json",
    data: [] 
  };
  let locations = { 
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.locations.schema.json",
    data: [] 
  };

  let bombIx = 1;

  //TODO: handle multiple instances of the same module on the same bomb, they should not have identical names because Manual will treat them as the same.

  camp.forEach(bomb => {
    let bombName = "Bomb " + bombIx;

    bomb.forEach(module => {
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
      locations.data.push({
        name: `${bombName} - ${module}`,
        category: [`${bombName} Checks`],
        requires: `|@${bombName} Mods:all|`
      });
    });
    locations.data.push({
      name: `${bombName} Defused`,
      category: [`${bombName} Checks`, "Bomb Defused Checks"],
      requires: `|@${bombName} Mods:all|`
    });

    bombIx++;
  });
  locations.data.push({
    name: "All Bombs Defused",
    requires: "|@Module:all|",
    victory: true
  });

  //We add widgets to each bomb (apart from the first) to balance out the number of
  //Incoming checks (items, distinct modules) and outgoing checks (locations, defusing module on every bomb + defusing the entire bomb)
  //Note that the items can *never* exceed the number of locations, as Manual/Archipelago simply can't allow it
  let bombCount = camp.length;
  let widgetsPerBomb = calculateWidgetsPerBomb();
  if (widgetsPerBomb > 0) {
    items.data.push({
      name: "Widget",
      category: "Widget",
      count: widgetsPerBomb * bombCount,
      progression: true
    });
    locations.data.forEach(location => {
      if (location.name == "All Bombs Defused") { 
        location.requires += ` AND |Widget:all|`;
      } else if (location.category[0] != "Bomb 1 Checks") {
        let bombIxMinusOne = Number.parseInt(location.category[0].split(" ")[1]) - 1;
        location.requires += ` AND |Widget:${bombIxMinusOne * widgetsPerBomb}|`;
      }
    });
  }

  return [ game, items, locations ];
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