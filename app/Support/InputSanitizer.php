<?php

namespace App\Support;

class InputSanitizer
{
    /**
     * Remove HTML tags and trim whitespace.
     */
    public static function plain(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $clean = trim(strip_tags($value));

        return $clean === '' ? null : $clean;
    }
}
