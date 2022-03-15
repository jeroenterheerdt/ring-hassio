# ring-hassio
[![Support the author on Patreon][patreon-shield]][patreon]
## Archived
This repo has been archived - please consider forking to continue development.

## About
A Home Assistant add-on to enable live streams of Ring Cameras.
This add-on wraps around [Dgreif's excellent work](https://github.com/dgreif/ring) and exposes a livestream.

> **DOT NOT run this add-on with 24-hour streaming - use this addon by starting it on-demand**

## Installation
1. Add this GitHub repository to your **supervisor** (not HACS) add-on store. 
2. Configure your Ring Refresh Token and port (see configuration below).
3. Start the "Ring Livestream" add-on. Check for errors in the logs.
4. For remote access, open up the port in your router.
5. Open the stream at http://homeassistant.local:port/public/stream.m3u8 to make sure it works before going any further. We recommend using VLC or equivalent.
6. Add a camera to Home Assistant, such as:
   ```yaml
   camera:
     - platform: generic
       name: Ring Livestream
       stream_source: http://homeassistant.local:port/public/stream.m3u8
       still_image_url: http://homeassistant.local:port/public/stream.m3u8
    ```
    (Don't worry about the `still_image_url` not pointing to an actual image, we are not going to use it, but it is required.)
7. Add a card `Picture Glance` card to your UI, set the 'Camera Entity` to the camera you have just created.
8. Done! Enjoy your shiny new livestream!

## Configuration
Example configuration:
```yaml
ring_refresh_token: your_refresh_token
camera_name: Front Door
```
* You need to create a refresh token - see https://github.com/dgreif/ring/wiki/Refresh-Tokens on how to do that. Note that you will have to have node and npm installed on your machine.
* The camera name is the name entred when setting up the camera in the Ring app.

## Taking a snapshot
Currently the addon does not support taking snapshots, but when it does this is the configuration you will need:
In order to use the `snapshot` service, you will need to following settings in your `configuration.yaml`:
   ```yaml
   homeassistant:
     whitelist_external_dirs:
       - /config/tmp
   ```
   You can then call the `snapshot` service like this:
   ```yaml
   service: camera.snapshot
   entity_id: [entityID]
   filename: tmp/foo.jpg
   ```

Some users reported success to create a snapshot using:
```camera:
  - platform: ffmpeg
    input: http://hassio.local:port/public/stream.m3u8
```

## Battery conservation
A workaround to start/stop streaming (and avoid quick discharge) in Hassio is to start the addon on demand. Also, automation could be added that turns off the stream after time limit.
To do this set up a sensor and switch:

   ```yaml
   binary_sensor:
     - platform: command_line
       command: "if curl -sSf http://homeassistant.local:3000/index.html &> /dev/null; then echo 1; else echo 0; fi"
       device_class: connectivity
       scan_interval: 3 # check status every X seconds
       name: Ring Livestream State
       payload_on: 1
       payload_off: 0
    
   switch:
     - platform: template
       switches:
         ring_live_stream:
           friendly_name: "Ring Live Stream"
           value_template: "{{ is_state('binary_sensor.ring_livestream_state', 'on') }}"
           turn_on:
             service: hassio.addon_start
             data:
               addon: 44c60309_ringlivestream
           turn_off:
             service: hassio.addon_stop
             data:
               addon: 44c60309_ringlivestream
               
   automation:
     - id: turn_off_ring_live_stream_addon
       alias: Turn Off Ring Live Stream Addon after delay
       trigger:
         - platform: state
           entity_id: binary_sensor.ring_livestream_state
           to: "on"
           for:
             minutes: 2
       action:
         - service: switch.turn_off
           data:
             entity_id: switch.ring_live_stream
   ```
- for the sensor you will need to update the port in URL if you change it in the configuration of the add-on.
- the switch will bounce back to the 'off' state on the next sensor refresh cycle while add-on is starting. If you want to add your own automations, make sure they're based on the sensor, not on the switch.

[patreon-shield]: https://frenck.dev/wp-content/uploads/2019/12/patreon.png
[patreon]: https://www.patreon.com/dutchdatadude
