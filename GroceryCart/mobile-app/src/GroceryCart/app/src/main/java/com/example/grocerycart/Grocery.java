package com.example.grocerycart;

public class Grocery {

    String name;
    String type;

    public Grocery(String name, String type){
        this.name = name;
        this.type = type;
    }

    public String getName(){
        return this.name;
    }

    public String getType(){
        return this.type;
    }

}
