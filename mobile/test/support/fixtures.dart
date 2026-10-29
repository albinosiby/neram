import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:neram_mobile/core/api.dart';
import 'package:neram_mobile/features/transit/repository.dart';

TransitRepository fixtureRepository({bool fail = false}) => TransitRepository(
  Api(
    client: MockClient((request) async {
      if (fail) return http.Response('unavailable', 503);
      final name = request.url.pathSegments.last;
      final input = jsonDecode(request.body) as Map;
      final values = <String, dynamic>{
        'neram_find_stops': [
          {'stop_key': 'aluva', 'name': 'Aluva', 'service_count': 10},
          {'stop_key': 'ernakulam', 'name': 'Ernakulam', 'service_count': 8},
        ],
        'neram_rail_stations': [
          {
            'code': 'CAN',
            'name': 'Kannur',
            'district': 'Kannur',
            'state': 'Kerala',
          },
          {
            'code': 'TLY',
            'name': 'Thalassery',
            'district': 'Kannur',
            'state': 'Kerala',
          },
        ],
        'neram_search_buses': [
          {
            'service_id': 'bus-1',
            'name': 'KSRTC',
            'operator': 'KSRTC',
            'origin': 'Aluva',
            'destination': 'Ernakulam',
            'boarding_stop': 'Aluva',
            'alighting_stop': 'Ernakulam',
            'departure_time': '06:25',
            'arrival_time': '07:05',
            'duration_minutes': 40,
            'boarding_sequence': 1,
            'alighting_sequence': 3,
            'arrival_day': 0,
            'total_matches': 1,
          },
        ],
        'neram_rail_search': [
          {
            'train_id': '4646',
            'train_number': '16308',
            'train_name': 'CAN ALLP EXPRESS',
            'origin_code': 'CAN',
            'destination_code': 'ALLP',
            'boarding_code': 'CAN',
            'boarding_name': 'Kannur',
            'alighting_code': 'TLY',
            'alighting_name': 'Thalassery',
            'departure_time': '05:10',
            'arrival_time': '05:29',
            'boarding_day': '1',
            'alighting_day': '1',
            'boarding_order': 1,
            'alighting_order': 2,
            'duration_minutes': 19,
            'operating_days': 'Mon|Tue|Wed|Thu|Fri|Sat|Sun',
            'total_results': 1,
          },
        ],
        'neram_journey': [
          {'sequence': 1, 'stop': 'Aluva', 'time': '06:25', 'day_offset': 0},
          {
            'sequence': 2,
            'stop': 'Kalamassery',
            'time': '06:45',
            'day_offset': 0,
          },
          {
            'sequence': 3,
            'stop': 'Ernakulam',
            'time': '07:05',
            'day_offset': 0,
          },
        ],
        'neram_rail_journey': [
          {
            'stop_order': 1,
            'station_code': 'CAN',
            'station_name': 'Kannur',
            'arrival_time': '',
            'departure_time': '05:10',
            'journey_day': '1',
          },
          {
            'stop_order': 2,
            'station_code': 'TLY',
            'station_name': 'Thalassery',
            'arrival_time': '05:29',
            'departure_time': '05:30',
            'journey_day': '1',
          },
          {
            'stop_order': 3,
            'station_code': 'ALLP',
            'station_name': 'Alleppey',
            'arrival_time': '13:30',
            'departure_time': '',
            'journey_day': '1',
          },
        ],
      };
      if (name == 'neram_search_buses' && input['p_from'] == input['p_to'])
        return http.Response('[]', 200);
      if (name == 'neram_issue_reports') return http.Response('', 201);
      return http.Response(
        jsonEncode(values[name] ?? []),
        200,
        headers: {'Content-Type': 'application/json'},
      );
    }),
  ),
);
