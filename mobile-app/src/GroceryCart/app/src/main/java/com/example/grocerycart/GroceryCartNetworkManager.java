package com.example.grocerycart;

import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.net.URI;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import android.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import okhttp3.OkHttpClient;
import io.socket.engineio.client.transports.WebSocket;


public class GroceryCartNetworkManager extends AppCompatActivity {

    public static String remoteHost = "";
    public static String socketPath = "";
    public static String username = "";
    public static String password = "";

    public static String remoteHostErrorText = "";

    private static Socket socket;

    public static void handleChangeRemoteHost(String newRemoteHost) {
        setRemoteHost(newRemoteHost);

        if(!isRemoteHostValidURI()){
            remoteHostErrorText = remoteHost + " is invalid";
            socket.disconnect();
            return;
        }
        remoteHostErrorText = "";
        resetSocket();
    }

    public static void handleChangeSocketPath(String socketPath){
        setSocketPath(socketPath);
        resetSocket();
    }

    public static void handleChangeUsername(String username){
        setUsername(username);
        resetSocket();
    }

    public static void handleChangePassword(String password){
        setPassword(password);
        resetSocket();
    }


    public static void setupSocket() {
        try {
            if(!isRemoteHostValidURI()) return;
            IO.Options socketIoOptions = getOptionsAcceptAll();
            socket = IO.socket(remoteHost,socketIoOptions);
            socket.connect();
        }
        catch (URISyntaxException e){
            System.out.println("Error when trying to connect to " + remoteHost);
            System.out.println(e.getStackTrace());
        }
    }

    public static void resetSocket() {
        if(isSocketDefined()){
            System.out.println("DISCONNECT SOCKET DUE TO RESET");
            socket.disconnect();
        }
        setupSocket();
    }

    public static void setRemoteHost(String newRemoteHost){
        remoteHost = newRemoteHost;
    }
    public static void setSocketPath(String newSocketPath){
        socketPath = newSocketPath;
    }
    public static void setUsername(String newUsername){
        username = newUsername;
    }
    public static void setPassword(String newPassword){
        password = newPassword;
    }


    public static void startListener(String messageListenTo, Emitter.Listener fn){
        if(!isSocketDefined() || socket.hasListeners(messageListenTo)) return;
        socket.on(messageListenTo, fn);
    }

    public static void stopListener(String messageListenTo){
        if(!isSocketDefined() || !socket.hasListeners(messageListenTo)) return;
        socket.off(messageListenTo);
    }

    public static void emit(String messageId){
        if(!isSocketDefined()) return;
        socket.emit(messageId);
    }
    public static void emit(String messageId, JSONObject object){
        if(!isSocketDefined()) return;
        socket.emit(messageId, object);
    }

    public static boolean isSocketDefined(){
        return socket != null;
    }

    public static boolean isRemoteHostValidURI(){
        try{
            // throws error if remoteHost is not valid uri
            URL url = new URL(remoteHost);
            return true;
        }
        catch(MalformedURLException e){
            System.out.println(e);
            return false;
        }
    }

    public static boolean isConnected(){
        if(!isSocketDefined()) return false;
        return socket.connected();
    }

    public static boolean isRemoteHostErrorTextSet(){
        return remoteHostErrorText.length() > 0;
    }

    public static String getRemoteHostErrorText(){
        return remoteHostErrorText;
    }

    public static boolean isRemoteHostSet(){
        return remoteHost.length() > 0;
    }

    // https://stackoverflow.com/questions/37826728/socket-io-client-in-android-connection-with-https-protocol-failed
    private static IO.Options getOptionsAcceptAll(){
        HostnameVerifier myHostnameVerifier = new HostnameVerifier() {
            @Override
            public boolean verify(String hostname, SSLSession session) {
                return true;
            }
        };
        TrustManager[] trustAllCerts= new TrustManager[] { new X509TrustManager() {
            public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            }

            public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
            }

            public X509Certificate[] getAcceptedIssuers() {
                return new X509Certificate[0];
            }
        }};

        SSLContext mySSLContext = null;
        try {
            mySSLContext = SSLContext.getInstance("TLS");
            try {
                mySSLContext.init(null, trustAllCerts, null);
            } catch (KeyManagementException e) {
                e.printStackTrace();
            }
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        OkHttpClient okHttpClient = new OkHttpClient.Builder().hostnameVerifier(myHostnameVerifier).sslSocketFactory(mySSLContext.getSocketFactory()).build();

        // default settings for all sockets
        IO.setDefaultOkHttpWebSocketFactory(okHttpClient);
        IO.setDefaultOkHttpCallFactory(okHttpClient);

        String userPassword = username + ":" + password;
        String userPasswordEncoded = Base64.encodeToString(userPassword.getBytes(), Base64.NO_WRAP);
        // set as an option
        IO.Options opts = new IO.Options();
        opts.path = socketPath;
        opts.callFactory = okHttpClient;
        opts.webSocketFactory = okHttpClient;
        opts.extraHeaders = Collections.singletonMap("authorization", Collections.singletonList("Basic " + userPasswordEncoded));

        return opts;
    }
}



