<?php

namespace App\Support;

class Media
{
    public const DISK = 'local';

    public static function url(?string $path): ?string
    {
        if (! $path) {
            return null;
        }

        return route('media.show', ['path' => $path]);
    }
}

