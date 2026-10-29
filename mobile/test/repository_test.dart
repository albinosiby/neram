import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:neram_mobile/core/api.dart';
import 'package:neram_mobile/features/transit/models.dart';
import 'package:neram_mobile/features/transit/repository.dart';

void main() {
  test(
    'uses separate Supabase URLs and carries route/time/page parameters',
    () async {
      final requests = <http.Request>[];
      final repository = TransitRepository(
        Api(
          client: MockClient((request) async {
            requests.add(request);
            return http.Response('[]', 200);
          }),
        ),
      );
      await repository.search(
        TransitKind.bus,
        'aluva',
        'ernakulam',
        after: 360,
      );
      await repository.search(
        TransitKind.train,
        'CAN',
        'TLY',
        after: 720,
        offset: 30,
      );
      expect(requests[0].url.host, 'usarcxcmftifeapngtcs.supabase.co');
      expect(requests[1].url.host, 'qfxwshqfhdghqtoijqzy.supabase.co');
      expect(jsonDecode(requests[1].body), {
        'p_from': 'CAN',
        'p_to': 'TLY',
        'p_after': 720,
        'p_offset': 30,
      });
      expect(jsonDecode(requests[0].body)['p_limit'], 200);
    },
  );
  test('keeps leading zeros and missing times', () {
    final row = SearchHit({
      'train_id': '22900',
      'train_number': '00001',
      'train_name': 'Special',
      'duration_minutes': null,
    }, TransitKind.train);
    expect(row.badge, 'TRAIN 00001');
    expect(row.minutes, null);
    expect(row.departure, '');
  });
  test('API failures become actionable exceptions', () async {
    final api = Api(client: MockClient((r) async => http.Response('', 503)));
    expect(
      api.rpc('neram_rail_stations', {'p_query': 'CAN'}, rail: true),
      throwsA(isA<ApiException>()),
    );
  });
  test('report contains only allowed columns', () async {
    Map? payload;
    final api = Api(
      client: MockClient((r) async {
        payload = jsonDecode(r.body) as Map;
        return http.Response('', 201);
      }),
    );
    await api.report('bus-1', 'wrong_time', '  Please correct this time.  ');
    expect(payload, {
      'service_id': 'bus-1',
      'category': 'wrong_time',
      'details': 'Please correct this time.',
    });
  });
}
