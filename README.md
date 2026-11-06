# companion-module-datavideo-nvs-33

A Bitfocus Companion module for the Datavideo NVS-33 H.264 streaming encoder and recorder.

It controls streaming, recording, encoder settings, stream server targets, inputs, audio,
and the production functions exposed by the Datavideo HTTP JSON API.

See [HELP.md](./companion/HELP.md) for the user documentation and [LICENSE](./LICENSE).

## Protocol source

The module implements the Datavideo HTTP JSON control interface, documented by Datavideo in
`HTTP.COMMAND.APPS.txt` and `HTTP.COMMAND.SYSTEN.txt` (version 1.4.0) for the SC6D0/SC6C0
platform. That command reference was published with the Companion module request
[bitfocus/companion-module-requests#1143](https://github.com/bitfocus/companion-module-requests/issues/1143).

The vendor documents are kept as local reference material and are not redistributed in this
repository.

## Getting started

Executing a `yarn` command should perform all necessary steps to develop the module, if it does not then follow the steps below.

The module can be built once with `yarn build`. This should be enough to get the module to be loadable by companion.

While developing the module, by using `yarn dev` the compiler will be run in watch mode to recompile the files on change.
