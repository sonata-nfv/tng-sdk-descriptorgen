describe('tng-sdk-descriptorgen input', function() {  
	var submitBtn = element(by.id('submitBtn'));
	var author = element(by.id('author'));
	var vendor = element(by.id('vendor'));
	var name = element(by.id('name'));
	var description = element(by.id('description'));
	var vnfs = element(by.id('vnfs'));
	var vnfType = element(by.id('vnfType'));
	

	beforeEach(function() {
		browser.get('');
	});

	
	it('should show the logo, input form, and generate button', function() {
		expect(element(by.id('logo')).isDisplayed()).toBeTruthy();
		expect(element(by.id('input')).isDisplayed()).toBeTruthy();
		expect(submitBtn.isDisplayed()).toBeTruthy();
	});
	
	it('should not show new or button button', function() {
		expect(element(by.id('newBtn')).isDisplayed()).toBeFalsy();
		expect(element(by.id('downloadBtn')).isDisplayed()).toBeFalsy();
	});
	
	it('should show the default inputs', function() {
		expect(author.getAttribute('value')).toEqual('Tango');
		expect(vendor.getAttribute('value')).toEqual('Tango');
		expect(name.getAttribute('value')).toEqual('tango-nsd');
		expect(description.getAttribute('value')).toEqual('Default description');
		expect(vnfs.getAttribute('value')).toEqual('2');
		expect(vnfType.getAttribute('value')).toEqual('ubuntu');
	});
	
	it('should allow editing the default inputs', function() {
		author.clear().sendKeys('Test author');
		expect(author.getAttribute('value')).toEqual('Test author');
		vendor.clear().sendKeys('Test vendor');
		expect(vendor.getAttribute('value')).toEqual('Test vendor');
		name.clear().sendKeys('Test name');
		expect(name.getAttribute('value')).toEqual('Test name');
		description.clear().sendKeys('Test description');
		expect(description.getAttribute('value')).toEqual('Test description');
		vnfs.sendKeys(3);
		expect(vnfs.getAttribute('value')).toEqual('3');		
	});
});

