const udp = require("dgram");
const { parse } = require("native-dns-packet");
const { argv } = require("process");
const { lookup } = require("dns");

const providedPort = Number(argv?.[2]) || 53;
const addr = "0.0.0.0";
const udpServer = udp.createSocket("udp4");

const pubDnsReq = async (dnsNameString,senderInfo) => {
  lookup(dnsNameString, (...param) => {
    console.log("res", param);
    // udpServer.send('param[1]',senderInfo.port,senderInfo.address);
    // TODO resolve the request and send the data back to DIG
  });
};
udpServer.bind(providedPort, addr);

udpServer.on("listening", () => {
  const addr = udpServer.address();
  console.log(`server listening on ${addr.port} ${addr.address}`);
});

udpServer.on("message", (msgBuff, rInfo) => {
  const msg = parse(msgBuff);
  msg.question.forEach((q)=>{
    pubDnsReq(q.name,rInfo)
  })
});
