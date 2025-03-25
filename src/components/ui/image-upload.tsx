
import * as React from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Upload, X } from "lucide-react"

interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onImageChange?: (value: string) => void
  avatarSize?: "sm" | "md" | "lg" | "xl"
}

const getSizeClasses = (size: "sm" | "md" | "lg" | "xl") => {
  switch (size) {
    case "sm":
      return "h-12 w-12"
    case "md":
      return "h-20 w-20"
    case "lg":
      return "h-24 w-24"
    case "xl":
      return "h-32 w-32"
  }
}

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ className, value, onImageChange, avatarSize = "lg", ...props }, ref) => {
    const [preview, setPreview] = React.useState(value || "")
    const videoRef = React.useRef<HTMLVideoElement>(null)
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [isCameraOpen, setIsCameraOpen] = React.useState(false)
    const [stream, setStream] = React.useState<MediaStream | null>(null)
    const [cameraError, setCameraError] = React.useState<string | null>(null)
    
    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return
        
        const file = acceptedFiles[0]
        const reader = new FileReader()
        
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string
          setPreview(dataUrl)
          onImageChange?.(dataUrl)
        }
        
        reader.readAsDataURL(file)
      },
      [onImageChange]
    )
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.jpeg', '.jpg', '.png', '.gif']
      },
      maxSize: 5242880, // 5MB
      maxFiles: 1
    })

    const openCamera = async () => {
      try {
        setCameraError(null)
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: "user"
          }
        }
        
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        setStream(mediaStream)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          videoRef.current.style.display = "block" // Ensure video is visible
          
          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch(err => {
                console.error("Failed to play video:", err)
                setCameraError("Failed to start video stream")
              })
            }
          }
        }
        
        setIsCameraOpen(true)
      } catch (error) {
        console.error("Error accessing camera:", error)
        setCameraError("Could not access camera. Please check camera permissions.")
      }
    }

    const closeCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      setIsCameraOpen(false)
      setCameraError(null)
    }

    const captureImage = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current
        const canvas = canvasRef.current
        
        // Wait until video dimensions are available
        if (video.videoWidth === 0 || video.videoHeight === 0) {
          console.log("Waiting for video dimensions...")
          setTimeout(captureImage, 100)
          return
        }
        
        const context = canvas.getContext('2d')

        if (context) {
          // Set canvas size to match video dimensions
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          
          // Draw the current video frame to the canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Convert canvas to data URL with higher quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
          
          // Update the preview and trigger onChange
          setPreview(dataUrl)
          onImageChange?.(dataUrl)
          
          // Close the camera
          closeCamera()
        }
      }
    }

    React.useEffect(() => {
      // Update preview when value changes externally
      if (value !== undefined && value !== preview) {
        setPreview(value)
      }
      
      return () => {
        // Cleanup function to ensure camera is closed when component unmounts
        if (stream) {
          stream.getTracks().forEach(track => track.stop())
        }
      }
    }, [stream, value, preview])
    
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center gap-4", className)}
        {...props}
      >
        <div 
          {...getRootProps()} 
          className={cn(
            "relative cursor-pointer transition-all group",
            isDragActive && "opacity-70"
          )}
        >
          <input {...getInputProps()} />
          <Avatar className={cn("border-4 border-primary/20", getSizeClasses(avatarSize))}>
            {preview ? (
              <AvatarImage src={preview} />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                <Upload className="h-6 w-6" />
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <Upload className="h-6 w-6 text-white" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              const input = document.createElement('input')
              input.type = 'file'
              input.accept = 'image/*'
              input.onchange = (event) => {
                const file = (event.target as HTMLInputElement).files?.[0]
                if (!file) return
                
                const reader = new FileReader()
                reader.onload = (e) => {
                  const dataUrl = e.target?.result as string
                  setPreview(dataUrl)
                  onImageChange?.(dataUrl)
                }
                reader.readAsDataURL(file)
              }
              input.click()
            }}
            className="px-2 h-8 text-xs"
          >
            <Upload className="mr-1 h-4 w-4" />
            Upload
          </Button>
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.preventDefault()
              openCamera()
            }}
            className="px-2 h-8 text-xs"
          >
            <Camera className="mr-1 h-4 w-4" />
            Camera
          </Button>
        </div>

        {isCameraOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card p-4 rounded-lg shadow-lg max-w-xl w-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Take a Photo</h3>
                <Button variant="ghost" size="icon" onClick={closeCamera}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {cameraError ? (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-3">
                  {cameraError}
                </div>
              ) : null}
              
              <div className="relative rounded-lg overflow-hidden mb-4 bg-black aspect-video flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-h-full max-w-full"
                />
                {!stream && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 justify-center">
                <Button 
                  onClick={captureImage} 
                  className="flex-1"
                  disabled={!stream || !!cameraError}
                >
                  Capture
                </Button>
                <Button variant="outline" onClick={closeCamera} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}
      </div>
    )
  }
)

ImageUpload.displayName = "ImageUpload"

export { ImageUpload }
