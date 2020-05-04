<?php

function open_conection_sqlsrv($serverName,$connectionInfo){
    $con = sqlsrv_connect( $serverName, $connectionInfo);
    if( $con === false ) {
	    die( print_r( sqlsrv_errors(), true));
	} else {
		return $con;
	}
}

function close_conection_sqlsrv($con1){
    if(isset($con1) && $con1!=null ){
        sqlsrv_close( $con1 ); 
    }
}

function open_conection($ip,$usuariobd,$clavebd,$bd){
    $con = mysqli_connect($ip,$usuariobd,$clavebd,$bd);
    mysqli_select_db($con,$bd);
    return $con;
}

function close_conection($con1){
    if(isset($con1) && $con1!=null ){
        mysqli_close($con1);    
    }
}

?>