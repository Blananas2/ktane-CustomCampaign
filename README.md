# ktane-CustomCampaign
Custom Campaign is a web application which designs custom campaigns for Keep Talking and Nobody Explodes with modded modules.

As input, you'll need a profile. If you don't have one, refer to the [profile editor](https://ktane.timwi.de/More/Profile%20Editor.html). Every mission in your campaign will include modules from your profile. You can also specify the module counts and the seed used for the pseudo-random number generator which generates the campaign.

To play the missions, you'll need every module your profile contains already installed, and [Dynamic Mission Generator](https://steamcommunity.com/sharedfiles/filedetails/?id=1633427044) and its dependancies. The app will provide you with the "DMG strings" to copy into the Dynamic Mission Generator app to play each mission.

This webapp was designed with [Manual](https://github.com/ManualForArchipelago/Manual/blob/main/README.md) for [Archipelago](https://archipelago.gg/) in mind. When `?m=archipelago` is appended to the URL, the tool (currently) only provides the DMG strings needed to play the missions easily.

At time of writing, generate a Manual world involves a bit of technical knowhow and the knowledge of how Manual works. In the future, apworld and yaml generation will be provided via the app when the campaign is generated.