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


// use provided information to copy and generate descriptors based on the default descriptors
function genTangoDescriptors(defaultNsd, defaultVnfd, uploadedVnfs) {
    vnfds = generateVnfds(defaultVnfd, uploadedVnfs);
    nsd = generateNsd(defaultNsd, vnfds);

    return [nsd, vnfds];
}


// generate VNFDs by copying and editing the default VNFD (not for uploaded VNFDs)
function generateVnfds(defaultVnfd, uploadedVnfs) {
    var vnfds = [];
    defaultVnfd.author = document.getElementById('author').value;
    defaultVnfd.vendor = document.getElementById('vendor').value;
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
    });

    return vnfds;
}


function generateNsd(defaultNsd, vnfds) {
    // copy and edit NSD: general info and involved vnfs
    var nsd = defaultNsd;		// since there's only one NSD, no proper copy needed
    nsd.author = document.getElementById('author').value;
    nsd.vendor = document.getElementById('vendor').value;
    nsd.name = document.getElementById('name').value;
    nsd.description = document.getElementById('description').value;

    var numVnfs = vnfds.length;
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

    return nsd;
}