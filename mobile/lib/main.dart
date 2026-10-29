import 'package:flutter/material.dart';

import 'app.dart';
import 'core/api.dart';
import 'core/settings.dart';
import 'features/transit/repository.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  AppSettings settings;
  try {
    settings = await AppSettings.load();
  } catch (_) {
    settings = AppSettings();
  }
  runApp(NeramApp(repository: TransitRepository(Api()), settings: settings));
}
