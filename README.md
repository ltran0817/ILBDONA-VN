1. Files required:

  - `config.json` consists of:

  ```
  "openWeatherAPI": "",
  "alphaAPI": "",
  "mongoDBPW": "",
  "uri": "t",
  "MONGODB_URI": "",
  ```

  - `city.list.json` (download from: http://bulk.openweathermap.org/sample/)
  - `city.list.min.json` (download from: http://bulk.openweathermap.org/sample/)
  - `.env` contains **DISCORDJS_BOT_TOKEN**

2. Set up Google Cloud API for text-to-speech:
   - Follow steps in [here](https://cloud.google.com/sdk/docs/install#deb) to install SDK
   - Run `gcloud auth application-default login`
   - Go to `application_default_credentials.json` paste in your info
   - Run `gcloud config set project PROJECT_ID`

3. To run the bot on pm2:
  - `npm install pm2 -g`
  - Inside the git folder run: `pm2 ecosystem` 
  - Copy everything inside `ecosystem.config.json`
  - Make changes to the file if necessary.
