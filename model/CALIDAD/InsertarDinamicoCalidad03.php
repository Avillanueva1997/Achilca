<?php

require_once('../../security.php');
require '../DatosBD.php';

$_para = $_POST['para'];
$_data = $_POST['data'][0];
$_camp = $_POST['camp'][0];
$_Tabla = $_para[0]['_Tabla'];
$_LineaProduccion = $_para[0]['_LineaProduccion'];
$_Year = $_para[0]['_Year'];
$_Month = $_para[0]['_Month'];
$_Month = $_Month + 1;

array_push($_camp,"linea_produccion","year", "month");

$tamañoData = sizeof($_data);
$tamañoCamp = sizeof($_camp);

for ($i=0; $i < $tamañoData; $i++) {
    $_data[$i]['linea_produccion'] = $_LineaProduccion;
    $_data[$i]['year'] = $_Year;
    $_data[$i]['month'] = $_Month;
}

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

for ($i=0; $i < $tamañoData ; $i++) { 		

	$sql = "insert into ".$_Tabla." (diametro, defecto, quantity, linea_produccion, year, month) values (";

	for($m=0; $m < $tamañoCamp ; $m++){
		$campo = $_camp[$m];
		$prueba2 = $_data[$i][$campo];
		$prueba2 = mb_strtoupper($prueba2, 'UTF-8');
		$max = $m + 1;
		if($tamañoCamp === $max){
			$sql = $sql."'".$prueba2."')";
		}else{
			$sql = $sql."'".$prueba2."',";
		}
		
	}   
	
	$result = mysqli_query($con,$sql);

	
	if (!$result) {
		printf("Error message: %s\n", mysqli_error($con));
	}

	
}

close_conection($con);

echo $result;

?>