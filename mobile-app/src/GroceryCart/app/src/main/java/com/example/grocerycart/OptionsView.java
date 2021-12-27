package com.example.grocerycart;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class OptionsView extends AppCompatActivity {

    private String remoteHost = "";
    private String userPassword = "";

    private String username = "";
    private String password = "";
    private String socketPath = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.options_view);
        getSupportActionBar().hide();

        setChangeRemoteHostButtonAction();
        setChangeSocketPathButtonAction();
        setChangeUsernameButtonAction();
        setChangePasswordButtonAction();

        setTextViewRemoteHost();
        setTextViewSocketPath();
        setTextViewUsername();
        setTextViewPassword();

        setEditTextChangeRemoteHostAction();
        setEditTextChangeSocketPathAction();
        setEditTextChangeUsernameAction();
        setEditTextChangePasswordAction();

        setButtonGoToAction(R.id.buttonGoToGroceryCartView, GroceryCartView.class);
    }

    public void setChangeRemoteHostButtonAction(){
        Button btn = (Button)findViewById(R.id.buttonSetRemoteHost);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("remoteHost", remoteHost);
                editor.commit();

                GroceryCartNetworkManager.handleChangeRemoteHost(remoteHost);
                setTextViewRemoteHost();

                EditText et = (EditText) findViewById(R.id.editTextRemoteHost);
                et.setText("");
            }
        });
    }

    public void setChangeSocketPathButtonAction(){
        Button btn = (Button)findViewById(R.id.buttonSetSocketPath);
        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(socketPath.length() > 0 && socketPath.charAt(0) != '/'){
                    socketPath = "/" + socketPath;
                }
                SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("socketPath", socketPath);
                editor.commit();
                GroceryCartNetworkManager.handleChangeSocketPath(socketPath);
                setTextViewSocketPath();

                EditText et = (EditText) findViewById(R.id.editTextSocketPath);
                et.setText("");
            }
        });
    }

    public void setChangeUsernameButtonAction(){
        Button btn = (Button)findViewById(R.id.buttonSetUsername);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("username", username);
                editor.commit();

                GroceryCartNetworkManager.handleChangeUsername(username);
                setTextViewUsername();

                EditText et = (EditText) findViewById(R.id.editTextUsername);
                et.setText("");
            }
        });
    }

    public void setChangePasswordButtonAction(){
        Button btn = (Button)findViewById(R.id.buttonSetPassword);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("password", password);
                editor.commit();

                GroceryCartNetworkManager.handleChangePassword(password);
                setTextViewPassword();

                EditText et = (EditText) findViewById(R.id.editTextPassword);
                et.setText("");
            }
        });
    }

    public void setTextViewRemoteHost(){
        TextView et = (TextView) findViewById(R.id.textViewRemoteHost);
        if(GroceryCartNetworkManager.isRemoteHostErrorTextSet()){
            et.setText(GroceryCartNetworkManager.getRemoteHostErrorText());
        }
        else if(!GroceryCartNetworkManager.isRemoteHostSet()){
            et.setText("No Remote Host set");
        }
        else{
            et.setText(GroceryCartNetworkManager.remoteHost);
        }
    }

    public void setTextViewSocketPath(){
        TextView et = (TextView) findViewById(R.id.textViewSocketPath);
        et.setText(GroceryCartNetworkManager.socketPath);
    }

    public void setTextViewUsername(){
        TextView et = (TextView) findViewById(R.id.textViewUsername);
        et.setText(GroceryCartNetworkManager.username);
    }

    public void setTextViewPassword(){
        TextView et = (TextView) findViewById(R.id.textViewPassword);
        et.setText(getHiddenText(GroceryCartNetworkManager.password));
    }

    private String getHiddenText(String text){
        String hiddenText = "";
        for(int i = 0; i < text.length(); i++){
            hiddenText += "*";
        }
        return hiddenText;
    }

    public void setEditTextChangeRemoteHostAction(){
        EditText et = (EditText) findViewById(R.id.editTextRemoteHost);
        et.addTextChangedListener(new TextWatcher() {

            public void afterTextChanged(Editable s) {}

            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                remoteHost = s.toString();
            }
        });
    }

    public void setEditTextChangeSocketPathAction(){
        EditText et = (EditText) findViewById(R.id.editTextSocketPath);
        et.addTextChangedListener(new TextWatcher() {

            public void afterTextChanged(Editable s) {}

            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                socketPath = s.toString();
            }
        });
    }

    public void setEditTextChangeUsernameAction(){
        EditText et = (EditText) findViewById(R.id.editTextUsername);
        et.addTextChangedListener(new TextWatcher() {

            public void afterTextChanged(Editable s) {}

            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                username = s.toString();
            }
        });
    }

    public void setEditTextChangePasswordAction(){
        EditText et = (EditText) findViewById(R.id.editTextPassword);
        et.addTextChangedListener(new TextWatcher() {

            public void afterTextChanged(Editable s) {}

            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

            public void onTextChanged(CharSequence s, int start, int before, int count) {
                password = s.toString();
            }
        });
    }

    public void setButtonGoToAction(int buttonId, Class destinationClass){
        Button btn = (Button)findViewById(buttonId);

        btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                startActivity(new Intent(OptionsView.this, destinationClass));
            }
        });
    }
}