// XXX even though ethers is not used in the code below, it's very likely
// it will be used by any DApp, so we are already including it here
const { ethers } = require("ethers");
var viem = require("viem");
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

let primesList = [];

const getPrimes = (lower, higher) => {
  let primes = [];
  console.log(lower, higher);

  for (let i = lower; i <= higher; i++) {
    var flag = 0;
    // looping through 2 to ith for the primality test
    for (let j = 2; j < i; j++) {
      if (i % j == 0) {
        flag = 1;
        break;
      }
    }
    if (flag == 0 && i != 1) {
      console.log(i);
      primes.push(i);
    }
  }
  return primes;
};

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  let JSONpayload = {};
  try {
    const payloadStr = viem.hexToString(data.payload);
    JSONpayload = JSON.parse(payloadStr);
  } catch (e) {
    console.log(`Adding notice with binary value ${data.payload}`);
    await fetch(rollup_server + "/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payload: data.payload }),
    });
    return "reject";
  }
  let url;
  let hexresult;
  try {
    if (JSONpayload.method === "prime") {
      console.log("getting the prime numbers");
      const primes = getPrimes(
        parseInt(JSONpayload.args.lower),
        parseInt(JSONpayload.args.higher)
      );
      const result = JSON.stringify({ primes: primes });
      hexresult = viem.stringToHex(result);
      console.log("primes are:", primes);
      url = String(rollup_server + "/notice");
      primesList = primesList.concat(...primes);
    } else {
      console.log("method undefined");
      const result = JSON.stringify({
        error: String("method undefined:" + JSONpayload.method),
      });
      hexresult = viem.stringToHex(result);
      url = String(rollup_server + "/report");
    }
  } catch (e) {
    console.log("error is:", e);
    url = String(rollup_server + "/report");
    hexresult = viem.stringToHex(JSON.stringify({ error: e }));
  }
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      payload: hexresult,
    }),
  });
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  let result;
  try {
    const payloadStr = viem.hexToString(data.payload);
    if (payloadStr == "primes") {
      result = viem.stringToHex(JSON.stringify(primesList));
    } else {
      result = viem.stringToHex(
        `This is a simple cartesi Dapp to find primes. payload is ${payloadStr}`
      );
    }
  } catch (e) {
    result = viem.stringToHex(`Error:${e}`);
  }
  await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload: result }),
  });
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: finish.status }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();