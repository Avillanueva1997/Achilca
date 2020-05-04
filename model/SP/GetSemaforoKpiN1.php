<?php 

require_once('../../security.php');
require '../DatosBD.php';
require '../Global_Functions.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$_Month = $_POST['_Month'];
$_Month += 1;
$_Year = $_POST['_Year'];

$sql = "select porcentaje_cumplimiento, date_event 
from cumplimiento_entregas_apt 
where month = {$_Month} and year = {$_Year} and date_event = (select max(date_event) from cumplimiento_entregas_apt);";

$result = mysqli_query($con, $sql);

if (!$result ) {
    printf("Error message: %s\n", mysqli_error($con));
}

$row_count = mysqli_num_rows($result);

if($row_count == 1){

    $row = mysqli_fetch_assoc($result);
    $porcentaje_cumplimiento = $row['porcentaje_cumplimiento'];

    $root = array(
        'Value' => $porcentaje_cumplimiento
    );
    
} else {
    $root = array(
        'Value' => ''
    );
}

close_conection($con);

$json_string = json_encode(compact('root'));

echo $json_string;

?>