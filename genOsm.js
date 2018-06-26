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
function genOsmDescriptors(defaultNsd, defaultVnfd, uploadedVnfs) {
    vnfds = generateOsmVnfds(defaultVnfd, uploadedVnfs);
    nsd = generateOsmNsd(defaultNsd, vnfds);

    return [nsd, vnfds];
}


// generate VNFDs by copying and editing the default VNFD (not for uploaded VNFDs)
function generateOsmVnfds(defaultVnfd, uploadedVnfs) {
    var vnfds = [];
    var numDefaultVnfs = 0;
    // iterate through VNFs (using .vnf-select, which points to the VNFD of each VNF)
    $('.vnf-select').each(function(i, obj) {
        if (obj.value == "default") {
            vnfds.push(jQuery.extend(true, {}, defaultVnfd));   // deep copy (necessary for nested VNFD fields)
            var vnfd = vnfds[i]["vnfd-catalog"]["vnfd"][0];
            vnfd["id"] = "default-vnf" + numDefaultVnfs;
            vnfd["name"] = "default-vnf" + numDefaultVnfs;
            vnfd["short-name"] = "default-vnf" + numDefaultVnfs;
            vnfd["vendor"] = document.getElementById('vendor').value;
            vnfd["vdu"][0]["image"] = document.getElementById('image' + (i+1)).value;

            // set unique interface names
            var vdu_interface = vnfd["vdu"][0]["interface"];
            vdu_interface[0]["name"] = "vnf" + numDefaultVnfs + "-mgmt";
            vdu_interface[1]["name"] = "vnf" + numDefaultVnfs + "-input";
            vdu_interface[2]["name"] = "vnf" + numDefaultVnfs + "-output";

            numDefaultVnfs += 1;
        }
        else {
            console.log("VNF " + i + ": Using uploaded VNFD: " + obj.value);
            vnfds.push(uploadedVnfs[obj.value]);
        }
    });

    return vnfds;
}


function generateOsmNsd(defaultNsd, vnfds) {
    // edit NSD: general info and involved vnfs (since there's only one NSD, no proper copy needed)
    var nsd = defaultNsd["nsd-catalog"]["nsd"][0];
    nsd["vendor"] = document.getElementById('vendor').value;
    nsd["id"] = document.getElementById('name').value;
    nsd["name"] = document.getElementById('name').value;
    nsd["description"] = document.getElementById('description').value;

    var numVnfs = vnfds.length;
    for (i=0; i<numVnfs; i++) {
        // list involved vnfs
        if (!nsd["constituent-vnfd"][i])		//create new entry if non-existent
            nsd["constituent-vnfd"][i] = {};
        nsd["constituent-vnfd"][i]["member-vnf-index"] = i;
        nsd["constituent-vnfd"][i]["vnfd-id-ref"] = vnfds[i]["vnfd-catalog"]["vnfd"][0]["id"];

        // create management connection points
        if (!nsd["vld"][0]["vnfd-connection-point-ref"][i])		//create new entry if non-existent
            nsd["vld"][0]["vnfd-connection-point-ref"][i] = {};
        nsd["vld"][0]["vnfd-connection-point-ref"][i]["member-vnf-index-ref"] = i;
        nsd["vld"][0]["vnfd-connection-point-ref"][i]["vnfd-connection-point-ref"] = "mgmt";
        nsd["vld"][0]["vnfd-connection-point-ref"][i]["vnfd-id-ref"] = vnfds[i]["vnfd-catalog"]["vnfd"][0]["id"];
    }

     // create vLinks between VNFs
     for (i=0; i<numVnfs-1; i++) {
        // start with vld i+1 because vld 0 is the mgmt vld
        nsd["vld"][i+1] = {};
        nsd["vld"][i+1]["id"] = "vnf" + i + "-2-vnf" + (i+1);
        nsd["vld"][i+1]["name"] = "vnf" + i + "-2-vnf" + (i+1);
        nsd["vld"][i+1]["vnfd-connection-point-ref"] = [];
        nsd["vld"][i+1]["vnfd-connection-point-ref"][0] = {
            "member-vnf-index-ref": i,
            "vnfd-connection-point-ref": "output",
            "vnfd-id-ref": vnfds[i]["vnfd-catalog"]["vnfd"][0]["id"]
        };
        nsd["vld"][i+1]["vnfd-connection-point-ref"][1] = {
            "member-vnf-index-ref": i+1,
            "vnfd-connection-point-ref": "input",
            "vnfd-id-ref": vnfds[i+1]["vnfd-catalog"]["vnfd"][0]["id"]
        };
    }

    return defaultNsd;
}