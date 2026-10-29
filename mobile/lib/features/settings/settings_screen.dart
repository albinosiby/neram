import 'package:flutter/material.dart';

import '../../core/settings.dart';
import '../../core/widgets.dart';

class SettingsScreen extends StatelessWidget {
  final AppSettings settings;
  const SettingsScreen({super.key, required this.settings});
  @override
  Widget build(BuildContext context) => ListView(
    padding: const EdgeInsets.all(20),
    children: [
      const SectionTitle('App settings', 'Personalize your Neram experience.'),
      const SizedBox(height: 8),
      const Text('Appearance'),
      const SizedBox(height: 12),
      SegmentedButton<ThemeMode>(
        segments: const [
          ButtonSegment(
            value: ThemeMode.system,
            icon: Icon(Icons.brightness_auto),
            label: Text('Auto'),
          ),
          ButtonSegment(
            value: ThemeMode.light,
            icon: Icon(Icons.light_mode_outlined),
            label: Text('Light'),
          ),
          ButtonSegment(
            value: ThemeMode.dark,
            icon: Icon(Icons.dark_mode_outlined),
            label: Text('Dark'),
          ),
        ],
        selected: {settings.themeMode},
        onSelectionChanged: (s) => settings.setTheme(s.first),
      ),
      const SizedBox(height: 22),
      SwitchListTile(
        contentPadding: EdgeInsets.zero,
        title: const Text('24-hour time'),
        subtitle: const Text('Display schedules as 18:30 instead of 06:30 PM.'),
        value: settings.use24Hour,
        onChanged: settings.set24Hour,
      ),
      const Divider(),
      ListTile(
        contentPadding: EdgeInsets.zero,
        leading: const Icon(Icons.info_outline),
        title: const Text('About Neram'),
        trailing: const Icon(Icons.chevron_right),
        onTap: () => showAboutDialog(
          context: context,
          applicationName: 'Neram Transit',
          applicationVersion: '1.0.0',
          applicationIcon: const Icon(Icons.directions_transit, size: 42),
          children: const [
            Text(
              'Bus, railway and Metro route information in one place. Built for the journeys that matter.',
            ),
            SizedBox(height: 16),
            Text(
              'Bus and train searches use separate read-only Supabase projects. Metro routes are bundled in this app. No location permission or account is required.',
            ),
            SizedBox(height: 16),
            Text(
              'Railway: eRail snapshot, 27 October 2026. Kochi: archived calendar ended 31 December 2025. Bengaluru: ixigo catalog, 27 October 2026. Timetables can change; confirm with the operator before travel.',
            ),
          ],
        ),
      ),
    ],
  );
}
