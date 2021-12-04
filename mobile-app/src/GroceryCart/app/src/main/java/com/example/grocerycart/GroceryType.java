package com.example.grocerycart;

import android.graphics.Color;

public class GroceryType {
    private String type;
    private String color;

    public GroceryType(String type,String color){
        this.type = type;
        this.color = color;
    }

    public String getType(){
        return type;
    }

    public String getColor(){
        return color;
    }

    public int getParsedColor(){
        return Color.parseColor(color);
    }

}
