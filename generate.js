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


var defaultVnfd;
var defaultNsd;
var uploadedVnfs = {};

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
        var newVnf = '<div class="input-group my-1">' +
            '<select class="form-control vnf-select" id="vnf' + numVnfs + '"><option value="default">default</option></select>' +
            '<span class="input-group-btn"><button class="btn rem-btn" >-</button></span></div>';
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
	var vnfdUrl = "https://cdn.rawgit.com/sonata-nfv/tng-schema/4ea30d03/function-descriptor/examples/default-vnfd.yml";
	var nsdUrl = "https://cdn.rawgit.com/sonata-nfv/tng-schema/4ea30d03/service-descriptor/examples/default-nsd.yml";
	
	// hide the generate button and input and show the generate new and download buttons
	document.getElementById('nsdInput').style.display = 'none';
    document.getElementById('vnfdInput').style.display = 'none';
	document.getElementById('submitBtn').style.display = 'none';
	document.getElementById('newBtn').style.display = 'block';
	document.getElementById('downloadBtn').style.display = 'block';
	
	$.get(vnfdUrl, setVnfd);
	$.get(nsdUrl, setNsd);
	
	return false;
}

function setVnfd(data) {
	defaultVnfd = jsyaml.load(data);
	
	if (typeof defaultNsd != 'undefined')
		editDescriptors();
}

function setNsd(data) {
	defaultNsd = jsyaml.load(data);
	
	if (typeof defaultVnfd != 'undefined')
		editDescriptors();
}


// use provided information to copy and edit the default descriptors
function editDescriptors() {
	// copy and edit VNFDs (don't edit uploaded VNFDs)
	var vnfds = [];
	defaultVnfd.author = document.getElementById('author').value;
	defaultVnfd.vendor = document.getElementById('vendor').value;
    var numVnfs = 0;
    var numDefaultVnfs = 0;
	$('.vnf-select').each(function(i, obj) {
        if (obj.value == "default") {
            vnfds.push(Object.assign({}, defaultVnfd));     // shallow copy defaultVnfd (enough since VNFDs aren't nested)
            vnfds[i].name = "default-vnf" + numDefaultVnfs;
            numDefaultVnfs += 1;
        }
        else {
            vnfds.push(uploadedVnfs[obj.value]);
        }
        numVnfs += 1;
    });
	
	// copy and edit NSD: general info and involved vnfs
	var nsd = defaultNsd;		// since there's only one NSD, no proper copy needed
	nsd.author = document.getElementById('author').value;
	nsd.vendor = document.getElementById('vendor').value;
	nsd.name = document.getElementById('name').value;
	nsd.description = document.getElementById('description').value;
	
	for (i=0; i<numVnfs; i++) {
		// list involved vnfs
		if (!nsd.network_functions[i])		//create new entry if non-existent
			nsd.network_functions[i] = {};
		nsd.network_functions[i].vnf_id = "vnf" + i;
		nsd.network_functions[i].vnf_name = vnfds[i].name;
		nsd.network_functions[i].vnf_vendor = vnfds[i].vendor;
		nsd.network_functions[i].vnf_version = vnfds[i].version;
		
		// create corresponding vLinks
		nsd.virtual_links[0].connection_points_reference[i] = "vnf" + i + ":mgmt";		// mgmt
		nsd.virtual_links[1].id = "input-2-vnf0";								// input to 1st vnf
		nsd.virtual_links[1].connection_points_reference[1] = "vnf0:input";

		if (!nsd.virtual_links[i+2])		//create new entry if non-existent
			nsd.virtual_links[i+2] = {id:"", connectivity_type:"", connection_points_reference:[]};
		nsd.virtual_links[i+2].connectivity_type = "E-Line";
		nsd.virtual_links[i+2].connection_points_reference[0] = "vnf" + i + ":output";
		if (i != numVnfs-1) {
			nsd.virtual_links[i+2].id = "vnf" + i + "-2-vnf" + (i+1);
			nsd.virtual_links[i+2].connection_points_reference[1] = "vnf" + (i+1) + ":input";
		}
		else {
			nsd.virtual_links[i+2].id = "vnf" + i + "-2-output";
			nsd.virtual_links[i+2].connection_points_reference[1] = "output";
		}
	}
	nsd.virtual_links[0].connection_points_reference[numVnfs] = "mgmt";	
	
	// adjust forwarding graph
	nsd.forwarding_graphs[0].number_of_virtual_links = numVnfs + 1;
	for (i=1; i<nsd.virtual_links.length; i++)		// skip 1st vLink (mgmt)
		nsd.forwarding_graphs[0].constituent_virtual_links[i-1] = nsd.virtual_links[i].id;
	for (i=0; i<numVnfs; i++)
		nsd.forwarding_graphs[0].constituent_vnfs[i] = "vnf" + i;
	var pos = 0;
	// take in- and output of each vLink
	for (i=1; i<nsd.virtual_links.length; i++) {		// skip 1st vLink (mgmt)
		nsd.forwarding_graphs[0].network_forwarding_paths[0].connection_points[pos] = {connection_point_ref: nsd.virtual_links[i].connection_points_reference[0], position: pos+1};
		pos++;
		nsd.forwarding_graphs[0].network_forwarding_paths[0].connection_points[pos] = {connection_point_ref: nsd.virtual_links[i].connection_points_reference[1], position: pos+1};
		pos++;
	}
		
	showDescriptors(nsd, vnfds);
}


// show the edited descriptors for further editing and copying
function showDescriptors(nsd, vnfds) {	
	// print instructions
	document.getElementById('info').innerHTML = "Please edit, copy & paste, or download the descriptors below as needed.";
	
	// print NSD
	var nsdHeader = document.getElementById('nsd');
	nsdHeader.innerHTML = "NSD";
	var nsdCode = document.getElementById('nsd-code');
	addCode("nsd", nsd, nsdCode);
	addDownloadButton("nsd", nsd, nsdCode);
	
	// print VNFDs
	var vnfdHeader = document.getElementById('vnfds');
	vnfdHeader.innerHTML = "VNFDs";
	var vnfdCode = document.getElementById('vnfd-code');
	for (i = 0; i < vnfds.length; i++) {
		var vnfdSubheader = document.createElement('h3');
		vnfdSubheader.innerHTML = "VNFD " + i;
		vnfdCode.appendChild(vnfdSubheader);
		addCode("vnfd" + i, vnfds[i], vnfdCode);
		addDownloadButton("vnfd" + i, vnfds[i], vnfdCode);
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
	
	
// create and download zip file of all descriptors
function downloadAll() {
	var zip = JSZip();
	
	// retrieve current descriptors to cover possible manual changes
	var divNode = document.getElementById('descriptors');
	var children = divNode.getElementsByTagName('pre');
	for (i = 0; i < children.length; i++) {
		var code = children[i].innerText;
		var yaml = jsyaml.load(code);
		zip.file(yaml.name + ".yaml", code);
	}
	
	zip.generateAsync({type:"blob"}).then(function(content) {
		download(content, "descriptors.zip", "blob");
	});
}


// upload an existing VNFD to reuse in the network service
function uploadVnfd() {
    var file = document.getElementById("vnfd_upload").files[0];     // only the first file TODO: multiple

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
