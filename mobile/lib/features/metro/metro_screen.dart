import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

import '../../core/format.dart';
import '../../core/settings.dart';
import '../../core/theme.dart';
import '../../core/widgets.dart';
import 'catalog.dart';
import 'route_map.dart';

class MetroScreen extends StatefulWidget {
  final AppSettings settings;
  final Future<MetroCatalog>? catalog;
  const MetroScreen({super.key, required this.settings, this.catalog});
  @override
  State<MetroScreen> createState() => _MetroScreenState();
}

class _MetroScreenState extends State<MetroScreen> {
  late Future<MetroCatalog> future;
  String city = 'kochi', service = 'WK', day = 'monday_to_saturday';
  String? from, to;
  TimeOfDay? after;
  int shown = 8;
  String stationQuery = '', lineFilter = 'purple';
  @override
  void initState() {
    super.initState();
    future = widget.catalog ?? MetroCatalog.load();
  }

  void changeCity(String value) {
    setState(() {
      city = value;
      from = null;
      to = null;
      after = null;
      shown = 8;
      stationQuery = '';
    });
  }

  Widget select(
    String label,
    String value,
    List<DropdownMenuItem<String>> items,
    ValueChanged<String> change, {
    Key? key,
  }) => InputDecorator(
    decoration: InputDecoration(labelText: label),
    child: DropdownButtonHideUnderline(
      child: DropdownButton<String>(
        key: key,
        value: value,
        isExpanded: true,
        isDense: true,
        items: items,
        onChanged: (v) {
          if (v != null) change(v);
        },
      ),
    ),
  );
  Future<void> station(MetroStation s) async {
    await showModalBottomSheet<void>(
      context: context,
      useSafeArea: true,
      isScrollControlled: true,
      builder: (context) => SheetFrame(
        title: s.name,
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(title: const Text('Station code'), trailing: Text(s.id)),
              ListTile(
                title: const Text('Main station in catalog'),
                trailing: Text(s.main ? 'Yes' : 'No'),
              ),
              ListTile(
                title: const Text('Coordinates'),
                subtitle: Text('${s.latitude}, ${s.longitude}'),
              ),
              FilledButton.icon(
                onPressed: () async {
                  final opened = await launchUrl(
                    Uri.parse(
                      'https://www.google.com/maps/search/?api=1&query=${s.latitude},${s.longitude}',
                    ),
                    mode: LaunchMode.externalApplication,
                  );
                  if (!opened && context.mounted)
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Could not open maps.')),
                    );
                },
                icon: const Icon(Icons.map_outlined),
                label: const Text('Open station on map'),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  void trip(MetroCatalog data, MetroTrip trip) {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      builder: (context) {
        bool full = false;
        return StatefulBuilder(
          builder: (context, update) {
            final calls = full ? trip.fullCalls : trip.calls;
            return FractionallySizedBox(
              heightFactor: .9,
              child: SheetFrame(
                title: 'Archived trip · ${trip.id}',
                child: ListView(
                  children: [
                    const Notice(
                      'This timetable calendar ended on 31 December 2025. It does not confirm a train running today.',
                      warning: true,
                    ),
                    Text(
                      '${clockSeconds(trip.departure, use24Hour: widget.settings.use24Hour)} → ${clockSeconds(trip.arrival, use24Hour: widget.settings.use24Hour)} · ${exactDuration(trip.seconds)}',
                    ),
                    const SizedBox(height: 18),
                    SegmentedButton<bool>(
                      segments: const [
                        ButtonSegment(
                          value: false,
                          label: Text('Selected segment'),
                        ),
                        ButtonSegment(value: true, label: Text('Full route')),
                      ],
                      selected: {full},
                      onSelectionChanged: (s) => update(() => full = s.first),
                    ),
                    const SizedBox(height: 18),
                    for (final call in calls)
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(
                          Icons.radio_button_checked,
                          color: teal,
                          size: 18,
                        ),
                        title: Text(data.station(number(call[0])!).name),
                        subtitle: Text(
                          'Arr ${clockSeconds(number(call[1])!, use24Hour: widget.settings.use24Hour)} · Dep ${clockSeconds(number(call[2])!, use24Hour: widget.settings.use24Hour)}',
                        ),
                        onTap: () => station(data.station(number(call[0])!)),
                      ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) => FutureBuilder<MetroCatalog>(
    future: future,
    builder: (context, snapshot) {
      if (snapshot.hasError)
        return ErrorPanel(
          'Could not load the Metro catalog.',
          () => setState(() => future = MetroCatalog.load()),
        );
      if (!snapshot.hasData)
        return const Center(child: CircularProgressIndicator());
      final data = snapshot.data!;
      final kochi = city == 'kochi';
      final stations = kochi ? data.kochi : data.bangalore;
      final a = from ?? stations.first.id, b = to ?? stations.last.id;
      final trips = kochi
          ? data.trips(
              a,
              b,
              service,
              after: after == null
                  ? null
                  : (after!.hour * 60 + after!.minute) * 60,
            )
          : <MetroTrip>[];
      final route = kochi ? null : data.route(a, b);
      final options = stations
          .map(
            (s) => DropdownMenuItem(
              value: s.id,
              child: Text(s.name, maxLines: 1, overflow: TextOverflow.ellipsis),
            ),
          )
          .toList();
      return ListView(
        padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
        children: [
          select(
            'Metro city',
            city,
            const [
              DropdownMenuItem(value: 'kochi', child: Text('Kochi Metro')),
              DropdownMenuItem(
                value: 'bengaluru',
                child: Text('Bengaluru · Namma Metro'),
              ),
            ],
            changeCity,
            key: const Key('metro-city'),
          ),
          const SizedBox(height: 22),
          SectionTitle(
            kochi
                ? 'A simpler way across Kochi.'
                : 'Across Bengaluru, connected.',
            kochi
                ? '25 stations · Aluva ↔ Tripunithura'
                : '83 stations · Purple, Green & Yellow lines',
          ),
          Notice(
            kochi
                ? 'Archived timetable — not current service information. The supplied calendar ended on 31 December 2025. Timings and fares may have changed.'
                : 'Uploaded ixigo catalog · 27 October 2026. Service hours are approximate line summaries, not station departures. Confirm with BMRCL.',
            warning: kochi,
          ),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  select(
                    'From',
                    a,
                    options,
                    (v) => setState(() {
                      from = v;
                      shown = 8;
                    }),
                    key: const Key('metro-from'),
                  ),
                  Align(
                    alignment: Alignment.centerRight,
                    child: IconButton(
                      tooltip: 'Swap Metro stations',
                      onPressed: () => setState(() {
                        from = b;
                        to = a;
                        shown = 8;
                      }),
                      icon: const Icon(Icons.swap_vert, color: teal),
                    ),
                  ),
                  select(
                    'To',
                    b,
                    options,
                    (v) => setState(() {
                      to = v;
                      shown = 8;
                    }),
                    key: const Key('metro-to'),
                  ),
                ],
              ),
            ),
          ),
          if (a == b)
            const Padding(
              padding: EdgeInsets.all(20),
              child: Text('Choose two different stations.'),
            ),
          if (kochi && a != b) ...[
            const SizedBox(height: 20),
            select(
              'Archived service pattern',
              service,
              const [
                DropdownMenuItem(value: 'WK', child: Text('Monday–Saturday')),
                DropdownMenuItem(value: 'WE', child: Text('Sunday')),
              ],
              (v) => setState(() {
                service = v;
                shown = 8;
              }),
            ),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              children: [
                OutlinedButton.icon(
                  onPressed: () async {
                    final value = await showTimePicker(
                      context: context,
                      initialTime: after ?? const TimeOfDay(hour: 6, minute: 0),
                    );
                    if (mounted && value != null)
                      setState(() {
                        after = value;
                        shown = 8;
                      });
                  },
                  icon: const Icon(Icons.schedule),
                  label: Text(
                    after == null
                        ? 'Any time'
                        : 'After ${after!.format(context)}',
                  ),
                ),
                if (after != null)
                  TextButton(
                    onPressed: () => setState(() => after = null),
                    child: const Text('Clear'),
                  ),
              ],
            ),
            const SizedBox(height: 14),
            Text(
              'Catalog fare: ${data.fare(a, b) == null ? 'Unavailable' : '₹${data.fare(a, b)}'}',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const Text(
              'Published fare only. Confirm before travel.',
              style: TextStyle(fontSize: 12),
            ),
            const SizedBox(height: 20),
            Text(
              '${trips.length} archived departures',
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 14),
            if (trips.isEmpty)
              const Text('No matching departures in the supplied archive.'),
            for (final item in trips.take(shown))
              Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Card(
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 9,
                    ),
                    title: Text(
                      '${clockSeconds(item.departure, use24Hour: widget.settings.use24Hour)} → ${clockSeconds(item.arrival, use24Hour: widget.settings.use24Hour)}',
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                    subtitle: Text(
                      '${exactDuration(item.seconds)} · ${item.calls.length} stations\nArchived trip ${item.id}',
                    ),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => trip(data, item),
                  ),
                ),
              ),
            if (shown < trips.length)
              OutlinedButton(
                onPressed: () => setState(() => shown += 20),
                child: const Text('Show more departures'),
              ),
            const SizedBox(height: 14),
            ExpansionTile(
              title: const Text('View catalog route map'),
              children: [
                CatalogMap(catalog: data, from: a, to: b),
                const Padding(
                  padding: EdgeInsets.all(14),
                  child: Text(
                    'Source geometry. No live train positions.',
                    style: TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
          ],
          if (!kochi && route != null) ...[
            const SizedBox(height: 22),
            Text(
              '${route.hops + 1} stations · ${route.transfers} line changes',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 14),
            for (final leg in route.legs) ...[
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Chip(
                        label: Text(
                          '${leg.line[0].toUpperCase()}${leg.line.substring(1)} Line',
                        ),
                        side: BorderSide(
                          color: leg.line == 'purple'
                              ? Colors.purple
                              : leg.line == 'green'
                              ? Colors.green
                              : amber,
                        ),
                      ),
                      if (leg != route.legs.first)
                        Text(
                          'Change at ${leg.stations.first}',
                          style: const TextStyle(
                            color: teal,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      const SizedBox(height: 8),
                      Text('${leg.stations.first} → ${leg.stations.last}'),
                      const SizedBox(height: 8),
                      Text(
                        'Towards ${(data.lines.firstWhere((l) => l['line_id'] == leg.line)['stations_in_order'] as List).indexOf(leg.stations.first) < (data.lines.firstWhere((l) => l['line_id'] == leg.line)['stations_in_order'] as List).indexOf(leg.stations.last) ? (data.lines.firstWhere((l) => l['line_id'] == leg.line)['stations_in_order'] as List).last : (data.lines.firstWhere((l) => l['line_id'] == leg.line)['stations_in_order'] as List).first}',
                        style: const TextStyle(fontSize: 12),
                      ),
                      ExpansionTile(
                        tilePadding: EdgeInsets.zero,
                        title: Text('Show all ${leg.stations.length} stations'),
                        children: [
                          for (final s in leg.stations)
                            ListTile(
                              dense: true,
                              leading: const Icon(
                                Icons.circle_outlined,
                                size: 13,
                              ),
                              title: Text(s),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 12),
            ],
            const Notice(
              'Fares, exact departure times, journey durations and geographic coordinates were not supplied for Bengaluru.',
            ),
            select('Service day', day, const [
              DropdownMenuItem(
                value: 'monday_to_saturday',
                child: Text('Monday–Saturday'),
              ),
              DropdownMenuItem(value: 'sunday', child: Text('Sunday')),
            ], (v) => setState(() => day = v)),
            const SizedBox(height: 14),
            Text(
              'Approximate service hours',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            for (final line in data.lines)
              ListTile(
                contentPadding: EdgeInsets.zero,
                title: Text('${line['line_name']}'),
                subtitle: Text(
                  '${line['first_train'][day]} – ${line['last_train'] is String ? line['last_train'] : line['last_train'][day]} · ${line['distance_km']} km (catalog)',
                ),
              ),
            const Text(
              'Purple/Green peak frequency is listed as approximately 8 minutes during 07:00–10:00 and 17:00–21:00. This is not a station timetable.',
              style: TextStyle(fontSize: 12, height: 1.7),
            ),
          ],
          const SizedBox(height: 18),
          ExpansionTile(
            title: Text('Explore ${stations.length} stations'),
            children: [
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: TextField(
                  decoration: const InputDecoration(
                    labelText: 'Search stations',
                    prefixIcon: Icon(Icons.search),
                  ),
                  onChanged: (v) => setState(() => stationQuery = v),
                ),
              ),
              for (final s in stations.where(
                (s) => '${s.name} ${s.id}'.toLowerCase().contains(
                  stationQuery.toLowerCase(),
                ),
              ))
                ListTile(
                  title: Text(s.name),
                  subtitle: kochi
                      ? Text('${s.id}${s.main ? ' · Main station' : ''}')
                      : Text(
                          data.lines
                              .where(
                                (l) => (l['stations_in_order'] as List)
                                    .contains(s.id),
                              )
                              .map((l) => l['line_name'])
                              .join(' · '),
                        ),
                  trailing: kochi ? const Icon(Icons.chevron_right) : null,
                  onTap: kochi ? () => station(s) : null,
                ),
            ],
          ),
          const SizedBox(height: 18),
          Text(
            kochi
                ? 'Calendar: 12 August 2024–31 December 2025. Four source trips lacked detailed calls and are omitted.'
                : 'Source: ixigo route map catalog. Third-party information, not an official BMRCL timetable.',
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      );
    },
  );
}
