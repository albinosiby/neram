import '../../core/api.dart';
import 'models.dart';

class TransitRepository {
  final Api api;
  TransitRepository(this.api);
  Future<List<StopChoice>> stops(TransitKind kind, String query) async {
    final rows = await api.rpc(
      kind == TransitKind.bus ? 'neram_find_stops' : 'neram_rail_stations',
      {'p_query': query},
      rail: kind == TransitKind.train,
    );
    return rows.map((r) => StopChoice.fromJson(r, kind)).toList();
  }

  Future<List<SearchHit>> search(
    TransitKind kind,
    String from,
    String to, {
    int? after,
    int offset = 0,
  }) async {
    final rows = await api.rpc(
      kind == TransitKind.bus ? 'neram_search_buses' : 'neram_rail_search',
      {
        'p_from': from,
        'p_to': to,
        'p_after': after,
        if (kind == TransitKind.bus) 'p_limit': 200 else 'p_offset': offset,
      },
      rail: kind == TransitKind.train,
    );
    return rows.map((r) => SearchHit(r, kind)).toList();
  }

  Future<List<StopCall>> journey(SearchHit row) async {
    final rows = await api.rpc(
      row.rail ? 'neram_rail_journey' : 'neram_journey',
      {'p_id': row.id},
      rail: row.rail,
    );
    return rows.map((r) => StopCall.fromJson(r, row.kind)).toList();
  }
}
