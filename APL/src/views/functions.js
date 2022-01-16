import axios from "axios";
var crypto = require("crypto");


export function validateSpecialCharacters(sss) {
    var sts = false;
    const TerroristCharacters = [];

    if (!sss.includes("\""))
    if (!sss.includes("\'"))
    if (!sss.includes("\`"))
    if (!sss.includes("\\"))
    if (!sss.includes("/"))
    if (!sss.includes("~"))
    if (!sss.includes("\%"))
    if (!sss.includes("^"))
    if (!sss.includes("\&"))
    if (!sss.includes("\+"))
      sts = true;
    return sts;
}

export function validateMobile(sss) {
  var sts = false;
  const TerroristCharacters = [];

  if (sss.length === 10)
  if (!sss.includes("\."))
  if (!sss.includes("\-"))
  if (!sss.includes("\+"))
  if (!sss.includes("\*"))
  if (!sss.includes("\/"))
  if (!sss.includes("e"))
  if (!sss.includes("E"))
  if (!isNaN(sss))
    sts = true;
  return sts;
}

export function validateEmail(sss) {
    let sts = false;
    if (validateSpecialCharacters(sss)) {
      let xxx = sss.split("@");
      if (xxx.length === 2) {
        if (xxx[1].includes(".")) 
          sts = true;
      }
    }
    return sts;
}



export function encrypt(text) {
  let hash="";
  try {
    const cipher = crypto.createCipheriv(process.env.REACT_APP_ALGORITHM, 
      process.env.REACT_APP_AKSHUSECRETKEY, 
      Buffer.from(process.env.REACT_APP_IV, 'hex'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    hash = encrypted.toString('hex');
  }
  catch (err) {
    console.log(err);
  } 
  return hash;
};

export function decrypt(hash) {
  const decipher = crypto.createDecipheriv(process.env.REACT_APP_ALGORITHM, 
    process.env.REACT_APP_AKSHUSECRETKEY, 
    Buffer.from(process.env.REACT_APP_IV, 'hex'));
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
  return decrpyted.toString();
};

const AMPM = [
  "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM", "AM",
  "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM", "PM"
];
  /**
 * @param {Date} d The date
 */
const TZ_IST={hours: 5, minutes: 30};
export function cricDate(d) {
  var xxx = new Date(d.getTime());
  xxx.setHours(xxx.getHours()+TZ_IST.hours);
  xxx.setMinutes(xxx.getMinutes()+TZ_IST.minutes);
  var myHour = xxx.getHours();
  var myampm = AMPM[myHour];
  if (myHour > 12) myHour -= 12;
  var tmp = `${MONTHNAME[xxx.getMonth()]} ${("0" + xxx.getDate()).slice(-2)} ${("0" + myHour).slice(-2)}:${("0" +  xxx.getMinutes()).slice(-2)}${myampm}`
  return tmp;
}

const notToConvert = ['XI', 'ARUN']
/**
 * @param {string} t The date
 */



export function getImageName(teamName) {
  let imageName = `${teamName}.JPG`;
  imageName = imageName.replaceAll(" ", "");
  return imageName;
}


export function checkText(txt) {
  for(let i=0; i<txt.length; ++i) {
    let asciiValue = txt.charCodeAt(i);
    if (asciiValue === 10) 
      console.log(`----CR at index ${i}`);
    else if (asciiValue === 13) 
      console.log(`----LF at index ${i}`);
    else if (asciiValue === 32) 
      console.log(`----SP at index ${i}`);
    else
      console.log(`char ${txt[i]} at ${i}`);
  }
}

const CR = String.fromCharCode(13);
const LF = String.fromCharCode(10);
const SP = String.fromCharCode(32);

const IntCR = String.fromCharCode(128+13);
const IntLF = String.fromCharCode(128+10);
const IntSP = String.fromCharCode(128+32);

export function textToInternal(txt) {
  let txt1 = txt;
  let x = txt1.split(CR);
  txt1 = x.join(IntCR);
  x = txt1.split(LF);
  txt1 = x.join(IntLF);
  x = txt1.split(SP);
  txt1 = x.join(IntSP);
  return txt1;
}

export function internalToText(txt) {
  let txt1 = txt;
  let x = txt1.split(IntCR);
  txt1 = x.join(CR);
  x = txt1.split(IntLF);
  txt1 = x.join(LF);
  x = txt1.split(IntSP);
  txt1 = x.join(SP);
  return txt1;
}