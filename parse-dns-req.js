const BufferCursor = require("buffercursor");
const parseMsg = (msgBuffer) => {
  const headerSection = parseHeader(msgBuffer);
  const question = parseQuestion(msgBuffer);
};

const parseHeader = (msgBuff) => {
  const packet = {};
  const val = msgBuff.readUInt16BE();
  packet["id"] = val;
  packet["qr"] = (val & 0x8000) >> 15;
  packet["opcode"] = (val & 0x7800) >> 11;
  packet["aa"] = (val & 0x400) >> 10;
  packet["tc"] = (val & 0x200) >> 9;
  packet["rd"] = (val & 0x100) >> 8;
  packet["ra"] = (val & 0x80) >> 7;
  packet["res1"] = (val & 0x40) >> 6;
  packet["res2"] = (val & 0x20) >> 5;
  packet["res3"] = (val & 0x10) >> 4;
  packet["rcode"] = val & 0xf;
  return packet;
};
const unPack = (buff) => {
  var len,
    comp,
    end,
    pos,
    part,
    combine = "";

  len = buff.readUInt8();
  comp = false;
  end = buff.tell();

  while (len !== 0) {
    if (isPointer(len)) {
      len -= LABEL_POINTER;
      len = len << 8;
      pos = len + buff.readUInt8();
      if (!comp) end = buff.tell();
      buff.seek(pos);
      len = buff.readUInt8();
      comp = true;
      continue;
    }

    part = buff.toString("ascii", len);

    if (combine.length) combine = combine + "." + part;
    else combine = part;

    len = buff.readUInt8();

    if (!comp) end = buff.tell();
  }

  buff.seek(end);

  return combine;
};
const parseQuestion = (buff) => {
  const q = {};
  const msg = new BufferCursor(buff);
  q["name"] = unPack(msg);
  q["type"] = msg.readUInt16BE();
  q["class"] = msg.readUInt16BE();
  buff.question[0] = val;
  return q;
};
module.exports = {
  parseMsg,
};
