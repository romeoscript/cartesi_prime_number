
const { ethers } = require("ethers");
var viem = require("viem");
const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

let factorialsList = [];
let fibonacciList = [];

const getFactorial = (num) => {
  if (num < 0) return -1; // Invalid input for factorial
  else if (num == 0) return 1;
  else {
    let factorial = 1;
    for (let i = 1; i <= num; i++) {
      factorial *= i;
    }
    return factorial;
  }
};

const getFibonacci = (num) => {
  if (num < 1) return []; // Invalid input for Fibonacci sequence
  let fib = [0, 1];
  for (let i = 2; i < num; i++) {
    fib[i] = fib[i - 1] + fib[i - 2];
  }
  return fib.slice(0, num);
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
    if (JSONpayload.method === "factorial") {
      console.log("calculating factorial");
      const num = parseInt(JSONpayload.args.number);
      const factorial = getFactorial(num);
      const result = JSON.stringify({ number: num, factorial: factorial });
      hexresult = viem.stringToHex(result);
      console.log("factorial of", num, "is:", factorial);
      url = String(rollup_server + "/notice");
      factorialsList.push({ number: num, factorial: factorial });
    } else if (JSONpayload.method === "fibonacci") {
      console.log("calculating fibonacci sequence");
      const num = parseInt(JSONpayload.args.number);
      const fibonacci = getFibonacci(num);
      const result = JSON.stringify({ number: num, fibonacci: fibonacci });
      hexresult = viem.stringToHex(result);
      console.log("fibonacci sequence up to", num, "terms is:", fibonacci);
      url = String(rollup_server + "/notice");
      fibonacciList.push({ number: num, fibonacci: fibonacci });
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
    if (payloadStr == "factorials") {
      result = viem.stringToHex(JSON.stringify(factorialsList));
    } else if (payloadStr == "fibonacci") {
      result = viem.stringToHex(JSON.stringify(fibonacciList));
    } else {
      result = viem.stringToHex(
        `This is a simple Cartesi Dapp to calculate factorials and fibonacci sequences. payload is ${payloadStr}`
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
