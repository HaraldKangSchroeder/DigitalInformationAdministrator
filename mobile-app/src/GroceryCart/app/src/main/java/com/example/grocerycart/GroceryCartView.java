package com.example.grocerycart;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.graphics.drawable.ShapeDrawable;
import android.graphics.drawable.shapes.OvalShape;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TableLayout;
import android.widget.TableRow;
import android.widget.TextView;

import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Array;
import java.util.ArrayList;

import io.socket.emitter.Emitter;

public class GroceryCartView extends AppCompatActivity {

    public final int SLIDER_WIDTH = 250;
    public final int BUTTON_CHANGE_AMOUNT_WIDTH = 200;
    public final int SEEKBAR_MAX_VALUE = 15;
    public final int GROCERY_NAME_TEXT_SIZE = 17;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.grocery_cart_view);
        getSupportActionBar().hide();

        setImageButtonGoToAction(R.id.buttonToOptions, OptionsView.class);
        setImageButtonGoToAction(R.id.buttonToAddGrocery, AddGroceryCartElementView.class);

        if(!GroceryCartNetworkManager.isSocketDefined()){
            SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());

            String remoteHost = sharedPreferences.getString("remoteHost", "") ;
            GroceryCartNetworkManager.setRemoteHost(remoteHost);

            String socketPath = sharedPreferences.getString("socketPath", "") ;
            GroceryCartNetworkManager.setSocketPath(socketPath);

            String username = sharedPreferences.getString("username", "") ;
            GroceryCartNetworkManager.setUsername(username);

            String password = sharedPreferences.getString("password", "") ;
            GroceryCartNetworkManager.setPassword(password);

            GroceryCartNetworkManager.setupSocket();
        }
        GroceryCartNetworkManager.startListener("connect", onConnect);
        GroceryCartNetworkManager.startListener("disconnect", onDisconnect);
        GroceryCartNetworkManager.startListener("allGroceryData", onMessageAllGroceryData);
        GroceryCartNetworkManager.emit("getAllGroceryData");
        changeColorOfConnectionIndicator();
    }

    @Override
    protected void onStop() {
        // call the superclass method first
        super.onStop();
        GroceryCartNetworkManager.stopListener("allGroceryData");
        GroceryCartNetworkManager.stopListener("connect");
        GroceryCartNetworkManager.stopListener("disconnect");
    }

    @Override
    protected  void onRestart(){
        super.onRestart();
        GroceryCartNetworkManager.startListener("connect", onConnect);
        GroceryCartNetworkManager.startListener("disconnect", onDisconnect);
        GroceryCartNetworkManager.startListener("allGroceryData", onMessageAllGroceryData);
        GroceryCartNetworkManager.emit("getAllGroceryData");
        changeColorOfConnectionIndicator();
    }

    public void setImageButtonGoToAction(int buttonId, Class destinationClass){
        ImageButton btn = (ImageButton)findViewById(buttonId);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(GroceryCartView.this, destinationClass));
            }
        });
    }

    private void createGroceryCartViewList(){
        for(int i = 0; i < GroceryCartManager.groceryCart.getList().size(); i++){
            GroceryCartElement groceryCartElement = GroceryCartManager.groceryCart.getList().get(i);
            createGroceryCartViewListEntry(groceryCartElement);
        }
    }

    private void resetGroceryCartViewList(){
        LinearLayout linLayGroceryCart = getLinearLayoutGroceryCart();
        linLayGroceryCart.removeAllViews();
        createGroceryCartViewList();
    }

    private void createGroceryCartViewListEntry(GroceryCartElement groceryCartElement){
        LinearLayout linLayGroceryCart = getLinearLayoutGroceryCart();
        LinearLayout linLayGroceryCartElement = getLinearLayoutGroceryCartElement(groceryCartElement);

        LinearLayout linLayColorIndicator = getLinearLayoutColorIndicator(groceryCartElement);
        TextView textViewName = getTextViewGroceryCartElementName(groceryCartElement.getName());
        TextView textViewAmount = getTextViewGroceryCartElementAmount(groceryCartElement.getAmount());
        SeekBar slider = getSliderRemoveGroceryCartEntry(groceryCartElement.getName());

        linLayGroceryCartElement.addView(linLayColorIndicator);
        linLayGroceryCartElement.addView(textViewName);
        linLayGroceryCartElement.addView(textViewAmount);
        linLayGroceryCartElement.addView(slider);

        linLayGroceryCart.addView(linLayGroceryCartElement);
    }

    public LinearLayout getLinearLayoutGroceryCart(){
        LinearLayout linLayGroceryCart = (LinearLayout) findViewById(R.id.LinearLayoutGroceryCart);
        return linLayGroceryCart;
    }

    public LinearLayout getLinearLayoutGroceryCartElement(GroceryCartElement groceryCartElement){
        LinearLayout linLayGroceryCartElement = new LinearLayout(this);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
        params.setMargins(10,10,10,10);
        linLayGroceryCartElement.setLayoutParams(params);
        linLayGroceryCartElement.setOrientation(LinearLayout.HORIZONTAL);
        return linLayGroceryCartElement;
    }

    public LinearLayout getLinearLayoutColorIndicator(GroceryCartElement groceryCartElement){
        int color = GroceryCartManager.groceryTypes.getParsedColorByType(groceryCartElement.getType());
        LinearLayout linLayColorIndicator = new LinearLayout(this);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(100, 100);
        params.setMargins(10,10,0,10);
        linLayColorIndicator.setLayoutParams(params);
        linLayColorIndicator.setBackgroundColor(color);
        return linLayColorIndicator;
    }


    public TextView getTextViewGroceryCartElementAmount(String amount){
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                BUTTON_CHANGE_AMOUNT_WIDTH,
                LinearLayout.LayoutParams.MATCH_PARENT,
                0.0f
        );
        params.setMargins(0,0,0,0);
        TextView textView = new TextView(this);
        textView.setGravity(Gravity.CENTER);
        textView.setTextColor(Color.parseColor("#AAAAAA"));
        textView.setLayoutParams(params);
        textView.setText(amount);
        textView.setTextSize(GROCERY_NAME_TEXT_SIZE);
        return textView;
    }

    public SeekBar getSliderRemoveGroceryCartEntry(String groceryCartElementName){
        SeekBar seekBar = new SeekBar(this);
        seekBar.setMax(SEEKBAR_MAX_VALUE);
        seekBar.setProgress(0);
        seekBar.setMinimumWidth(30);
        seekBar.setMinimumHeight(30);

        LinearLayout.LayoutParams param = new LinearLayout.LayoutParams(
                SLIDER_WIDTH,
                LinearLayout.LayoutParams.MATCH_PARENT,
                0.0f
        );
        seekBar.setLayoutParams(param);

        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) { }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) { }

            @Override
            public void onProgressChanged(SeekBar seekBar, int progress,boolean fromUser) {
                if(progress == SEEKBAR_MAX_VALUE){
                    try{
                        JSONObject entryToDelete = new JSONObject();
                        entryToDelete.put("name", groceryCartElementName);
                        GroceryCartNetworkManager.emit("deleteGroceryCartEntry", entryToDelete);
                    }
                    catch (JSONException e) {
                        System.out.println(e);
                    }
                }
            }
        });

        return seekBar;
    }

    public TextView getTextViewGroceryCartElementName(String name) {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                //LinearLayout.LayoutParams.WRAP_CONTENT,
                450,
                LinearLayout.LayoutParams.MATCH_PARENT,
                0f
        );
        params.setMargins(5,0,0,0);
        TextView textView = new TextView(this);
        textView.setGravity(Gravity.CENTER);
        textView.setTextColor(Color.parseColor("#AAAAAA"));
        textView.setLayoutParams(params);
        textView.setText(name);
        textView.setTextSize(GROCERY_NAME_TEXT_SIZE);
        return textView;
    }

    private Emitter.Listener onMessageAllGroceryData = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject data = (JSONObject) args[0];
                    try {
                        System.out.println(data);
                        String groceryTypesUnformatted = data.getString("groceryTypeEntries");
                        ArrayList<JSONObject> groceryTypes = Utils.stringJsonArrayToJsonArray(groceryTypesUnformatted);

                        String groceryCartUnformatted = data.getString("groceryCartEntries");
                        ArrayList<JSONObject> groceryCart = Utils.stringJsonArrayToJsonArray(groceryCartUnformatted);

                        String groceriesUnformatted = data.getString("groceryEntries");
                        ArrayList<JSONObject> groceries = Utils.stringJsonArrayToJsonArray(groceriesUnformatted);

                        GroceryCartManager.groceryTypes.readDataset(groceryTypes);
                        GroceryCartManager.groceryCart.readDataset(groceryCart);
                        GroceryCartManager.groceries.readDataset(groceries);

                        resetGroceryCartViewList();

                    } catch (Exception e) {
                        System.out.println(e.getStackTrace());
                        return;
                    }
                }
            });
        }
    };

    private Emitter.Listener onConnect = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    changeColorOfConnectionIndicator();
                }
            });
        }
    };

    private Emitter.Listener onDisconnect = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    changeColorOfConnectionIndicator();
                }
            });
        }
    };

    private void changeColorOfConnectionIndicator(){
        LinearLayout linLayConnectionIndicator = (LinearLayout) findViewById(R.id.ConnectionIndicator);
        if(GroceryCartNetworkManager.isConnected()){
            linLayConnectionIndicator.setBackgroundColor(Color.GREEN);
            return;
        }
        linLayConnectionIndicator.setBackgroundColor(Color.RED);
    }

}