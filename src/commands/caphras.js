module.exports = {
  name: 'caphras',
  description: 'display caphras information',
  execute(client, message, args) {
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
    // format: wepType fromLvl toLvl capPrice
    const eqType = args[0];
    const fromlvl = args[1];
    const tolvl = args[2];
    const caphrasPrice = args[3];
    let validFormat = true;

    if (isNaN(args[1]) || isNaN(args[2])) { validFormat = false };
    let amount, sheetDP, heva, hdr, hp, AP, acc = 0;
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
        message.channel.send('Unknown Equipment Type');
        // amount = 0;
        validFormat = false;
      };
    } else {
      let res = "```!caphras [equipment type] [from level] [to level]```";
      message.channel.send(res);
    }

  }
}