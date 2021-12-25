package com.example.grocerycart;
import android.graphics.Color;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class GroceryTypes {

    final String DEFAULT_COLOR = "#AAAAAA";

    private ArrayList<GroceryType> groceryTypeList;

    public GroceryTypes(){
        groceryTypeList = new ArrayList<GroceryType>();
    }

    public ArrayList<GroceryType> getList(){
        return groceryTypeList;
    }

    public void addGroceryType(GroceryType groceryType){
        groceryTypeList.add(groceryType);
    }

    public int getParsedColorByType(String type){
        if(type == "null") return Color.parseColor(DEFAULT_COLOR);
        for(int i = 0; i < groceryTypeList.size(); i++){
            if(groceryTypeList.get(i).getType().equals(type)){
                return groceryTypeList.get(i).getParsedColor();
            }
        }
        return 0;
    }

    public void readDataset(ArrayList<JSONObject> dataset){
        groceryTypeList = new ArrayList<GroceryType>();
        for(int i = 0; i < dataset.size(); i++){
            try{
                String type = dataset.get(i).getString("type");
                String color = dataset.get(i).getString("color");
                addGroceryType(new GroceryType(type,color));
            }
            catch (JSONException e) {
                System.out.println(e.getStackTrace());
            }
        }
    }

    public String[] getTypes(){
        String[] types = new String[groceryTypeList.size()];
        for(int i = 0; i < types.length; i++){
            types[i] = groceryTypeList.get(i).getType();
        }
        return types;
    }



}
