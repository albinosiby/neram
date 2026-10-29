import 'package:flutter/material.dart';

import '../../core/format.dart';
import '../../core/settings.dart';
import '../../core/theme.dart';
import '../../core/widgets.dart';
import 'models.dart';
import 'repository.dart';

class JourneySheet extends StatefulWidget {
  final SearchHit row;
  final TransitRepository repository;
  final AppSettings settings;
  const JourneySheet({
    super.key,
    required this.row,
    required this.repository,
    required this.settings,
  });
  @override
  State<JourneySheet> createState() => _JourneySheetState();
}

class _JourneySheetState extends State<JourneySheet> {
  late Future<List<StopCall>> future;
  bool full = false;
  @override
  void initState() {
    super.initState();
    future = widget.repository.journey(widget.row);
  }

  @override
  Widget build(BuildContext context) {
    final row = widget.row;
    return SheetFrame(
      title: '${row.rail ? row.badge + ' · ' : ''}${row.name}',
      child: ListView(
        children: [
          Text(
            '${row.from} → ${row.to}',
            style: Theme.of(context).textTheme.bodyLarge,
          ),
          const SizedBox(height: 8),
          Text(duration(row.minutes)),
          Notice(
            row.rail
                ? 'Saved eRail timetable · 27 October 2026. Times are in IST; origin weekdays do not confirm operation today.'
                : 'Saved bus timetable. Confirm current timings with the operator.',
          ),
          SegmentedButton<bool>(
            segments: const [
              ButtonSegment(value: false, label: Text('Selected segment')),
              ButtonSegment(value: true, label: Text('Full route')),
            ],
            selected: {full},
            onSelectionChanged: (s) => setState(() => full = s.first),
          ),
          const SizedBox(height: 20),
          FutureBuilder<List<StopCall>>(
            future: future,
            builder: (context, snapshot) {
              if (snapshot.hasError)
                return ErrorPanel(
                  '${snapshot.error}',
                  () => setState(() => future = widget.repository.journey(row)),
                );
              if (!snapshot.hasData)
                return const Center(
                  child: Padding(
                    padding: EdgeInsets.all(24),
                    child: CircularProgressIndicator(),
                  ),
                );
              final calls = snapshot.data!
                  .where(
                    (s) => full || (s.order >= row.start && s.order <= row.end),
                  )
                  .toList();
              if (calls.isEmpty)
                return const Text('No stop details available.');
              return Column(
                children: [
                  Text('${calls.length} scheduled stops'),
                  const SizedBox(height: 20),
                  for (var i = 0; i < calls.length; i++)
                    CallTile(
                      call: calls[i],
                      rail: row.rail,
                      last: i == calls.length - 1,
                      board: calls[i].order == row.start,
                      alight: calls[i].order == row.end,
                      use24Hour: widget.settings.use24Hour,
                    ),
                ],
              );
            },
          ),
          if (!row.rail) ...[
            const SizedBox(height: 20),
            OutlinedButton.icon(
              onPressed: () => showModalBottomSheet<void>(
                context: context,
                isScrollControlled: true,
                useSafeArea: true,
                builder: (context) =>
                    ReportSheet(repository: widget.repository, row: row),
              ),
              icon: const Icon(Icons.report_outlined),
              label: const Text('Report issue'),
            ),
          ],
        ],
      ),
    );
  }
}

class CallTile extends StatelessWidget {
  final StopCall call;
  final bool rail, last, board, alight, use24Hour;
  const CallTile({
    super.key,
    required this.call,
    this.rail = false,
    this.last = false,
    this.board = false,
    this.alight = false,
    this.use24Hour = false,
  });
  @override
  Widget build(BuildContext context) => IntrinsicHeight(
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(
          width: 26,
          child: Column(
            children: [
              Container(
                width: 15,
                height: 15,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: board
                      ? teal
                      : alight
                      ? amber
                      : Theme.of(context).colorScheme.outline,
                ),
              ),
              if (!last)
                Expanded(
                  child: Container(
                    width: 2,
                    color: Theme.of(context).colorScheme.outlineVariant,
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(width: 8),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(bottom: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                if (board || alight)
                  Text(
                    board ? 'BOARD HERE' : 'GET OFF HERE',
                    style: TextStyle(
                      fontSize: 9,
                      color: board ? teal : amber,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                Text(
                  call.name,
                  style: const TextStyle(fontWeight: FontWeight.w600),
                ),
                const SizedBox(height: 4),
                Text(
                  [
                    if (call.code.isNotEmpty) call.code,
                    if (call.day != null)
                      '${rail ? 'Train day' : 'Day'} ${call.day}',
                  ].join(' · '),
                  style: Theme.of(context).textTheme.labelSmall,
                ),
              ],
            ),
          ),
        ),
        const SizedBox(width: 10),
        Padding(
          padding: const EdgeInsets.only(bottom: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (rail)
                Text(
                  'Arr ${clock(call.arrival, use24Hour: use24Hour)}',
                  style: const TextStyle(fontSize: 11),
                ),
              Text(
                '${rail ? 'Dep ' : ''}${clock(call.departure, use24Hour: use24Hour)}',
                style: const TextStyle(fontSize: 11),
              ),
            ],
          ),
        ),
      ],
    ),
  );
}

class ReportSheet extends StatefulWidget {
  final TransitRepository repository;
  final SearchHit row;
  const ReportSheet({super.key, required this.repository, required this.row});
  @override
  State<ReportSheet> createState() => _ReportSheetState();
}

class _ReportSheetState extends State<ReportSheet> {
  final form = GlobalKey<FormState>();
  final controller = TextEditingController();
  String category = 'wrong_time';
  String? error;
  bool busy = false, success = false;
  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  Future<void> submit() async {
    if (!form.currentState!.validate()) return;
    setState(() {
      busy = true;
      error = null;
    });
    try {
      await widget.repository.api.report(
        widget.row.id,
        category,
        controller.text,
      );
      if (mounted) setState(() => success = true);
    } catch (e) {
      if (mounted) setState(() => error = '$e');
    } finally {
      if (mounted) setState(() => busy = false);
    }
  }

  @override
  Widget build(BuildContext context) => SheetFrame(
    title: 'Report timetable issue',
    child: SingleChildScrollView(
      child: success
          ? const Padding(
              padding: EdgeInsets.all(24),
              child: Text('Thank you. Your report was submitted for review.'),
            )
          : Form(
              key: form,
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(widget.row.name),
                  const SizedBox(height: 16),
                  DropdownButtonFormField<String>(
                    initialValue: category,
                    decoration: const InputDecoration(labelText: 'Issue'),
                    items: const [
                      DropdownMenuItem(
                        value: 'wrong_time',
                        child: Text('Wrong time'),
                      ),
                      DropdownMenuItem(
                        value: 'missing_stop',
                        child: Text('Missing stop'),
                      ),
                      DropdownMenuItem(
                        value: 'wrong_route',
                        child: Text('Wrong route'),
                      ),
                      DropdownMenuItem(value: 'other', child: Text('Other')),
                    ],
                    onChanged: busy
                        ? null
                        : (value) => setState(() => category = value!),
                  ),
                  const SizedBox(height: 14),
                  TextFormField(
                    controller: controller,
                    minLines: 3,
                    maxLines: 5,
                    maxLength: 1000,
                    decoration: const InputDecoration(
                      labelText: 'What needs correcting?',
                    ),
                    validator: (v) => (v?.trim().length ?? 0) < 10
                        ? 'Please enter at least 10 characters.'
                        : null,
                  ),
                  if (error != null)
                    Text(
                      error!,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                  const SizedBox(height: 16),
                  FilledButton(
                    onPressed: busy ? null : submit,
                    child: Text(busy ? 'Sending…' : 'Submit report'),
                  ),
                ],
              ),
            ),
    ),
  );
}
