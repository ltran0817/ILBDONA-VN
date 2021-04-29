const { openWeatherAPI } = require('../../config.json');
const fetch = require("node-fetch");

module.exports = {
  name: 'weather',
  description: 'return weather information of user input',
  execute(message, args) {
    let absoluteURL = "";
    const location = args[0];
    if (location.match(/^[0-9]{5}(?:-[0-9]{4})?$/i)) {
      absoluteURL = `https://api.openweathermap.org/data/2.5/weather?zip=${location},us&appid=${openWeatherAPI}&units=metric`;
    } else {
      absoluteURL = `https://api.openweathermap.org/data/2.5/weather?q=${location},us&appid=${openWeatherAPI}&units=metric`;
    }
    console.log("Requested Location:", location);

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
  }
}