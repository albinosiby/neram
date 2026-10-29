# Neram mobile

Native Flutter UI for buses, railway schedules and Kochi/Bengaluru Metro. This is a Flutter implementation, not a WebView wrapper. The website continues to use the existing `dist/` folder and Render blueprint.

## Folder blueprint

- `lib/core/`: HTTP API, theme, persisted appearance/time preferences, formatters and shared UI.
- `lib/features/transit/`: common bus/train search, station picker, typed result models, route sheet and bounded bus issue reporting.
- `lib/features/metro/`: offline catalogs, ordered route algorithms, archived Kochi trips/fares, source geometry map, Bengaluru transfers and approximate service hours.
- `lib/features/settings/`: appearance, clock format and source information.
- `assets/`: existing Neram illustrations and compact Metro JSON catalogs. These do not include the full bus or railway databases.
- `android/`: Android app ID `app.neram.transit`, network permission, launcher icon and native Gradle setup.
- `test/`: route/time/data separation and mobile layout/interaction checks.
- `integration_test/`: native Android search-to-route and navigation flow using deterministic HTTP fixtures.

## Run locally

Use Flutter **3.47.8**, JDK 17 and an Android SDK. For the initial checkout, generate the standard platform runners (this preserves existing Dart and Android app sources):

```sh
cd mobile
flutter create --no-pub --platforms=android,ios,web --org app.neram --project-name neram_mobile .
flutter pub get
flutter analyze --no-fatal-infos
flutter test
flutter run
```

Connect an Android phone with USB debugging enabled, verify it with `flutter devices`, then `flutter run -d DEVICE_ID`. Use `flutter test integration_test/app_test.dart -d DEVICE_ID` for the deterministic native UI flow. Physical phone testing requires a connected device; browser viewport tests do not establish that an Android APK works.

## Build an APK

```sh
flutter build apk --debug
# build/app/outputs/flutter-apk/app-debug.apk
```

The GitHub **Flutter mobile** workflow builds the APK and uploads `neram-android-debug`. Download the artifact ZIP from the successful workflow run and extract the APK. It is a debug/test build, not a Play Store release. Configure your own private release signing key before publishing a release; never commit keystores or signing passwords.

CI also analyzes code, runs unit/widget tests, and runs an Android emulator integration flow after the APK job passes. The workflow uploads generated platform sources and the dependency lock separately. iOS source can be generated with the same command; compiling/signing an iOS app requires macOS/Xcode and Apple provisioning and is not covered by the Android workflow.

## Data and behavior

Bus and railway requests use separate publishable Supabase keys from `lib/core/api.dart`. Keys are public client identifiers, not service-role secrets. Database RLS/grants control access. Optional `--dart-define=BUS_SUPABASE_URL=...`, `BUS_SUPABASE_KEY`, `RAIL_SUPABASE_URL`, `RAIL_SUPABASE_KEY` override the defaults. No database writes occur except an explicit user-submitted bus correction.

- Bus prefix suggestions and ordered intermediate-stop matching use the original bus RPCs, capped at 200 results; operator and duration filters operate on that returned set.
- Train station suggestions, 30-result pages, ordered stop matching and full routes use the railway project. Leading-zero train numbers stay strings. Origin running weekdays are not interpreted as boarding-date confirmation.
- Kochi has 25 stations, 446 detailed archived trips and catalog fares; the calendar ended **31 December 2025**. Four incomplete source trips are omitted. Service times after 24:00 retain their next-day markers. Geometry uses the uploaded shapes, with no live train positions.
- Bengaluru has 83 unique stations, three lines and two interchanges. Routes minimize line changes, then station intervals. Fares and exact train departures/durations are unavailable in the supplied catalog and are not invented.
- The initial native interface is English. Appearance and 12/24-hour preferences are saved locally. Offline Metro is supported; bus/train searches require network access and show retry states.

## Test scope

Widget tests check a 390×844 phone layout, a 320-pixel narrow layout, bus/train routes, navigation, settings and both Metro cities. Repository tests inspect actual request URLs and parameters using a mock HTTP client. Native emulator integration also uses fixtures to avoid flaky network-based UI tests. The existing root `verify_api.py` and `scripts/verify_railway_api.py` separately exercise live public APIs without modifying source data.

See `QA.md` for the observed test/build results and any remaining device-testing limits.
