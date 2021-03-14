import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:ui/Providers/ThemeProvider.dart';
import 'package:ui/Screens/Home.dart';
import 'package:ui/Screens/Splash.dart';
import 'package:ui/Utills/Themes.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (ctx) => ThemeProvider(),
        ),
      ],
      child: Consumer<ThemeProvider>(
        builder: (context, themes, child) {
          return MaterialApp(
            key: themes.key,
            debugShowCheckedModeBanner: false,
            navigatorKey: themes.navigatorKey,
            title: ThemesList.appName,
            theme: themes.theme,
            darkTheme: ThemesList.darkTheme,
            home: Splash(),
            routes: {
              "/home": (ctx) => Home(),
              //"/dashboard": (ctx) => DashBoardScreen(),
            },
          );
        },
      ),
    );
  }
}
