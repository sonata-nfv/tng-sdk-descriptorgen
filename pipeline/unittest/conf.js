exports.config = {
  specs: ['*.js'],
  directConnect: true,
  capabilities: {
    browserName: 'chrome',
	chromeOptions: {
		args: ['--headless', '--disable-gpu', '--no-sandbox', '--window-size=1920x1200']
	}
  },
  baseUrl: 'file:///' + __dirname + '/../../index.html',
  onPrepare: function() {
	browser.ignoreSynchronization = true;
    browser.resetUrl = 'file:///';
  }
};
