# HLTB Games Script

This script allows you to easily insert a game note into your vault.

# Requirements

- [QuickAdd Plugin](https://github.com/chhoumann/quickadd)

# Installation

You have to install a QuickAdd plugin for this to work. You will need to put the user script into a new macro and then create a Macro choic in the main menu to activate it.

- Save the script (games.js) to your vault. Make sure it's saved as a JavaScript (.js) file.
- Create a new template in your designated templates folder.

```
---
coverUrl: {{VALUE:coverUrl}}
developer: {{VALUE:developer}}
released: {{VALUE:released}}
genre: {{VALUE:genreLinks}}
publisher: {{VALUE:publisherLinks}}
platform: {{VALUE:platformLinks}}
reviewScore: {{VALUE:reviewScore}}
lengthMain: {{VALUE:completionMain}}
lengthPlus: {{VALUE:completionPlus}}
length100: {{VALUE:completion100}}
played_date: {{DATE:gggg-MM-DD}}
---
![coverUrl|200]({{VALUE:coverUrl}})
```

- Open the Macro Manager by opening the `QuickAdd Plugin` settings and click `Manage Macros`.
- Create a new Macro
- Add the user script to the command list
- Add a new Template step to the macro. This will be what creates the note in your vault.
- Set the template path to the template you created
- Enable File Name Format and use `{{VALUE:fileName}} as the file name format.
- Then Save the Template
- Go back out to your `QuickAdd Plugin` main menu and add a new Macro choice.
  - Pick a name e.g. `Add Game`
  - From the list choose `Macro`
  - Press `Add Choice`
- Attach the Macro to the Macro Choice you just created. You can do it by clicking the cog ⚙ icon and selecting it.
- Click on the thunder icon ⚡ to enable macro
- Now you can add your games by pressing CMD+P and type `Add Game`
