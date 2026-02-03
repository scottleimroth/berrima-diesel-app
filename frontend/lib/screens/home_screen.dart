import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/signal_providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final signalsAsync = ref.watch(signalsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Berrima Diesel'),
      ),
      body: signalsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
        data: (signals) => ListView.builder(
          itemCount: signals.length,
          itemBuilder: (context, index) {
            final signal = signals[index];
            return Card(
              margin: const EdgeInsets.all(8.0),
              child: ListTile(
                title: Text(signal['company']),
                subtitle: Text(signal['signal']),
                trailing: Text(
                  '${(signal['probability'] * 100).toStringAsFixed(0)}%',
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                onTap: () {
                  context.go('/signal/${signal['id']}');
                },
              ),
            );
          },
        ),
      ),
    );
  }
}
