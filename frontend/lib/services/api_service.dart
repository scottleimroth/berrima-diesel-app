import 'package:http/http.dart' as http;
import 'dart:convert';

const String baseUrl = 'http://localhost:5000/api';

class ApiService {
  static Future<List<dynamic>> getSignals() async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/signals'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load signals');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<dynamic> getSignal(int id) async {
    try {
      final response = await http.get(Uri.parse('$baseUrl/signals/$id'));
      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to load signal');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }

  static Future<dynamic> createSignal({
    required String company,
    required String signal,
    required double probability,
    required String timestamp,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/signals'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'company': company,
          'signal': signal,
          'probability': probability,
          'timestamp': timestamp,
        }),
      );
      if (response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to create signal');
      }
    } catch (e) {
      throw Exception('Error: $e');
    }
  }
}
