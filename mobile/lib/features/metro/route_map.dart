import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../../core/theme.dart';
import 'catalog.dart';

class CatalogMap extends StatelessWidget {
  final MetroCatalog catalog;
  final String from, to;
  const CatalogMap({
    super.key,
    required this.catalog,
    required this.from,
    required this.to,
  });
  @override
  Widget build(BuildContext context) => Semantics(
    label: 'Kochi Metro catalog route map. $from to $to. No live trains.',
    image: true,
    child: SizedBox(
      height: 300,
      width: double.infinity,
      child: CustomPaint(
        painter: _MapPainter(
          catalog,
          from,
          to,
          Theme.of(context).colorScheme.onSurfaceVariant,
        ),
      ),
    ),
  );
}

class _MapPainter extends CustomPainter {
  final MetroCatalog catalog;
  final String from, to;
  final Color muted;
  _MapPainter(this.catalog, this.from, this.to, this.muted);
  @override
  void paint(Canvas canvas, Size size) {
    final shapes = (catalog.schedule['shapes'] as List)
        .map(
          (s) => (s['points'] as List)
              .map(
                (p) =>
                    Offset((p[1] as num).toDouble(), (p[0] as num).toDouble()),
              )
              .toList(),
        )
        .toList();
    final points = shapes.expand((s) => s).toList();
    if (points.isEmpty) return;
    final minX = points.map((p) => p.dx).reduce(math.min),
        maxX = points.map((p) => p.dx).reduce(math.max),
        minY = points.map((p) => p.dy).reduce(math.min),
        maxY = points.map((p) => p.dy).reduce(math.max);
    final scale = math.min(
      (size.width - 48) / (maxX - minX),
      (size.height - 40) / (maxY - minY),
    );
    final ox = (size.width - (maxX - minX) * scale) / 2,
        oy = (size.height - (maxY - minY) * scale) / 2;
    Offset project(Offset p) =>
        Offset(ox + (p.dx - minX) * scale, oy + (maxY - p.dy) * scale);
    void draw(List<Offset> line, Color color, double width) {
      final path = Path();
      for (var i = 0; i < line.length; i++) {
        final p = project(line[i]);
        if (i == 0) {
          path.moveTo(p.dx, p.dy);
        } else {
          path.lineTo(p.dx, p.dy);
        }
      }
      canvas.drawPath(
        path,
        Paint()
          ..color = color
          ..style = PaintingStyle.stroke
          ..strokeWidth = width
          ..strokeCap = StrokeCap.round,
      );
    }

    for (final shape in shapes) {
      draw(shape, muted.withValues(alpha: .28), 3);
    }
    final a = catalog.kochi.firstWhere((s) => s.id == from),
        b = catalog.kochi.firstWhere((s) => s.id == to);
    final pa = Offset(a.longitude!, a.latitude!),
        pb = Offset(b.longitude!, b.latitude!);
    int nearest(List<Offset> line, Offset p) {
      int best = 0;
      double score = double.infinity;
      for (var i = 0; i < line.length; i++) {
        final d = (line[i] - p).distanceSquared;
        if (d < score) {
          score = d;
          best = i;
        }
      }
      return best;
    }

    List<Offset>? selected;
    double best = double.infinity;
    int ai = 0, bi = 0;
    for (final shape in shapes) {
      final x = nearest(shape, pa), y = nearest(shape, pb);
      final score =
          (shape[x] - pa).distanceSquared + (shape[y] - pb).distanceSquared;
      if (score < best) {
        best = score;
        selected = shape;
        ai = x;
        bi = y;
      }
    }
    if (selected != null)
      draw(selected.sublist(math.min(ai, bi), math.max(ai, bi) + 1), teal, 5);
    for (final station in catalog.kochi) {
      final p = project(Offset(station.longitude!, station.latitude!));
      canvas.drawCircle(
        p,
        station.id == from || station.id == to ? 6 : 2.5,
        Paint()
          ..color = station.id == to
              ? amber
              : station.id == from
              ? teal
              : muted,
      );
    }
    final label = TextPainter(
      text: TextSpan(
        text: 'N ↑   $from → $to',
        style: TextStyle(color: muted, fontSize: 11),
      ),
      textDirection: TextDirection.ltr,
    )..layout(maxWidth: size.width);
    label.paint(canvas, const Offset(8, 5));
  }

  @override
  bool shouldRepaint(covariant _MapPainter old) =>
      old.from != from || old.to != to || old.muted != muted;
}
