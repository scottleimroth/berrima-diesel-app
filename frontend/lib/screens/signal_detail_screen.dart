import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/signal_providers.dart';

class SignalDetailScreen extends ConsumerWidget {
  final int signalId;

  const SignalDetailScreen({
    super.key,
    required this.signalId,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final signalAsync = ref.watch(signalDetailProvider(signalId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Signal Details'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.go('/'),
        ),
      ),
      body: signalAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stack) => Center(child: Text('Error: $error')),
        data: (signal) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                signal['company'],
                style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 16),
              Text(
                'Signal: ${signal['signal']}',
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 16),
              Text(
                'Probability: ${(signal['probability'] * 100).toStringAsFixed(0)}%',
                style: const TextStyle(fontSize: 18),
              ),
              const SizedBox(height: 16),
              Text(
                'Timestamp: ${signal['timestamp']}',
                style: const TextStyle(fontSize: 14, color: Colors.grey),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
