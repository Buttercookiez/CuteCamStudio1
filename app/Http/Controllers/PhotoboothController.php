<?php

namespace App\Http\Controllers;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PhotoboothController extends Controller
{
    public function index()
    {
        // Clear previous session photos when starting fresh
        session()->forget('last_captured_photos');
        return view('photobooth');
    }

    public function capture(Request $request)
    {
        $request->validate([
            'photo' => 'required|string'
        ]);

        try {
            // Decode the image
            $imageData = $request->input('photo');
            $imageData = str_replace('data:image/png;base64,', '', $imageData);
            $imageData = str_replace(' ', '+', $imageData);
            $decodedImage = base64_decode($imageData);
            
            if ($decodedImage === false) {
                throw new \Exception('Invalid image data');
            }

            // Generate unique filename
            $imageName = 'photo_' . time() . '_' . Str::random(8) . '.png';
            $path = 'photos/' . $imageName;
            
            // Save the image
            Storage::disk('public')->put($path, $decodedImage);
            
            // Verify the image was saved
            if (!Storage::disk('public')->exists($path)) {
                throw new \Exception('Failed to save image');
            }

            // Store in session as an array
            $currentPhotos = session('last_captured_photos', []);
            $currentPhotos[] = $path;
            session(['last_captured_photos' => $currentPhotos]);
            
            return response()->json([
                'success' => true,
                'customize_url' => route('photobooth.customize.show'),
                'photo_count' => count($currentPhotos)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function showCustomize()
    {
        $photoPaths = session('last_captured_photos', []);
        
        if (empty($photoPaths)) {
            return redirect()->route('photobooth.index')->with('error', 'No photos found to customize');
        }
        
        $photoUrls = array_map(function($path) {
            return Storage::url($path);
        }, $photoPaths);
        
        return view('customize', [
            'photoUrls' => $photoUrls,
            'photoCount' => count($photoUrls)
        ]);
    }

    public function saveCustomizedPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|string'
        ]);
        
        // Clear previous customized photo
        if (session()->has('last_customized_photo')) {
            $oldPath = session('last_customized_photo');
            if (Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }
        }
        
        $imageData = $request->input('photo');
        $imageData = str_replace('data:image/png;base64,', '', $imageData);
        $imageData = str_replace(' ', '+', $imageData);
        
        $imageName = 'custom_' . time() . '.png';
        $path = 'photos/' . $imageName;
        Storage::disk('public')->put($path, base64_decode($imageData));
        
        // Store in session for download
        session(['last_customized_photo' => $path]);
        
        return response()->json([
            'success' => true,
            'download_url' => route('photobooth.download')
        ]);
    }

    public function download()
    {
        if (!session()->has('last_customized_photo')) {
            return redirect()->route('photobooth.index');
        }
        
        $photoPath = session('last_customized_photo');
        
        if (!Storage::disk('public')->exists($photoPath)) {
            abort(404);
        }
        
        $file = Storage::disk('public')->get($photoPath);
        $extension = pathinfo($photoPath, PATHINFO_EXTENSION);
        $mimeTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
        ];
        
        $mimeType = $mimeTypes[strtolower($extension)] ?? 'application/octet-stream';
        
        return response($file, 200, [
            'Content-Type' => $mimeType,
            'Content-Disposition' => 'attachment; filename="'.basename($photoPath).'"'
        ]);
    }

    public function gallery()
    {
        $photos = Storage::disk('public')->files('photos');
        $photos = array_filter($photos, function($file) {
            return in_array(pathinfo($file, PATHINFO_EXTENSION), ['jpg', 'jpeg', 'png']);
        });
        
        return view('gallery', [
            'photos' => array_map(function($photo) {
                return [
                    'url' => Storage::url($photo),
                    'name' => basename($photo)
                ];
            }, $photos)
        ]);
    }

    public function success($filename)
    {
        if (!Storage::disk('public')->exists('photos/' . $filename)) {
            abort(404);
        }
        
        return view('success', [
            'photoUrl' => Storage::url('photos/' . $filename)
        ]);
    }

    public function getStickers($category)
    {
        $validCategories = ['hearts', 'props', 'food', 'animals', 'words'];
        
        if (!in_array($category, $validCategories)) {
            abort(404);
        }
        
        $stickers = Storage::disk('public')->files('stickers/' . $category);
        $stickers = array_filter($stickers, function($file) {
            return in_array(pathinfo($file, PATHINFO_EXTENSION), ['png', 'svg']);
        });
        
        return response()->json([
            'stickers' => array_map(function($sticker) {
                return [
                    'url' => Storage::url($sticker),
                    'name' => basename($sticker)
                ];
            }, $stickers)
        ]);
    }

    public function getFrames($category = null)
    {
        $path = 'frames';
        if ($category && in_array($category, ['birthday', 'kawaii', 'retro', 'minimalist'])) {
            $path .= '/' . $category;
        }
        
        $frames = Storage::disk('public')->files($path);
        $frames = array_filter($frames, function($file) {
            return in_array(pathinfo($file, PATHINFO_EXTENSION), ['png', 'svg']);
        });
        
        return response()->json([
            'frames' => array_map(function($frame) {
                return [
                    'url' => Storage::url($frame),
                    'name' => basename($frame),
                    'category' => explode('/', $frame)[1] ?? 'all'
                ];
            }, $frames)
        ]);
    }

    // Add this method to handle frame generation
public function generateFramedPhoto(Request $request)
{
    $request->validate([
        'photo_urls' => 'required|array',
        'frame_color' => 'sometimes|string'
    ]);

    try {
        $photoUrls = $request->input('photo_urls');
        $frameColor = $request->input('frame_color', '#FFFFFF');
        $photoCount = count($photoUrls);

        // Create blank image based on photo count
        $frameWidth = 1200;
        $frameHeight = 1800;
        $frame = imagecreatetruecolor($frameWidth, $frameHeight);
        
        // Set frame background color
        $rgb = sscanf($frameColor, "#%02x%02x%02x");
        $bgColor = imagecolorallocate($frame, $rgb[0], $rgb[1], $rgb[2]);
        imagefill($frame, 0, 0, $bgColor);

        // Calculate photo positions based on count
        $positions = $this->calculatePhotoPositions($photoCount, $frameWidth, $frameHeight);

        // Add each photo to the frame
        foreach ($photoUrls as $index => $url) {
            $photoPath = str_replace(Storage::url(''), '', $url);
            $photoPath = 'public/' . $photoPath;
            
            if (Storage::exists($photoPath)) {
                $photoData = Storage::get($photoPath);
                $photo = imagecreatefromstring($photoData);
                
                $pos = $positions[$index];
                imagecopyresized(
                    $frame, $photo,
                    $pos['x'], $pos['y'], 
                    0, 0,
                    $pos['width'], $pos['height'],
                    imagesx($photo), imagesy($photo)
                );
                
                imagedestroy($photo);
            }
        }

        // Save the framed photo
        $framedName = 'framed_' . time() . '.png';
        $framedPath = 'photos/' . $framedName;
        
        ob_start();
        imagepng($frame);
        $imageData = ob_get_clean();
        Storage::disk('public')->put($framedPath, $imageData);
        
        imagedestroy($frame);

        return response()->json([
            'success' => true,
            'framed_url' => Storage::url($framedPath)
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], 500);
    }
}

private function calculatePhotoPositions($count, $frameWidth, $frameHeight)
{
    $positions = [];
    $padding = 20;
    
    switch ($count) {
        case 1:
            $positions[] = [
                'x' => $padding,
                'y' => $padding,
                'width' => $frameWidth - ($padding * 2),
                'height' => $frameHeight - ($padding * 2)
            ];
            break;
            
        case 2:
            $positions = [
                [
                    'x' => $padding,
                    'y' => $padding,
                    'width' => $frameWidth - ($padding * 2),
                    'height' => ($frameHeight / 2) - ($padding * 1.5)
                ],
                [
                    'x' => $padding,
                    'y' => ($frameHeight / 2) + ($padding / 2),
                    'width' => $frameWidth - ($padding * 2),
                    'height' => ($frameHeight / 2) - ($padding * 1.5)
                ]
            ];
            break;
            
        case 3:
            $positions = [
                [
                    'x' => $padding,
                    'y' => $padding,
                    'width' => $frameWidth - ($padding * 2),
                    'height' => ($frameHeight / 3) - ($padding * 1.5)
                ],
                [
                    'x' => $padding,
                    'y' => ($frameHeight / 3) + ($padding / 2),
                    'width' => ($frameWidth / 2) - ($padding * 1.5),
                    'height' => ($frameHeight / 3) - ($padding * 1.5)
                ],
                [
                    'x' => ($frameWidth / 2) + ($padding / 2),
                    'y' => ($frameHeight / 3) + ($padding / 2),
                    'width' => ($frameWidth / 2) - ($padding * 1.5),
                    'height' => ($frameHeight / 3) - ($padding * 1.5)
                ]
            ];
            break;
            
        case 4:
            $cellWidth = ($frameWidth - ($padding * 3)) / 2;
            $cellHeight = ($frameHeight - ($padding * 3)) / 2;
            
            for ($row = 0; $row < 2; $row++) {
                for ($col = 0; $col < 2; $col++) {
                    $positions[] = [
                        'x' => $padding + ($col * ($cellWidth + $padding)),
                        'y' => $padding + ($row * ($cellHeight + $padding)),
                        'width' => $cellWidth,
                        'height' => $cellHeight
                    ];
                }
            }
            break;
    }
    
    return $positions;
}
}