import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';

final signalsProvider = FutureProvider<List<dynamic>>((ref) async {
  return await ApiService.getSignals();
});

final signalDetailProvider = FutureProvider.family<dynamic, int>((ref, id) async {
  return await ApiService.getSignal(id);
});
