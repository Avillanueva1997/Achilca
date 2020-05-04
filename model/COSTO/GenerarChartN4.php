<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Year = $_POST['_Year'];

$Data = array();

    $sqlData = "select t2.description as month, t1.dolar
                from costo_mtto t1
                inner join month t2 on t1.month = t2.code
                where t1.year = '".$_Year."';";

$resultData = mysqli_query($con,$sqlData);

if (!$resultData ) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($resultData)) 
{ 	    
    
    $month = $row['month'];
    $month = reduceMonth($month);
    $dolar = $row['dolar'];
    $dolar = $dolar / 1000;
    $dolar = toFixed($dolar, 0);

    $Data[] = array(
                            'month'=>$month,
                            'dolar'=>$dolar
    );
}

mysqli_free_result($resultData);
    
close_conection($con);

$json_string = json_encode($Data);

echo $json_string;

?>