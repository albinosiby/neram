import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import '../../core/format.dart';
import '../../core/settings.dart';
import '../../core/theme.dart';
import '../../core/widgets.dart';
import 'journey_sheet.dart';
import 'models.dart';
import 'repository.dart';
import 'station_picker.dart';

class TransitSearchScreen extends StatefulWidget {
  final TransitKind kind;
  final TransitRepository repository;
  final AppSettings settings;
  const TransitSearchScreen({
    super.key,
    required this.kind,
    required this.repository,
    required this.settings,
  });
  @override
  State<TransitSearchScreen> createState() => _TransitSearchScreenState();
}

class _TransitSearchScreenState extends State<TransitSearchScreen> {
  StopChoice? from, to;
  TimeOfDay? after;
  List<SearchHit> rows = [];
  bool loading = false, searched = false, shortest = false;
  String? error;
  int total = 0, version = 0;
  String operator = 'All';
  int shown = 30;
  bool get rail => widget.kind == TransitKind.train;
  void invalidate() {
    version++;
    setState(() {
      rows = [];
      total = 0;
      loading = false;
      searched = false;
      error = null;
      shown = 30;
    });
  }

  Future<void> pick(bool origin) async {
    final value = await pickStation(
      context,
      widget.repository,
      widget.kind,
      origin ? 'Choose departure' : 'Choose destination',
    );
    if (!mounted || value == null) return;
    setState(() {
      if (origin) {
        from = value;
      } else {
        to = value;
      }
    });
    invalidate();
  }

  Future<void> search({bool more = false}) async {
    if (loading) return;
    if (from == null || to == null || from!.id == to!.id) {
      setState(() => error = 'Choose two different stations.');
      return;
    }
    final v = ++version;
    setState(() {
      loading = true;
      error = null;
      searched = true;
      if (!more) {
        rows = [];
        shown = 30;
        total = 0;
      }
    });
    try {
      final found = await widget.repository.search(
        widget.kind,
        from!.id,
        to!.id,
        after: after == null ? null : after!.hour * 60 + after!.minute,
        offset: more ? rows.length : 0,
      );
      if (!mounted || v != version) return;
      setState(() {
        rows = more ? [...rows, ...found] : found;
        total = found.isEmpty ? (more ? total : 0) : found.first.total;
      });
    } catch (e) {
      if (mounted && v == version) setState(() => error = '$e');
    } finally {
      if (mounted && v == version) setState(() => loading = false);
    }
  }

  Future<void> chooseTime() async {
    final value = await showTimePicker(
      context: context,
      initialTime: after ?? const TimeOfDay(hour: 6, minute: 0),
    );
    if (mounted && value != null) {
      after = value;
      invalidate();
    }
  }

  List<SearchHit> get filtered {
    final list = rows
        .where((r) => operator == 'All' || r.raw['operator'] == operator)
        .toList();
    if (shortest)
      list.sort((a, b) => (a.minutes ?? 999999).compareTo(b.minutes ?? 999999));
    return list;
  }

  Widget field(String label, StopChoice? value, VoidCallback tap, Key key) =>
      Expanded(
        child: InkWell(
          key: key,
          borderRadius: BorderRadius.circular(17),
          onTap: tap,
          child: InputDecorator(
            decoration: InputDecoration(labelText: label),
            child: Row(
              children: [
                Expanded(
                  child: Text(
                    value?.name ??
                        (rail ? 'Station name or code' : 'Select bus stop'),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                ),
                const Icon(Icons.expand_more, size: 20),
              ],
            ),
          ),
        ),
      );
  @override
  Widget build(BuildContext context) {
    final results = filtered;
    final visible = rail ? results : results.take(shown).toList();
    return ListView(
      key: PageStorageKey(widget.kind),
      padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
      children: [
        SectionTitle(
          rail ? 'Your next rail journey.' : 'Where are you heading?',
          rail
              ? 'Find trains between stations, with every scheduled stop.'
              : 'Choose your start and destination. Find your next bus.',
        ),
        Notice(
          rail
              ? 'Saved eRail catalog · 27 October 2026. Scheduled Indian time (IST), not live running status. Confirm current operation for your travel date.'
              : 'Saved bus timetables. Confirm timings and operation with the operator before travel.',
        ),
        Card(
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                LayoutBuilder(
                  builder: (context, space) {
                    final swap = IconButton(
                      key: Key('${widget.kind.name}-swap'),
                      tooltip: 'Swap stations',
                      onPressed: () {
                        final old = from;
                        from = to;
                        to = old;
                        invalidate();
                      },
                      icon: const Icon(Icons.swap_vert, color: teal),
                    );
                    if (space.maxWidth < 500)
                      return Row(
                        children: [
                          Expanded(
                            child: Column(
                              children: [
                                Row(
                                  children: [
                                    field(
                                      'From',
                                      from,
                                      () => pick(true),
                                      Key('${widget.kind.name}-from'),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    field(
                                      'To',
                                      to,
                                      () => pick(false),
                                      Key('${widget.kind.name}-to'),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          swap,
                        ],
                      );
                    return Row(
                      children: [
                        field(
                          'From',
                          from,
                          () => pick(true),
                          Key('${widget.kind.name}-from'),
                        ),
                        swap,
                        field(
                          'To',
                          to,
                          () => pick(false),
                          Key('${widget.kind.name}-to'),
                        ),
                      ],
                    );
                  },
                ),
                const SizedBox(height: 14),
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: chooseTime,
                        icon: const Icon(Icons.schedule),
                        label: Text(
                          after == null
                              ? 'Any time'
                              : 'After ${clock('${after!.hour}:${after!.minute.toString().padLeft(2, '0')}', use24Hour: widget.settings.use24Hour)}',
                        ),
                      ),
                    ),
                    if (after != null)
                      IconButton(
                        tooltip: 'Clear time filter',
                        onPressed: () {
                          after = null;
                          invalidate();
                        },
                        icon: const Icon(Icons.close),
                      ),
                  ],
                ),
                const SizedBox(height: 14),
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    key: Key('${widget.kind.name}-search'),
                    onPressed: loading ? null : () => search(),
                    icon: loading
                        ? const SizedBox(
                            width: 19,
                            height: 19,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : const Icon(Icons.search),
                    label: Text(
                      loading
                          ? 'Searching…'
                          : rail
                          ? 'Search trains'
                          : 'Search buses',
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 22),
        if (!rail)
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final value in ['All', 'KSRTC', 'Private'])
                ChoiceChip(
                  label: Text(value == 'All' ? 'All buses' : value),
                  selected: operator == value,
                  onSelected: (_) => setState(() => operator = value),
                ),
              ActionChip(
                avatar: const Icon(Icons.sort, size: 17),
                label: Text(shortest ? 'Shortest journey' : 'Sorted by time'),
                onPressed: () => setState(() => shortest = !shortest),
              ),
            ],
          ),
        const SizedBox(height: 18),
        Text(
          rail ? 'Trains on your route' : 'Available transit buses',
          style: Theme.of(context).textTheme.titleLarge
              ?.copyWith(fontWeight: FontWeight.bold),
        ),
        if (error != null)
          ErrorPanel(error!, () => search(more: rows.isNotEmpty)),
        if (loading)
          const Padding(
            padding: EdgeInsets.all(20),
            child: Center(child: CircularProgressIndicator()),
          ),
        if (searched && !loading && error == null)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 12),
            child: Text(
              rail
                  ? '${rows.length} of $total catalog matches · All origin running days'
                  : '${results.length} shown · $total source matches${total > 200 ? ' (first 200 loaded)' : ''}',
              style: Theme.of(context).textTheme.bodySmall,
            ),
          ),
        if (!loading && error == null && visible.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 36),
            child: Column(
              children: [
                Icon(
                  rail ? Icons.train_outlined : Icons.directions_bus_outlined,
                  size: 52,
                  color: Theme.of(context).colorScheme.onSurfaceVariant,
                ),
                const SizedBox(height: 16),
                Text(
                  searched
                      ? 'No matching routes in this catalog.'
                      : 'Where will you go next?',
                  style: Theme.of(context).textTheme.titleMedium,
                ),
                const SizedBox(height: 9),
                Text(
                  searched
                      ? 'Try another station or clear the time filter.'
                      : 'Choose your stations to begin.',
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 12),
                TextButton(
                  onPressed: () {
                    from = rail
                        ? const StopChoice('CAN', 'Kannur', 'Kerala')
                        : const StopChoice('aluva', 'Aluva');
                    to = rail
                        ? const StopChoice('TLY', 'Thalassery', 'Kerala')
                        : const StopChoice('ernakulam', 'Ernakulam');
                    search();
                  },
                  child: Text(
                    rail ? 'Try Kannur → Thalassery' : 'Try Aluva → Ernakulam',
                  ),
                ),
              ],
            ),
          ),
        for (final row in visible)
          Padding(
            padding: const EdgeInsets.only(bottom: 14),
            child: TransitCard(
              row: row,
              settings: widget.settings,
              onTap: () => showModalBottomSheet<void>(
                context: context,
                isScrollControlled: true,
                useSafeArea: true,
                builder: (context) => FractionallySizedBox(
                  heightFactor: .9,
                  child: JourneySheet(
                    row: row,
                    repository: widget.repository,
                    settings: widget.settings,
                  ),
                ),
              ),
            ),
          ),
        if (!loading &&
            (rail
                ? rows.isNotEmpty && rows.length < total && rows.length < 5000
                : shown < results.length))
          OutlinedButton(
            onPressed: () {
              if (rail) {
                search(more: true);
              } else {
                setState(() => shown += 30);
              }
            },
            child: Text(rail ? 'Load more trains' : 'Show more buses'),
          ),
        if (rail)
          const Notice(
            'Origin running weekdays refer to the train’s starting station. Your boarding station may be on a later train day. No ticket booking, seat availability, cancellations or live train positions are included.',
          ),
      ],
    );
  }
}

class TransitCard extends StatelessWidget {
  final SearchHit row;
  final AppSettings settings;
  final VoidCallback onTap;
  const TransitCard({
    super.key,
    required this.row,
    required this.settings,
    required this.onTap,
  });
  @override
  Widget build(BuildContext context) => Card(
    child: InkWell(
      borderRadius: BorderRadius.circular(24),
      onTap: onTap,
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                if (!row.rail) ...[
                  ClipOval(
                    child: SvgPicture.asset(
                      'assets/bus.svg',
                      width: 48,
                      height: 48,
                    ),
                  ),
                  const SizedBox(width: 12),
                ],
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        row.badge,
                        style: const TextStyle(
                          color: teal,
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        row.name,
                        style: Theme.of(context).textTheme.titleMedium
                            ?.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.chevron_right),
              ],
            ),
            const SizedBox(height: 18),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        clock(row.departure, use24Hour: settings.use24Hour),
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(row.from, style: const TextStyle(fontSize: 12)),
                      if (row.rail)
                        Text(
                          'Train day ${row.boardingDay}',
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.fromLTRB(8, 4, 8, 0),
                  child: Column(
                    children: [
                      const Icon(Icons.arrow_right_alt, size: 22, color: teal),
                      Text(
                        duration(row.minutes),
                        style: const TextStyle(fontSize: 10),
                      ),
                    ],
                  ),
                ),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(
                        clock(row.arrival, use24Hour: settings.use24Hour),
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        row.to,
                        textAlign: TextAlign.right,
                        style: const TextStyle(fontSize: 12),
                      ),
                      if (row.rail)
                        Text(
                          'Train day ${row.arrivalDay}',
                          style: Theme.of(context).textTheme.labelSmall,
                        ),
                    ],
                  ),
                ),
              ],
            ),
            if (row.rail) ...[
              const SizedBox(height: 15),
              Text(
                'Origin runs: ${row.runningDays.isEmpty ? 'Not specified' : row.runningDays}',
                style: Theme.of(context).textTheme.bodySmall,
              ),
            ] else ...[
              const SizedBox(height: 12),
              Text(row.route, style: Theme.of(context).textTheme.bodySmall),
            ],
          ],
        ),
      ),
    ),
  );
}
