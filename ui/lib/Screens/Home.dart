import 'package:flutter/material.dart';
import 'package:ui/Screens/Widgets/Home/DesktopHomeScreen.dart';
import 'package:ui/Screens/Widgets/Home/MobileAndAndroidHomeScreen.dart';
import 'package:ui/Screens/Widgets/Home/TabHomeScreen.dart';

class Home extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(builder: (context, constrance) {
      if (constrance.maxWidth > 1200) {
        return DesktopHomeScreen(
          t: 'Aryan Classes',
        );
      } else if (constrance.maxWidth > 800 && constrance.maxWidth < 1200) {
        return TabHomeScreen(
          t: 'Aryan Tab',
        );
      } else {
        return MobileAndHomeScreen(
          t: 'Aryan Mobile',
        );
      }
    });
  }
}
