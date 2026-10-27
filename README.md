# Neram Transit

A responsive bus timetable search app based on the supplied Neram mobile UI. Built with semantic HTML, CSS and browser JavaScript, with no build dependencies.

## Features

- Departure and destination stop autocomplete, keyboard navigation, swap control
- Direct buses between intermediate stops in the correct travel order
- Departure-time filters, KSRTC/private filters, time/duration sorting
- Complete stop itinerary, overnight travel offsets, 12/24-hour preference
- Loading, empty and network error states; illustrated Kerala background

## Run

Serve `dist/` using any static web server. For example, `python3 -m http.server 8080 --directory dist`.

## Database

Connected project: `usarcxcmftifeapngtcs` (neramapp).
The browser uses the Supabase publishable key in `dist/config.js`. It is intended for browser use and is not a database password or service-role secret.

`supabase/001_transit_search.sql` records the applied migration: public timetable projections with read-only RLS policies and SECURITY INVOKER search functions. All private source payloads, metadata and Firebase backups remain in `neram_data` without anonymous access. No browser writes are granted. Timetable tables contain a projection of the import at migration time; future imports require updating these projections.

Operator classification is derived from the service name (KSRTC matching names versus other/private services). The dataset contains historical estimates and possible duplicates; the app does not claim live availability, seat booking, service-day validation or GPS tracking. Contaminated stop names containing timing text/newlines are omitted from autocomplete, with source records preserved. Search caps at 200 matches and reports truncation.

## Hosting

Deploy `dist/` to any static host. `.openai/hosting.json` configures the associated Sites deployment. Access for the initial Sites deployment is owner-private.
