const { optionHandler } = require('./handleInquirer.js');

async function init() {
  await optionHandler();
}

init();
