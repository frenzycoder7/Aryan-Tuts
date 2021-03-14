import 'package:flutter/material.dart';
import 'package:ui/Screens/Widgets/Navigations/NavigationBar.dart';

class TabHomeScreen extends StatelessWidget {
  String t;
  TabHomeScreen({this.t});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
            colors: [Colors.redAccent, Colors.orangeAccent],
          ),
        ),
        child: Column(
          children: [
            NavigationBar(),
            Container(
              child: Image.asset(
                'assets/1stImage.png',
              ),
            ),
            Container(
              alignment: Alignment.topLeft,
            )
          ],
        ),
      ),
    );
  }
}
