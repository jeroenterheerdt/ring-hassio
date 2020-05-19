# ring-hassio
[![Support the author on Patreon][patreon-shield]][patreon]
[![Buy me a coffee][buymeacoffee-shield]][buymeacoffee]

[buymeacoffee]: https://www.buymeacoffee.com/dutchdatadude
[buymeacoffee-shield]: https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png
## About
A Home Assistant add-on to enable live streams of Ring Cameras.
This add-on wraps around [Dgreif's excellent work](https://github.com/dgreif/ring) and exposes a livestream.
It can be used both in HASSIO / Home Assistant and Home Assistant Core using Docker.

## Note
This addon does not support 2FA

## Installation in HASSIO / Home Assistant
1. Add this GitHub repository to your add-on store. 
2. Configure your Ring username, password and port (see configuration below).
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
7. Add a card `Picture Glance` card to your UI, set the 'Camera Entity` to the camera you have just created. If it was created for your automatically, go in and see if the settings are correct!
8. Done! Enjoy your shiny new livestream!

### Configuration
Example configuration:
```json
{
    "ring_username": your_email_address,
    "ring_password": your_password
}
```

## Installation in Home Assistant Core / Docker
Thanks to @robert-alfaro for figuring this out!
1. Ensure device that you will be using has UPnP/NAT-PMP enabled. This is most probably a setting in your router. To be more strict, if you can, use explicit port forward rules for the ports documented here: [Ring Ports](https://support.ring.com/hc/en-us/articles/205385394-The-Protocols-and-Ports-Used-by-Ring-Devices).
2. Clone this repository.
3. Create environment variables or create options.json file:
```json
{
    "ring_username": your_email_address,
    "ring_password": your_password,
    "port": 3000
}
```
4. Build docker image
> NOTE: substitute below 'armv7' with your machine architecture
```bash
cd <path to this repo>
docker build --build-arg BUILD_FROM='homeassistant/armv7-base:3.11' -t ring-hassio .
```

5. run docker image
```bash
docker run --init -d --name="ring-livestream" -v <path to options.json>:/data/options.json -p 3000:3000 ring-hassio
```

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
[patreon-shield]: https://frenck.dev/wp-content/uploads/2019/12/patreon.png
[patreon]: https://www.patreon.com/dutchdatadude
