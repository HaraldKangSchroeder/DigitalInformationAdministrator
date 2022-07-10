package com.example.grocerycart;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

public class Utils {

    public static String[] stringToArray(String stringArr){
        String reducedByBrackets = stringArr.substring(1, stringArr.length()-1);
        //split the string into an array

        String[] arr = reducedByBrackets.split(",");
        return arr;
    }

    public static ArrayList<JSONObject> stringJsonArrayToJsonArray(String stringJsonArray) throws JSONException {
        ArrayList<JSONObject> jsonArray = new ArrayList<JSONObject>();
        String stringJsonObject = "";
        boolean started = false;
        for(int i = 0; i < stringJsonArray.length(); i++){
            if(stringJsonArray.charAt(i) == '{'){
                started = true;
            }
            if(started){
                stringJsonObject = stringJsonObject.concat("" + stringJsonArray.charAt(i));
            }
            if(stringJsonArray.charAt(i) == '}'){
                started = false;
                try {
                    JSONObject jsonObject = new JSONObject(stringJsonObject);
                    jsonArray.add(jsonObject);
                    stringJsonObject = "";
                }
                catch (JSONException e){
                    System.out.println(e.getStackTrace());
                }
            }
        }
        return jsonArray;
    }
}
