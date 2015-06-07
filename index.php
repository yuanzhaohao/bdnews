<?php
ini_set('display_errors', 1);
error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);

$root = dirname(__FILE__) . DIRECTORY_SEPARATOR;
require_once $root . "rewrite" . DIRECTORY_SEPARATOR . "Rewrite.php";
$path = $_SERVER['REQUEST_URI'];

if(!Rewrite::match($path)){
    if(($pos = strpos($path, '?')) !== false){
        $path = substr($path, 0, $pos);
    }
    if('/' === $path){
        echo 'index';
    } else {
        $len = strlen($path) - 1;
        if('/' === $path{$len}){
            $path = substr($path, 0, $len);
        }
        $split = explode('/', $path);
        if('static' === $split[1]){
            $file = $root . substr($path, 1);
            if(is_file($file)){
                $content_type = 'Content-Type: ';
                $pos = strrpos($file, '.');
                if(false !== $pos){
                    $ext = substr($file, $pos + 1);
                    $MIME = array(
                             'bmp' => 'image/bmp',
                             'css' => 'text/css',
                             'doc' => 'application/msword',
                             'dtd' => 'text/xml',
                             'gif' => 'image/gif',
                             'hta' => 'application/hta',
                             'htc' => 'text/x-component',
                             'htm' => 'text/html',
                            'html' => 'text/html',
                           'xhtml' => 'text/html',
                             'tpl' => 'text/html',
                             'ico' => 'image/x-icon',
                             'jpe' => 'image/jpeg',
                            'jpeg' => 'image/jpeg',
                             'jpg' => 'image/jpeg',
                              'js' => 'text/javascript',
                            'json' => 'application/json',
                             'jsp' => 'text/html',
                           'mocha' => 'text/javascript',
                             'mp3' => 'audio/mp3',
                             'mp4' => 'video/mpeg4',
                            'mpeg' => 'video/mpg',
                             'mpg' => 'video/mpg',
                        'manifest' => 'text/cache-manifest',
                             'pdf' => 'application/pdf',
                             'png' => 'image/png',
                             'ppt' => 'application/vnd.ms-powerpoint',
                            'rmvb' => 'application/vnd.rn-realmedia-vbr',
                              'rm' => 'application/vnd.rn-realmedia',
                             'rtf' => 'application/msword',
                             'svg' => 'image/svg+xml',
                             'swf' => 'application/x-shockwave-flash',
                             'tif' => 'image/tiff',
                            'tiff' => 'image/tiff',
                             'txt' => 'text/plain',
                             'vml' => 'text/xml',
                            'vxml' => 'text/xml',
                             'wav' => 'audio/wav',
                             'wma' => 'audio/x-ms-wma',
                             'wmv' => 'video/x-ms-wmv',
                             'xml' => 'text/xml',
                             'xls' => 'application/vnd.ms-excel',
                              'xq' => 'text/xml',
                             'xql' => 'text/xml',
                          'xquery' => 'text/xml',
                             'xsd' => 'text/xml',
                             'xsl' => 'text/xml',
                            'xslt' => 'text/xml'
                    );
                    $content_type .= $MIME[$ext] ? $MIME[$ext] : 'application/x-' . $ext;
                } else {
                    $content_type .= 'text/plain';
                }
                header($content_type);
                echo file_get_contents($file);
            } else {
                header('Status: 404 File Not Found');
            }
        } else {
            $last = array_pop($split);
            $len = count($split);
            // $file = $root . 'template' . $path;
            $file = $root . $path;
            $content_type = 'Content-Type: text/html';
            header($content_type);
            echo file_get_contents($file);
        }
    }
}
