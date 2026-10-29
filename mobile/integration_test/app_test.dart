import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:neram_mobile/app.dart';
import 'package:neram_mobile/core/settings.dart';
import 'package:neram_mobile/features/metro/catalog.dart';

import '../test/support/fixtures.dart';

void main() {
  final binding = IntegrationTestWidgetsFlutterBinding.ensureInitialized();
  testWidgets('Android navigation and search-to-route flow', (tester) async {
    final catalog = await MetroCatalog.load();
    await tester.pumpWidget(
      NeramApp(
        repository: fixtureRepository(),
        settings: AppSettings(),
        metroCatalog: Future.value(catalog),
      ),
    );
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Try Aluva → Ernakulam'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('Try Aluva → Ernakulam'));
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('06:25 AM'));
    await tester.tap(find.text('06:25 AM'));
    await tester.pumpAndSettle();
    expect(find.text('BOARD HERE'), findsOneWidget);
    await tester.tap(find.byTooltip('Close').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Trains').last);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Try Kannur → Thalassery'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.tap(find.text('Try Kannur → Thalassery'));
    await tester.pumpAndSettle();
    await tester.ensureVisible(find.text('CAN ALLP EXPRESS'));
    await tester.tap(find.text('CAN ALLP EXPRESS'));
    await tester.pumpAndSettle();
    expect(find.text('2 scheduled stops'), findsOneWidget);
    await tester.tap(find.text('Full route'));
    await tester.pumpAndSettle();
    expect(find.text('3 scheduled stops'), findsOneWidget);
    await tester.tap(find.byTooltip('Close').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Metro').last);
    await tester.pumpAndSettle();
    expect(find.text('A simpler way across Kochi.'), findsOneWidget);
    await tester.tap(find.text('Settings').last);
    await tester.pumpAndSettle();
    expect(find.text('App settings'), findsOneWidget);
    expect(tester.takeException(), null);
    // Native integration uses deterministic HTTP fixtures; live backend tests run separately.
    await binding.convertFlutterSurfaceToImage();
    await tester.pumpAndSettle();
    await binding.takeScreenshot('neram-android-settings');
  });
}
