# KTANE Custom Campaign
Custom Campaign is a [webapp](https://blananas2.github.io/ktane-CustomCampaign/customcampaign.html) which designs custom campaigns for Keep Talking and Nobody Explodes with modded modules.

This webapp was designed with [Manual](https://github.com/ManualForArchipelago/Manual/blob/main/README.md) for [Archipelago](https://archipelago.gg/) in mind. When the Archipelago checkbox is checked, the tool can also generate and provide yaml and apworld files. **Below will explain in detail how to play this game with Archipelago.**

This project would not have been without the help of other software, namely JSZip and Manual. See `JSZIP-LICENSE` and `MANUAL-LICENSE` for more information.

If you have any comments, questions, concerns, suggestions: Please get in touch with me on Discord @blananas2 or send an issue on this repository.

# What is this?

_Keep Talking and Nobody Explodes_ is a bomb defusal simulation game developed by indie studio Steel Crate Games released in 2015. In the game, procedurally generated bombs including various puzzle-like modules need to be disarmed before the time runs out without making too many mistakes. While the game is designed for asymmetric multiplayer (defuser and experts), the community welcomes the playstyle where both roles are played by the same person.

Since 2016, a community of dedicated players have been fascinated with the plethora of modded modules created via the Steam Workshop. Many have defused much bigger and more complicated bombs, created missions and modules of their own, and learned a bunch of new things from various fields of knowledge.

KTANE Custom Campaign makes Modded KTANE playable through Archipelago by generating a campaign with modules of your choosing. At this time, this is done via (the perhaps confusingly named, in this context) Manual, but a more "proper" implementation can be made at a later date. Do get in touch if you'd like to work on it with me. 

Due to the webapp's heavy reliance on this modded content, *it is not recommended to play this world if you are beginner, especially if you are playing a sync multiworld.* If that's you, please play through the vanilla game first. If you would like to get comfortable with modded, the recommendation is to play through [Krow's Intro Missions](https://steamcommunity.com/sharedfiles/filedetails/?id=2211683331) (a collection is linked here for convenience). If you need help learning the new modules, the [KTANE Discord](https://discord.gg/K6uQMyBcYZ) is the place to ask. *If you want to play the vanilla Archipelago implementation, refer to [its GitHub](https://github.com/GreenPower713/Archipelago/tree/main/worlds/ktane/docs) instead.*

At this time, the world functions as follows:
- Incoming checks are **distinct modules**, when you recieve a module, every instance of that module across the entire campaign is unlocked. When all of a bomb's modules are unlocked, you gain access to that bomb.
- Outgoing checks are for **each module solved** and **every bomb solved**.
- Your goal is to defuse all bombs in the campaign.

# Prerequisites

- You will need the Steam release of KTANE. No other versions will work.
- You will need prior experience with KTANE. Please also consider installing the other Quality of Life mods listed on that page.
- You will need [Archipelago](https://archipelago.gg/tutorial/Archipelago/setup_en) and [Manual](https://github.com/ManualForArchipelago/Manual/tree/main/docs/play) installed. (Both of the links here are the relevant setup guides.)
- You will need [Dynamic Mission Generator](https://steamcommunity.com/sharedfiles/filedetails/?id=1633427044), its dependancies, and all modded modules you would like to play both installed and enabled.
- You will need a profile. To create one, you can use the Mod Selector (the tablet) in-game or the [Profile Editor](https://ktane.timwi.de/More/Profile%20Editor.html). **Note:** Only Expert profiles will work.
- All experts will need to access to the [Repository of Manual Pages](https://ktane.timwi.de/).

# Creating your game

- Go to the [webapp](https://blananas2.github.io/ktane-CustomCampaign/customcampaign.html).
- Check the Archipelago Mode checkbox.
- Input your profile next to where it says "KTANE Profile". If you made your profile in-game, the file can be found at one of the paths below.
  - Windows: `%APPDATA%\..\LocalLow\Steel Crate Games\Keep Talking and Nobody Explodes\ModProfiles`
  - Mac: `~/Library/Application Support/com.steelcrategames.keeptalkingandnobodyexplodes/ModProfiles`
  - Linux: `~/.config/unity3d/Steel Crate Games/Keep Talking and Nobody Explodes/ModProfiles`
  - Linux (flatpak): `~/.var/app/com.valvesoftware.Steam/.config/unity3d/Steel Crate Games/Keep Talking and Nobody Explodes/ModProfiles`
  - Steam Deck (Proton): `~/.local/share/Steam/steamapps/compatdata/341800/pfx/drive_c/users/steamuser/AppData/LocalLow/Steel Crate Games/Keep Talking and Nobody Explodes/ModProfiles`
- Set the remainder of your settings to your liking. Hovering over any text with a dotted line under it explains the effects of the settings.
- Click "Generate Campaign", and more Archipelago-specific settings will appear. If you later change any settings *above* the "Generate Campaign" button, you will need to click "Generate Campaign" to use those new settings.
- After all settings are to your liking, click "Download YAML" and "Download apworld".
- Send the yaml and apworld to whoever is hosting, if applicable.
- Place your yaml in your Archipelago Players folder and install the apworld by double-clicking on it or running it like an executable.

# Playing your game

- In your Archipelago Launcher, open the Manual Client.
- Ensure the Manual Game ID matches that of the installed apworld.
- Connect to the relevant server and enter your slot name.
- Click on the "Manual" tab. This is where you send checks out to other worlds.
- In KTANE, click on the Mod Selector, then Dynamic Mission Generator. Your missions are run through here.
- For each mission you play, assuming its checks are shown in green in the Manual Client:
  - Find the mission's name in the webapp, and click "Copy DMG String".
  - Select all the text in Dynamic Mission Generator (i.e. Control+A).
  - Paste in the string you just recieved (i.e. Control+V).
  - Click the Run button to play the mission.
  - After a defusal or detonation, open the dropdown for the relevant mission in the Manual client, and click any modules that were defused. If you don't remember which were defused, you can access the logfile to find out. Easiest method is via the [Log Viewer Hotkey](https://steamcommunity.com/sharedfiles/filedetails/?id=1358839759), where you simply need to press Shift+F7. Don't forget to send a deathlink as well if the bomb exploded.
- After **all** bombs are defused, after sending all other checks, open the "Victory" dropdown, and click the "All Bombs Defused" button.