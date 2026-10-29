# Mobile QA — 29 October 2026

Observed in GitHub Actions run 40823049878 for commit 65d11d11aeac11b3524cc1e1a12c4856b81f088d:

- Flutter 3.47.8 dependency resolution and static analysis passed.
- All 9 unit/widget tests passed: time/day offsets, exact Kochi archive sample and fares, Bengaluru transfers, separate API targets and pagination parameters, response error handling, leading-zero train numbers, report payload fields, phone navigation/search-to-route and a 320-pixel layout with larger text.
- Both live public API smoke scripts passed separately: buses (188 Aluva→Ernakulam matches, ordered route and overnight handling) and railway (45 Kannur→Thalassery matches, paging, time filter and raw-data denial).
- The first APK attempt stopped at Gradle validation because 8.13 was below the Flutter minimum of 8.14. The wrapper was updated to 8.14.3 without bypassing validation. APK compilation and API 35 emulator integration are being rerun.

The first UI test attempt tapped before its scroll had settled. The harness was corrected to pump layout after scrolling; the rerun passed. No assertion was removed to hide that failure.

Local Flutter dependency setup was rejected by automatic approval review when a dependency attempted cloud-metadata access. No metadata access was authorized or retried. Native compilation and execution use isolated GitHub-hosted CI runners without this session's credentials.

No physical Android phone is connected to this session. Hardware keyboard, system back, Android font scaling, external Maps launch, APK installation and real-device rendering must be verified on a phone before treating this as a production release. Emulator and widget checks are distinct from physical-device testing.

The APK is a debug/test build. Store distribution needs release signing and a separate production review. iOS platform source is included; no iOS binary has been compiled or signed here.
