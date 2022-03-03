
> Open this page at [https://isakkjerstad.github.io/micro-bit-traffic-lights/](https://isakkjerstad.github.io/micro-bit-traffic-lights/)

# Configure a new traffic light:
- Download the code and flash it to a Micro:Bit with a micro-USB cable.
- Connect the Micro:Bit to a Kitronik STOP:bit traffic light.
- Power the Micro:Bit with either a USB power bank or a battery pack.
- Repeat.

# Operate the traffic lights:
- Once powered up, all lights should turn on. If not, check the physical connections.
- Enter operating mode by pressing A. Confirm with B.
- Enter intersection group by pressing A. Confirm with B.
- Enter direction setting by pressing A. Confirm with B.
- The yellow light will stay on, until the light is ready. Note that at least one master light is needed per intersection group.

## Operating mode:
- (0) for slave, (1) for master.
- The master controls the slaves. Each intersection group should have one master.

## Intersection group:
- Number ranges from 0 to +100. Changes radio group.
- Each intersection should have an uniqe intersection group.
- A intersection can be set up with 2, 4 or more lights.

## Direction setting:
- An intersection can have crossing roads. The direction setting controls matching and opposite lights.
- The direction setting can be (0) or (1). Lights with the same value have matching control.

## Use as Extension (download/edit):

This repository can be added as an **extension** in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **New Project**
* click on **Extensions** under the gearwheel menu
* search for **https://github.com/isakkjerstad/micro-bit-traffic-lights** and import

## Edit this project ![Build status badge](https://github.com/isakkjerstad/micro-bit-traffic-lights/workflows/MakeCode/badge.svg)

To edit this repository in MakeCode.

* open [https://makecode.microbit.org/](https://makecode.microbit.org/)
* click on **Import** then click on **Import URL**
* paste **https://github.com/isakkjerstad/micro-bit-traffic-lights** and click import

#### Metadata (used for search, rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
