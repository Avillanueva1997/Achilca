<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_CodeCab = $_POST['_CodeCab'];
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Turno = $_POST['_Turno'];

$sql = "select * from reporte_pro_det where code_cabecera = '".$_CodeCab."' and linea_produccion = '".$_LineaProduccion."' and turno = '".$_Turno."';";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $code=$row['code'];
    $code_cabecera=$row['code_cabecera'];
    $inicio=$row['inicio'];
    $fin=$row['fin'];
    $op=$row['op'];
    $maquina=$row['maquina'];
    $componente=$row['componente'];
    $causa=$row['causa'];
    $comentario=$row['comentario'];
    $linea_produccion=$row['linea_produccion'];
    $turno=$row['turno'];

    $Data[] = array(
    						'code'=>$code,
    						'code_cabecera'=>$code_cabecera,
    						'inicio'=>$inicio,
    						'fin'=>$fin,
    						'op'=>$op,
    						'maquina'=>$maquina,
    						'componente'=>$componente,
    						'causa'=>$causa,
    						'comentario'=>$comentario,
    						'linea_produccion'=>$linea_produccion,
    						'turno'=>$turno
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>