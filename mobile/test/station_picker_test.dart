import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:neram_mobile/features/transit/models.dart';
import 'package:neram_mobile/features/transit/station_picker.dart';

import 'support/fixtures.dart';

void main() {
  testWidgets('station name selection returns typed choice', (tester) async {
    StopChoice? selected;
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Builder(
            builder: (context) => TextButton(
              onPressed: () async {
                selected = await pickStation(
                  context,
                  fixtureRepository(),
                  TransitKind.bus,
                  'Choose departure',
                );
              },
              child: const Text('Pick station'),
            ),
          ),
        ),
      ),
    );
    await tester.tap(find.text('Pick station'));
    await tester.pumpAndSettle();
    expect(find.text('Aluva'), findsOneWidget);
    await tester.tap(find.text('Aluva'));
    await tester.pumpAndSettle();
    expect(selected?.id, 'aluva');
    expect(find.text('Choose departure'), findsNothing);
    expect(tester.takeException(), null);
  });
  testWidgets('rail picker reports failures and clears an empty query', (
    tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: StationPicker(
            repository: fixtureRepository(fail: true),
            kind: TransitKind.train,
            title: 'Choose station',
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    await tester.enterText(find.byKey(const Key('station-query')), 'CAN');
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pumpAndSettle();
    expect(find.textContaining('Could not load'), findsOneWidget);
    await tester.enterText(find.byKey(const Key('station-query')), '');
    await tester.pump(const Duration(milliseconds: 300));
    await tester.pumpAndSettle();
    expect(find.text('Type a station name or code to begin.'), findsOneWidget);
    expect(find.byType(LinearProgressIndicator), findsNothing);
    expect(tester.takeException(), null);
  });
}
