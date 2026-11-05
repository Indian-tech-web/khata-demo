package com.sugarkhata.demo;

import android.content.Context;
import android.os.Bundle;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

  public class PrintBridge {
    @JavascriptInterface
    public void print() {
      runOnUiThread(new Runnable() {
        @Override
        public void run() {
          WebView web = getBridge().getWebView();
          PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
          PrintDocumentAdapter adapter = web.createPrintDocumentAdapter("Sugar Khata Bill");
          PrintAttributes attrs = new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build();
          pm.print("Sugar Khata Bill", adapter, attrs);
        }
      });
    }
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    getBridge().getWebView().addJavascriptInterface(new PrintBridge(), "AndroidPrint");
  }
}
