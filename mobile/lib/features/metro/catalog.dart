import 'dart:convert';

import 'package:flutter/services.dart';

typedef Json = Map<String, dynamic>;

class MetroStation {
  final String id, name;
  final double? latitude, longitude;
  final bool main;
  const MetroStation(
    this.id,
    this.name, {
    this.latitude,
    this.longitude,
    this.main = false,
  });
}

class MetroTrip {
  final String id, service;
  final List<List<dynamic>> calls, fullCalls;
  final int departure, arrival;
  MetroTrip(this.id, this.service, this.calls, this.fullCalls)
    : departure = (calls.first[2] as num).toInt(),
      arrival = (calls.last[1] as num).toInt();
  int get seconds => arrival - departure;
}

class MetroLeg {
  final String line;
  final List<String> stations;
  MetroLeg(this.line, this.stations);
}

class MetroRoute {
  final List<MetroLeg> legs;
  MetroRoute(this.legs);
  int get transfers => legs.length - 1;
  int get hops => legs.fold(0, (sum, l) => sum + l.stations.length - 1);
}

class MetroCatalog {
  final List<MetroStation> kochi;
  final Json schedule, bengaluru;
  MetroCatalog(this.kochi, this.schedule, this.bengaluru);
  static Future<MetroCatalog> load() async {
    final data = await Future.wait(
      [
        'kochi_stations.json',
        'kochi_catalog.json',
        'bengaluru.json',
      ].map((n) => rootBundle.loadString('assets/data/$n')),
    );
    return MetroCatalog(
      (jsonDecode(data[0]) as List)
          .map(
            (s) => MetroStation(
              '${s['stop_id']}',
              '${s['station_name']}',
              latitude: (s['latitude'] as num).toDouble(),
              longitude: (s['longitude'] as num).toDouble(),
              main:
                  s['main_station_flag'] == true || s['main_station_flag'] == 1,
            ),
          )
          .toList(),
      Map<String, dynamic>.from(jsonDecode(data[1]) as Map),
      Map<String, dynamic>.from(jsonDecode(data[2]) as Map),
    );
  }

  List<Json> get lines => (bengaluru['lines'] as List)
      .map((l) => Map<String, dynamic>.from(l as Map))
      .toList();
  List<MetroStation> get bangalore => {
    for (final line in lines)
      for (final station in line['stations_in_order'] as List)
        '$station': MetroStation('$station', '$station'),
  }.values.toList();
  MetroStation station(int index) =>
      kochi.firstWhere((s) => s.id == schedule['stationCodes'][index]);
  num? fare(String from, String to) => schedule['fares']['$from:$to'] as num?;
  List<MetroTrip> trips(String from, String to, String service, {int? after}) {
    if (from == to) return [];
    final codes = schedule['stationCodes'] as List;
    final a = codes.indexOf(from), b = codes.indexOf(to);
    if (a < 0 || b < 0) return [];
    final result = <MetroTrip>[];
    for (final raw in schedule['trips'] as List) {
      if (raw[1] != service) continue;
      final calls = (raw[4] as List)
          .map((c) => List<dynamic>.from(c as List))
          .toList();
      final start = calls.indexWhere((c) => c[0] == a);
      if (start < 0) continue;
      int end = -1;
      for (int i = start + 1; i < calls.length; i++) {
        if (calls[i][0] == b) {
          end = i;
          break;
        }
      }
      if (end < 0) continue;
      final trip = MetroTrip(
        '${raw[0]}',
        service,
        calls.sublist(start, end + 1),
        calls,
      );
      if (trip.arrival < trip.departure ||
          (after != null && trip.departure < after))
        continue;
      result.add(trip);
    }
    result.sort((a, b) {
      final time = a.departure.compareTo(b.departure);
      return time == 0 ? a.id.compareTo(b.id) : time;
    });
    return result;
  }

  MetroRoute? route(String from, String to) {
    if (from == to) return null;
    final states = <String, ({String line, String station, int index})>{};
    String key(String line, String station) => jsonEncode([line, station]);
    for (final line in lines) {
      final stops = line['stations_in_order'] as List;
      for (int i = 0; i < stops.length; i++) {
        final s = '${stops[i]}';
        states[key('${line['line_id']}', s)] = (
          line: '${line['line_id']}',
          station: s,
          index: i,
        );
      }
    }
    final pending = states.keys.toSet(),
        costs = <String, int>{},
        parents = <String, String>{};
    for (final entry in states.entries) {
      if (entry.value.station == from) costs[entry.key] = 0;
    }
    String? finish;
    while (pending.isNotEmpty) {
      String? at;
      int best = 1 << 30;
      for (final id in pending) {
        if ((costs[id] ?? 1 << 30) < best) {
          best = costs[id]!;
          at = id;
        }
      }
      if (at == null) break;
      pending.remove(at);
      final s = states[at]!;
      if (s.station == to) {
        finish = at;
        break;
      }
      for (final id in pending) {
        final n = states[id]!;
        final same = s.line == n.line && (s.index - n.index).abs() == 1;
        final change = s.station == n.station && s.line != n.line;
        if (!same && !change) continue;
        final cost = best + (change ? 1000 : 1);
        if (cost < (costs[id] ?? 1 << 30)) {
          costs[id] = cost;
          parents[id] = at;
        }
      }
    }
    if (finish == null) return null;
    final path = <String>[];
    for (String? id = finish; id != null; id = parents[id]) {
      path.insert(0, id);
    }
    final legs = <MetroLeg>[];
    for (final id in path) {
      final s = states[id]!;
      if (legs.isEmpty || legs.last.line != s.line)
        legs.add(MetroLeg(s.line, []));
      legs.last.stations.add(s.station);
    }
    return MetroRoute(legs);
  }
}
