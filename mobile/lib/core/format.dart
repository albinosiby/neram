String clock(String? value, {bool use24Hour = false}) {
  if (value == null || value.isEmpty) return '—';
  final match = RegExp(r'^(\d{1,3}):([0-5]\d)(?::([0-5]\d))?$')
      .firstMatch(value);
  if (match == null) return '—';
  final h = int.parse(match[1]!);
  final m = match[2]!;
  final suffix = h >= 24 ? ' · Day +${h ~/ 24}' : '';
  if (use24Hour) return '${(h % 24).toString().padLeft(2, '0')}:$m$suffix';
  return '${(h % 12 == 0 ? 12 : h % 12).toString().padLeft(2, '0')}:$m ${h % 24 >= 12 ? 'PM' : 'AM'}$suffix';
}

String duration(int? minutes) {
  if (minutes == null || minutes < 0) return 'Duration unavailable';
  if (minutes < 60) return '$minutes min';
  return '${minutes ~/ 60} hr${minutes % 60 == 0 ? '' : ' ${minutes % 60} min'}';
}

String clockSeconds(int seconds, {bool use24Hour = false}) => clock(
  '${seconds ~/ 3600}:${((seconds % 3600) ~/ 60).toString().padLeft(2, '0')}',
  use24Hour: use24Hour,
);
String exactDuration(int seconds) =>
    '${duration(seconds ~/ 60)}${seconds % 60 == 0 ? '' : ' ${seconds % 60} sec'}';
int? number(Object? value) =>
    value is num ? value.toInt() : int.tryParse('$value');
