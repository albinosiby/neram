import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AppSettings extends ChangeNotifier {
  final SharedPreferences? preferences;
  ThemeMode themeMode;
  bool use24Hour;
  AppSettings({
    this.preferences,
    this.themeMode = ThemeMode.dark,
    this.use24Hour = false,
  });
  static Future<AppSettings> load() async {
    final p = await SharedPreferences.getInstance();
    return AppSettings(
      preferences: p,
      themeMode: ThemeMode.values.firstWhere(
        (v) => v.name == p.getString('theme'),
        orElse: () => ThemeMode.dark,
      ),
      use24Hour: p.getBool('use24Hour') ?? false,
    );
  }

  Future<void> setTheme(ThemeMode value) async {
    themeMode = value;
    notifyListeners();
    await preferences?.setString('theme', value.name);
  }

  Future<void> set24Hour(bool value) async {
    use24Hour = value;
    notifyListeners();
    await preferences?.setBool('use24Hour', value);
  }
}
