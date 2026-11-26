package com.novem.ever.yours

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.Bundle
import android.view.Gravity
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView
import android.content.Intent

class MainActivity : Activity() {
    private lateinit var webView: WebView
    private lateinit var loading: LinearLayout
    private lateinit var errorPanel: LinearLayout
    private var pageFailed = false

    companion object {
        private const val HOME = "https://wryoualdi.github.io/-novem-ever-yours-/"
        private const val HOST = "wryoualdi.github.io"
        private const val IVORY = 0xFFF7F0EA.toInt()
        private const val BURGUNDY = 0xFF713044.toInt()
        private const val SAGE = 0xFF71805D.toInt()
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.statusBarColor = IVORY
        window.navigationBarColor = IVORY
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR or View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR

        val root = FrameLayout(this).apply { setBackgroundColor(IVORY) }
        webView = WebView(this).apply {
            setBackgroundColor(IVORY)
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.loadsImagesAutomatically = true
            settings.mediaPlaybackRequiresUserGesture = false
            settings.javaScriptCanOpenWindowsAutomatically = true
            settings.setSupportMultipleWindows(false)
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val uri = request.url
                    if (uri.scheme == "https" && uri.host == HOST) return false
                    if (uri.scheme == "http" || uri.scheme == "https") {
                        startActivity(Intent(Intent.ACTION_VIEW, uri))
                        return true
                    }
                    return true
                }

                override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                    pageFailed = false
                    loading.visibility = View.VISIBLE
                    errorPanel.visibility = View.GONE
                }

                override fun onPageFinished(view: WebView, url: String?) {
                    loading.visibility = View.GONE
                    if (!pageFailed) webView.visibility = View.VISIBLE
                }

                override fun onReceivedError(view: WebView, request: WebResourceRequest, error: WebResourceError) {
                    if (request.isForMainFrame) showError()
                }
            }
            webChromeClient = WebChromeClient()
        }

        loading = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setBackgroundColor(IVORY)
            addView(TextView(this@MainActivity).apply {
                text = "D 27"
                textSize = 34f
                setTextColor(BURGUNDY)
                typeface = Typeface.create("serif", Typeface.ITALIC)
                gravity = Gravity.CENTER
            })
            addView(TextView(this@MainActivity).apply {
                text = "DAISY  •  ALWAYS"
                textSize = 11f
                letterSpacing = 0.22f
                setTextColor(SAGE)
                gravity = Gravity.CENTER
                setPadding(0, 8, 0, 22)
            })
            addView(ProgressBar(this@MainActivity).apply { indeterminateTintList = android.content.res.ColorStateList.valueOf(BURGUNDY) })
        }

        errorPanel = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(32, 24, 32, 24)
            setBackgroundColor(IVORY)
            addView(TextView(this@MainActivity).apply {
                text = "D 27"
                textSize = 32f
                setTextColor(BURGUNDY)
                typeface = Typeface.create("serif", Typeface.ITALIC)
                gravity = Gravity.CENTER
            })
            addView(TextView(this@MainActivity).apply {
                text = "Website belum dapat dimuat. Periksa koneksi internet, lalu coba lagi."
                textSize = 15f
                setTextColor(BURGUNDY)
                gravity = Gravity.CENTER
                setPadding(0, 18, 0, 18)
            })
            addView(Button(this@MainActivity).apply {
                text = "Coba lagi"
                setOnClickListener {
                    pageFailed = false
                    errorPanel.visibility = View.GONE
                    loading.visibility = View.VISIBLE
                    webView.reload()
                }
            })
        }

        root.addView(webView, FrameLayout.LayoutParams(-1, -1))
        root.addView(loading, FrameLayout.LayoutParams(-1, -1))
        root.addView(errorPanel, FrameLayout.LayoutParams(-1, -1).apply { gravity = Gravity.CENTER })
        errorPanel.visibility = View.GONE
        webView.visibility = View.INVISIBLE
        setContentView(root)

        if (savedInstanceState != null) webView.restoreState(savedInstanceState)
        else webView.loadUrl(HOME)
    }

    private fun showError() {
        pageFailed = true
        loading.visibility = View.GONE
        webView.visibility = View.INVISIBLE
        errorPanel.visibility = View.VISIBLE
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) webView.goBack()
        else super.onBackPressed()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        if (::webView.isInitialized) webView.saveState(outState)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        if (::webView.isInitialized) {
            webView.stopLoading()
            webView.destroy()
        }
        super.onDestroy()
    }
}
