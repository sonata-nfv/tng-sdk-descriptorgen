describe('tng-sdk-descriptorgen input', function() {  
	var submitBtn = element(by.id('submitBtn'));
	var author = element(by.id('author'));
	var vendor = element(by.id('vendor'));
	var name = element(by.id('name'));
	var description = element(by.id('description'));
	var vnfUpload = element(by.id('vnfd_upload'));
	var vnf1 = element(by.id('vnf1'));
	var addBtn = element(by.id('addBtn'));
	

	beforeEach(function() {
		browser.get('');
	});

	
	it('should show the logo, input form, and generate button', function() {
		expect(element(by.id('logo')).isDisplayed()).toBeTruthy();
		expect(element(by.id('nsdInput')).isDisplayed()).toBeTruthy();
        expect(element(by.id('vnfdInput')).isDisplayed()).toBeTruthy();
        expect(addBtn.isDisplayed()).toBeTruthy();
		expect(submitBtn.isDisplayed()).toBeTruthy();
	});
	
	it('should not show new or download button', function() {
		expect(element(by.id('newBtn')).isDisplayed()).toBeFalsy();
		expect(element(by.id('downloadBtn')).isDisplayed()).toBeFalsy();
	});
	
	it('should show the default inputs', function() {
		expect(author.getAttribute('value')).toEqual('Tango');
		expect(vendor.getAttribute('value')).toEqual('Tango');
		expect(name.getAttribute('value')).toEqual('tango-nsd');
		expect(description.getAttribute('value')).toEqual('Default description');
		expect(vnf1.getAttribute('value')).toEqual('default');
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
		addBtn.click();
		expect(element(by.id('vnf2')).isDisplayed()).toBeTruthy();
	});
});

