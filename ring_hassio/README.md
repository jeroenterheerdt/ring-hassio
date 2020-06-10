# ring-hassio
[![Support the author on Patreon][patreon-shield]][patreon]
## About
A Home Assistant add-on to enable live streams of Ring Cameras.
This add-on wraps around [Dgreif's excellent work](https://github.com/dgreif/ring) and exposes a livestream.

## Installation
1. Add this GitHub repository to your add-on store. 
2. Configure your Ring Refresh Token and port (see configuration below).
3. Start the "Ring Livestream" add-on. Check for errors in the logs.
4. Open port 3000 (default) on your router or whatever you set in the config.
5. Open the stream at http://hassio.local:port/public/stream.m3u8 to make sure it works before going any further. We recommend using VLC or equivalent.
6. Add a camera to Home Assistant, such as:
   ```yaml
   camera:
     - platform: generic
       name: Ring Livestream
       stream_source: http://hassio.local:port/public/stream.m3u8
       still_image_url: http://hassio.local:port/public/stream.m3u8
    ```
    (Don't worry about the `still_image_url` not pointing to an actual image, we are not going to use it, but it is required.)
7. Add a card `Picture Glance` card to your UI, set the 'Camera Entity` to the camera you have just created.
8. Done! Enjoy your shiny new livestream!

## Configuration
Example configuration:
```json
{
    "ring_refresh_token": your_refresh_token
}
```
You need to create a refresh token - see https://github.com/dgreif/ring/wiki/Refresh-Tokens on how to do that.

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
   
## Battery conservation
A workaround to start/stop streaming (and avoid quick discharge) in Hassio is to start the addon on demand.
To do this:

   ```yaml
   sensor:
     - platform: rest
       resource: "http://hassio.local:port/api/hassio/addons/xxxxxxxx_ringlivestream/info"
       headers:
         Authorization: "Bearer [Long_Lived_Access_Token]"
         Content-Type: application/json
       name: ring_addon_state
       value_template: "{{value_json['data']['state']}}" 
    
   switch:
     - platform: template
       switches:
         ring_live_stream:
           value_template: "{{ is_state('sensor.ring_addon_state', 'started') }}"
           turn_on:
             service: hassio.addon_start
             data:
               addon: xxxxxxxx_ringlivestream
           turn_off:
             service: hassio.addon_stop
             data:
               addon: xxxxxxxx_ringlivestream
   ```
To get the 8 chars code "xxxxxxxx_ringlivestream" open the addon page and check the URL bar.

[patreon-shield]: https://frenck.dev/wp-content/uploads/2019/12/patreon.png
[patreon]: https://www.patreon.com/dutchdatadude
