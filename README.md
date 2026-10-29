# Neram Transit

A responsive bus timetable search app based on the supplied Neram mobile UI. Built with semantic HTML, CSS and browser JavaScript, with no build dependencies.

## Features

- Departure and destination stop autocomplete, keyboard navigation, swap control
- Direct buses between intermediate stops in the correct travel order
- Departure-time filters, KSRTC/private filters, time/duration sorting
- Journey summary bottom sheet, separate Full Route view, overnight travel offsets and 12/24-hour preference
- English/Malayalam interface, saved automatic/light/dark appearance preferences and About Neram
- Timetable issue report form with private admin review in Supabase
- Loading, empty and network error states; illustrated Kerala background

## Run

Run `node build.mjs` after changing the source files, then serve `dist/` using any static web server. The build combines all styles and scripts into files named with content hashes, so cached files from an older release cannot partially style the new screens. For example, `python3 -m http.server 8080 --directory dist`.

## Database

Connected project: `usarcxcmftifeapngtcs` (neramapp).
The browser uses the Supabase publishable key in `dist/config.js`. It is intended for browser use and is not a database password or service-role secret.

`supabase/001_transit_search.sql` records the applied migration: public timetable projections with read-only RLS policies and SECURITY INVOKER search functions. All private source payloads, metadata and Firebase backups remain in `neram_data` without anonymous access. Timetable data remains read-only. `supabase/002_issue_reports.sql` allows visitors to submit bounded corrections to `public.neram_issue_reports`. Visitors cannot read, update or delete reports. Admins review them in the Supabase Table Editor; submission does not automatically modify a timetable. Stop names remain in their original dataset spelling in both interface languages. Timetable tables contain a projection of the import at migration time; future imports require updating these projections.

Operator classification is derived from the service name (KSRTC matching names versus other/private services). The dataset contains historical estimates and possible duplicates; the app does not claim live availability, seat booking, service-day validation or GPS tracking. Contaminated stop names containing timing text/newlines are omitted from autocomplete, with source records preserved. Search caps at 200 matches and reports truncation.

## Hosting

Deploy `dist/` to any static host. Render runs `node build.mjs` from `render.yaml` before publishing. Generated bundles are also committed so the existing static publish command can serve them immediately. `.openai/hosting.json` configures the associated Sites deployment. Access for the initial Sites deployment is owner-private.

## Kochi Metro station guide

The Metro tab uses the uploaded `stations.csv`: 25 stations in sequence from Aluva to Tripunithura, station codes, coordinates and 13 main-station flags. `dist/metro-data.js` preserves every supplied field. Route selection works in either direction, counts intermediate stations, and provides an expandable station timeline, station search, main-station filter and coordinate-based map links. The initial CSV provides no schedules or fares; the later archived catalog extends it as documented below. Metro station data is served with the frontend and does not query Supabase. Use `#metro` to open this view directly.

## Archived Metro timetable catalog

The additional `kochi_metro_catalog.zip` supplies 446 detailed trips (10,652 calls), 450 trip metadata records, 625 fare-pair rules across six fare bands, two geographic route shapes and service calendars. Four metadata-only trips are omitted from departure results: WK_4, WK_12, WK_18 and WK_256.

The published calendar is valid only from 2024-08-12 through 2025-12-31. Every timetable, trip detail and fare is labelled as archived; the app does not claim current availability, current pricing or live positions. Service-pattern selection is historical Monday–Saturday versus Sunday, not a prediction for today. Querying uses actual ordered calls, so short-turn trips are included only when they serve both selected stops in order. Board at the source departure time; alight at the destination arrival time. Times after 24:00 retain the following-day offset. Cards display hours/minutes; trip details preserve seconds.

`dist/data/metro-catalog.5408afb0a9afd9cd.json` is an exact compact representation of the source calls, calendar, fare rules and shape points. Station indices reference `stationCodes`; times are seconds from the service-day start. Trip arrays contain [trip_id, service_id, direction_id, shape_id, calls]; calls contain [station_index, arrival_seconds, departure_seconds, source_distance]. Shape points preserve [latitude, longitude, source_distance]. Distances are preserved without assuming their units. The original upload remains the source of truth.

The 300 KB catalog is fetched once, only when Metro opens, through the versioned manifest. Timetable filtering then runs locally; bus-only visits do not download it. Source Malayalam station names and wheelchair flags supplement the original station directory. The map draws uploaded geometry and station coordinates, highlights the selected segment and has no external tile dependency or live train markers.

Run `node scripts/verify-metro-catalog.mjs` for fare, trip-order, service-pattern, short-turn, overnight and calendar validity checks.

## Bengaluru / Namma Metro

Open `/#metro-bengaluru` or choose Bengaluru in the Metro city selector. The uploaded `bengaluru_metro_ixigo_catalog.json` (retrieved 27 October 2026) supplies Purple, Green and Yellow line station orders: 85 line entries, 83 unique stations and two interchanges. Data is retained in `dist/bengaluru-data.js`. A line-aware route graph minimizes transfers then adjacent station intervals, with directions, ordered stations, station search, line distances and approximate Monday–Saturday/Sunday operating hours. The shared RV Road station uses its identical station-list name; the source interchange description also has the alias “(RV Road)”.

This third-party catalog has no fare matrix, geographic coordinates, train-level departures or journey durations. UI labels service summaries as approximate and supplies no invented fares, ETAs or map coordinates. Bengaluru content is English; the existing bus/Kochi language preferences continue to work. No Supabase data is changed. Run `node scripts/verify-bengaluru.mjs` to verify route and interchange behavior.

## Railway integration

Open `/#trains` for station suggestions, ordered-stop route search, optional departure-time filtering, 30-result pages, and selected-segment/full-route sheets. Train numbers stay text so leading zeros survive. Times and train journey-day labels come from the eRail lookup snapshot collected on 27 October 2026. Weekdays describe departure at the train origin; no date-based running confirmation, current status, booking, seat availability, or fare is inferred. Conflicting source HTML schedules are not merged into lookup times. Apparent duplicate train numbers remain separate train IDs, matching the preserved catalog.

Railway data resides in the separate `neram-railway` Supabase project (`qfxwshqfhdghqtoijqzy`), while bus searches retain the original Neram project. Only a publishable key is in `dist/config.js`. The one-time `supabase/railway_search.sql` setup enables narrow column SELECT grants and read policies for the timetable fields. Raw JSON/import/report columns remain inaccessible; visitors have no insert/update/delete grants. All three RPCs use SECURITY INVOKER and an empty search_path. Existing indexes support station and ordered-train lookups without duplicating the railway dataset.

RPCs: `neram_rail_stations(p_query)` (max 20), `neram_rail_search(p_from,p_to,p_after,p_offset)` (max 30, offset bounded to 5,000), and `neram_rail_journey(p_id)` (max 500). Route search matches intermediate stations in the correct stop order. Duration uses supplied journey-day and clock-time differences; negative or implausibly long results display as unavailable.

Checks: `python3 scripts/verify_railway_api.py` runs read-only public API checks for station matching, escaped wildcard search, paging, ordered stops, time filtering, full routes, and denial of raw data reads. Mobile browser checks additionally cover keyboard suggestion selection, swapping transport tabs, selected/full route views and narrow layouts. Existing bus and Metro behavior is retained. The new train interface is English.

## Flutter mobile app

The native Flutter client lives in [`mobile/`](mobile/README.md), organized by shared core, transit, Metro and settings features. The root web app and Render deployment remain separate. See the **Flutter mobile** GitHub Actions workflow for analyzed/tested APK artifacts and `mobile/QA.md` for observed test coverage and device limitations.
