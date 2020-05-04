<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];
$_Diametro = $_POST['_Diametro'];
$_Month = $_POST['_Month'];
$_Month = $_Month + 1;

$sqlData = "select t1.real, t1.objetivo
                from costo_trf t1
                where t1.year = '".$_Year."' and t1.diametro = '".$_Diametro."' and t1.month = {$_Month};";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    $real=$row['real'];
    $objetivo=$row['objetivo'];

    $Data[] = array(
                            'real'=>$real,
                            'objetivo'=>$objetivo
    );
}

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>