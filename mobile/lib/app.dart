import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

import 'core/settings.dart';
import 'core/theme.dart';
import 'features/transit/models.dart';
import 'features/transit/repository.dart';
import 'features/transit/search_screen.dart';
import 'features/metro/catalog.dart';
import 'features/metro/metro_screen.dart';
import 'features/settings/settings_screen.dart';

class NeramApp extends StatelessWidget {
  final TransitRepository repository;
  final AppSettings settings;
  final Future<MetroCatalog>? metroCatalog;
  const NeramApp({
    super.key,
    required this.repository,
    required this.settings,
    this.metroCatalog,
  });
  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: settings,
    builder: (context, _) => MaterialApp(
      title: 'Neram Transit',
      debugShowCheckedModeBanner: false,
      theme: neramTheme(Brightness.light),
      darkTheme: neramTheme(Brightness.dark),
      themeMode: settings.themeMode,
      home: NeramHome(
        repository: repository,
        settings: settings,
        metroCatalog: metroCatalog,
      ),
    ),
  );
}

class NeramHome extends StatefulWidget {
  final TransitRepository repository;
  final AppSettings settings;
  final Future<MetroCatalog>? metroCatalog;
  const NeramHome({
    super.key,
    required this.repository,
    required this.settings,
    this.metroCatalog,
  });
  @override
  State<NeramHome> createState() => _NeramHomeState();
}

class _NeramHomeState extends State<NeramHome> {
  int selected = 0;
  @override
  Widget build(BuildContext context) => Scaffold(
    appBar: AppBar(
      title: const Text.rich(
        TextSpan(
          children: [
            TextSpan(
              text: 'NERAM ',
              style: TextStyle(
                letterSpacing: 4,
                fontWeight: FontWeight.w800,
                fontSize: 19,
              ),
            ),
            TextSpan(
              text: 'TRANSIT',
              style: TextStyle(
                color: amber,
                letterSpacing: 3,
                fontWeight: FontWeight.w800,
                fontSize: 19,
              ),
            ),
          ],
        ),
      ),
      actions: [
        IconButton(
          tooltip: 'App settings',
          onPressed: () => setState(() => selected = 3),
          icon: const Icon(Icons.settings_outlined),
        ),
      ],
    ),
    body: SafeArea(
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 800),
          child: Stack(
            children: [
              Positioned.fill(
                child: IgnorePointer(
                  child: Opacity(
                    opacity: .07,
                    child: SvgPicture.asset(
                      'assets/kerala-evening.svg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
              ),
              IndexedStack(
                index: selected,
                children: [
                  TransitSearchScreen(
                    kind: TransitKind.bus,
                    repository: widget.repository,
                    settings: widget.settings,
                  ),
                  TransitSearchScreen(
                    kind: TransitKind.train,
                    repository: widget.repository,
                    settings: widget.settings,
                  ),
                  MetroScreen(
                    settings: widget.settings,
                    catalog: widget.metroCatalog,
                  ),
                  SettingsScreen(settings: widget.settings),
                ],
              ),
            ],
          ),
        ),
      ),
    ),
    bottomNavigationBar: NavigationBar(
      selectedIndex: selected,
      onDestinationSelected: (i) => setState(() => selected = i),
      destinations: const [
        NavigationDestination(
          icon: Icon(Icons.directions_bus_outlined),
          selectedIcon: Icon(Icons.directions_bus),
          label: 'Buses',
        ),
        NavigationDestination(
          icon: Icon(Icons.train_outlined),
          selectedIcon: Icon(Icons.train),
          label: 'Trains',
        ),
        NavigationDestination(
          icon: Icon(Icons.subway_outlined),
          selectedIcon: Icon(Icons.subway),
          label: 'Metro',
        ),
        NavigationDestination(
          icon: Icon(Icons.tune_outlined),
          selectedIcon: Icon(Icons.tune),
          label: 'Settings',
        ),
      ],
    ),
  );
}
