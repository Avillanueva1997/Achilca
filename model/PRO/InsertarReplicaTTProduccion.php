<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");



$_FirstDate = $_POST['_FirstDate'];
$_SecondDate = $_POST['_SecondDate'];
$_Turno = $_POST['_Turno'];

$sql = "select start_date, end_date 
        from tt_produccion 
        where start_date in (select max(start_date) from tt_produccion where turno = '".$_Turno."');";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

while($row = mysqli_fetch_array($result)){
    $start_date = $row['start_date'];
    $end_date = $row['end_date'];
}

$last_date_first = $start_date->modify('+1 day');
$last_date_end = $end_date->modify('+1 day');

mysqli_free_result($result);

$sql = "select * from tt_produccion 
        where cast (start_date as date) between '".$_FirstDate."' and '".$_SecondDate."' and turno = '".$_Turno."' order by cast(start_date as date) asc;";

$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

$DataReplica = array();

while($row = mysqli_fetch_array($result)){
    $title = $row['title'];
    $info = $row['info'];
    $turno = $row['turno'];
    $grupo = $row['grupo'];

    $DataReplica[] = array(
        'title'=>$title,
        'info'=>$info,
        'turno'=>$turno,
        'grupo'=>$grupo
    );
}

mysqli_free_result($result);

    for ($i=0; $i < sizeof($DataReplica) ; $i++) {
        $DataReplica[$i]['start_date'] = clone $last_date_first;
        $DataReplica[$i]['end_date'] = clone $last_date_end;
        $last_date_first = $last_date_first->modify('+1 day');
        $last_date_end = $last_date_end->modify('+1 day');
    }

for ($i=0; $i < sizeof($DataReplica); $i++) {
    $sql = "insert into tt_produccion(start_date, end_date, title, info, turno, grupo) 
    values ('".$DataReplica[$i]['start_date']->format('Y-m-d H:i:s')."', '".$DataReplica[$i]['end_date']->format('Y-m-d H:i:s')."', '".$DataReplica[$i]['title']."', '".$DataReplica[$i]['info']."', '".$DataReplica[$i]['turno']."', '".$DataReplica[$i]['grupo']."');";

    $result = mysqli_query($con,$sql);

    if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}

    mysqli_free_result($result);
}

echo 1;

?>