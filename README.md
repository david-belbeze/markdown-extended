# Markdown extended

Simple library that expose markdown server with mermaid extension.

## Installation

This is a Node.js module that can be installed using npm.

`$ npm install -g markdown-extended`

## Usage

`$ mdserve -h`

```commandline
usage: cli.js [-h] [-d DIRECTORY] [-p PORT] [--open]

Optional arguments:
  -h, --help            Show this help message and exit.
  -d DIRECTORY, --directory DIRECTORY
                        The directory containing markdown data to serve
  -p PORT, --port PORT  Set the port of the server that render the markdown 
                        files
  --open                Use this flag to force to open the link in new 
                        browser tab
```

## Documentation

More details in [documentation](./doc/).

## License

Copyright 2019 David BELBEZE

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the 
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit 
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the 
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
