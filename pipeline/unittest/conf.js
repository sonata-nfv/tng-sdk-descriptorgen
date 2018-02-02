exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['*.js'],
  capabilities: {
    browserName: 'chrome',
	chromeOptions: {
		args: ['--headless']
	}
  },
  baseUrl: 'file:///' + __dirname + '/../../index.html',
  onPrepare: function() {
	browser.ignoreSynchronization = true;
    browser.resetUrl = 'file:///';
  }
};
