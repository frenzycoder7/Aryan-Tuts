import 'package:flutter/material.dart';

class HeaderItem extends StatelessWidget {
  IconData icon;
  String text;
  Color iconColor;
  HeaderItem({this.icon, this.text, this.iconColor});
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.all(10),
      child: Row(
        children: [
          Icon(
            icon,
            color: iconColor,
          ),
          Text(
            text,
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
          )
        ],
      ),
    );
  }
}
