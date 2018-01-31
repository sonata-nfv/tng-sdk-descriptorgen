exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['input-spec.js'],
  multiCapabilities: [{
    browserName: 'firefox'
  }, {
    browserName: 'chrome'
  }],
  baseUrl: 'file:///' + __dirname + '/../index.html',
  onPrepare: function() {
	browser.ignoreSynchronization = true;
    browser.resetUrl = 'file:///';
  }
};