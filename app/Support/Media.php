<?php

namespace App\Support;

use Illuminate\Support\Facades\Storage;

class Media
{
    public const DISK = 'local';

    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        static $existsCache = [];

        if (! array_key_exists($path, $existsCache)) {
            $existsCache[$path] = Storage::disk(self::DISK)->exists($path)
                || Storage::disk('public')->exists($path);
        }

        if (! $existsCache[$path]) {
            return null;
        }

        return route('media.show', ['path' => $path]);
    }
}
