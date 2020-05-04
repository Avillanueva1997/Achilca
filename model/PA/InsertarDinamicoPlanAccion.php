<?php

require_once('../../security.php');
require '../DatosBD.php';

$_para = $_POST['para'];
$_data = $_POST['data'][0];
$_camp = $_POST['camp'][0];
$_Tabla = $_para[0]['_Tabla'];

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

for ($i=0; $i < sizeof($_data); $i++) { 
    $responsable = $_data[$i]['responsable'];
    unset($responsable[0]);
    $responsable = join('|', $responsable);
    $_data[$i]['responsable'] = $responsable;
    if($_data[$i]['status'] == '#ff0000'){
        $_data[$i]['status'] = '1';
    } else if($_data[$i]['status'] == '#008f39'){
        $_data[$i]['status'] = '2';
    } else if($_data[$i]['status'] == '#ff8000'){
        $_data[$i]['status'] = '3';
    } else {
        $_data[$i]['status'] = '1';
    }
}

$tamañoData = sizeof($_data);
$tamañoCamp = sizeof($_camp);

print_r($_data);

for ($i=0; $i < $tamañoData ; $i++) { 		

	$sql = "insert into ".$_Tabla." values (";

	for($m=0; $m < $tamañoCamp ; $m++){
		$campo = $_camp[$m];
		$prueba2 = $_data[$i][$campo];
		$prueba2 = mb_strtoupper($prueba2, 'UTF-8');
		$prueba2 = mysqli_real_escape_string($con, $prueba2);
		$max = $m + 1;
		if($tamañoCamp === $max){
			$sql = $sql."'".$prueba2."')";
		}else{
			$sql = $sql."'".$prueba2."',";
		}
		
	}

	print_r($sql);
       
    
	
	$result = mysqli_query($con,$sql);

	
	if (!$result) {
		printf("Error message: %s\n", mysqli_error($con));
	}

	
}

close_conection($con);

echo $result;

?>