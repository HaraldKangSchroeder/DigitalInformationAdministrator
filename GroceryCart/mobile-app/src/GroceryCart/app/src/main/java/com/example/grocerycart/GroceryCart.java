package com.example.grocerycart;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class GroceryCart {

    private ArrayList<GroceryCartElement> groceryCartList;

    public GroceryCart(){
        groceryCartList = new ArrayList<GroceryCartElement>();
    }

    public ArrayList<GroceryCartElement> getList(){
        return groceryCartList;
    }

    public void addGroceryCartElement(GroceryCartElement groceryCartElement){
        groceryCartList.add(groceryCartElement);
    }

    public void readDataset(ArrayList<JSONObject> dataset){
        groceryCartList = new ArrayList<GroceryCartElement>();
        for(int i = 0; i < dataset.size(); i++){
            try{
                String name = dataset.get(i).getString("name");
                String type = dataset.get(i).getString("type");
                if(type.equals("null")){
                    type = "-";
                }
                String amount = dataset.get(i).getString("amount");
                addGroceryCartElement(new GroceryCartElement(name,type,amount));
            }
            catch (JSONException e) {
                System.out.println(e.getStackTrace());
            }
        }
    }
}
