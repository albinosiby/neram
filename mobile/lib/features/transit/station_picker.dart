import 'dart:async';

import 'package:flutter/material.dart';

import '../../core/widgets.dart';
import 'models.dart';
import 'repository.dart';

Future<StopChoice?> pickStation(
  BuildContext context,
  TransitRepository repository,
  TransitKind kind,
  String title,
) => showModalBottomSheet<StopChoice>(
  context: context,
  isScrollControlled: true,
  useSafeArea: true,
  builder: (context) => FractionallySizedBox(
    heightFactor: .9,
    child: StationPicker(repository: repository, kind: kind, title: title),
  ),
);

class StationPicker extends StatefulWidget {
  final TransitRepository repository;
  final TransitKind kind;
  final String title;
  const StationPicker({
    super.key,
    required this.repository,
    required this.kind,
    required this.title,
  });
  @override
  State<StationPicker> createState() => _StationPickerState();
}

class _StationPickerState extends State<StationPicker> {
  final controller = TextEditingController();
  Timer? timer;
  int version = 0;
  bool loading = false;
  String? error;
  List<StopChoice> items = [];
  @override
  void initState() {
    super.initState();
    if (widget.kind == TransitKind.bus) load();
  }

  @override
  void dispose() {
    timer?.cancel();
    controller.dispose();
    super.dispose();
  }

  Future<void> load() async {
    final q = controller.text.trim();
    final v = ++version;
    if (q.isEmpty && widget.kind == TransitKind.train) {
      setState(() => items = []);
      return;
    }
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final found = await widget.repository.stops(widget.kind, q);
      if (mounted && v == version) setState(() => items = found);
    } catch (e) {
      if (mounted && v == version) setState(() => error = '$e');
    } finally {
      if (mounted && v == version) setState(() => loading = false);
    }
  }

  @override
  Widget build(BuildContext context) => SheetFrame(
    title: widget.title,
    child: Column(
      children: [
        const SizedBox(height: 12),
        TextField(
          key: const Key('station-query'),
          controller: controller,
          autofocus: true,
          maxLength: 80,
          decoration: InputDecoration(
            labelText: widget.kind == TransitKind.train
                ? 'Station name or code'
                : 'Search bus stops',
            prefixIcon: const Icon(Icons.search),
            counterText: '',
          ),
          onChanged: (_) {
            version++;
            timer?.cancel();
            timer = Timer(const Duration(milliseconds: 250), load);
          },
        ),
        const SizedBox(height: 10),
        if (loading) const LinearProgressIndicator(),
        if (error != null) ErrorPanel(error!, load),
        Expanded(
          child: ListView.builder(
            itemCount: items.length,
            itemBuilder: (context, i) {
              final item = items[i];
              return ListTile(
                title: Text(item.name),
                subtitle: Text(
                  widget.kind == TransitKind.train
                      ? '${item.id} · ${item.detail}'
                      : item.detail,
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () => Navigator.pop(context, item),
              );
            },
          ),
        ),
        if (!loading && error == null && items.isEmpty)
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text(
              controller.text.isEmpty
                  ? 'Type a station name or code to begin.'
                  : 'No matching stations. Try another spelling.',
            ),
          ),
      ],
    ),
  );
}
