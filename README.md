# 5GTANGO Descriptor Generator
The descriptor generator provides a simple web-based GUI that allows to setup and generate correct descriptors (VNFDs and NSDs). The generator uses provided information or assumes default values if no information is provided. This allows the generation of descriptors with a single click.

The resulting VNFDs and NSDs can still be modified as needed.



The current version is just a simple prototype to test the main functionality. Better visualization and more/better features are needed.



**TODO: Comments after F2F**

* support specifying high-level information in some kind of meta-descriptor that can be compiled into descriptors via command line --> more comfortable for advanced users who don't want to use the web interface
* specify min/max number of VNFCs per VDU
* allow to specify multiple VDUs per VNF?
* Other types of descriptors?
  * Test descriptors
  * Policy descriptors (eg, placement constraints)
* ensure consistency with specific schema version