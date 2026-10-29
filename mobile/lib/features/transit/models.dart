import '../../core/format.dart';

enum TransitKind { bus, train }

class StopChoice {
  final String id, name, detail;
  const StopChoice(this.id, this.name, [this.detail = '']);
  String get label => detail.isEmpty ? name : '$name ($id)';
  factory StopChoice.fromJson(Map<String, dynamic> row, TransitKind kind) =>
      kind == TransitKind.bus
      ? StopChoice(
          '${row['stop_key']}',
          '${row['name']}',
          '${row['service_count']} scheduled services',
        )
      : StopChoice(
          '${row['code']}',
          '${row['name']}',
          [
            row['district'],
            row['state'],
          ].where((x) => x != null && x != '').join(', '),
        );
}

class SearchHit {
  final Map<String, dynamic> raw;
  final TransitKind kind;
  SearchHit(this.raw, this.kind);
  bool get rail => kind == TransitKind.train;
  String str(String key) => raw[key]?.toString() ?? '';
  String get id => str(rail ? 'train_id' : 'service_id');
  String get name => str(rail ? 'train_name' : 'name');
  String get badge => rail ? 'TRAIN ${str('train_number')}' : str('operator');
  String get from => str(rail ? 'boarding_name' : 'boarding_stop');
  String get to => str(rail ? 'alighting_name' : 'alighting_stop');
  String get departure => str('departure_time');
  String get arrival => str('arrival_time');
  int? get minutes => number(raw['duration_minutes']);
  int get start =>
      number(raw[rail ? 'boarding_order' : 'boarding_sequence']) ?? 0;
  int get end =>
      number(raw[rail ? 'alighting_order' : 'alighting_sequence']) ?? 0;
  int get total => number(raw[rail ? 'total_results' : 'total_matches']) ?? 0;
  String get runningDays => str('operating_days').replaceAll('|', ' · ');
  String get route => rail
      ? '${str('origin_code')} → ${str('destination_code')}'
      : '${str('origin')} → ${str('destination')}';
  String get boardingDay => str('boarding_day');
  String get arrivalDay => rail ? str('alighting_day') : str('arrival_day');
}

class StopCall {
  final int order;
  final String name, code, arrival, departure;
  final int? day;
  const StopCall({
    required this.order,
    required this.name,
    this.code = '',
    this.arrival = '',
    this.departure = '',
    this.day,
  });
  factory StopCall.fromJson(Map<String, dynamic> row, TransitKind kind) =>
      kind == TransitKind.train
      ? StopCall(
          order: number(row['stop_order']) ?? 0,
          name: '${row['station_name'] ?? row['station_code']}',
          code: '${row['station_code']}',
          arrival: '${row['arrival_time'] ?? ''}',
          departure: '${row['departure_time'] ?? ''}',
          day: number(row['journey_day']),
        )
      : StopCall(
          order: number(row['sequence']) ?? 0,
          name: '${row['stop']}',
          departure: '${row['time'] ?? ''}',
          day: number(row['day_offset']) == null
              ? null
              : number(row['day_offset'])! + 1,
        );
}
