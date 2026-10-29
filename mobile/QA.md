# Mobile QA — 29 October 2026

Verified code commit: `7b1c959c71bceb47a6e0d33dbbf7eac70630cdd8`.
GitHub Actions: https://github.com/albinosiby/neram/actions/runs/40823595674

## Passed

- Flutter 3.47.8 package resolution and static analysis.
- All **11 unit/widget tests**: exact Kochi sample/fare, archive/overnight handling, Bengaluru transfer routing in both directions, time formatting, separate API targets and pagination parameters, leading-zero train numbers, error handling, report payload fields, phone navigation/search-to-route/settings, narrow 320-pixel layout with larger text, station selection and recovery after a failed station search.
- **Android debug APK build**, with the existing live bus/railway publishable endpoints and bundled offline Metro catalogs.
- **Android API 35 emulator integration flow**, running native Flutter widgets: bus search→route, train search→selected/full route, Metro navigation and settings. Deterministic HTTP fixtures keep this UI flow independent of network outages.
- Live public API smoke checks separately passed: buses (188 Aluva→Ernakulam matches, time filter, ordered route, overnight handling) and railway (45 Kannur→Thalassery matches, pagination, time filter, full route and denial of raw data reads). No source data was modified.

## Deliverable

`Neram-Android-Test.apk` (debug build, all supported Android ABIs), 157,987,342 bytes.
SHA-256: `425916ee183128cd9418595f83f231b4ed7a585270f02e7434544dd63db8a003`

GitHub artifact: https://github.com/albinosiby/neram/actions/runs/40823595674/artifacts/12876011031

## Corrections during validation

The first interaction test tapped before its scroll had settled. The harness now pumps layout after scrolling; all assertions pass. The first native build stopped because Gradle 8.13 was below Flutter's minimum of 8.14. The wrapper was upgraded to 8.14.3 without bypassing validation. A genuine station-picker empty-query/error state was corrected and covered by a new test. Existing web API verification was fixed to parse the bus config independently of the additional rail config.

## Limits

No physical phone is connected to this session. The emulator was not the user's Motorola phone. APK installation, hardware/system Back, external Maps launch, device-specific rendering/font settings and behavior on the user's actual Android version still need a physical-device check. The native emulator HTTP flow uses fixtures; real APIs were checked separately, not by booking tickets or sending test reports.

This is a debug/test APK, not a signed Play Store release. The native interface is English. Appearance and clock-format settings persist locally. iOS platform sources are included, but no iOS binary was compiled or signed here. Android build tools are pinned to supported versions and currently produce future-deprecation warnings; builds pass.

Local Flutter dependency setup was blocked by automatic approval review when a dependency attempted cloud-metadata access. That access was not authorized or retried. Compilation and Android execution were completed in isolated GitHub-hosted runners without this session's credentials.
