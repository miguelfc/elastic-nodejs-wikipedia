# elastic-nodejs-wikipedia

Simple node application that extracts recent changes information from wikipedia, and saves them into elasticsearch.

## Disclaimer

This application just shows a use case for nodejs and elasticsearch working together. It has not been optimized in any way, and the whole application could be done better for production usage, which is not this case. Other than that, you can do whatever you want with it.

## Requisites

You will need node.js to work, a working installation of elasticsearch and internet access.
For the node application you will need to install the elasticsearch package from the application directory (or globally if you like):

```sh
npm install elasticsearch
```

## Installation

This doesn't need any installation, but you will need to provide the packages indicated in the requisites.

## Usage

Just run the extract script:

```sh
node extract.js
```

You can customize how many calls to the api you can do, by editing the script.

## Other stuff

If you don't have experience with elasticsearch, you can install the head plugin which is basically a web UI to visualize the data. Just use the following command from the elasticsearch bin directory and you are good to go:

```sh
./plugin install mobz/elasticsearch-head
```

After that, you can access using this url (with the adequate host and port):

http://localhost:9200/_plugin/head/
