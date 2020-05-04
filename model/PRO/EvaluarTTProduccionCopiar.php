<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$_FirstDate = $_POST['_FirstDate'];
$_SecondDate = $_POST['_SecondDate'];
$_Turno = $_POST['_Turno'];

$count_rows = 0;

if($_Turno == 'A' || $_Turno == 'B'){

    $sql = "select count(*) as count_rows from tt_produccion where cast (start_date as date) between '".$_FirstDate."' and '".$_SecondDate."' and turno = '".$_Turno."';";

    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    while($row = mysqli_fetch_array($result)){
        $count_rows = $row['count_rows'];
    }

    mysqli_free_result($result);

} else {

    $sql = "select count(*) as count_rows from tt_produccion where cast (start_date as date) between '".$_FirstDate."' and '".$_SecondDate."' and (turno = 'A' or turno = 'B');";

    $result = mysqli_query($con,$sql);

    if (!$result  ) {
    printf("Error message: %s\n", mysqli_error($con));
}

    while($row = mysqli_fetch_array($result)){
        $count_rows = $row['count_rows'];
    }

    mysqli_free_result($result);

}

echo $count_rows;

?>