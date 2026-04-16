package com.nx036

import android.app.Application
import android.preference.PreferenceManager
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Waydroid: always point Metro bundler to host bridge IP
    if (BuildConfig.DEBUG) {
      PreferenceManager.getDefaultSharedPreferences(this)
        .edit()
        .putString("debug_http_host", "192.168.240.1:8081")
        .apply()
    }
    loadReactNative(this)
  }
}
