package com.example.grocerycart;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Groceries {

    ArrayList<Grocery> groceryList;

    public Groceries(){
        groceryList = new ArrayList<Grocery>();
    }

    public void addGrocery(Grocery grocery){
        groceryList.add(grocery);
    }

    public boolean containsGroceryByName(String name){
        String nameUppercase = name.toUpperCase();
        for(int i = 0; i < groceryList.size(); i++){
            String _nameUpperCase = groceryList.get(i).getName().toUpperCase();
            if(_nameUpperCase.equals(nameUppercase)){
                return true;
            }
        }
        return false;
    }

    public Grocery getGrocery(String name){
        String nameUppercase = name.toUpperCase();
        for(int i = 0; i < groceryList.size(); i++){
            String _nameUpperCase = groceryList.get(i).getName().toUpperCase();
            if(_nameUpperCase.equals(nameUppercase)){
                return groceryList.get(i);
            }
        }
        return null;
    }

    public void readDataset(ArrayList<JSONObject> dataset){
        groceryList = new ArrayList<Grocery>();
        for(int i = 0; i < dataset.size(); i++){
            try{
                String name = dataset.get(i).getString("name");
                String type = dataset.get(i).getString("type");
                addGrocery(new Grocery(name,type));
            }
            catch (JSONException e) {
                System.out.println(e.getStackTrace());
            }
        }
    }

}
