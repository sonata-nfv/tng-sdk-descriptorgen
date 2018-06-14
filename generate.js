/* Copyright (c) 2017 5GTANGO and Paderborn University ALL RIGHTS RESERVED. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

Neither the name of 5GTANGO, Paderborn University
nor the names of its contributors may be used to endorse or promote
products derived from this software without specific prior written
permission.

This work has been performed in the framework of the 5GTANGO project,
funded by the European Commission under Grant number 761493 through
the Horizon 2020 and 5G-PPP programmes. The authors would like to
acknowledge the contributions of their colleagues of the 5GTANGO
partner consortium (www.5gtango.eu). */


// global variables
var defaultTangoVnfd;
var defaultTangoNsd;
var defaultOsmVnfd;
var defaultOsmNsd;
var tangoVnfds;
var tangoNsd;
var osmVnfds;
var osmNsd;
var uploadedVnfs = {};
var productionMode = true;     // productionMode = true --> load default descriptors faster (default!); = false --> reflect changed descriptors within minutes

// button click
$('#submitBtn').click(loadDescriptors);
$('#newBtn').click(refresh);
$('#downloadBtn').click(downloadAll);

// dynamic form fields for adding/removing VNFs
$(document).ready(function(){
    var numVnfs = 1;
    // add VNF
    $("#addBtn").click(function(e){
        numVnfs = numVnfs + 1;
        // copy & paste from index.html
        var newVnf =
            '<div class="input-group my-1">' +
            '<select class="form-control vnf-select" id="vnf' + numVnfs + '"><option value="default">Default VNFD</option></select>' +
            '<input type="text" class="form-control" id="image' + numVnfs + '" value="ubuntu:16.04" required>' +
            '<select class="form-control" id="type' + numVnfs + '"><option value="docker">docker</option><option value="vhd">vhd</option><option value="vmdk">vmdk</option><option value="vdi">vdi</option>' +
            '<option value="iso">iso</option><option value="qcow2">qcow2</option><option value="ova">ova</option><option value="ovf">ovf</option><option value="raw">raw</option></select>' +
            '<span class="input-group-btn"><button class="btn rem-btn" type="button">Remove VNF</button></span></div>';
        $("#addBtn").before($(newVnf));
        // add options: all previously uploaded VNFDs
        for (vnf in uploadedVnfs) {
            $('#vnf' + numVnfs).append($('<option>', {value: vnf, text: vnf}));
        }

        // remove VNF
        $('.rem-btn').click(function(e){
            var vnfGroup = this.parentNode.parentNode;
            $(vnfGroup).remove();
        });
    });
});

// submit when pressing enter
document.getElementById('nsdInput').onkeydown = function(e) {
	if (e.keyCode == 13) {
		loadDescriptors();
	}
};

// hide newBtn and downloadBtn at the beginning
window.onload = function() {
	document.getElementById('newBtn').style.display = 'none';
	document.getElementById('downloadBtn').style.display = 'none';
};

// reload window to allow creating new descriptors
function refresh() {
	location.reload();
}


// load default VNFD and NSD from GitHub (asynchronous -> set VNFD, NSD and ask for user input when ready)
function loadDescriptors() {
	if (productionMode) {
        // load most recent 5GTANGO default descriptors from the tng-schema repository using RawGit production CDN
        var tangoVnfdUrl = "https://cdn.rawgit.com/sonata-nfv/tng-schema/4ea30d03/function-descriptor/examples/default-vnfd.yml";
        var tangoNsdUrl = "https://cdn.rawgit.com/sonata-nfv/tng-schema/4ea30d03/service-descriptor/examples/default-nsd.yml";

        var osmVnfdUrl = "https://cdn.rawgit.com/sonata-nfv/tng-sdk-descriptorgen/134e6193/default-descriptors/osm_default_vnfd.yaml";
        var osmNsdUrl = "https://cdn.rawgit.com/sonata-nfv/tng-sdk-descriptorgen/134e6193/default-descriptors/osm_default_nsd.yaml";
    }
    else {
        // or load them from StefanUPB/tng-sdk-descriptorgen fork using RawGit development CDN (only for development, testing)
        console.log("productionMode off: Load default descr. from StefanUPB/tng-sdk-descriptorgen + no caching");
        var tangoVnfdUrl = "https://rawgit.com/StefanUPB/tng-sdk-descriptorgen/master/default-descriptors/tango_default_vnfd.yml";
        var tangoNsdUrl = "https://rawgit.com/StefanUPB/tng-sdk-descriptorgen/master/default-descriptors/tango_default_nsd.yml";

        var osmVnfdUrl = "https://rawgit.com/StefanUPB/tng-sdk-descriptorgen/master/default-descriptors/osm_default_vnfd.yaml";
        var osmNsdUrl = "https://rawgit.com/StefanUPB/tng-sdk-descriptorgen/master/default-descriptors/osm_default_nsd.yaml";
    }
	
	// hide the generate button and input and show the generate new and download buttons
	document.getElementById('nsdInput').style.display = 'none';
    document.getElementById('vnfdInput').style.display = 'none';
	document.getElementById('submitBtn').style.display = 'none';
	document.getElementById('newBtn').style.display = 'block';
	document.getElementById('downloadBtn').style.display = 'block';

    // load descriptors; only cache default descriptors in production, not in development
	var loadTangoVnfd = $.ajax({url: tangoVnfdUrl, cache: productionMode});
	var loadTangoNsd = $.ajax({url: tangoNsdUrl, cache: productionMode});
    var loadOsmVnfd = $.ajax({url: osmVnfdUrl, cache: productionMode});
    var loadOsmNsd = $.ajax({url: osmNsdUrl, cache: productionMode});
    $.when(loadTangoVnfd, loadTangoNsd, loadOsmVnfd, loadOsmNsd).then(generateDescriptors);
	
	return false;
}


// trigger generation of Tango and OSM descriptors
function generateDescriptors(data1, data2, data3, data4) {
    // get the returned default
    defaultTangoVnfd = jsyaml.safeLoad(data1[0]);
    defaultTangoNsd = jsyaml.safeLoad(data2[0]);
    defaultOsmVnfd = jsyaml.safeLoad(data3[0]);
    defaultOsmNsd = jsyaml.safeLoad(data4[0]);

    var descriptors = genTangoDescriptors(defaultTangoNsd, defaultTangoVnfd, uploadedVnfs);
    tangoNsd = descriptors[0];
    tangoVnfds = descriptors[1];

    var descriptors = genOsmDescriptors(defaultOsmNsd, defaultOsmVnfd, uploadedVnfs);
    osmNsd = descriptors[0];
    osmVnfds = descriptors[1];

    showDescriptors();
}


// generate and return the project.yml referencing the generated descriptors as JS object (can be dumped as yaml)
function generateProjectYml() {
    // create JS object with project info
    var project = {
        descriptor_extension: "yml",
        version: "0.5",
        files: [],
        package: {
            name: "generated-project",
            version: "0.1"
        }
    };

    // set general info based on provided high-level details (take from tangoNsd)
    project["package"]["maintainer"] = tangoNsd["author"];
    project["package"]["vendor"] = tangoNsd["vendor"];
    project["package"]["description"] = tangoNsd["description"];

    //TODO: add files; problem: reference correct filename -> set proper filenames in the zip!
    // add files: Tango then OSM and NSD, then VNFDs
    var file = {
        path: "bla",
        type: "application/vnd.5gtango.nsd",
        tags: ["eu.5gtango"]
    };

    console.log(project);
    return project;
}


// show the generated descriptors for further editing and copying
function showDescriptors() {
	// print instructions
	document.getElementById('info').innerHTML = "Please edit, copy & paste, or download the descriptors below as needed.";

	// TODO: avoid duplicate code by iterating over all supported platforms (currently tango and osm)
    // Tango
    document.getElementById('tango').innerHTML = "5GTANGO descriptors";
    var nsd = tangoNsd;
    var vnfds = tangoVnfds;
    // print NSD
	document.getElementById('tango-nsd').innerHTML = "NSD";
	var nsdCode = document.getElementById('tango-nsd-code');
	addCode("tango-nsd", nsd, nsdCode);
	addDownloadButton("tango-nsd", nsd, nsdCode);
	
	// print VNFDs
	document.getElementById('tango-vnfds').innerHTML = "VNFDs";
	var vnfdCode = document.getElementById('tango-vnfd-code');
	for (var i = 0; i < vnfds.length; i++) {
		var vnfdSubheader = document.createElement('h4');
		vnfdSubheader.innerHTML = "VNFD " + i;
		vnfdCode.appendChild(vnfdSubheader);
		addCode("tango-vnfd" + i, vnfds[i], vnfdCode);
		addDownloadButton("tango-vnfd" + i, vnfds[i], vnfdCode);
	}

    // OSM
    document.getElementById('osm').innerHTML = "OSM descriptors";
    var nsd = osmNsd;
    var vnfds = osmVnfds;
    // print NSD
    document.getElementById('osm-nsd').innerHTML = "NSD";
    var nsdCode = document.getElementById('osm-nsd-code');
    addCode("osm-nsd", nsd, nsdCode);
    addDownloadButton("osm-nsd", nsd, nsdCode);

    // print VNFDs
    document.getElementById('osm-vnfds').innerHTML = "VNFDs";
    var vnfdCode = document.getElementById('osm-vnfd-code');
    for (var i = 0; i < vnfds.length; i++) {
        var vnfdSubheader = document.createElement('h4');
        vnfdSubheader.innerHTML = "VNFD " + i;
        vnfdCode.appendChild(vnfdSubheader);
        addCode("osm-vnfd" + i, vnfds[i], vnfdCode);
        addDownloadButton("osm-vnfd" + i, vnfds[i], vnfdCode);
    }
	
	PR.prettyPrint();
}


// add the specified code in an editable text field
function addCode(name, descriptor, parentNode) {
	var code = document.createElement('pre');
	code.id = name.toLowerCase() + "Code";
	code.className = "prettyprint lang-yaml";
	code.setAttribute("contentEditable", "true");
	code.innerHTML = jsyaml.safeDump(descriptor);
	parentNode.appendChild(code);
}


// add a download button for the specified descriptor
// name has to be consistent with the name of the corresponding code block (given to addCode)
function addDownloadButton(name, descriptor, parentNode) {
	var downloadBtn = document.createElement('button');
	downloadBtn.id = name.toLowerCase() + "DownloadBtn";
	downloadBtn.className = "btn btn-primary btn-block mb-5";
	downloadBtn.type = "button";
	downloadBtn.innerHTML = "Download " + name.toUpperCase();
	downloadBtn.addEventListener('click', function() {
		// load current descriptor from code box to cover manual changes
		var currDescriptor = document.getElementById(name + "Code").innerText;
		download(currDescriptor, name.toLowerCase() + ".yaml");
	});
	parentNode.appendChild(downloadBtn);
}


// trigger download of a file with the specified data and filename
// adapted from https://stackoverflow.com/a/30832210/2745116
function download(data, filename, type = "text/yaml") {
    var file = new Blob([data], {type: type});
	var a = document.createElement("a"), url = URL.createObjectURL(file);
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	setTimeout(function() {
		document.body.removeChild(a);
		window.URL.revokeObjectURL(url);  
	}, 0); 
}
	

// retrieve and return a suitable file name based on a descriptors name (tango or osm; nsd or vnfd); descriptor = JS object
function getDescriptorFilename(descriptor) {
    // distinguish between tango/osm nsd/vnfd to extract the name correctly
    var filename = "unnamed.yml";

    if (descriptor.hasOwnProperty("nsd-catalog")) {
        filename = "osm_" + descriptor["nsd-catalog"]["nsd"][0]["name"] + ".yml";
    }
    else if (descriptor.hasOwnProperty("vnfd-catalog")) {
        filename = "osm_" + descriptor["vnfd-catalog"]["vnfd"][0]["name"] + ".yml";
    }
    else {
        filename = "tango_" + descriptor["name"] + ".yml";
    }

    return filename;
}

// create and download zip file of all descriptors
function downloadAll() {
    var zip = JSZip();

    // generate project.yml (as JS object)
    var project = generateProjectYml();
    zip.file("project.yml", jsyaml.safeDump(project));

	// retrieve current descriptors to cover possible manual changes
	var divNode = document.getElementById('descriptors');
	var children = divNode.getElementsByTagName('pre');
	for (i = 0; i < children.length; i++) {
	    // read modified code again to extract the descriptor name and use it as file name (+ tango/osm prefix)
		var code = jsyaml.safeLoad(children[i].innerText);
		var filename = getDescriptorFilename(code);
		zip.file(filename, jsyaml.safeDump(code));
	}

	// download the zipped files
	zip.generateAsync({type:"blob"}).then(function(content) {
		download(content, "descriptors.zip", "blob");
	});
}


// upload an existing VNFD to reuse in the network service
function uploadVnfd() {
    var file = document.getElementById("vnfd_upload").files[0];     // only the first file

    if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function(evt) {
            var contents = evt.target.result;
            var vnfd = jsyaml.load(contents);

            // validate: correct vnfd with 3 connection points: input, output, mgmt
            if (!(vnfd.connection_points.some(e => e.id === "mgmt") && vnfd.connection_points.some(e => e.id === "input")
                && vnfd.connection_points.some(e => e.id === "output"))) {
                alert("Invalid VNFD: Does not contain mgmt, input, output connection points")
                return;
            }

            // add new VNFD as option
            uploadedVnfs[vnfd.name] = vnfd;
            $(".vnf-select").append($('<option>', {value: vnfd.name, text: vnfd.name}));

            // show success
            document.getElementById("fileHelp").innerText = "Uploaded " + file.name + " successfully."
        };
        reader.onerror = function(evt) {alert("Error: Could not read file.")}
    }
}
