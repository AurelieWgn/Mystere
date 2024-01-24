package com.mystere

import android.content.Intent
import android.provider.Settings
import androidx.core.app.ActivityCompat.startActivityForResult
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.*
import android.app.AlarmManager
import android.content.Context
import android.net.Uri

class AlarmModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AlarmModule"
    }

    @ReactMethod
    fun requestPermission(promise: Promise) {
        val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
        intent.data = Uri.parse("package:" + reactApplicationContext.packageName)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
        if (intent.resolveActivity(reactApplicationContext.packageManager) != null) {
            reactApplicationContext.startActivity(intent)
            promise.resolve(true) // Permission requested
        } else {
            promise.reject("ERROR", "Feature not available on this device.") // Feature not available or error occurred.
        }
       
    }

    @ReactMethod
    fun hasScheduleExactAlarmPermission(promise: Promise) {
        val alarmManager = reactApplicationContext.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val hasPermission = alarmManager.canScheduleExactAlarms()
        promise.resolve(hasPermission)
    }
}

