# Default descriptors

This folder contains default VNFD and NSD for creating OSM descriptors. The OSM default descriptors are based on examples from the [OSM's website](https://osm.etsi.org/wikipub/index.php/Reference_VNF_and_NS_Descriptors_(Release_THREE)) and [git repository](https://osm.etsi.org/gitweb/?p=osm/devops.git;a=tree;f=descriptor-packages;h=415663e8a79101851d4ae20a23d8ec057bdd3a71;hb=HEAD).

The 5GTANGO default descriptors are loaded directly from [tng-schma](https://github.com/sonata-nfv/tng-schema) via the CDN of jsDelivr. 

When changing the default descriptors (5GTANGO or OSM), make sure to also update them in the [tng-sdk-project repo](https://github.com/sonata-nfv/tng-sdk-project/tree/master/src/tngsdk/descriptorgen/default-descriptors), which includes the CLI- and microservice-version of the descriptor generator. Also, make sure to update the CDN link in `loadDescriptors()` in `generate.js` to point to the current version of the default descriptors.
