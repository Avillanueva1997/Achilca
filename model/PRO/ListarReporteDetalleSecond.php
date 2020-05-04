<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Code = $_POST['_Code'];
$_LineaProduccion = $_POST['_LineaProduccion'];
$_Turno = $_POST['_Turno'];

$sql = "select t1.code, t1.inicio, t1.fin, t2.description as op, t3.description as maquina, t1.componente, t4.description as causa, t1.comentario
from reporte_pro_det t1
inner join op t2 on t1.op = t2.code
inner join maquina t3 on t1.maquina = t3.code
inner join causa t4 on t1.causa = t4.code
where t1.code_cabecera = '".$_Code."' and t1.linea_produccion = '".$_LineaProduccion."' and t1.turno = '".$_Turno."';";


$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$Data = array();

while($row = mysqli_fetch_array($result)) 
{ 	    
    $inicio=$row['inicio'];
    $inicio = explode(":", $inicio);
    $inicio = $inicio[0].':'.$inicio[1];
    $fin=$row['fin'];
    $fin = explode(":", $fin);
    $fin = $fin[0].':'.$fin[1];
    $maquina=$row['maquina'];
    $causa=$row['causa'];
    $comentario=$row['comentario'];

    $Data[] = array(
    						'inicio'=>$inicio,
    						'fin'=>$fin,
    						'maquina'=>$maquina,
    						'causa'=>$causa,
    						'comentario'=>$comentario
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($Data);

echo $json_string;
?>