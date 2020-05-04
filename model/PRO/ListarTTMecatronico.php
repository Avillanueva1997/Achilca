<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");




$sql = "select * from tt_mecatronico;";

$result = mysqli_query($con,$sql);

$TTMecatronico = array();

$TTMecatronico[] = array(
            'pic' => 'sap-icon://key-user-settings',
            'name' => 'ADMIN',
            'role'=> 'ADMIN',
            'appointments' => array()
    );

$sizeTTMecatronico = sizeof($TTMecatronico);

    while($row = mysqli_fetch_array($result)){
        
        $start=$row['start_date'];
        $end=$row['end_date'];
        $title=$row['title'];
        $info=$row['info'];
        $turno=$row['turno'];
        $mecatronico=$row['mecatronico'];

        if($turno == 'A'){
            $TTMecatronico[$sizeTTMecatronico - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type12',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false,
                'turno'=> $turno,
                'mecatronico'=> $mecatronico
            );
        } else {
            $TTMecatronico[$sizeTTMecatronico - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type17',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false,
                'turno'=> $turno,
                'mecatronico'=> $mecatronico
            );
        }
    }

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($TTMecatronico);

echo $json_string;
?>