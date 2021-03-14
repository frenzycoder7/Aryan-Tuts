import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';
import 'package:ui/Screens/Utils/HeadItems.dart';
import 'package:ui/Screens/Utils/HeroItem.dart';
import 'package:ui/Screens/Widgets/Banner/DesktopTabBanner.dart';
import 'package:ui/Screens/Widgets/Navigations/NavigationBar.dart';

class DesktopHomeScreen extends StatelessWidget {
  String t;
  DesktopHomeScreen({this.t});
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: ListView(
        children: [
          Container(
            height: 580,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.centerLeft,
                end: Alignment.centerRight,
                colors: [Colors.redAccent, Colors.orangeAccent],
              ),
            ),
            child: Column(
              children: [
                Container(
                  height: 40,
                  width: double.infinity,
                  color: HexColor('#232637'),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        margin: EdgeInsets.only(left: 10),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            HeaderItem(
                              icon: Icons.phone,
                              text: '+91 9262715527',
                              iconColor: Colors.greenAccent,
                            ),
                            HeaderItem(
                              icon: Icons.mail_outline,
                              text: 'gaurav4149singh@gmail.com',
                              iconColor: Colors.redAccent,
                            ),
                          ],
                        ),
                      ),
                      Container(
                        margin: EdgeInsets.only(right: 10),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.end,
                          children: [
                            HeaderItem(
                              icon: Icons.whatshot,
                              iconColor: Colors.red,
                              text: 'Join us',
                            )
                          ],
                        ),
                      )
                    ],
                  ),
                ),
                NavigationBar(),
                DesktopTabBanner(),
              ],
            ),
          ),
          Container(
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(
                  padding: EdgeInsets.all(30),
                  child: HeroItem(
                    icon: Icons.school,
                    text: 'Online Addmition',
                  ),
                ),
                Container(
                  padding: EdgeInsets.all(30),
                  child: HeroItem(
                    icon: Icons.warning,
                    text: 'Online Test',
                  ),
                ),
                Container(
                  padding: EdgeInsets.all(30),
                  child: HeroItem(
                    icon: Icons.help,
                    text: 'Best Support',
                  ),
                ),
                Container(
                  padding: EdgeInsets.all(30),
                  child: HeroItem(
                    icon: Icons.computer,
                    text: 'Practicals',
                  ),
                )
              ],
            ),
          ),
          Container(
            padding: EdgeInsets.only(top: 70),
            child: Center(
              child: Text(
                'Online Addmition',
                style: TextStyle(
                  color: HexColor('#ebb830'),
                  fontWeight: FontWeight.w600,
                  fontSize: 50,
                ),
              ),
            ),
          ),
          Container(
            height: 500,
            child: Row(
              children: [
                Expanded(
                  flex: 2,
                  child: Container(
                    child: Image.asset(
                      'assets/loginArea.jpg',
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Expanded(
                  flex: 3,
                  child: Container(
                    child: Text('jhvjhghjgkh'),
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
