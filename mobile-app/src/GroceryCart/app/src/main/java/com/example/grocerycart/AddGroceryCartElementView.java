package com.example.grocerycart;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.Spinner;

import org.json.JSONException;
import org.json.JSONObject;

public class AddGroceryCartElementView extends AppCompatActivity {

    private String selectedType = "";
    private Boolean specificGroceryWritten = false;
    private String groceryName = "";
    private String amount = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_grocery_cart_element_view);
        getSupportActionBar().hide();

        setGroceryTypesAsSpinnerValues(GroceryCartManager.groceryTypes.getTypes());
        setButtonGoToAction(R.id.buttonFromAddToGroceryCartView, GroceryCartView.class);
        setButtonAddGroceryAction(R.id.buttonAddGroceryCartElement, GroceryCartView.class);
        setEditTextChangeGroceryNameAction();
        setEditTextChangeAmountAction();

        Button btn = (Button)findViewById(R.id.buttonAddGroceryCartElement);
        btn.setEnabled(false);

    }

    private void setEditTextChangeGroceryNameAction(){
        EditText et = (EditText) findViewById(R.id.editTextChangeGroceryName);
        et.addTextChangedListener(new TextWatcher() {
            public void afterTextChanged(Editable s) {}
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                groceryName = s.toString();
                groceryName = groceryName.substring(0, 1).toUpperCase() + groceryName.substring(1);
                if(GroceryCartManager.groceries.containsGroceryByName(groceryName) && !specificGroceryWritten){
                    String type = GroceryCartManager.groceries.getGrocery(groceryName).getType();
                    String[] singleType = {type};
                    setGroceryTypesAsSpinnerValues(singleType);
                    specificGroceryWritten = true;
                }
                else if(!GroceryCartManager.groceries.containsGroceryByName(groceryName) && specificGroceryWritten){
                    setGroceryTypesAsSpinnerValues(GroceryCartManager.groceryTypes.getTypes());
                    specificGroceryWritten = false;
                }

                Button btn = (Button)findViewById(R.id.buttonAddGroceryCartElement);
                if(groceryName.length() > 0){
                    btn.setEnabled(true);
                }
                else{
                    btn.setEnabled(false);
                }
            }
        });
    }

    private void setEditTextChangeAmountAction(){
        EditText et = (EditText) findViewById(R.id.editTextChangeAmount);
        et.addTextChangedListener(new TextWatcher() {
            public void afterTextChanged(Editable s) {}
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                amount = s.toString();
            }
        });
    }

    private void setGroceryTypesAsSpinnerValues(String[] types){
        if(types.length == 0) return;
        Spinner dropdown = findViewById(R.id.spinnerGroceryTypes);
        ArrayAdapter<String> adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, types);
        dropdown.setAdapter(adapter);
        selectedType = types[0];
        changeTypeColorIndicator(GroceryCartManager.groceryTypes.getParsedColorByType(selectedType));

        dropdown.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                selectedType = types[position];
                changeTypeColorIndicator(GroceryCartManager.groceryTypes.getParsedColorByType(selectedType));
            }
            @Override
            public void onNothingSelected(AdapterView<?> parentView) {}
        });
    }

    public void changeTypeColorIndicator(int color){
        LinearLayout linLayTypeColorIndicator = (LinearLayout) findViewById(R.id.fieldTypeColorIndicator);
        linLayTypeColorIndicator.setBackgroundColor(color);
    }

    public void setButtonGoToAction(int buttonId, Class destinationClass){
        Button btn = (Button)findViewById(buttonId);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(AddGroceryCartElementView.this, destinationClass));
            }
        });
    }

    public void setButtonAddGroceryAction(int buttonId,  Class destinationClass){
        Button btn = (Button)findViewById(buttonId);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                try{
                    JSONObject newEntry = new JSONObject();
                    newEntry.put("name", groceryName);
                    if(!selectedType.equals("-"))
                    {
                        newEntry.put("type", selectedType);
                    }
                    newEntry.put("amount", amount);
                    GroceryCartNetworkManager.emit("createGroceryCartEntry", newEntry);
                    startActivity(new Intent(AddGroceryCartElementView.this, destinationClass));
                }
                catch (JSONException e) {
                    System.out.println(e);
                }
            }
        });
    }

}