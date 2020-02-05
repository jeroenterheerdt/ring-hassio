# ring-hassio
[![Support the author on Patreon][patreon-shield]][patreon]
## About
A Hass.IO add-on for Ring Doorbells, Cameras, Alarm System, and Smart Lighting.
This add-on wraps around [Dgreif's excellent work](https://github.com/dgreif/ring) and exposes a livestream.

## Installation
1. Add this repository to your Hass.io instance
2. Install the "Ring Hassio" add-on.
3. Configure your Ring username, password and port (see configuration below)
4. Start the "Ring Hassio" add-on
5. Open port 3000 on your router (or whatever port you configured in the config)
6. Open the stream at http://hassio.local:YOUR_PORT/public/stream.m3u8. We recommend using VLC or equivalent.


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