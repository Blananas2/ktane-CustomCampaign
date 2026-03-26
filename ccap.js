//this JS tool, intended to be used with node or via a webapp, is for converting a campaign to item and location jsons for Manual Archipelago

let fs = require("fs");
let camp = [ //contrived example to get the point across; when in actual use, other tools will generate the campaign, it won't be static like in this case
    [ "Colour Flash", "Piano Keys", "Semaphore", "Emoji Math", "Word Scramble" ],
    [ "Two Bits", "Word Scramble", "Combination Lock", "Orientation Cube", "Plumbing" ],
    [ "Colour Flash", "Switches", "Word Scramble", "Combination Lock", "Foreign Exchange Rates" ],
    [ "Word Scramble", "Round Keypad", "Adventure Game", "3D Maze", "Number Pad" ],
    [ "Piano Keys", "Semaphore", "Emoji Math", "Switches", "Word Scramble" ]
];

let items = { 
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.items.schema.json",
    data: [] 
};
let locations = { 
    "$schema": "https://github.com/ManualForArchipelago/Manual/raw/main/schemas/Manual.locations.schema.json",
    data: [] 
};

let bombIx = 1;

camp.forEach(bomb => {
    let bombName = "Bomb " + bombIx;
    let moduleIx = 1;

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

        moduleIx++;
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
    requires: "|@Module:all| AND |@Bomb Defused Checks:all|",
    victory: true
});

let moduleItemCount = items.data.length;
let bombCount = camp.length;
let widgetsPerBomb = Math.floor(((locations.data.length - 1) - moduleItemCount) / (bombCount - 1)); 
/*** the first -1 above is so that the victory condition doesn't contribute to the count, that can result in the item checks exceeding the location checks
which Manual/Archipelago just doesn't allow, the second is so that the first bomb doesn't need widgets (i just think it's cleaner/funnier that way) ***/
if (widgetsPerBomb > 0) {
    items.data.push({
        name: "Widget",
        category: "Widget",
        count: widgetsPerBomb * bombCount,
        progression: true
    });
    locations.data.forEach(location => {
        if (location.name == "All Bombs Defused") { 
            location.requires += ` AND |Widget:${widgetsPerBomb * (bombCount - 1)}|`;
        } else if (location.category[0] != "Bomb 1 Checks") {
            let bombIxMinusOne = Number.parseInt(location.category[0].split(" ")[1]) - 1;
            location.requires += ` AND |Widget:${bombIxMinusOne * widgetsPerBomb}|`;
        }
    });
}

console.log(`Generated game with ${moduleItemCount} modules, ${widgetsPerBomb * (bombCount - 1)} widgets, and ${locations.data.length} locations.`);

fs.writeFile('items.json', JSON.stringify(items, null, 1), err => {
    if (err) {
        console.error(err);
    } else {
        console.log("items.json updated");
    }
});
fs.writeFile('locations.json', JSON.stringify(locations, null, 1), err => {
    if (err) {
        console.error(err);
    } else {
        console.log("locations.json updated");
    }
});