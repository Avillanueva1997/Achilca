<?php

require_once('../../security.php');
require '../DatosBD.php';

$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");

$sqlOne = "select code, description from lineas_produccion where status = '1';";

$resultOne = mysqli_query($con,$sqlOne);

$ProgramaProduccion = array();

while($rowOne = mysqli_fetch_array($resultOne)){
    $code_lp = $rowOne['code'];
    $description_lp = $rowOne['description'];

    $ProgramaProduccion[] = array(
            'pic' => 'sap-icon://machine',
            'name' => $code_lp,
            'role'=> $description_lp,
            'appointments' => array()
    );

    $sizePP = sizeof($ProgramaProduccion);
    $lastPosition = $sizePP - 1;

    $sqlTwo = "select * from programa_produccion where linea_produccion = '".$code_lp."';";

    $resultTwo = mysqli_query($con,$sqlTwo);

    while($rowTwo = mysqli_fetch_array($resultTwo)){
        
        $start=$rowTwo['start_date'];
        $end=$rowTwo['end_date'];
        $title=$rowTwo['title'];
        $info=$rowTwo['info'];
        $linea_produccion=$rowTwo['linea_produccion'];
        $turno=$rowTwo['turno'];
        $option=$rowTwo['option'];
        $tm=$rowTwo['tm'];

        if($turno == 'A'){
            $ProgramaProduccion[$lastPosition]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type12',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false,
                'linea_produccion'=> $linea_produccion,
                'turno'=> $turno,
                'option'=> $option,
                'tm'=> $tm
            );
        } else {
            $ProgramaProduccion[$lastPosition]['appointments'][] = array(
                'start'=>$start,
                'end'=>$end,
                'title'=>$title,
                'type'=> 'Type17',
                'info'=>$info,
                'pic'=>'sap-icon://notes',
                'tentative'=> false,
                'linea_produccion'=> $linea_produccion,
                'turno'=> $turno,
                'option'=> $option,
                'tm'=> $tm
            );
        }

    }

    mysqli_free_result($resultTwo);
}

/*$sql = "select * from programa_produccion;";




$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}*/

/*while($row = mysqli_fetch_array($result)){
 	    
    $start=$row['start_date'];
    $end=$row['end_date'];
    $title=$row['title'];
    $info=$row['info'];

    $ProgramaProduccion[] = array(
    						'start'=>$start,
    						'end'=>$end,
    						'title'=>$title,
    						'type'=> 'Type07',
    						'info'=>$info,
    						'pic'=>'sap-icon://sap-ui5',
			                'tentative'=> false
    					 );
}*/

mysqli_free_result($resultOne);

close_conection($con);

$json_string = json_encode($ProgramaProduccion);

echo $json_string;
?>