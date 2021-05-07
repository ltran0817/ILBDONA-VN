const textToSpeech = require('@google-cloud/text-to-speech');
const ttsClient = new textToSpeech.TextToSpeechClient();
const fs = require('fs');
const util = require('util');
const supportedLangs = require('../../language_code.json');

// 2 HELPER FUNCTIONS
const playingAudioFile = async (message) => {
  const connection = await message.member.voice.channel.join();
  connection.play('output.mp3').on('finish', () => {
    console.log("Finished playing audio")
    // VOICE_CHANNEL.leave();
  }).on('error', console.error);
};
const quickstart = async (content, langCode, langName) => {
  const request = {
    input: { text: content },
    voice: {
      languageCode: langCode,
      name: langName
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 1.3,
    }
  }
  const [response] = await ttsClient.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  await writeFile('output.mp3', response.audioContent, 'binary');
  console.log("Finished Writing audio file");
};

module.exports = {
  name: 'say',
  description: 'execute text-to-speech command from user in voice channel',
  async execute(client, message, args) {
    // args[0]: if language code or full name "en-us" or "en-us-Wavenet-D" provided.
    // if args[0] not follow the syntax => default vi-VN-Wavenet-B
    try {
      const VOICE_CHANNEL = message.member.voice.channel;
      let TTS_CONTENT = "";
      let LANG_CODE = "vi-VN";
      let LANG_FULLNAME = "vi-VN-Wavenet-B";
      let validLangFormat = false;
      if (args[0].match(/^[a-z]{2,3}-[A-Z]{2}-(?:\bWavenet\b|\bStandard\b)-[A-F]{1}$/i)) {//full name provided
        console.log("case 1");
        LANG_FULLNAME = args[0];
        LANG_CODE = args[0].split("-").slice(0, 2).join('-');
        let result = supportedLangs.voices.find(lang => lang.name === LANG_FULLNAME);
        (result) ? validLangFormat = true : (validLangFormat = false, LANG_CODE = "vi-VN", LANG_FULLNAME = "vi-VN-Wavenet-B");
        args.shift();
        TTS_CONTENT = args.join(' ');
      } else if (args[0].match(/^[a-z]{2,3}-[A-Z]{2}$/i)) {
        console.log("case 2");
        LANG_CODE = args[0].split("-").slice(0, 2).join('-');
        let result = supportedLangs.voices.find(lang => lang.languageCodes[0] === LANG_CODE);
        (result) ? (validLangFormat = true, LANG_FULLNAME = result.name) : (validLangFormat = false, LANG_CODE = "vi-VN", LANG_FULLNAME = "vi-VN-Wavenet-B");
        args.shift();
        TTS_CONTENT = args.join(' ');
      } else {
        if (args[0] === 'languages') {
          let listOfLangs = [];
          supportedLangs.voices.forEach(lang => listOfLangs.push(lang.languageCodes[0]));
          let uniqueLangs = [...new Set(listOfLangs)];
          let mesReply = uniqueLangs.join('\n');
          message.channel.send(mesReply);
        } else {
          console.log("Unknown case!");
          validLangFormat = true;
          TTS_CONTENT = args.join(" ");
        }
      }
      console.log(args);
      console.log(`Language Code: ${LANG_CODE}, Lan        message.reply("You need to be in voice channel to use this command!");guage Full Name: ${LANG_FULLNAME}, TTS Content: ${TTS_CONTENT}`);
      // Check if LANG_CODE and LANG_FULLNAME exists in supported list first
      // if only LANG_CODE provided => find first occurence of that language name in the list => if it exists => API 

      //check if user is in voice channel
      if (VOICE_CHANNEL && validLangFormat) {
        // quickstart(TTS_CONTENT, LANG_CODE, LANG_FULLNAME);
        await quickstart(TTS_CONTENT, LANG_CODE, LANG_FULLNAME); await playingAudioFile(message);
      } else if (VOICE_CHANNEL && !validLangFormat) {

      } else {
        message.reply("You need to be in voice channel to use this command!");
      }
    } catch (e) {
      console.log(e);
    }
  }
}