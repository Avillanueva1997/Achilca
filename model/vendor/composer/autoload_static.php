<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInit7bb33c55967c7ca7c6e8bfe5d3228bec
{
    public static $prefixLengthsPsr4 = array (
        'P' => 
        array (
            'PHPMailer\\PHPMailer\\' => 20,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'PHPMailer\\PHPMailer\\' => 
        array (
            0 => __DIR__ . '/..' . '/phpmailer/phpmailer/src',
        ),
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInit7bb33c55967c7ca7c6e8bfe5d3228bec::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInit7bb33c55967c7ca7c6e8bfe5d3228bec::$prefixDirsPsr4;

        }, null, ClassLoader::class);
    }
}