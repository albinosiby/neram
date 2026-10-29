import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiException implements Exception {
  final String message;
  const ApiException(this.message);
  @override
  String toString() => message;
}

class Api {
  static const busUrl = String.fromEnvironment(
    'BUS_SUPABASE_URL',
    defaultValue: 'https://usarcxcmftifeapngtcs.supabase.co',
  );
  static const busKey = String.fromEnvironment(
    'BUS_SUPABASE_KEY',
    defaultValue: 'sb_publishable_VOA7K0U7mw2DpKA5x9KYGQ_oxl4F4Gu',
  );
  static const railUrl = String.fromEnvironment(
    'RAIL_SUPABASE_URL',
    defaultValue: 'https://qfxwshqfhdghqtoijqzy.supabase.co',
  );
  static const railKey = String.fromEnvironment(
    'RAIL_SUPABASE_KEY',
    defaultValue: 'sb_publishable_ZOFL0cV_brqGBiEncR5wRA_hMWypDm4',
  );
  final http.Client client;
  Api({http.Client? client}) : client = client ?? http.Client();
  Future<List<Map<String, dynamic>>> rpc(
    String name,
    Map<String, dynamic> body, {
    bool rail = false,
  }) async {
    try {
      final response = await client
          .post(
            Uri.parse('${rail ? railUrl : busUrl}/rest/v1/rpc/$name'),
            headers: {
              'apikey': rail ? railKey : busKey,
              'Content-Type': 'application/json',
            },
            body: jsonEncode(body),
          )
          .timeout(const Duration(seconds: 20));
      if (response.statusCode != 200)
        throw ApiException(
          'Could not load the timetable (${response.statusCode}). Please retry.',
        );
      final parsed = jsonDecode(response.body);
      if (parsed is! List)
        throw const ApiException(
          'Unexpected timetable response. Please retry.',
        );
      return parsed.map((r) => Map<String, dynamic>.from(r as Map)).toList();
    } on TimeoutException {
      throw const ApiException(
        'The request timed out. Check your connection and retry.',
      );
    } on http.ClientException {
      throw const ApiException(
        'Could not connect. Check your internet connection.',
      );
    } on FormatException {
      throw const ApiException(
        'The timetable response could not be read. Please retry.',
      );
    }
  }

  Future<void> report(String serviceId, String category, String details) async {
    try {
      final response = await client
          .post(
            Uri.parse('$busUrl/rest/v1/neram_issue_reports'),
            headers: {
              'apikey': busKey,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: jsonEncode({
              'service_id': serviceId,
              'category': category,
              'details': details.trim(),
            }),
          )
          .timeout(const Duration(seconds: 20));
      if (response.statusCode != 201)
        throw const ApiException('Could not submit the report. Please retry.');
    } on TimeoutException {
      throw const ApiException(
        'Report timed out. Check your connection before retrying.',
      );
    } on http.ClientException {
      throw const ApiException('Could not connect to submit the report.');
    }
  }

  void close() => client.close();
}
