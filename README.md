# 5GTANGO Descriptor Generator
The descriptor generator provides a simple web-based GUI that allows to setup and generate correct descriptors (VNFDs and NSDs). The generator uses provided information or assumes default values if no information is provided. This allows the generation of descriptors with a single click.

The resulting VNFDs and NSDs can still be modified as needed.

## Installation and usage

Simply download the repository and open `index.html` in a web browser (tested with Firefox 58).


## Docker deployment

If you want to deploy the descriptor generator as a docker container, you can do so using the `Dockerfile`. Simply download the repository and run from within:
* `docker build -t tng-sdk-descriptorgen:latest .` to create the docker image
* `docker images` to check that the image is there
* `docker run -d -p 80:80 tng-sdk-descriptorgen:latest` to start the docker container
* `docker container ls` to check that the container is running
* Open (localhost)[localhost] in your web browser to access the descriptor generation web interface

## Workflow
### Input

The web interface asks for high-level information about the network service such as author and service name. For all fields, default values are provided to support the easy and fast generation of new descriptors. Clicking the "Generate" button triggers the generation of the descriptors.

![input](docs/input.png)

### Output

The generated descriptors are directly shown in code boxes that allow further manual adjustments and that provide yaml code highlighting. Once satisfied with the result, the descriptors can be downloaded individually or bundled together in a zip file.

![input](docs/output.png)



## Development and contribution

Please check or create [issues](https://github.com/sonata-nfv/tng-sdk-descriptorgen/issues) matching the current and future development steps.



**TODO: Comments after Aveiro F2F**

* support specifying high-level information in some kind of meta-descriptor that can be compiled into descriptors via command line --> more comfortable for advanced users who don't want to use the web interface
* specify min/max number of VNFCs per VDU
* allow to specify multiple VDUs per VNF?
* Other types of descriptors?
  * Test descriptors
  * Policy descriptors (eg, placement constraints)
* ensure consistency with specific schema version
