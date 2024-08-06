
# Prime Number Cartesi DApp

This is a simple Cartesi DApp to find prime numbers within a given range. It provides an HTTP server that interacts with a rollup server to process requests for computing prime numbers and responding to inspections.

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
   git clone https://github.com/yourusername/prime-cartesi-dapp.git
   cd prime-cartesi-dapp
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

This endpoint processes advance state requests to compute prime numbers.

- **URL:** \`/advance\`
- **Method:** \`POST\`
- **Payload:**
  \`\`\`json
  {
    "payload": "<hex-encoded JSON string>"
  }
  \`\`\`

#### Example Request Payload

\`\`\`json
{
  "method": "prime",
  "args": {
    "lower": "10",
    "higher": "50"
  }
}
\`\`\`

#### Example Response

\`\`\`json
{
  "primes": [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
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

#### Example Request Payload

\`\`\`plaintext
"primes"
\`\`\`

#### Example Response

\`\`\`json
[
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
]
\`\`\`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

If you have any questions or issues, please open an issue on GitHub. Thank you for using this Cartesi DApp to find prime numbers!
