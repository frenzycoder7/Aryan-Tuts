import 'package:flutter/material.dart';
import 'package:hexcolor/hexcolor.dart';

class HeroItem extends StatelessWidget {
  IconData icon;
  String text;
  HeroItem({this.icon, this.text});
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(15),
        color: HexColor('#ebb830'),
        boxShadow: [
          BoxShadow(
            color: Colors.grey,
            offset: Offset.zero,
            blurRadius: 3.0,
            spreadRadius: 3.0,
          )
        ],
      ),
      width: 250,
      height: 130,
      child: Row(
        children: [
          Expanded(
            flex: 2,
            child: Container(
              child: Center(
                child: CircleAvatar(
                  backgroundColor: Colors.white,
                  child: Icon(icon),
                ),
              ),
            ),
          ),
          Expanded(
            flex: 4,
            child: Container(
              alignment: Alignment.centerLeft,
              padding: EdgeInsets.all(10),
              color: Colors.orange,
              child: Text(
                text,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
