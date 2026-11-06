# Changelog

All notable changes to this project are recorded here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

The full text of each release is kept in [`.github/release-notes/`](./.github/release-notes),
one file per tag, and is what the GitHub release is built from.

## [1.0.0] — 2026-11-06

First public release: **43 actions, 10 feedbacks, 30 variables, 24 presets.**

### Added

- **Streaming** — start, stop and toggle for RTSP, RTMP, TS, HLS, SRT, YouTube and Facebook, plus YouTube and Facebook account linking.
- **Encoder** — video bitrate, resolution, frame rate, GOP, H.264 profile and audio bitrate. Each write is merged into the device block, so unrelated settings survive.
- **Stream targets** — RTSP server properties, RTMP publish target, TS output address, HLS options and SRT listener port.
- **Recording** — start, stop, toggle and file properties (name, container, segment length) for the SD card.
- **Inputs and audio** — video source selection, IP stream, picture and file playback, audio source, line-in volume, picture tuning and mirroring.
- **Production functions** of the Datavideo API (PGM layout and position, monitor output, OSD, snapshot, mixer) for multi-channel models.
- **Device** — set name, reboot and on-demand state refresh.
- Automatic digest login with transparent re-login, polling that can be switched off, and the password stored as a Companion secret.

Full release notes: [v1.0.0](./.github/release-notes/v1.0.0.md)
