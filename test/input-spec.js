describe('tng-sdk-descriptorgen input', function() {  
	beforeEach(function() {
		browser.get('');
	});

	it('should show the logo, input form, and generate button', function() {
		expect(element(by.id('logo')).isDisplayed()).toBeTruthy();
		expect(element(by.id('input')).isDisplayed()).toBeTruthy();
		expect(element(by.id('submitBtn')).isDisplayed()).toBeTruthy();
	});
	
	it('should not show new or button button', function() {
		expect(element(by.id('newBtn')).isDisplayed()).toBeFalsy();
		expect(element(by.id('downloadBtn')).isDisplayed()).toBeFalsy();
	});
	
	it('should show the default inputs', function() {
		expect(element(by.id('author')).getAttribute('value')).toEqual('Tango');
		expect(element(by.id('vendor')).getAttribute('value')).toEqual('Tango');
		expect(element(by.id('name')).getAttribute('value')).toEqual('tango-nsd');
		expect(element(by.id('description')).getAttribute('value')).toEqual('Default description');
		expect(element(by.id('vnfs')).getAttribute('value')).toEqual('2');
		expect(element(by.id('vnfType')).getAttribute('value')).toEqual('ubuntu');
	});
	
	// TODO: try enter something, click generate button
	// TODO: output-spec.js to check output? or better in one test file?
	// TODO: document and prepare for CICD environment (how to install and run protractor)
});

