# ring-hassio
[![Support the author on Patreon][patreon-shield]][patreon]
## About
A Home Assistant add-on to enable live streams of Ring Cameras.
This add-on wraps around [Dgreif's excellent work](https://github.com/dgreif/ring) and exposes a livestream.

## Installation
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
7. Add a card `Picture Glance` card to your UI, set the 'Camera Entity` to the camera you have just created.
8. Done! Enjoy your shiny new livestream!

## Configuration
Example configuration:
```json
{
    "ring_username": your_email_address,
    "ring_password": your_password
}
```

[patreon-shield]: https://frenck.dev/wp-content/uploads/2019/12/patreon.png
[patreon]: https://www.patreon.com/dutchdatadude