import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:neram_mobile/app.dart';
import 'package:neram_mobile/core/settings.dart';
import 'package:neram_mobile/features/metro/catalog.dart';

import 'support/fixtures.dart';

void main() {
  testWidgets('phone navigation, search, route sheets and settings', (
    tester,
  ) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final catalog = (await tester.runAsync(MetroCatalog.load))!;
    await tester.pumpWidget(
      NeramApp(
        repository: fixtureRepository(),
        settings: AppSettings(),
        metroCatalog: Future.value(catalog),
      ),
    );
    await tester.pumpAndSettle();
    expect(find.text('Where are you heading?'), findsOneWidget);
    await tester.scrollUntilVisible(
      find.text('Try Aluva → Ernakulam'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Try Aluva → Ernakulam'));
    await tester.pumpAndSettle();
    expect(find.text('06:25 AM'), findsOneWidget);
    await tester.ensureVisible(find.text('06:25 AM'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('06:25 AM'));
    await tester.pumpAndSettle();
    expect(find.text('BOARD HERE'), findsOneWidget);
    expect(find.text('Kalamassery'), findsOneWidget);
    await tester.tap(find.byTooltip('Close').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Trains').last);
    await tester.pumpAndSettle();
    await tester.scrollUntilVisible(
      find.text('Try Kannur → Thalassery'),
      200,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('Try Kannur → Thalassery'));
    await tester.pumpAndSettle();
    expect(find.text('CAN ALLP EXPRESS'), findsOneWidget);
    await tester.ensureVisible(find.text('CAN ALLP EXPRESS'));
    await tester.pumpAndSettle();
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
    expect(find.textContaining('Archived timetable'), findsOneWidget);
    await tester.tap(find.byKey(const Key('metro-city')));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Bengaluru · Namma Metro').last);
    await tester.pumpAndSettle();
    expect(find.text('Across Bengaluru, connected.'), findsOneWidget);
    await tester.tap(find.text('Settings').last);
    await tester.pumpAndSettle();
    await tester.tap(find.text('Light'));
    await tester.pumpAndSettle();
    expect(find.text('App settings'), findsOneWidget);
    expect(tester.takeException(), null);
  });
  testWidgets('narrow phone and larger text do not overflow', (tester) async {
    tester.view.physicalSize = const Size(320, 740);
    tester.platformDispatcher.textScaleFactorTestValue = 1.3;
    addTearDown(tester.platformDispatcher.clearTextScaleFactorTestValue);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);
    final c = (await tester.runAsync(MetroCatalog.load))!;
    await tester.pumpWidget(
      MediaQuery(
        data: const MediaQueryData(textScaler: TextScaler.linear(1.3)),
        child: NeramApp(
          repository: fixtureRepository(),
          settings: AppSettings(),
          metroCatalog: Future.value(c),
        ),
      ),
    );
    await tester.pumpAndSettle();
    expect(tester.takeException(), null);
    await tester.tap(find.text('Trains').last);
    await tester.pumpAndSettle();
    expect(tester.takeException(), null);
  });
}
