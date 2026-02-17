<?php

namespace App\Enums;

enum UserRole: string
{
    case SUPER_ADMIN = 'super_admin';
    case LGU_ADMIN = 'lgu_admin';
    case BUSINESS_OWNER = 'business_owner';
    case TOURIST = 'tourist';
    case VISITOR = 'visitor';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_map(
            static fn (self $role): string => $role->value,
            self::cases(),
        );
    }

    /**
     * @return list<string>
     */
    public static function cmsRoles(): array
    {
        return [
            self::LGU_ADMIN->value,
            self::SUPER_ADMIN->value,
        ];
    }
}
