<?php

namespace App\Http\Controllers;

use App\Support\Media;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;

class MediaController extends Controller
{
    public function show(Request $request, string $path): Response
    {
        // Block traversal and absolute path attempts.
        abort_if(str_contains($path, '..') || str_starts_with($path, '/'), 404);

        if (Storage::disk(Media::DISK)->exists($path)) {
            return Storage::disk(Media::DISK)->response($path);
        }

        // Legacy fallback for old uploads already stored on public disk.
        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->response($path);
        }

        abort(404);
    }
}
