<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");




$sql = "select * from tt_produccion order by    cast(start_date as datetime) asc;";

$result = mysqli_query($con,$sql);

$TTProduccion = array();

$TTProduccion[] = array(
            'pic' => 'sap-icon://group',
            'name' => 'Producción',
            'role'=> '',
            'appointments' => array()
    );

$sizeTTProduccion = sizeof($TTProduccion);


    while($row = mysqli_fetch_array($result)){
        
        $start=$row['start_date'];
        $end=$row['end_date'];
        $title=$row['title'];
        $info=$row['info'];
        $turno=$row['turno'];

        if($turno == 'A'){
            $TTProduccion[$sizeTTProduccion - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type12',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false
            );
        } else {
            $TTProduccion[$sizeTTProduccion - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type17',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false
            );
        }
    }

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($TTProduccion);

echo $json_string;
?>