# STEEL Base Theme

### Instructions

- Copy `default-theme` folder in your themes directory
- Copy the other files in your base folder
- Edit `variables.json` paths to match your directory structures
- Run `gulp` command from your console

---

### For deployment

- after the `npm install` command, run `gulp deploy` to run only the necessary task.

---

### Extra features
- Create a `secret.json` file in your base folder and add as content:
```{
}```.
In here you will put all the private API keys required for the tasks you need.

##### Compressing images 
- Get a new TinyPng api key from https://tinypng.com/developers or retrieve yours from https://tinypng.com/developers/subscription.
- Insert it in secret.json. Es:
```
"TinyPng" : "YOUR_API_KEY"
```
- Now all the images you put in your `THEME_NAME/img` folder will be compress *once* when you run the `gulp` command in the console.
