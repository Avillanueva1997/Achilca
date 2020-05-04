<?php 

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_LineaProduccion = $_POST['_LineaProduccion'];
$_Moye = $_POST['_Moye'];
$_Moye = explode('.', $_Moye);
$_Month = $_Moye[0];
$_Month = $_Month + 1;
$_Year = $_Moye[1];
$_Diametro = $_POST['_Diametro'];

$Data = array();

$sqlData = "select t2.description as defecto, t1.quantity 
from dist_bola_obs t1 
inner join defecto t2 on t1.defecto = t2.code 
where t1.linea_produccion = '".$_LineaProduccion."' and t1.diametro = '".$_Diametro."' and t1.year = {$_Year} and t1.month = {$_Month} and t1.quantity != 0;";
$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    
    $defecto=$row['defecto'];
    $quantity=$row['quantity'];

    $Data[] = array(
                            'defecto'=>$defecto,
                            'quantity'=>$quantity
    );
}

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>