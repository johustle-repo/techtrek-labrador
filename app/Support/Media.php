<?php

namespace App\Support;

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Media
{
    public const DISK = 'local';

    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        // Already an absolute / external URL.
        if (Str::startsWith($path, ['http://', 'https://', '//'])) {
            return $path;
        }

        // Public URL path already provided.
        if (Str::startsWith($path, ['/'])) {
            return $path;
        }

        static $existsCache = [];

        if (! array_key_exists($path, $existsCache)) {
            $existsCache[$path] = Storage::disk(self::DISK)->exists($path)
                || Storage::disk('public')->exists($path)
                || File::exists(public_path($path));
        }

        if (! $existsCache[$path]) {
            return null;
        }

        // Some legacy records store direct files in /public.
        if (File::exists(public_path($path))) {
            return asset($path);
        }

        return route('media.show', ['path' => $path]);
    }
}
