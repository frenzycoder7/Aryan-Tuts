import 'package:flutter/material.dart';

class MobileAndHomeScreen extends StatelessWidget {
  String t;
  MobileAndHomeScreen({this.t});
  GlobalKey<ScaffoldState> _drawerKey = GlobalKey();
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      key: _drawerKey,
      appBar: AppBar(
        elevation: 3,
        leading: IconButton(
          icon: Icon(Icons.storage),
          onPressed: () {
            _drawerKey.currentState.openDrawer();
          },
        ),
        title: Text(t),
      ),
      drawer: Drawer(
        elevation: 3,
        child: Column(
          children: [
            Container(
              height: 200,
              width: double.infinity,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                  colors: [Colors.redAccent, Colors.orangeAccent],
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Container(
                    padding: EdgeInsets.all(15),
                    height: 130,
                    width: 130,
                    child: CircleAvatar(
                      backgroundColor: Colors.white,
                      child: Icon(
                        Icons.person,
                        size: 30,
                      ),
                    ),
                  ),
                  Container(
                    padding: EdgeInsets.only(left: 15, right: 15, bottom: 15),
                    child: Text(
                      'Guest User',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 20,
                        color: Colors.white,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
