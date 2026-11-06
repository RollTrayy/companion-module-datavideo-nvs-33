# Datavideo NVS-33

This module controls a Datavideo NVS-33 H.264 streaming encoder and recorder over the
JSON/HTTP control interface that the device's own web UI uses.

## Configuration

| Field          | Description                                                                                                                                                                               |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Device address | IP address or hostname of the NVS-33. The factory default is `192.168.1.60`.                                                                                                              |
| HTTP port      | Port of the web interface, normally `80`.                                                                                                                                                 |
| Username       | Web interface user. Factory default is `admin`.                                                                                                                                           |
| Password       | Web interface password. Factory default is `0000`; leave the field empty to use that default.                                                                                             |
| Device channel | The HTTP endpoint used for commands: `0` talks to `/_dev0`, `1` to `/_dev1`, and so on. Keep this at `0` for an NVS-33.                                                                   |
| Poll interval  | How often the module reads the device state, in milliseconds. `0` disables periodic polling; the state is then only refreshed by the button actions and by **Device: Refresh state now**. |

The password is stored as a Companion secret, so it is not written into exported configurations.

The module logs in automatically. If the device drops the session it logs in again on the next request.

## Streaming

- **Streaming: Start** – starts the main or sub stream with the selected protocol
  (RTSP, RTMP, TS, HLS, SRT, YouTube, Facebook).
- **Streaming: Stop** – stops the selected stream.
- **Streaming: Toggle** – reads the current state and starts or stops accordingly.
- **Streaming: Link YouTube / Facebook account** – starts a linking session on the device
  (multi-channel models).

- **SRT: Set listener port** – sets the SRT listener port (models with SRT support).
- **Streaming: Unlink YouTube / Facebook** – logs the device out of a linked platform.

The protocol to start with should match the protocol configured on the device: a device
configured for RTMP is started as RTMP, not as RTSP.

## Encoder

- **Set video bitrate** (44–65536 kbps)
- **Set resolution** (128–1920 × 64–1080)
- **Set frame rate** (1–60 fps)
- **Set GOP**
- **Set H.264 profile** (Baseline / Main / High)
- **Set audio bitrate** (32–384 kbps)

The device requires the whole encoder property block on every write, so the module reads
the current block first and only replaces the value you changed. Nothing else is reset.

## Streaming server properties

- **RTSP: Set server properties** – RTSP port, RTSP over HTTP port, account, password,
  stream name and multicast.
- **RTMP: Set publish target** – server URL, stream name/key and optional credentials.
- **TS: Set output address** – for example `udp://239.0.0.1:1234`.
- **HLS: Set video only**, **HLS: Enable or disable preview**.

## Recording (SD card)

- **Recording: Start / Stop / Toggle** for the main or sub recording.
- **Recording: Set file properties** – file name, container (AVI/MP4/TS/MOV) and segment duration.

## Inputs and audio

- **Input: Select video source** – Composite, S-Video, HDMI, DVI, YPbPr, VGA, SDI, Photo,
  IP stream or file playback. On an NVS-33 only SDI and HDMI are physically available.
- **Input: Use IP stream source / Show picture / Play file** – selects those inputs and sets
  their address or file name (multi-channel models).
- **Audio: Select input** – Embedded, RCA / line-in, XLR or microphone, depending on the model.
- **Audio: Set line-in volume** and **Audio: Adjust line-in volume**.
- **Video: Set picture tuning** – brightness, contrast, hue, saturation, sharpness.
- **Video: Set mirroring** – horizontal and vertical.

Volume control on the analogue input only works while the device audio standard is set to
Manual; SMPTE and EBU use fixed levels.

## Production functions (multi-channel models)

The NVS-33 is a single-channel encoder, but the module also implements the production
functions of the Datavideo HTTP API. These require a multi-channel model and are grouped
in the **Production** preset section:

- **PGM: Set layout** – PBP, POP, PIP or Full, with channel selection, background colour and scale.
- **PGM: Set channel position** – position, size and layer of one channel.
- **Monitor: Select output**, **Set output frame rate**, **Set output volume**.
- **OSD: Set text overlay**, **OSD: Show or hide layer**.
- **Mixer: Set channel volume**.
- **Snapshot: Capture**.

If the device does not support one of these functions it answers with an error. The module
logs it in the module log and leaves the connection running.

## Device

- **Device: Set device name**
- **Device: Reboot**
- **Device: Refresh state now**

Settings that can lock you out of the device or destroy data—network reconfiguration,
firmware update, account changes, storage formatting and factory reset—are deliberately not
exposed by this module.

## Variables

| Variable                                                                                           | Description                 |
| -------------------------------------------------------------------------------------------------- | --------------------------- |
| `streaming_main_status`, `streaming_sub_status`                                                    | `On` or `Off`               |
| `streaming_main_type`, `streaming_sub_type`                                                        | Protocol currently in use   |
| `recording_main_status`, `recording_sub_status`                                                    | `On` or `Off`               |
| `recording_main_file`, `recording_sub_file`                                                        | Current recording file name |
| `video_source`, `audio_source`                                                                     | Selected inputs             |
| `input_signal`                                                                                     | `Yes` or `No`               |
| `input_resolution`, `input_framerate`, `input_scan`, `input_audio`                                 | Detected input format       |
| `pgm_type`, `pgm_scale`                                                                            | Program layout              |
| `multiview_type`                                                                                   | Monitor output              |
| `hls_preview`                                                                                      | `On` or `Off`               |
| `monitor_volume_multiview`, `monitor_volume_pgm`                                                   | Monitor volumes (0–255)     |
| `encoder_main_bitrate`, `encoder_main_resolution`, `encoder_main_framerate`, `encoder_sub_bitrate` | Encoder settings            |     | `storage_capacity`, `storage_remaining` | Storage card capacity and free space, as reported by the device |
| `device_name`, `firmware_version`, `software_version`                                              | Device identification       |

## Feedbacks

- Streaming is active (per stream and protocol)
- Any streaming is active
- Recording is active (per recording) / any recording is active
- Video input is selected
- Audio input is selected
- Input signal is detected
- PGM layout is active
- Monitor output is active
- HLS preview is enabled

## Troubleshooting

- **Connection failure / login rejected** – check the address, port and credentials. The
  NVS-33 uses `admin` / `0000` after a factory reset.
- **Commands succeed but variables stay empty** – increase the poll interval or press
  **Device: Refresh state now**. Polling is disabled when the interval is `0`.
- **A production function answers with an error** – the device does not implement it; this is
  expected on a single-channel NVS-33.
