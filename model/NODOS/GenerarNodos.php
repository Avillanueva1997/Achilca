<?php

require_once('../../security.php');
require '../DatosBD.php';

$_level = $_POST['_level'];
$_role = $_POST['_role'];

$sql = "select * from nodos where level = '".$_level."';";
$con = open_conection($host, $user, $pass, $db);
mysqli_set_charset($con, "utf8");
$result = mysqli_query($con,$sql);

if (!$result) {
    printf("Error message: %s\n", mysqli_error($con));
}


$TileCollection = array();

while($row = mysqli_fetch_array($result)){
	    
    $icon=$row['icon'];
    $type=$row['type'];
    $title=$row['title'];
    $info=$row['info'];
    $view=$row['view'];

    $sqlStatus = "select t2.vista  as vista_modulo, t2.code as modulo
                from permisos t1
                inner join modulo t2 on t1.modulo = t2.code
                inner join roles t3 on t1.role = t3.code
                where t3.description = '".$_role."';";

    $resultStatus = mysqli_query($con,$sqlStatus);

    if (!$resultStatus) {
        printf("Error message: %s\n", mysqli_error($con));
    }

    $status = 'Disabled';

    while($rowStatus = mysqli_fetch_array($resultStatus)){
        $view_status = $rowStatus['vista_modulo'];
        $modulo = $rowStatus['modulo'];

        if($view_status == strtoupper($view)){
            $status = 'Loaded';
        } else {

            $sqlSecondStatus = "select tran from transaccion where modulo = {$modulo};";

            $resultSecondStatus = mysqli_query($con,$sqlSecondStatus);

            if (!$resultSecondStatus) {
                printf("Error message: %s\n", mysqli_error($con));
            }

            while($rowSecondStatus = mysqli_fetch_array($resultSecondStatus)){
                $tran = $rowSecondStatus['tran'];

                if($tran == strtoupper($view)){
                    $status = 'Loaded';
                }
            }

            mysqli_free_result($resultSecondStatus);   

        }
    }

    mysqli_free_result($resultStatus);    

    $TileCollection[] = array(
    						'icon'=>$icon,
    						'type'=>$type,
    						'title'=>$title,
    						'info'=>$info,
                            'view'=>$view,
                            'state'=>$status
    					 );
}

mysqli_free_result($result);

close_conection($con);

$json_string = json_encode(compact('TileCollection'));

echo $json_string;

?>