package com.swiftbarbird;

import android.widget.Toast;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import android.Manifest;
import android.app.Activity;
import android.content.AsyncQueryHandler;
import android.content.ContentResolver;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.net.Uri;
import android.provider.CallLog;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import android.os.Build;
import java.util.*;
import java.text.*;
import com.alibaba.fastjson.JSON;

public class GetContactList extends ReactContextBaseJavaModule {
    private ReactApplicationContext reactContext;
    public GetContactList(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }
    @Override 
    public String getName() {
        return "GetContact";
    }

    private boolean getPersimmionInfoAndGetList() {
        Activity currentActivity = getCurrentActivity();
        if (Build.VERSION.SDK_INT >= 23) {
            //1. 检测是否添加权限   PERMISSION_GRANTED  表示已经授权并可以使用
            if (ContextCompat.checkSelfPermission(currentActivity, Manifest.permission.READ_CALL_LOG) != PackageManager.PERMISSION_GRANTED) {
                //手机为Android6.0的版本,权限未授权去i请授权
                //2. 申请请求授权权限
                //1. Activity
                // 2. 申请的权限名称
                // 3. 申请权限的 请求码
                ActivityCompat.requestPermissions(currentActivity, new String[]
                    {Manifest.permission.READ_CALL_LOG//通话记录
                    }, 1005);
                return false;
            } else {//手机为Android6.0的版本,权限已授权可以使用
                // 执行下一步
                return true;
            }
        } else {//手机为Android6.0以前的版本，可以使用
            return true;
        }
    }

    private WritableArray getDataList() {
        Activity currentActivity = getCurrentActivity();
        // 1.获得ContentResolver
        ContentResolver resolver = currentActivity.getContentResolver();
        // 2.利用ContentResolver的query方法查询通话记录数据库
        /**
         * @param uri 需要查询的URI，（这个URI是ContentProvider提供的）
         * @param projection 需要查询的字段
         * @param selection sql语句where之后的语句
         * @param selectionArgs ?占位符代表的数据
         * @param sortOrder 排序方式
         * 
         */
        Cursor cursor = resolver.query(CallLog.Calls.CONTENT_URI, // 查询通话记录的URI
            new String[] { CallLog.Calls.CACHED_NAME// 通话记录的联系人
                , CallLog.Calls.NUMBER// 通话记录的电话号码
                , CallLog.Calls.DATE// 通话记录的日期
                , CallLog.Calls.DURATION// 通话时长
                , CallLog.Calls.TYPE }// 通话类型
            , null, null, CallLog.Calls.DEFAULT_SORT_ORDER// 按照时间逆序排列，最近打的最先显示
        );
        // 3.通过Cursor获得数据
        WritableArray list = new WritableNativeArray();
        while (cursor.moveToNext()) {
          String name = cursor.getString(cursor.getColumnIndex(CallLog.Calls.CACHED_NAME));
          String number = cursor.getString(cursor.getColumnIndex(CallLog.Calls.NUMBER));
          long dateLong = cursor.getLong(cursor.getColumnIndex(CallLog.Calls.DATE));
          String date = new SimpleDateFormat("yyyy-MM-dd HH-mm-ss").format(new Date(dateLong));
          int duration = cursor.getInt(cursor.getColumnIndex(CallLog.Calls.DURATION));
          int type = cursor.getInt(cursor.getColumnIndex(CallLog.Calls.TYPE));
          String typeString = "";
          switch (type) {
          case CallLog.Calls.INCOMING_TYPE:
            typeString = "打入";
            break;
          case CallLog.Calls.OUTGOING_TYPE:
            typeString = "打出";
            break;
          case CallLog.Calls.MISSED_TYPE:
            typeString = "未接";
            break;
          default:
            break;
          }
          Map<String, String> map = new HashMap<String, String>();
          map.put("name", (name == null) ? "未备注联系人" : name);
          map.put("number", number);
          map.put("date", date);
          map.put("duration", (duration / 60) + "分钟");
          map.put("type", typeString);
          list.pushString(JSON.toJSONString(map));
        }
        return list;
      }

    @ReactMethod
    public void getCallLogs(String message, Callback Callback) {
        if (!getPersimmionInfoAndGetList()) {
            Callback.invoke("null");
        } else {
            WritableArray list = getDataList();
            Callback.invoke(list);
        }
        
    }
}