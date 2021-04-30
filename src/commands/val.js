module.exports = {
  name: 'val',
  description: 'Calculate the amount of money you get back from BDO Market in under different conditions',
  execute(client, message, args) {
    let withVP = 0;
    let withoutVP = 0;
    let withFMnVP = 0;
    let wrongFormat = false;
    let metric = {
      k: 1000,
      m: 1000000,
      b: 1000000000,
      t: 1000000000000
    }
    // check how many args provided
    if (args.length === 1) {
      const value = args[0];
      //check if the string has unit modifier or just number
      if ((/^(\d*\.?\,?\d*)*$/i).test(value)) {
        let tempValue = value.replaceAll(',', '');
        withFMnVP = tempValue * 0.86;
        withVP = tempValue * 0.845;
        withoutVP = tempValue * 0.65;
      } else {  // if there is unit like k m b t
        console.log("Contains unit: ", value);
        let tempValue = value.match(/^\d*[\.\,]?\d+/i).join('');
        let unit = value.match(/[a-zA-z]/i).join('');
        withFMnVP = tempValue * metric[unit] * 0.86;
        withVP = tempValue * metric[unit] * 0.845;
        withoutVP = tempValue * metric[unit] * 0.65;
        console.log(`${tempValue} - ${unit}`);
      };
    } else if (args.length === 2) {
      if (isNaN(args[0]) || !isNaN(args[1])) {
        wrongFormat = true;
      } else {
        const amount = args[0];
        const unit = args[1];
        withVP = amount * metric[unit[0]] * 0.845;
        withFMnVP = amount * metric[unit[0]] * 0.86;
        withoutVP = amount * metric[unit[0]] * 0.65;
      };
    } else {
      wrongFormat = true;
    };
    if (wrongFormat) {
      message.channel.send("```!val [amount in number][optional multiplier]```");
    } else {
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
    }
  }
}