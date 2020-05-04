<?php

function toFixed($number, $decimals) {
    return number_format($number, $decimals, '.', "");
}

function toChangeMonth($month){

    $MonthSpanish = '';

    switch ($month) {
        case '01':
            $MonthSpanish = 'Ene';
            break;
        case '02':
            $MonthSpanish = 'Feb';
            break;    
        case '03':
            $MonthSpanish = 'Mar';
            break;    
        case '04':
            $MonthSpanish = 'Abr';
            break;    
        case '05':
            $MonthSpanish = 'May';
            break;    
        case '06':
            $MonthSpanish = 'Jun';
            break;    
        case '07':
            $MonthSpanish = 'Jul';
            break;        
        case '08':
            $MonthSpanish = 'Ago';
            break; 
        case '09':   
            $MonthSpanish = 'Set';
            break;    
        case '10':
            $MonthSpanish = 'Oct';
            break;    
        case '11':
            $MonthSpanish = 'Nov';
            break;    
        case '12':
            $MonthSpanish = 'Dic';
            break;    
    }

    return $MonthSpanish;
}

function reduceMonth($month){
    $monthR = '';
    switch ($month) {
        case 'ENERO':
            $monthR = 'Ene';
            break;
        case 'FEBRERO':
            $monthR = 'Feb';
            break;
        case 'MARZO':
            $monthR = 'Mar';
            break;
        case 'ABRIL':
            $monthR = 'Abr';
            break;
        case 'MAYO':
            $monthR = 'May';
            break;
        case 'JUNIO':
            $monthR = 'Jun';
            break;
        case 'JULIO':
            $monthR = 'Jul';
            break;
        case 'AGOSTO':
            $monthR = 'Ago';
            break;
        case 'SETIEMBRE':
            $monthR = 'Set';
            break;
        case 'OCTUBRE':
            $monthR = 'Oct';
            break;
        case 'NOVIEMBRE':
            $monthR = 'Nov';
            break;
        case 'DICIEMBRE':
            $monthR = 'Dic';
            break;
    }

    return $monthR;
}

function GetTrimestre($month){
    $trimestre = '';
    switch ($month) {
        case '01':
        case '02':
        case '03':
            $trimestre = '01';
            break;
        case '04':
        case '05':
        case '06':
            $trimestre = '02';
            break;
        case '07':
        case '08':
        case '09':
            $trimestre = '03';
            break;
        case '10':
        case '11':
        case '12':
            $trimestre = '04';
            break;
    }

    return $trimestre;
}

$separator = md5(time());
$eol = PHP_EOL;

function setHeadersMail($from){
	global $separator, $eol;

	$headers = "From: " . $from . $eol;
	$headers .= "MIME-Version: 1.0" . $eol;
	$headers .= "Content-Type: multipart/mixed; boundary=\"" . $separator . "\"" . $eol . $eol;

	return $headers;
}

function setBodyMail($message, $filename, $attachment){
	global $separator, $eol;

	$body = '';
	$body .= "Content-Transfer-Encoding: 7bit" . $eol;
	$body .= "This is a MIME encoded message." . $eol; //had one more .$eol
	$body .= "--" . $separator . $eol;
	$body .= "Content-Type: text/html; charset=\"UTF-8\"" . $eol;
	$body .= "Content-Transfer-Encoding: 8bit" . $eol . $eol;
	$body .= $message . $eol;
	$body .= "--" . $separator . $eol;
	$body .= "Content-Type: application/octet-stream; name=\"" . $filename . "\"" . $eol;
	$body .= "Content-Transfer-Encoding: base64" . $eol;
	$body .= "Content-Disposition: attachment" . $eol . $eol;
	$body .= $attachment . $eol;
	$body .= "--" . $separator . "--";

	return $body;
}

?>