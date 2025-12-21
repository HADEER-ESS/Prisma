package com.prismamodule

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Path
import android.graphics.Rect
import android.graphics.RectF
import com.facebook.fbreact.specs.NativeCropToOvalImageSpec
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import androidx.core.graphics.createBitmap
import java.io.File
import java.io.FileOutputStream

class NativeCropToOvalImageModule (
     reactContext :  ReactApplicationContext
): NativeCropToOvalImageSpec(reactContext) {
    override fun getName() = NAME
    override fun cropToOvalImage(
        imageUri: String?,
        ovalWidth: Double,
        ovalHeight: Double,
        ovalX: Double,
        ovalY: Double,
        screenWidth: Double,
        screenHeight: Double,
        promise: Promise?
    ) {
        try {
            val path = imageUri?.replace("file://" , "")
            val bitmap = BitmapFactory.decodeFile(path)

            if(bitmap == null){
                promise?.reject("IMAGE_LOAD_ERROR_GET_NULL", "Failed to load image")
                return
            }

            val scaleX = bitmap.width.toFloat() / screenWidth.toFloat()
            val scaleY = bitmap.height.toFloat() / screenHeight.toFloat()

            // Mirror X coordinate for front camera (image is flipped horizontally)
            val mirroredOvalX = screenWidth - ovalX - ovalWidth
            
            val cropX = (mirroredOvalX * scaleX - ovalX*2).toInt()
            val cropY = (ovalY * scaleY).toInt()
            val cropWidth = ((ovalWidth * scaleX) - (cropX/1.8)).toInt()
            val cropHeight = ((ovalHeight * scaleY) + (cropY/3)).toInt()

            if( cropX < 0 ||
                cropY < 0 ||
                cropX + cropWidth > bitmap.width ||
                cropY + cropHeight > bitmap.height
                ){
                promise?.reject("INVALID_CROP_SCALING", "Crop region exceed image bounds")
                return
            }

            //CREATE a BITMAP with cropping OVAL, and white background
            val outputBitmap = createBitmap(cropWidth, cropHeight)
            val canvas = Canvas(outputBitmap)

            canvas.drawColor(Color.WHITE)

            //OVAL path
            val ovalPath = Path()
            val ovalRect = RectF(0f,0f,cropWidth.toFloat(), cropHeight.toFloat())
            ovalPath.addOval(ovalRect, Path.Direction.CW)

            canvas.clipPath(ovalPath)

            val srcRect = Rect(cropX, cropY, cropX+cropWidth, cropY+cropHeight)
            val dstRect = Rect(0,0,cropWidth, cropHeight)
            canvas.drawBitmap(bitmap, srcRect, dstRect, null)

            val outputFile = File(
                reactApplicationContext.cacheDir,
                "oval_cropped_${System.currentTimeMillis()}.jpg"
            )
            FileOutputStream(outputFile).use { out ->
                outputBitmap.compress(Bitmap.CompressFormat.JPEG, 90 , out)
            }

            bitmap.recycle()
            outputBitmap.recycle()

            promise?.resolve("file://${outputFile.absolutePath}")

        }catch (error : Exception){
            promise?.reject("CROP_ERROR_CATCH", "Failed to crop image: ${error.message}", error)
        }
    }

    companion object{
        const val NAME = "NativeCropToOvalImage"
    }
}