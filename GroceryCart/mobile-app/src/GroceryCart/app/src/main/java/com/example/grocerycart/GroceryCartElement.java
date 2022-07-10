package com.example.grocerycart;

import android.graphics.Color;

public class GroceryCartElement {

    private String name;
    private String type;
    private String amount;

    public GroceryCartElement(String name, String type, String amount){
        this.name = name;
        this.type = type;
        this.amount = amount;
    }

    public String getType(){
        return type;
    }

    public String getName(){
        return name;
    }

    public String getAmount(){
        return amount;
    }

}
