import 'package:flutter_test/flutter_test.dart';
import 'package:neram_mobile/core/format.dart';
import 'package:neram_mobile/features/metro/catalog.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  test('times preserve midnight and service-day offsets', () {
    expect(clock('00:05'), '12:05 AM');
    expect(clock('12:05'), '12:05 PM');
    expect(clock('24:03'), '12:03 AM · Day +1');
    expect(clock('25:12', use24Hour: true), '01:12 · Day +1');
    expect(clock('bad'), '—');
    expect(duration(null), 'Duration unavailable');
    expect(duration(70), '1 hr 10 min');
  });
  test(
    'Kochi archive exact fare, Sunday train, short turns and overnight',
    () async {
      final catalog = await MetroCatalog.load();
      expect(catalog.kochi.length, 25);
      expect(catalog.fare('ALVA', 'TPHT'), 60);
      final trip = catalog
          .trips('ALVA', 'TPHT', 'WE')
          .firstWhere((t) => t.id == 'WE_10');
      expect(trip.departure, 41830);
      expect(trip.arrival, 44868);
      expect(trip.seconds, 3038);
      expect(trip.calls.length, 25);
      expect(catalog.trips('ALVA', 'ALVA', 'WK'), isEmpty);
      expect(
        catalog.trips('TPHT', 'ALVA', 'WE').any((t) => t.id == 'WE_1'),
        false,
      );
      expect(
        catalog.trips('TPHT', 'MUTT', 'WE').any((t) => t.id == 'WE_1'),
        true,
      );
      final night = catalog
          .trips('TPHT', 'MUTT', 'WK', after: 23 * 3600)
          .firstWhere((t) => t.id == 'WK_253');
      expect(night.arrival, greaterThan(86400));
      expect(
        catalog.schedule['calendar'].every((c) => c['end_date'] == 20251231),
        true,
      );
    },
  );
  test('Bengaluru routes keep transfer stations and directions', () async {
    final c = await MetroCatalog.load();
    expect(c.bangalore.length, 83);
    final route = c.route(
      'Whitefield (Kadugodi)',
      'Delta Electronics Bommasandra',
    )!;
    expect(route.transfers, 2);
    expect(
      route.legs[0].stations.last,
      'Nadaprabhu Kempegowda Station (Majestic)',
    );
    expect(route.legs[1].stations.last, 'Rashtreeya Vidyalaya Road');
    expect(c.route('Rashtreeya Vidyalaya Road', 'Ragigudda')!.transfers, 0);
    expect(c.route('Ragigudda', 'Ragigudda'), null);
    expect(c.route('unknown', 'Ragigudda'), null);
    for (final line in c.lines) {
      final s = line['stations_in_order'] as List;
      expect(c.route(s.last, s.first)!.hops, s.length - 1);
    }
  });
}
