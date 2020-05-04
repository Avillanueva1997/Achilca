<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");




$sql = "select * from tt_mecanico;";

$result = mysqli_query($con,$sql);

$TTMecanico = array();

$TTMecanico[] = array(
            'pic' => 'sap-icon://key-user-settings',
            'name' => 'ADMIN',
            'role'=> 'ADMIN',
            'appointments' => array()
    );

$sizeTTMecanico = sizeof($TTMecanico);


    while($row = mysqli_fetch_array($result)){
        
        $start=$row['start_date'];
        $end=$row['end_date'];
        $title=$row['title'];
        $info=$row['info'];
        $turno=$row['turno'];
        $backup=$row['back_up'];
        $mecanico=$row['mecanico'];

        if($turno == 'A') {
            $TTMecanico[$sizeTTMecanico - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type12',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false,
                'turno'=> $turno,
                'backup'=> $backup,
                'mecanico'=> $mecanico
            );
        } else if($turno == 'B'){
            $TTMecanico[$sizeTTMecanico - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type17',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false,
                'turno'=> $turno,
                'backup'=> $backup,
                'mecanico'=> $mecanico
            );
        } else {
            $TTMecanico[$sizeTTMecanico - 1]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type20',
                'info'=>$info,
                'pic'=>'sap-icon://cloud',
                'tentative'=> false,
                'turno'=> $turno,
                'backup'=> $backup,
                'mecanico'=> $mecanico
            );
        }

        
    }

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode($TTMecanico);

echo $json_string;
?>