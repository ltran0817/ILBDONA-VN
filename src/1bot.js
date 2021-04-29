// import libraries
require('dotenv').config();
const apiKeys = require('../config.json');
// declare important variables
const fs = require('fs');
const util = require('util');
const fetch = require("node-fetch");
const { connect } = require('http2');
// APIs
const QuickChart = require('quickchart-js');
const textToSpeech = require('@google-cloud/text-to-speech');
const api = apiKeys["openWeatherAPI"];
const alphaApi = apiKeys["alphaAPI"];
const cityData = require('../city.list.min.json');
//chart to draw chart
const chart = new QuickChart();
//google cloud tts client
const ttsClient = new textToSpeech.TextToSpeechClient();

//discord client
const { Client } = require('discord.js');
const Discord = require('discord.js');
const client = new Client();
const command = require('./command');


const caphrasMainHand = { //[caphras_amount, ap, acc]
  0: [0, 0, 0],
  1: [297, 1, 0],
  2: [686, 1, 3],
  3: [1167, 2, 3],
  4: [1740, 2, 4],
  5: [2645, 3, 4],
  6: [3665, 3, 5],
  7: [4800, 4, 5],
  8: [6050, 4, 6],
  9: [7415, 5, 6],
  10: [8895, 5, 7],
  11: [10417, 6, 7],
  12: [12054, 6, 8],
  13: [13806, 7, 8],
  14: [15673, 7, 9],
  15: [17655, 8, 9],
  16: [19752, 8, 10],
  17: [21964, 9, 10],
  18: [24291, 9, 11],
  19: [26733, 10, 11],
  20: [29403, 10, 12],
};
const caphrasAwakeningWeapon = { //[caphras_amount, ap, acc]
  0: [0, 0, 0,],
  1: [345, 1, 0],
  2: [796, 1, 3],
  3: [1352, 2, 3],
  4: [2014, 2, 4],
  5: [3058, 3, 4],
  6: [4234, 3, 5],
  7: [5542, 4, 5],
  8: [6982, 4, 6],
  9: [8555, 5, 6],
  10: [10260, 5, 7],
  11: [12012, 6, 7],
  12: [13896, 6, 8],
  13: [15912, 7, 8],
  14: [18060, 7, 9],
  15: [20340, 8, 9],
  16: [22752, 8, 10],
  17: [25296, 9, 10],
  18: [27972, 9, 11],
  19: [30780, 10, 11],
  20: [33768, 10, 12],
};
const caphrasOffhand = { // [caphras, ap,acc,eva,heva,dr,hdr,hp]
  0: [0, 0, 0, 0, 0, 0, 0, 0],
  1: [297, 0, 4, 0, 0, 0, 0, 0],
  2: [686, 0, 4, 0, 0, 0, 1, 0],
  3: [1167, 0, 4, 0, 0, 1, 1, 0],
  4: [1740, 0, 4, 0, 3, 1, 1, 0],
  5: [2645, 0, 4, 1, 3, 1, 1, 0],
  6: [3665, 0, 4, 1, 3, 1, 1, 20],
  7: [4800, 1, 4, 1, 3, 1, 1, 20],
  8: [6050, 1, 8, 1, 3, 1, 1, 20],
  9: [7415, 1, 8, 1, 3, 1, 2, 20],
  10: [8895, 1, 8, 1, 3, 2, 2, 20],
  11: [10659, 1, 8, 1, 6, 2, 2, 20],
  12: [12453, 1, 8, 2, 6, 2, 2, 20],
  13: [14277, 1, 8, 2, 6, 2, 2, 40],
  14: [16131, 2, 8, 2, 6, 2, 2, 40],
  15: [18015, 2, 12, 2, 6, 2, 2, 40],
  16: [19929, 2, 12, 2, 6, 2, 3, 40],
  17: [21873, 2, 12, 2, 6, 3, 3, 40],
  18: [23847, 2, 12, 2, 9, 3, 3, 40],
  19: [25851, 2, 12, 3, 9, 3, 3, 40],
  20: [27885, 2, 12, 3, 9, 3, 3, 60],
};
const caphrasArmor = { //[caphras, eva, heva, dr, hdr, hp]
  0: [0, 0, 0, 0, 0, 0],
  1: [153, 1, 1, 0, 0, 20],
  2: [383, 1, 1, 1, 1, 30],
  3: [690, 2, 2, 1, 1, 40],
  4: [997, 2, 2, 2, 2, 50],
  5: [1710, 3, 3, 2, 2, 60],
  6: [2424, 3, 3, 3, 3, 70],
  7: [3522, 4, 4, 3, 3, 80],
  8: [4716, 4, 4, 4, 4, 90],
  9: [5950, 5, 5, 5, 5, 100],
  10: [7224, 5, 6, 5, 5, 110],
  11: [8496, 5, 6, 5, 6, 120],
  12: [9808, 6, 6, 5, 6, 120],
  13: [11160, 6, 6, 6, 6, 120],
  14: [12552, 6, 7, 6, 6, 130],
  15: [13984, 6, 7, 6, 7, 140],
  16: [15456, 7, 7, 6, 7, 140],
  17: [16968, 7, 7, 7, 7, 140],
  18: [18520, 7, 8, 7, 7, 150],
  19: [20112, 7, 8, 7, 8, 160],
  20: [21744, 8, 8, 8, 8, 160],
};
const caphrasDimTree = {
  0: 0,
  1: 176,
  2: 440,
  3: 792,
  4: 1144,
  5: 1961,
  6: 2778,
  7: 4036,
  8: 5404,
  9: 6812,
  10: 8260,
};

client.on('ready', () => {
  console.log(`${client.user.username} has logged in!`);
  command(client, 'ping', message => {
    message.channel.send('pong');
  });

  // command to check status of current server(guild)
  command(client, 'servers', message => {
    client.guilds.cache.forEach(guild => {
      message.channel.send(`${guild.name} has ${guild.memberCount} members`);
      const tempList = guild.emojis.cache;
      const emojisList = [];
      tempList.map(emoji => {
        emojisList.push(emoji.toString());
        // console.log(emoji.toString());
      });
      const demo = emojisList.slice(0, 10);
      console.log(emojisList);
      // console.log(tempList.length);
      // console.log(typeof tempList);
      message.channel.send(demo).catch(err => console.log(err));
      // console.log(guild.emojis.cache);
    })
  });
  // delete messages
  command(client, 'prune', message => {
    //display all text messages in current channel
    // message.channel.messages.fetch().then(results => {
    //   console.log(results);
    // })

    // delete last 10 messages
    const numberOfMessages = message.content.replace('!prune', '');
    if (numberOfMessages <= 10) {
      message.channel.bulkDelete(numberOfMessages).then(() => {
        message.channel.send(`Deleted ${numberOfMessages} messages!`).then(msg => { msg.delete({ timeout: 5000 }) }).catch(err => console.log(err));
      })
    } else {
      message.channel.send(`You can't delete more than 10 messages at a time!`);
    }

  });
  //val command
  command(client, 'val', message => {
    const value = message.content.replace('!val ', '');
    let withVP = 0;
    let withoutVP = 0;
    let withFMnVP = 0;
    let metric = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000
    }
    // check if the input is 1 word like 100k or 2 words like 1000 billion
    if (value.trim().indexOf(' ') != -1) { // there is at leat 1 space
      // extract the word
      const unit = value.match(/\w+$/i).join('');
      const amount = value.match(/^\d+[\.\,]?\d+/i).join('');
      console.log("This is 2 words and unit is: ", unit, " and: ", amount);
      withVP = amount * metric[unit[0]] * 0.845;
      withFMnVP = amount * metric[unit[0]] * 0.86;
      withoutVP = amount * metric[unit[0]] * 0.65;
    }
    else {
      console.log("This is 1 word")
      //check if the string has unit modifier or just number

      if ((/^(\d*\.?\,?\d*)*$/i).test(value)) {
        let tempValue = value.replaceAll(',', '');
        withFMnVP = tempValue * 0.86;
        withVP = tempValue * 0.845;
        withoutVP = tempValue * 0.65;

      } else {
        console.log("Contains unit: ", value);
        let tempValue = value.match(/^\d*[\.\,]?\d+/i).join('');
        let unit = value.match(/[a-zA-z]/i).join('');
        withFMnVP = tempValue * metric[unit] * 0.86;
        withVP = tempValue * metric[unit] * 0.845;
        withoutVP = tempValue * metric[unit] * 0.65;
        console.log(`${tempValue} - ${unit}`);
      }
    }
    message.channel.send({
      embed: {
        // title: value.toLocaleString(),
        fields: [
          { name: 'With Value Pack and 7k Family Fame', value: `${withFMnVP.toLocaleString()} silver` },
          { name: 'With Value Pack', value: `${withVP.toLocaleString()} silver` },
          { name: 'Without Value Pack', value: `${withoutVP.toLocaleString()} silver` }
        ]
      }
    }).catch(err => console.log(err));

  });

  //caphras command
  command(client, 'caphras', message => {
    //determine which type of equipment mainhand, offhand, awake, armor, dimtree
    const content = message.content.replace('!caphras ', '');
    const parts = content.split(' ');
    const eqType = parts[0];
    const caphras_price = 0;
    //determine which level from which level
    let fromlvl, tolvl = 0;
    let validFormat = true;
    if (isNaN(parts[1]) || isNaN(parts[2])) { validFormat = false };
    if (parts.length === 3) {
      if (parts[1] > parts[2]) {
        fromlvl = parts[1];
        tolvl = parts[2];
      } else {
        fromlvl = parts[1];
        tolvl = parts[2];
      }
    } else if (parts.length === 2) {
      fromlvl = 0;
      tolvl = parts[1];
    } else if (parts.length === 4) {
      if (parts[1] > parts[2]) {
        fromlvl = parts[1];
        tolvl = parts[2];
      } else {
        fromlvl = parts[1];
        tolvl = parts[2];
      }
      caphras_price = parts[3];
    }


    // information from going from lvl to lvl:
    let amount, sheetDP, heva, hdr, hp, AP, acc = 0;
    // console.log(`${eqType} from ${fromlvl} to ${tolvl}`);
    if (validFormat) {
      if (eqType.match(/\barmor\b|\bgiath\b|\bgriffon\b|\bbheg\b|\bleebur\b|\burugon\b|\bmuskan\b/i)) { // armor
        // information on gain
        let tempTolvl = caphrasArmor[tolvl];
        let tempFromlvl = caphrasArmor[fromlvl];
        amount = tempTolvl[0] - tempFromlvl[0];
        sheetDP = (tempTolvl[1] - tempFromlvl[1]) + (tempTolvl[3] - tempFromlvl[3]);
        heva = tempTolvl[2] - tempFromlvl[2];
        hdr = tempTolvl[4] - tempFromlvl[4];
        hp = tempTolvl[5] - tempFromlvl[5];
        message.channel.send({
          embed: {
            title: `GAIN`,
            fields: [
              { name: `Sheet DP`, value: sheetDP },
              { name: `Hidden Evasion`, value: heva },
              { name: `Hidden DR`, value: hdr },
              { name: `HP`, value: hp },
              { name: `Number of Caphras Stones`, value: Math.abs(amount) }
            ]
          }
        })
      } else if (eqType.match(/\bmainhand\b|\bmain hand\b|\bkza\b|\boffin\b|\bmain\b/i)) { // main hand
        let tempTolvl = caphrasMainHand[tolvl];
        let tempFromlvl = caphrasMainHand[fromlvl];
        amount = tempTolvl[0] - tempFromlvl[0];
        AP = tempTolvl[1] - tempFromlvl[1];
        acc = tempTolvl[2] - tempFromlvl[2];
        console.log(`Amount require: ${Math.abs(amount)}`);
        message.channel.send({
          embed: {
            title: `GAIN`,
            fields: [
              { name: `Sheet AP`, value: AP },
              { name: `Accuracy`, value: acc },
              { name: `Number of Caphras Stones`, value: Math.abs(amount) }
            ]
          }
        });
      } else if (eqType.match(/\bdim tree\b|\bdim\b|\bdimtree\b/i)) {
        if (tolvl > 10) { // DIM TREE
          message.channel.send(`Idiot! Don't caphras your dim tree more than 10`);
          amount = 100000;
        } else {
          amount = caphrasDimTree[tolvl] - caphrasDimTree[fromlvl];
        }
        let dimMessage = 'Above 10 is useless'
        message.channel.send({
          embed: {
            title: `GAIN`,
            fields: [
              { name: `Sheet DP`, value: dimMessage },
              { name: `Hidden Evasion`, value: dimMessage },
              { name: `Hidden DR`, value: dimMessage },
              { name: `HP`, value: dimMessage },
              { name: `Number of Caphras Stones`, value: Math.abs(amount) }
            ]
          }
        })
        console.log(`Amount require: ${Math.abs(amount)}`);
      } else if (eqType.match(/\bnouver\b|\bkutum\b|\boffhand\b/i)) { // OFFHAND KUTUM NOUVER
        let tempTolvl = caphrasOffhand[tolvl];
        let tempFromlvl = caphrasOffhand[fromlvl];

        amount = tempTolvl[0] - tempFromlvl[0];
        AP = tempTolvl[1] - tempFromlvl[1];
        acc = tempTolvl[2] - tempFromlvl[2];
        sheetDP = (tempTolvl[3] - tempFromlvl[3]) + (tempTolvl[5] - tempFromlvl[5]);
        heva = tempTolvl[4] - tempFromlvl[4];
        hdr = tempTolvl[6] - tempFromlvl[6];
        hp = tempTolvl[7] - tempFromlvl[7];
        message.channel.send({
          embed: {
            title: `GAIN`,
            fields: [
              { name: `Sheet AP`, value: AP },
              { name: `Accuracy`, value: acc },
              { name: `Sheet DP`, value: sheetDP },
              { name: `Hidden Evasion`, value: heva },
              { name: `Hidden DR`, value: hdr },
              { name: `HP`, value: hp },
              { name: `Number of Caphras Stones`, value: Math.abs(amount) }
            ]
          }
        });
        // console.log(`Amount require: ${Math.abs(amount)}`);
      } else if (eqType.match(/\bawakening\b|\bawaken\b|\bdande\b|\bdragon\b|\bdandelion\b/i)) { //DANDE AWAKENING WEAPON
        let tempTolvl = caphrasAwakeningWeapon[tolvl];
        let tempFromlvl = caphrasAwakeningWeapon[fromlvl];
        amount = tempTolvl[0] - tempFromlvl[0];
        AP = tempTolvl[1] - tempFromlvl[1];
        acc = tempTolvl[2] - tempFromlvl[2];
        // console.log(`Amount require: ${Math.abs(amount)}`);
        message.channel.send({
          embed: {
            title: `GAIN`,
            fields: [
              { name: `Sheet AP`, value: AP },
              { name: `Accuracy`, value: acc },
              { name: `Number of Caphras Stones`, value: Math.abs(amount) }
            ]
          }
        });
        // console.log(`Amount require: ${Math.abs(amount)}`);
      } else {
        validFormat = false
        // message.channel.send('Unknown Equipment Type');
        // amount = 0;
      };
    } else {
      let res = "```!caphras [equipment type] [from level] [to level]```";
      message.channel.send(res);
    }

  });

  //echo command
  command(client, 'echo', message => {
    const content = message.content.replace('!echo', '');
    console.log(content);
    message.channel.send(content);
  })

  //stock command
  command(client, 'stock', message => {
    const stockName = message.content.replace('!stock ', '').trim();
    const functionName = 'TIME_SERIES_DAILY_ADJUSTED';
    const outputSize = 'compact';
    const absoluteURL = `https://www.alphavantage.co/query?function=${functionName}&symbol=${stockName}&apikey=${alphaApi}`;
    fetch(absoluteURL).then(res => {
      // console.log(`Result of ${stockName}`, res);
      return res.json();
    }).then(parsedStock => {
      if (parsedStock['Error Message']) {
        return 'Wrong Stock Name Provided!';
      }
      let tempKeys = Object.keys(parsedStock['Time Series (Daily)']).slice(0, 5);      // get the list of days
      let tempData = [];
      let data = [];  // store data of those days
      // console.log(keys);
      let fetchedData = parsedStock['Time Series (Daily)'];
      // console.log(fetchedData);
      for (i = 0; i < 5; i++) {
        tempData.push(fetchedData[tempKeys[i]]['5. adjusted close']);
      }
      data = tempData.reverse();
      let keys = tempKeys.reverse();
      let max = Math.max(data);
      let upperBound = Math.ceil(max + (max * 10 / 100));
      let min = Math.min(data);
      let lowerBound = Math.floor(min + (min * 5 / 100));
      chart.setConfig({
        'type': 'line',
        'data': {
          'labels': keys,
          'datasets': [
            {
              'label': stockName,
              'backgroundColor': 'rgb(255, 99, 132)',
              'borderColor': 'rgb(255, 99, 132)',
              'fill': false,
              'data': data,
              tension: 0.2
            }
          ]
        },
        'options': {
          'scales': {
            'y': {
              'min': lowerBound,
              'max': upperBound
            }
          }
        }
      })
      return chart.getShortUrl();
    }
    ).then(parsedRes => {
      message.channel.send(parsedRes);
    }).catch(err => console.log(err));
  })

  //weather command
  command(client, 'weather', message => {
    let absoluteURL = "";
    const location = message.content.replace('!weather ', '').trim();
    if (location.match(/^[0-9]{5}(?:-[0-9]{4})?$/i)) {
      absoluteURL = `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${api}&units=metric`;
    } else {
      absoluteURL = `https://api.openweathermap.org/data/2.5/weather?q=${location},us&appid=${api}&units=metric`;
    }
    console.log("Requested Location:", location)

    fetch(absoluteURL).then(res => {
      return res.json();
    }).then(parsedWeather => {
      if (parsedWeather.cod === '404') {
        message.channel.send("Invalid Location Provided!");
      } else {
        let embedMessage = {
          title: `Weather for ${parsedWeather.name}, ${parsedWeather.sys.country}`,
          fields: [
            { name: 'Forecast', value: `${parsedWeather.weather[0].main}` },
            { name: 'Temperature', value: `${parsedWeather.main.temp} C` },
            { name: 'Wind', value: `${parsedWeather.wind.speed} km/hr` }
          ],
          timestamp: new Date()
        }
        message.channel.send({ embed: embedMessage }).catch(err => { console.log("Error Sending Message: ", err) })
      }
    }).catch(err => { console.log("Err: ", err) });
  })
});

// helper to find city based on name, state, country
const findCityID = (cityName, State, Country) => {
  let query = {};
  if (cityName !== "") {
    query.name = cityName;
    if (State !== "") { query.state = State };
    if (Country !== "") { query.country = Country };
  }
  console.log("query is:", query);
  // if state is not missing and country missing
  // if state is missing and country not missing
  // if both missing, return first result found
  // else return what can it find
  if ((query.state !== "" && query.state !== undefined)
    && (query.country === "" || query.country === undefined)) {
    console.log("case 1");
    console.log("query.state: ", query.state)
    return cityData.find(city =>
      city.name === query.name
      && city.state === query.state
    )
  } else if ((query.state === "" || query.state === undefined)
    && (query.country !== "" && query.country !== undefined)) {
    console.log("case 2");
    return cityData.find(city =>
      city.name === query.name
      && city.country === query.country
    )
  } else if ((query.state !== "" && query.state !== undefined)
    && (query.country !== "" && query.country !== undefined)) {
    console.log("case 3");
    return cityData.find(city => city.name === query.name
      && city.state === query.state
      && city.country === query.country)
  } else if ((query.state === "" || query.state === undefined)
    && (query.country === "" || query.country === undefined)) {
    console.log("case 4");
    return cityData.find(city =>
      city.name === query.name)
  }
}
//helper convert epoch to local seperately
const epochToDate = (unixTime) => {
  return new Date(unixTime * 1000).toLocaleString('en-US', {
    weekday: 'long', // long, short, narrow
    month: 'long',
    day: 'numeric'
  });
}
const epochToTime = (unixTime) => {
  return new Date(unixTime * 1000).toLocaleString('en-US', {
    hour: 'numeric', // numeric, 2-digit
    minute: 'numeric', // numeric, 2-digit
  });
}

command(client, '7weather', message => {
  let absoluteURL = ``;
  let tempLocation = message.content.replace('!7weather ', '').trim();
  let location = tempLocation.split(',').map(item => item.trim());
  let cityName, state, country = "";
  if (location.length > 0) {
    [cityName, state, country] = location;
  }
  console.log(`Cityname: ${cityName}, ${state}, ${country}`);
  let result = findCityID(cityName, state, country);

  if (result === undefined) {
    message.channel.send("Wrong Name Format Provided");
  } else {
    let lon = result.coord['lon'];
    let lat = result.coord['lat'];
    absoluteURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${api}&units=metric`
    fetch(absoluteURL).then(res => {
      return res.json();
    }).then(parsedWeather => {
      if (parsedWeather.cod === '404') {
        message.channel.send("Invalid Location Provided!");
      } else {
        const embed = new Discord.MessageEmbed()
          .setTitle(`Daily Forecast for ${cityName}`)
          .setAuthor('Open Weather API');
        let shortnedWeather = parsedWeather['daily'].slice(0, 6);
        shortnedWeather.map(eachDay => {
          embed.addFields({
            name: epochToDate(eachDay.dt),
            value:
              `
          Sunrise: ${epochToTime(eachDay.sunrise)},
          Sunset: ${epochToTime(eachDay.sunset)},
          Weather: ${eachDay.weather[0].main},
          Morning: ${eachDay.temp.morn} (${eachDay.feels_like.morn}),
          Evening: ${eachDay.temp.eve} (${eachDay.feels_like.eve}),
          Night: ${eachDay.temp.night} (${eachDay.feels_like.night}),
          `,
            inline: true
          })
        })
        message.channel.send({ embed: embed }).catch(err => { console.log("Error Sending Message: ", err) })
      }
    }).catch(err => { console.log("Err: ", err) });
  }
})

client.on('message', async message => {
  if (message.author.bot) return;

  // ---normal reaction commands---
  if (message.content.match(/\bshia\b/i)) {
    message.react('<:shia:590783923164938242>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\brim\b|\bdream\b)/i)) {
    message.react('<:dream:590832149121466369>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\bpho\b|\bphò\b|\bQV\b)/i)) {
    message.react('<:phothug:590623481088180225>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\bchui\b|\bchúi\b|\bchuoi\b|\bchuối\b)/i)) {
    message.react('<:chuoicry:590776762540228618>').catch(error => { console.log(error) });
  }
  if (message.content.match(/\bOG\b/i)) {
    message.react('<:ognguyen:590789909242183680>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\btom\b|\btôm\b|\bstorm\b)/i)) {
    message.react('<:storm2:591121718098133002>').catch(error => { console.log(error) });
  }
  if (message.content.match(/Trump/i)) {
    message.react('<:trump:733823690038575174>').catch(error => { console.log(error) });
  }
  if (message.content.match(/hmm/i)) {
    message.react('<:trump:733823690038575174>').catch(error => { console.log(error) });
  }
  if (message.content.match(/\bneko\b/i)) {
    message.react('<:neko:690437227351769098>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\bchuy boa\b|\bChụy boa\b|\bChụy ba\b|\bshaduy\b|\bchị ba\b|\bchị 3\b|\bchuy 3\b|\bChụy 3\b|\bChụy 3)/i)) {
    message.react('<:chuy3:590774817326891009>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\byamirai\b|\byamirui\b|\bhokage\b|\byam\b)/i)) {
    message.react('<:feelsyamman:590615525667766313>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\biron aids\b|tuấn|tuan)/i)) {
    message.react('<:ironaids:590791940174381056>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\bhim\b|\bhim69\b|\bbede\b|\bgay\b)/i)) {
    message.react('<:him69:590780197285003264>').catch(error => { console.log(error) });
  }
  if (message.content.match(/\bhokage\b/i)) {
    message.react('<:him69:590780197285003264>').catch(error => { console.log(error) });
    message.react('<:ironaids:590791940174381056>').catch(error => { console.log(error) });
    message.react('<:feelsyamman:590615525667766313>').catch(error => { console.log(error) });
  }
  if (message.content.match(/(\bdaudau\b|\bdau dau\b|\bđậu đậu\b|tú)/i)) {
    message.react('<:daudau:690418600565145602>').catch(error => { console.log(error) });
  }
  if (message.content.match(/\boops\b/i)) {
    message.react('<:oops:794086548382810122>').catch(error => { console.log(error) });
  }
  if (message.content.match(/\bsummer\b/i)) {
    if (message.author.bot) return;
    setTimeout(() => {
      message.channel.send('WOOF WOOF!').catch(error => console.log(error));
    }, 1000);
    setTimeout(() => {
      message.channel.send('WOOF Woof!').catch(error => console.log(error));
    }, 1500);
    setTimeout(() => {
      message.channel.send('woof woof').catch(error => console.log(error));
    }, 1800);
    setTimeout(() => {
      message.channel.send('<:summer:680375204052205729>').catch(error => { console.log(error) });
    }, 2000);
  }
  if (message.content.includes('shh')) {
    message.react('<:shhh:797262655605833738>').catch(error => { console.log(error) });
  }
  if (message.content.match(/oppa/i)) {
    message.react('<:oppa:690428609630044160>').catch(error => { console.log(error) });
  }
  // ---normal reaction commands---

  // ---text to speech commands ---

  //function to play tts file
  const getTTSFile = async (request) => {
    const [response] = await ttsClient.synthesizeSpeech(request);
    return response;
  }

  if (message.content === "!leave") {
    message.member.voice.channel.disconnect();
    message.channel.send("Bot leave the channel");
  }
  if (message.content.startsWith("!summer")) {
    const VOICE_CHANNEL = message.member.voice.channel;
    if (VOICE_CHANNEL) {
      const connection = await message.member.voice.channel.join();
      connection.play('summer.mp3').on('finish', () => {
        console.log("Finished playing audio")
        VOICE_CHANNEL.leave();
      }).on('error', console.error);
    }
  }
  if (message.content.startsWith("!say")) {
    const VOICE_CHANNEL = message.member.voice.channel;
    const TTS_CONTENT = message.content.replace('!say ', '');
    //check if user is in voice channel
    if (VOICE_CHANNEL) {
      const playingAudioFile = async () => {
        const connection = await message.member.voice.channel.join();
        connection.play('output.mp3').on('finish', () => {
          console.log("Finished playing audio")
          // VOICE_CHANNEL.leave();
        }).on('error', console.error);
      };

      const quickstart = async () => {
        const request = {
          input: { text: TTS_CONTENT },
          voice: {
            languageCode: "vi-VN",
            name: "vi-VN-Wavenet-B"
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 1,
          }
        }
        const [response] = await ttsClient.synthesizeSpeech(request);
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log("Finished Writing audio file");
      }
      quickstart();
      const list = [quickstart, playingAudioFile];
      for (const fn of list) {
        await fn();
      }
    } else {
      message.reply("You need to be in voice channel to use this command!");
    }
  }
})













// const ytdl = require('ytdl-core');
// const PREFIX = "$";
// const TTS_PREFIX = "$say";

// //start listening
// client.on('ready', () => {
//   console.log(`${client.user.username} has logged in!`);
// });
// // listening for message 
// client.on('message', (message) => {
//   if (message.author.bot) return;
//   if (message.content.startsWith(PREFIX) && !message.content.startsWith(TTS_PREFIX)) {
//     const [CMD_NAME, ...args] = message.content
//       .trim()
//       .substring(PREFIX.length)
//       .split(" ");
//     console.log(CMD_NAME, " sent by ", message.author.username);
//     console.log(`Args of command ${args}`)
//   }
//   else if (message.content.startsWith(TTS_PREFIX)) {
//     const TTS_TEXT = message.content.substring(TTS_PREFIX.length);
//     const AUTHOR = message.author.username;
//     const VOICE_CHANNEL = message.member.voice.channel;

//     // check is user in voice channel to use the command
//     if (!VOICE_CHANNEL) { message.reply("You need to be in voice channel to use this command!"); }
//     else {
//       const permissions = VOICE_CHANNEL.permissionsFor(message.client.user);
//       if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
//         return message.channel.send("I need the permissions to join and speak in your channel!")
//       }
//       else {
//         VOICE_CHANNEL.join();
//         VOICE_CHANNEL.connection.play(ytdl("https://www.youtube.com/watch?v=pRpeEdMmmQ0"));
//         VOICE_CHANNEL.leave();
//       }
//       const request = {
//         "audioConfig": {
//           "audioEncoding": "LINEAR16",
//           "pitch": 0.8,
//           "speakingRate": 1.19
//         },
//         "input": {
//           "text": TTS_TEXT
//         },
//         "voice": {
//           "languageCode": "vi-VN",
//           "name": "vi-VN-Wavenet-B"
//         }
//       }
//       console.log("TTS command was sent:", TTS_TEXT);
//       console.log("AUTHOR: ", AUTHOR);
//       console.log("CHANNEL: ", VOICE_CHANNEL.name);
//     }

//   }

// })

client.login(process.env.DISCORDJS_BOT_TOKEN);