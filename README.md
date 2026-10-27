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

The Metro tab uses the uploaded `stations.csv`: 25 stations in sequence from Aluva to Tripunithura, station codes, coordinates and 13 main-station flags. `dist/metro-data.js` preserves every supplied field. Route selection works in either direction, counts intermediate stations, and provides an expandable station timeline, station search, main-station filter and coordinate-based map links. This file provides no train schedules or fares; the Metro interface does not fabricate either. Metro station data is served with the frontend and does not query Supabase. Use `#metro` to open this view directly.
