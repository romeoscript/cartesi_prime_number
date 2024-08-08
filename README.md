
# Factorial and Fibonacci Cartesi DApp

This is a simple Cartesi DApp to calculate factorials and Fibonacci sequences. It provides an HTTP server that interacts with a rollup server to process requests for computing these sequences and responding to inspections.

## Table of Contents

1. [Requirements](#requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [Endpoints](#endpoints)
6. [Contributing](#contributing)
7. [License](#license)

## Requirements

- Node.js (v14.x or later)
- npm (v6.x or later)
- Cartesi Rollup Server URL

## Installation

1. Clone the repository:

   \`\`\`bash
   git clone https://github.com/romeoscript/cartesi_factorial_fibonacci.git
   cd cartesi_factorial_fibonacci
   \`\`\`

2. Install the dependencies:

   \`\`\`bash
   npm install
   \`\`\`

## Configuration

Set the \`ROLLUP_HTTP_SERVER_URL\` environment variable to the URL of your Cartesi rollup server.

For example, you can create a \`.env\` file in the root directory of your project with the following content:

\`\`\`plaintext
ROLLUP_HTTP_SERVER_URL=http://localhost:5000
\`\`\`

Load the environment variables from the \`.env\` file:

\`\`\`bash
source .env
\`\`\`

## Usage

Start the DApp by running the following command:

\`\`\`bash
node index.js
\`\`\`

The DApp will start and continuously listen for requests from the Cartesi rollup server.

## Endpoints

### Advance State

This endpoint processes advance state requests to compute factorials and Fibonacci sequences.

- **URL:** \`/advance\`
- **Method:** \`POST\`
- **Payload:**
  \`\`\`json
  {
    "payload": "<hex-encoded JSON string>"
  }
  \`\`\`

#### Example Request Payload for Factorial

\`\`\`json
{
  "method": "factorial",
  "args": {
    "number": "5"
  }
}
\`\`\`

#### Example Response for Factorial

\`\`\`json
{
  "number": 5,
  "factorial": 120
}
\`\`\`

#### Example Request Payload for Fibonacci

\`\`\`json
{
  "method": "fibonacci",
  "args": {
    "number": "10"
  }
}
\`\`\`

#### Example Response for Fibonacci

\`\`\`json
{
  "number": 10,
  "fibonacci": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
}
\`\`\`

### Inspect State

This endpoint processes inspect state requests.

- **URL:** \`/inspect\`
- **Method:** \`POST\`
- **Payload:**
  \`\`\`json
  {
    "payload": "<hex-encoded string>"
  }
  \`\`\`

#### Example Request Payload for Factorials List

\`\`\`plaintext
"factorials"
\`\`\`

#### Example Response for Factorials List

\`\`\`json
[
  { "number": 5, "factorial": 120 },
  { "number": 6, "factorial": 720 }
]
\`\`\`

#### Example Request Payload for Fibonacci List

\`\`\`plaintext
"fibonacci"
\`\`\`

#### Example Response for Fibonacci List

\`\`\`json
[
  { "number": 10, "fibonacci": [0, 1, 1, 2, 3, 5, 8, 13, 21, 34] },
  { "number": 5, "fibonacci": [0, 1, 1, 2, 3] }
]
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

If you have any questions or issues, please open an issue on GitHub. Thank you for using this Cartesi DApp to calculate factorials and Fibonacci sequences!
